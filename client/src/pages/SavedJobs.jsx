import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiBookmark, FiMapPin, FiBriefcase, FiDollarSign, FiTrash2, FiExternalLink } from "react-icons/fi";
import axios from "axios";
import kConvert from "k-convert";
import moment from "moment";

const SavedJobs = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { userData, backendUrl, jobs, fetchUserData } = useContext(AppContext);
  const [savedJobsList, setSavedJobsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData?.savedJobs && jobs.length > 0) {
      const saved = jobs.filter(job => userData.savedJobs.includes(job._id));
      setSavedJobsList(saved);
      setIsLoading(false);
    } else if (userData && (!userData.savedJobs || userData.savedJobs.length === 0)) {
      setSavedJobsList([]);
      setIsLoading(false);
    }
  }, [userData, jobs]);

  const handleUnsaveJob = async (jobId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/users/save-job`,
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Job removed from saved list");
        fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const stripHtmlTags = (html) => {
    return html ? html.replace(/<[^>]*>?/gm, '') : 'No description provided';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b1220] via-[#1f2937] to-[#2b1f1a] pt-16 pb-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <FiBookmark className="text-yellow-300" />
                <span className="text-white/90 text-sm font-medium">Your Collection</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Saved Jobs
              </h1>
              <p className="text-blue-100 text-lg max-w-xl mx-auto">
                {savedJobsList.length > 0
                  ? `You have ${savedJobsList.length} saved job${savedJobsList.length > 1 ? 's' : ''} ready to explore`
                  : "Jobs you bookmark will appear here for quick access"
                }
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 -mt-10">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : savedJobsList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-panel rounded-3xl p-12 text-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBookmark className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Saved Jobs Yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Browse available jobs and click the bookmark icon to save them for later review.
              </p>
              <button
                onClick={() => navigate("/")}
                className="btn-primary px-8 py-3 rounded-xl font-semibold"
              >
                Browse Jobs
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence>
                {savedJobsList.map((job) => (
                  <motion.div
                    key={job._id}
                    variants={cardVariants}
                    exit="exit"
                    layout
                    className="surface-panel rounded-2xl overflow-hidden transition-shadow duration-300"
                  >
                    <div className="p-6 flex flex-col md:flex-row md:items-center gap-5">
                      {/* Company Logo */}
                      <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm flex-shrink-0">
                        <img
                          src={job.companyId?.image || "/default-company.png"}
                          alt="Company"
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
                          {job.title}
                        </h3>
                        <p className="text-indigo-600 font-medium mb-2">
                          {job.companyId?.name || "Company"}
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiMapPin className="text-blue-500" />
                            {job.location || "Remote"}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiBriefcase className="text-purple-500" />
                            {job.level || "Entry Level"}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiDollarSign className="text-green-500" />
                            {job.salary ? kConvert.convertTo(job.salary) : "Competitive"}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-2 line-clamp-1">
                          {stripHtmlTags(job.description)}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex md:flex-col gap-3 flex-shrink-0">
                        <button
                          onClick={() => {
                            navigate(`/apply-job/${job._id}`);
                            window.scrollTo(0, 0);
                          }}
                          className="btn-primary flex-1 md:flex-none px-6 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                        >
                          View Job <FiExternalLink size={14} />
                        </button>
                        <button
                          onClick={() => handleUnsaveJob(job._id)}
                          className="flex-1 md:flex-none px-6 py-2.5 border border-[#d7cec0] text-[#6f685d] rounded-lg font-medium text-sm hover:border-[#0b1220] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <FiTrash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <div className="mt-16">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default SavedJobs;

