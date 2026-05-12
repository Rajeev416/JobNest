import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  File,
  Edit,
  Download,
  Briefcase,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  BarChart3,
  Home,
} from "lucide-react";

const Applications = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const context = useContext(AppContext);
  const { backendUrl, userData, userApplications, fetchUserData, fetchUserApplications } = context;

  // Automatically fetch latest user applications on component mount
  useEffect(() => {
    if (user) {
      fetchUserApplications();
    }
    
    // Background polling every 5 seconds to check for recruiter updates live
    const interval = setInterval(() => {
      if (user) {
        fetchUserApplications();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const updateResume = async () => {
    try {
      if (!resume) {
        toast.error("Please select a resume file.");
        return;
      }

      const formData = new FormData();
      formData.append("resume", resume);

      const token = await getToken();

      const response = await fetch(`${backendUrl}/api/users/update-resume`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update resume. Please try again.");
    }

    setIsEdit(false);
    setResume(null);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Accepted":
        return {
          bg: "bg-emerald-500/10",
          text: "text-emerald-600",
          border: "border-emerald-500/20",
          icon: CheckCircle,
          glow: "shadow-emerald-500/20",
        };
      case "Rejected":
        return {
          bg: "bg-red-500/10",
          text: "text-red-500",
          border: "border-red-500/20",
          icon: XCircle,
          glow: "shadow-red-500/20",
        };
      default:
        return {
          bg: "bg-amber-500/10",
          text: "text-amber-600",
          border: "border-amber-500/20",
          icon: AlertCircle,
          glow: "shadow-amber-500/20",
        };
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: userApplications?.length || 0,
      accepted: userApplications?.filter((app) => app.status === "Accepted").length || 0,
      pending:
        userApplications?.filter(
          (app) => !app.status || app.status === "Pending" || (app.status !== "Accepted" && app.status !== "Rejected")
        ).length || 0,
      rejected: userApplications?.filter((app) => app.status === "Rejected").length || 0,
    };
    return stats;
  };

  const stats = getStatusStats();
  const filteredApplications =
    selectedStatus === "all"
      ? userApplications
      : userApplications?.filter((app) => {
          if (selectedStatus === "pending") {
            return !app.status || app.status === "Pending" || (app.status !== "Accepted" && app.status !== "Rejected");
          }
          return app.status?.toLowerCase() === selectedStatus.toLowerCase();
        }) || [];

  return (
    <div className="min-h-screen bg-[#f6f1e8] relative overflow-hidden">
      <div className="absolute inset-0 editorial-grid opacity-30"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#ffb39b]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#ffd6c6]/20 rounded-full blur-3xl"></div>

      <motion.button
        onClick={() => navigate("/")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 left-4 z-50 flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#e7ddcf] text-[#0b1220] rounded-lg hover:bg-white transition-all duration-300 shadow-lg"
      >
        <Home className="w-4 h-4 mr-2" />
        Home
      </motion.button>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={cardVariants} className="mb-12 text-center">
          <h1 className="text-5xl mt-20 font-bold text-[#0b1220] mb-4">Application Dashboard</h1>
          <p className="text-[#6f685d] text-lg">Track your career journey with precision</p>
        </motion.div>

        <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Applications", value: stats.total, icon: Briefcase, color: "from-[#0b1220] to-[#1f2937]" },
            { label: "Accepted", value: stats.accepted, icon: CheckCircle, color: "from-emerald-500 to-emerald-600" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "from-amber-500 to-amber-600" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-xl from-[#ffb39b]/30 to-[#ffd6c6]/30"></div>
              <div className="relative surface-panel rounded-2xl p-6 hover:border-[#ffd6c6] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6f685d] text-sm font-medium">{stat.label}</p>
                    <p className="text-[#0b1220] text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="mt-4 w-full bg-[#efe7db] rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 bg-gradient-to-r ${stat.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((stat.value / Math.max(stats.total, 1)) * 100, 100)}%` }}
                    transition={{ delay: index * 0.1 + 0.8, duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={cardVariants} whileHover={{ y: -2 }} className="mb-8 group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ffb39b]/20 to-[#ffd6c6]/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative surface-panel rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d7cec0] to-transparent"></div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-[#0b1220] rounded-lg flex items-center justify-center mr-4 shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0b1220]">Resume Management</h3>
                  <p className="text-[#6f685d]">Keep your profile updated</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isEdit || (userData && !userData.resume) ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-wrap gap-4 items-center"
                  >
                    <label className="relative cursor-pointer group">
                      <div className="flex items-center px-4 py-3 bg-[#f6f1e8] border border-[#e7ddcf] rounded-lg hover:bg-white transition-all duration-200">
                        <Download className="w-4 h-4 text-[#6f685d] mr-2 group-hover:text-[#0b1220] transition-colors" />
                        <span className="text-[#6f685d] group-hover:text-[#0b1220] transition-colors">
                          {resume ? resume.name : "Select Resume"}
                        </span>
                      </div>
                      <input
                        type="file"
                        className="sr-only"
                        accept="application/pdf"
                        onChange={(e) => setResume(e.target.files[0])}
                      />
                    </label>

                    <motion.button
                      onClick={updateResume}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-[#0b1220] text-white font-medium rounded-lg hover:bg-[#151c2a] transition-all duration-200 shadow-lg"
                    >
                      Save Resume
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-wrap gap-4 items-center"
                  >
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center px-6 py-3 bg-[#0b1220] text-white font-medium rounded-lg hover:bg-[#151c2a] transition-all duration-200 shadow-lg"
                      href={userData?.resume || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Resume
                    </motion.a>

                    <motion.button
                      onClick={() => setIsEdit(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center px-6 py-3 border border-[#d7cec0] text-[#0b1220] font-medium rounded-lg hover:bg-white transition-all duration-200"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Update Resume
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ffb39b]/20 to-[#ffd6c6]/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative surface-panel rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d7cec0] to-transparent"></div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="flex items-center mb-4 lg:mb-0">
                  <div className="w-10 h-10 bg-[#0b1220] rounded-lg flex items-center justify-center mr-4 shadow-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-[#0b1220]">Application Tracker</h3>
                      <button 
                        onClick={() => fetchUserApplications()}
                        className="p-1.5 bg-[#f6f1e8] hover:bg-[#e7ddcf] rounded-md transition-colors text-[#6f685d] hover:text-[#0b1220]"
                        title="Refresh Status"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                      </button>
                    </div>
                    <p className="text-[#6f685d]">Monitor your progress</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["all", "accepted", "pending", "rejected"].map((status) => (
                    <motion.button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedStatus === status
                          ? "bg-[#0b1220] text-white shadow-lg"
                          : "bg-[#f6f1e8] text-[#6f685d] hover:bg-white hover:text-[#0b1220]"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {filteredApplications?.length > 0 ? (
                  <motion.div
                    key="applications"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {filteredApplications.map((job, index) => {
                      const statusConfig = getStatusConfig(job.status);
                      const StatusIcon = statusConfig.icon;

                      return (
                        <motion.div
                          key={job.id || index}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -2, scale: 1.01 }}
                          className="group relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#fff1e8]/60 to-[#ffe7db]/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>

                          <div className="relative flex items-center justify-between p-4 bg-white border border-[#efe7db] rounded-lg hover:border-[#ffd6c6] transition-all duration-300">
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-lg bg-[#f6f1e8] flex items-center justify-center overflow-hidden border border-[#efe7db]">
                                  <img
                                    className="w-full h-full object-cover"
                                    src={job.companyId?.image || assets.default_company_icon}
                                    alt={`${job.companyId?.name || "Company"} Logo`}
                                  />
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-[#0b1220] font-medium truncate">{job.jobId?.title || "N/A"}</p>
                                <p className="text-[#6f685d] text-sm">{job.companyId?.name || "Unknown Company"}</p>
                                <div className="flex items-center text-xs text-[#8c8376] mt-1 space-x-4">
                                  <div className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {job.jobId?.location || "N/A"}
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {moment(job.date).format("MMM DD, YYYY")}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex-shrink-0">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                                <StatusIcon className="w-3 h-3 mr-1.5" />
                                {job.status || "Pending"}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 bg-[#0b1220] rounded-xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                    >
                      <Briefcase className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-xl font-semibold text-[#0b1220] mb-2">
                      {selectedStatus === "all" ? "No applications yet" : `No ${selectedStatus} applications`}
                    </h3>
                    <p className="text-[#6f685d] mb-8 max-w-md mx-auto">
                      {selectedStatus === "all"
                        ? "Start your journey by applying to exciting opportunities"
                        : `You do not have any ${selectedStatus} applications at the moment`}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-[#0b1220] text-white font-medium rounded-lg hover:bg-[#151c2a] transition-all duration-300 shadow-lg"
                    >
                      Explore Opportunities
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Applications;

