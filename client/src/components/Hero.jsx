import React, { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import bgimage from "../assets/bg-image-main.jpg";
import { motion } from "framer-motion";
import { FiSearch, FiMapPin, FiArrowRight } from "react-icons/fi";
import { FiBriefcase, FiUsers, FiTrendingUp } from "react-icons/fi";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const [activeTag, setActiveTag] = useState(null);

  const popularTags = ["Developer", "Designer", "Marketing", "Remote", "Manager"];

  const stats = [
    { icon: FiBriefcase, number: "50K+", label: "Active Jobs" },
    { icon: FiUsers, number: "1M+", label: "Job Seekers" },
    { icon: FiTrendingUp, number: "95%", label: "Success Rate" },
  ];

  const handleTagClick = (tag) => {
    setActiveTag(tag);
    titleRef.current.value = tag;
    setSearchFilter((prev) => ({ ...prev, title: tag }));
  };

  const onSearch = (e) => {
    e.preventDefault();
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);

    const jobListSection = document.getElementById("job-list");
    if (jobListSection) {
      jobListSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTitleChange = () => {
    setSearchFilter((prev) => ({ ...prev, title: titleRef.current.value }));
  };

  const handleLocationChange = () => {
    setSearchFilter((prev) => ({ ...prev, location: locationRef.current.value }));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mx-4 my-6 lg:mx-8 lg:my-10 rounded-[32px] border border-[#e7ddcf] overflow-hidden"
    >
      <div className="absolute inset-0 editorial-grid opacity-40"></div>
      <div className="absolute -top-24 -right-16 w-72 h-72 bg-[#ffd6c6]/50 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-24 -left-16 w-72 h-72 bg-[#d6e4ff]/50 blur-3xl rounded-full"></div>

      <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-10 p-8 md:p-14">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm uppercase tracking-[0.4em] text-[#6f685d]"
          >
            Launch your next move
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0b1220] leading-tight mt-4"
          >
            Find work that feels
            <span className="block text-[#ff5c2a]">designed for you.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg text-[#6f685d] max-w-2xl mt-6"
          >
            Curated roles, bold teams, and a hiring flow that keeps you in control.
            Explore opportunities tailored to your momentum.
          </motion.p>

          <motion.form
            onSubmit={onSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-10"
          >
            <div className="surface-panel rounded-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 flex items-center px-6 py-5 border-b md:border-b-0 md:border-r border-[#e7ddcf]">
                  <FiSearch className="text-[#6f685d] text-xl mr-4" />
                  <input
                    type="text"
                    ref={titleRef}
                    placeholder="Job title, keywords, company"
                    className="w-full text-base outline-none placeholder-[#8c8376] bg-transparent font-medium"
                    defaultValue={activeTag || ""}
                    onChange={handleTitleChange}
                  />
                </div>
                <div className="flex-1 flex items-center px-6 py-5 border-b md:border-b-0 md:border-r border-[#e7ddcf]">
                  <FiMapPin className="text-[#6f685d] text-xl mr-4" />
                  <input
                    type="text"
                    ref={locationRef}
                    placeholder="Location or remote"
                    className="w-full text-base outline-none placeholder-[#8c8376] bg-transparent font-medium"
                    onChange={handleLocationChange}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-accent px-8 py-5 font-semibold text-base flex items-center justify-center transition-transform hover:-translate-y-0.5"
                >
                  Search Jobs
                  <FiArrowRight className="ml-3" />
                </button>
              </div>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8"
          >
            <span className="text-sm font-medium text-[#6f685d]">
              Popular searches
            </span>
            <div className="flex flex-wrap gap-3 mt-3">
              {popularTags.map((tag, i) => (
                <motion.button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    activeTag === tag
                      ? "bg-[#0b1220] text-[#f6f1e8] border-[#0b1220]"
                      : "bg-white/70 text-[#0b1220] border-[#e7ddcf] hover:border-[#0b1220]"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ delay: 0.05 * i }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden ink-shadow"
          >
            <img
              src={bgimage}
              alt="Modern team at work"
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220]/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#6f685d]">Featured</p>
              <h3 className="text-xl font-semibold text-[#0b1220] mt-2">Product Design Lead</h3>
              <p className="text-sm text-[#6f685d]">Hybrid, New York</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                className="surface-panel rounded-2xl p-5 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-[#0b1220] rounded-xl flex items-center justify-center">
                  <stat.icon className="text-[#f6f1e8] text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[#0b1220]">{stat.number}</p>
                  <p className="text-sm text-[#6f685d]">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>


    </motion.section>
  );
};

export default Hero;
