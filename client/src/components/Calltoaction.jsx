import React from "react";
import { motion } from "framer-motion";
import { FiSearch, FiStar } from "react-icons/fi";
import CtaBackground from "../assets/bg-image-main.jpg";

const CallToAction = () => {
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={CtaBackground}
          alt="Professional team collaborating"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220]/75 to-[#2b1f1a]/70"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 rounded-3xl bg-white/10 border border-white/20 shadow-2xl backdrop-blur"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ffb39b] rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#d6e4ff] rounded-full blur-3xl opacity-20"></div>

          <div className="relative text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              <span className="block">Build a career with momentum</span>
              <span className="block text-[#ffb39b]">Start with JobNest</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto mt-6 text-lg text-white/80"
            >
              Smart matching, bold teams, and a platform designed for modern hiring.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col justify-center gap-4 mt-10 sm:flex-row sm:gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-accent flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <FiSearch className="w-5 h-5 mr-2" />
                Search Jobs
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-300 bg-transparent border border-white/60 rounded-xl hover:bg-white/10"
                onClick={() => (window.location.href = "/")}
              >
                <FiStar className="w-5 h-5 mr-2" />
                Explore Features
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-sm text-white/70"
            >
              Trusted by over 1M+ professionals worldwide
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;

