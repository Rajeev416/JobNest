import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import HeroImage from "../assets/image-gall.jpg";
import { FiSearch, FiDollarSign, FiBarChart2, FiArrowRight } from "react-icons/fi";

const AppDownload = () => {
  const { setShowRecruiterLogin, companyToken } = useContext(AppContext);
  const navigate = useNavigate();

  const handleRecruiterClick = (e) => {
    e.preventDefault();
    if (companyToken) {
      navigate("/dashboard");
    } else {
      setShowRecruiterLogin(true);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 section-sheen"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="relative z-10">
            <motion.span
              className="inline-block px-3 py-1 text-xs font-semibold tracking-[0.25em] text-[#6f685d] border border-[#d7cec0] rounded-full mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              BUILT FOR FOCUS
            </motion.span>

            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0b1220] leading-tight mb-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Discover roles that match
              <span className="text-[#ff5c2a]"> your rhythm</span>
            </motion.h2>

            <motion.p
              className="text-lg text-[#6f685d] mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Curated listings, transparent salary ranges, and talent insights in a
              single, premium workflow.
            </motion.p>

            <motion.div
              className="space-y-4 mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-[#0b1220] p-2.5 rounded-lg text-[#f6f1e8]">
                  <FiSearch className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-[#0b1220]">Smart Job Matching</h3>
                  <p className="text-[#6f685d]">
                    Hand-picked opportunities based on your skills and intent.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-[#ff5c2a] p-2.5 rounded-lg text-[#0b1220]">
                  <FiDollarSign className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-[#0b1220]">Salary Insights</h3>
                  <p className="text-[#6f685d]">
                    Real ranges and transparent compensation signals.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-[#1f2937] p-2.5 rounded-lg text-[#f6f1e8]">
                  <FiBarChart2 className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-[#0b1220]">Company Analytics</h3>
                  <p className="text-[#6f685d]">
                    Deeper context on teams, culture, and growth.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <a
                href="#job-list"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('job-list')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary px-8 py-4 rounded-lg font-semibold text-center cursor-pointer"
              >
                Browse Jobs
              </a>

              <button
                onClick={handleRecruiterClick}
                className="btn-ghost px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                Recruiter Dashboard
                <FiArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative rounded-3xl overflow-hidden ink-shadow border border-[#e7ddcf]">
              <img
                src={HeroImage}
                alt="Professionals collaborating in a studio"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220]/40 to-transparent"></div>

              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-5 rounded-2xl flex items-center gap-4 border border-white/40 shadow-xl">
                <div className="w-12 h-12 bg-[#ff5c2a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiBarChart2 className="text-[#ff5c2a] w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0b1220]">Platform Activity</h4>
                  <p className="text-sm text-[#6f685d]">10,000+ new jobs posted this week</p>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppDownload;
