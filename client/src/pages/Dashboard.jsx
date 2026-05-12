import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, FileText, PlusCircle, Menu, Zap } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("");
  const { companyData, setCompanyData, setCompanyToken } = useContext(AppContext);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    setActiveTab(path);
  }, [location]);

  useEffect(() => {
    if (companyData) navigate("/dashboard/manage-job");
  }, [companyData]);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  const getGreeting = () => {
    const hour = currentTime.getHours();
    return hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  };

  const logout = () => {
    setCompanyToken(null);
    localStorage.removeItem("companyToken");
    setCompanyData(null);
    navigate("/");
  };

  const navItems = [
    { path: "add-job", label: "Add Job", icon: PlusCircle },
    { path: "manage-job", label: "Manage Jobs", icon: Briefcase },
    { path: "view-applications", label: "Applications", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-[#f6f1e8]">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed lg:static left-0 top-0 w-72 h-full bg-[#0b1220] text-white z-50 flex flex-col justify-between border-r border-white/10"
          >
            <div className="p-6">
              <div 
                onClick={() => navigate("/")}
                className="flex items-center gap-3 cursor-pointer group mb-10"
              >
                <div className="bg-[#ff5c2a] p-2 rounded-xl group-hover:scale-[1.05] transition-transform shadow-lg shadow-[#ff5c2a]/20">
                  <Zap size={22} className="text-[#0b1220]" />
                </div>
                <div className="leading-tight">
                  <span className="block text-xl font-bold tracking-tight text-white">
                    JobNest
                  </span>
                  <span className="block text-[10px] text-white/50 uppercase tracking-[0.2em] font-medium">
                    Recruiter Portal
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={`/dashboard/${path}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium hover:scale-[1.02] ${
                        isActive ? "bg-white text-[#0b1220]" : "text-white/80 hover:bg-white/10"
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="bg-white/10 p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-[#ff5c2a] rounded-full flex items-center justify-center text-[#0b1220] text-lg font-bold shadow-md">
                  {companyData?.name?.[0] || "C"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{companyData?.name}</p>
                  <p className="text-xs text-white/70">Recruiter Mode</p>
                </div>
              </div>
              <button onClick={logout} className="mt-4 text-sm text-[#ffb39b] hover:underline w-full text-left">
                Sign out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md shadow-sm px-6 md:px-8 py-5 flex justify-between items-center border-b border-[#e7ddcf]"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-lg border border-[#e7ddcf]"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#0b1220]">
                {activeTab.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Dashboard"}
              </h1>
              <p className="text-sm text-[#6f685d] mt-1">
                {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#6f685d] font-semibold">{getGreeting()},</p>
            <p className="text-xs text-[#8c8376]">{companyData?.name}</p>
            <p className="text-sm text-[#8c8376]">{formatTime(currentTime)}</p>
          </div>
        </motion.header>

        <main className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="surface-panel rounded-3xl p-6 min-h-[500px]"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
