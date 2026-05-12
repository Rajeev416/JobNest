import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBookmark, FiMapPin, FiBriefcase, FiDollarSign, FiClock } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

const JobCard = ({
  job = {
    title: "",
    companyId: { name: "", image: "" },
    location: "",
    level: "",
    salary: null,
    type: "",
    description: "",
    postedAt: null,
    _id: "",
  },
}) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { userData, backendUrl, fetchUserData } = useContext(AppContext);
  const { getToken } = useAuth();

  useEffect(() => {
    if (userData?.savedJobs && job._id) {
      setIsSaved(userData.savedJobs.includes(job._id));
    }
  }, [userData, job._id]);

  const handleSaveJob = async (e) => {
    e.stopPropagation();
    if (!userData) {
      toast.error("Please login to save jobs");
      return;
    }

    try {
      setIsSaving(true);
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/users/save-job`,
        { jobId: job._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setIsSaved(data.isSaved);
        toast.success(data.message);
        fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const stripHtmlTags = (html) => {
    return html ? html.replace(/<[^>]*>?/gm, "") : "No description provided";
  };

  const getTimePassed = (date) => {
    if (!date) return "Recently posted";
    const diff = Date.now() - new Date(date);
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "Just now";
  };

  const formatSalary = (salary) => {
    if (!salary) return "Competitive";
    if (typeof salary === "number") return `$${salary.toLocaleString()}`;
    if (typeof salary === "string") return salary;
    if (salary.min && salary.max) return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    return `$${(salary.amount || salary).toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 260 }}
        className="group surface-panel rounded-2xl border border-[#e7ddcf] overflow-hidden"
      >
        <div className="p-6 pb-4 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl border border-[#e7ddcf] overflow-hidden bg-white shadow-sm">
              <img
                src={job.companyId?.image || "/default-company.png"}
                alt="logo"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#0b1220]">
                {job.title || "Job Title"}
              </h3>
              <p className="text-sm text-[#6f685d]">
                {job.companyId?.name || "Company"}
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveJob}
            disabled={isSaving}
            className={`p-2 rounded-full text-xl ${
              isSaved ? "text-[#ff5c2a]" : "text-[#6f685d] hover:text-[#0b1220]"
            } transition ${isSaving ? "opacity-50" : ""}`}
            title={isSaved ? "Saved" : "Save job"}
          >
            <FiBookmark />
          </button>
        </div>

        <div className="px-6 pb-4 flex flex-wrap gap-2 text-xs font-medium">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 text-[#0b1220] border border-[#e7ddcf]">
            <FiMapPin className="text-sm" /> {job.location || "Remote"}
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 text-[#0b1220] border border-[#e7ddcf]">
            <FiBriefcase className="text-sm" /> {job.level || "Intermediate"}
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 text-[#0b1220] border border-[#e7ddcf]">
            <FiDollarSign className="text-sm" /> {formatSalary(job.salary)}
          </span>
          {job.type && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 text-[#0b1220] border border-[#e7ddcf]">
              <FiClock className="text-sm" /> {job.type}
            </span>
          )}
        </div>

        <div className="px-6 pb-4">
          <p
            className="text-sm text-[#5f5a52] leading-relaxed line-clamp-3"
          >
            {stripHtmlTags(job.description)}
          </p>
        </div>



        <div className="px-6 py-4 border-t border-[#e7ddcf] bg-[#f2eadf] flex flex-wrap gap-3 items-center justify-between">
          <span className="text-xs text-[#6f685d]">Posted {getTimePassed(job.postedAt)}</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigate(`/apply-job/${job._id}`);
                window.scrollTo(0, 0);
              }}
              className="btn-ghost px-4 py-2 text-xs font-semibold rounded-md hover:border-[#0b1220]"
            >
              Learn More
            </button>
            <button
              onClick={() => {
                navigate(`/apply-job/${job._id}`);
                window.scrollTo(0, 0);
              }}
              className="btn-primary px-4 py-2 text-xs font-semibold rounded-md"
            >
              Apply Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JobCard;

