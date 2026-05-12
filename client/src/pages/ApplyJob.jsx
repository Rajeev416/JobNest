import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import kConvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import Calltoaction from "../components/Calltoaction";
import { motion } from "framer-motion";
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiCheckCircle, FiExternalLink, FiUsers, FiCalendar, FiMonitor } from "react-icons/fi";

const ApplyJob = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [jobData, setJobData] = useState(null);
  const [isAlreadyApplied, setAlreadyApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState([]);

  const {
    jobs = [],
    backendUrl,
    userData,
    userApplications = [],
    fetchUserApplications,
  } = useContext(AppContext);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.job);
        findSimilarJobs(data.job);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error(data.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to fetch job details. Please try again later.");
    }
  };

  const findSimilarJobs = (currentJob) => {
    const similar = jobs
      .filter(
        (job) =>
          job._id !== currentJob._id &&
          (job.companyId?._id === currentJob.companyId?._id ||
            job.category === currentJob.category)
      )
      .slice(0, 4);
    setSimilarJobs(similar);
  };

  const applyHandler = async () => {
    try {
      if (!userData) {
        return toast.error("Please login to apply.");
      }

      if (!userData.resume) {
        return toast.error("Please upload a resume before applying.");
      }

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: jobData?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Application submitted successfully!");
        fetchUserApplications();
        setAlreadyApplied(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error applying for the job. Please try again.");
    }
  };

  const checkAlreadyApplied = () => {
    if (jobData && userApplications && userApplications.length > 0) {
      const hasApplied = userApplications.some((item) => item.jobId?._id === jobData._id);
      setAlreadyApplied(hasApplied);
    }
  };

  useEffect(() => {
    if (id) fetchJob();
  }, [id, backendUrl]);

  useEffect(() => {
    checkAlreadyApplied();
  }, [jobData, userApplications]);

  if (isLoading || !jobData) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="min-h-screen bg-[#f6f1e8]">
          <div className="bg-gradient-to-r from-[#0b1220] to-[#2b1f1a] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex items-start space-x-6">
                  <motion.div whileHover={{ scale: 1.05 }} className="bg-white/90 p-3 rounded-2xl shadow-lg border border-white/20">
                    <img
                      className="h-20 w-20 object-contain"
                      src={jobData?.companyId?.image || assets.placeholder}
                      alt="Company Logo"
                    />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{jobData?.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 mt-1">
                      <p className="text-xl text-white/80">{jobData?.companyId?.name}</p>
                      {jobData?.companyWebsite && (
                        <a
                          href={jobData.companyWebsite.startsWith("http") ? jobData.companyWebsite : `https://${jobData.companyWebsite}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm backdrop-blur-sm transition-colors border border-white/20 flex items-center gap-1"
                        >
                          View Company Profile
                          <FiExternalLink size={14} />
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-white/80">
                      <div className="flex items-center">
                        <FiMapPin className="mr-2" />
                        {jobData?.location}
                      </div>
                      <div className="flex items-center">
                        <FiBriefcase className="mr-2" />
                        {jobData?.level}
                      </div>
                      <div className="flex items-center">
                        <FiDollarSign className="mr-2" />
                        {jobData?.salary ? kConvert.convertTo(jobData.salary) : "Competitive"}
                      </div>
                      {jobData?.workType && (
                        <div className="flex items-center">
                          <FiMonitor className="mr-2" />
                          {jobData.workType}
                        </div>
                      )}
                      {jobData?.openings && (
                        <div className="flex items-center">
                          <FiUsers className="mr-2" />
                          {jobData.openings} Opening{jobData.openings > 1 ? "s" : ""}
                        </div>
                      )}
                      <div className="flex items-center">
                        <FiClock className="mr-2" />
                        Posted {moment(jobData?.date).fromNow()}
                      </div>
                      {jobData?.lastDate && (
                        <div className="flex items-center text-[#ffb39b]">
                          <FiCalendar className="mr-2" />
                          Apply by {moment(jobData.lastDate).format("MMM Do, YYYY")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col items-center">
                  <button
                    onClick={applyHandler}
                    disabled={isAlreadyApplied}
                    className={`px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all ${
                      isAlreadyApplied
                        ? "bg-emerald-600 text-white flex items-center"
                        : "bg-white text-[#0b1220] hover:bg-[#fff6ec] hover:shadow-xl"
                    }`}
                  >
                    {isAlreadyApplied ? (
                      <>
                        <FiCheckCircle className="mr-2" />
                        Applied Successfully
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </button>
                  {!isAlreadyApplied && (
                    <p className="mt-2 text-white/70 text-sm">
                      {userData?.resume ? "Your resume is ready" : "Upload resume to apply"}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="surface-panel rounded-2xl p-8 mb-8"
                >
                  <h2 className="text-2xl font-bold text-[#0b1220] mb-6">Job Description</h2>
                  <div className="prose max-w-none text-[#5f5a52]" dangerouslySetInnerHTML={{ __html: jobData?.description || "" }}></div>
                </motion.div>
                {similarJobs.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-10"
                  >
                    <h2 className="text-2xl font-bold text-[#0b1220] mb-6">Similar Jobs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {similarJobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="lg:w-1/3 space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="surface-panel rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-[#0b1220] mb-4">Job Overview</h3>
                  <div className="space-y-4 text-[#6f685d]">
                    <div className="flex items-center justify-between">
                      <span>Job Type</span>
                      <span className="font-medium text-[#0b1220]">{jobData?.type || "Full-time"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Level</span>
                      <span className="font-medium text-[#0b1220]">{jobData?.level || "Intermediate"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Location</span>
                      <span className="font-medium text-[#0b1220]">{jobData?.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Openings</span>
                      <span className="font-medium text-[#0b1220]">{jobData?.openings || 1}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="surface-panel rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-[#0b1220] mb-4">Salary Range</h3>
                  <p className="text-2xl font-bold text-[#0b1220]">
                    {jobData?.salary ? kConvert.convertTo(jobData.salary) : "Competitive"}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          <Calltoaction />
          <Footer />
        </div>
      </motion.div>
    </>
  );
};

export default ApplyJob;






