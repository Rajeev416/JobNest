import User from "../models/User.js";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";
import { v2 } from "cloudinary";
import fs from "fs";

// Get user Data
export const getUserData = async (req, res) => {
  const userId = req.auth?.userId;

  if (!userId) {
    return res.json({ success: false, message: "Please login to continue" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Apply For a Job
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.auth?.userId;

  if (!userId) {
    return res.json({ success: false, message: "Please login to apply" });
  }

  try {
    const isAlreadyApplied = await JobApplication.findOne({ userId, jobId });

    if (isAlreadyApplied) {
      return res.json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const jobData = await Job.findById(jobId);

    if (!jobData) {
      return res.json({ success: false, message: "Job not found" });
    }

    await JobApplication.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });

    res.json({ success: true, message: "Applied Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get User applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.json({ success: false, message: "Please login to continue" });
    }

    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location level salary")
      .exec();

    if (!applications) {
      return res.json({
        success: false,
        message: "No applications found for this User",
      });
    }

    return res.json({ success: true, applications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update User Profile (resume)
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.json({ success: false, message: "Please login to continue" });
    }
    const resumeFile = req.file;

    const userData = await User.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: "User profile not found. Please wait for synchronization or check webhook setup." });
    }

    if (resumeFile) {
      const resumeUpload = await v2.uploader.upload(resumeFile.path, {
        resource_type: "raw",
        folder: "resumes",
        public_id: `resume_${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`
      });
      userData.resume = resumeUpload.secure_url;

      // Auto-delete temp file from uploads/ folder
      fs.unlink(resumeFile.path, () => {});
    }
    await userData.save();

    return res.json({ success: true, message: "Resume Updated Successfully" });
  } catch (error) {
    // Clean up temp file even on error
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.json({ success: false, message: error.message });
  }
};

// Save or Unsave a Job
export const saveJob = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { jobId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "Please login to save jobs" });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!userData.savedJobs) {
      userData.savedJobs = [];
    }

    const jobIndex = userData.savedJobs.indexOf(jobId);
    let isSaved = false;

    if (jobIndex > -1) {
      userData.savedJobs.splice(jobIndex, 1);
    } else {
      userData.savedJobs.push(jobId);
      isSaved = true;
    }

    await userData.save();
    return res.json({ success: true, message: isSaved ? "Job saved successfully" : "Job removed from saved list", isSaved, savedJobs: userData.savedJobs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};