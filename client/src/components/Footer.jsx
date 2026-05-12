import React from "react";
import { motion } from "framer-motion";
import { Zap, Twitter, Linkedin, Github, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <footer className="relative overflow-hidden bg-[#0b1220] text-[#f6f1e8] pt-20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff5c2a]/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#d6e4ff]/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#ff5c2a] flex items-center justify-center shadow-lg shadow-[#ff5c2a]/20">
                  <Zap size={24} className="text-[#0b1220]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight text-white leading-tight">JobNest</span>
                  <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-medium">Job Studio</span>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed max-w-sm mb-8">
                Empowering professionals and companies to connect, grow, and build the future of work together in a seamless digital ecosystem.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                {[
                  { icon: Twitter, href: "https://x.com" },
                  { icon: Linkedin, href: "https://linkedin.com" },
                  { icon: Github, href: "https://github.com" },
                  { icon: Instagram, href: "https://instagram.com" },
                ].map((Social, idx) => (
                  <a
                    key={idx}
                    href={Social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#ff5c2a] hover:text-[#0b1220] hover:border-[#ff5c2a] transition-all duration-300"
                  >
                    <Social.icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Navigation Links */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              <motion.div variants={itemVariants}>
                <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Platform</h3>
                <ul className="space-y-4">
                  {["Browse Jobs", "Companies", "Salary Guide", "Career Advice"].map((item) => (
                    <li key={item}>
                      <Link to="/" className="text-white/60 hover:text-[#ff5c2a] transition-colors text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">For Employers</h3>
                <ul className="space-y-4">
                  {["Post a Job", "Browse Candidates", "Pricing Plans", "Recruiting Solutions"].map((item) => (
                    <li key={item}>
                      <Link to="/" className="text-white/60 hover:text-[#ff5c2a] transition-colors text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Legal & Support</h3>
                <ul className="space-y-4">
                  {["Help Center", "Terms of Service", "Privacy Policy", "Contact Us"].map((item) => (
                    <li key={item}>
                      <Link to="/" className="text-white/60 hover:text-[#ff5c2a] transition-colors text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          viewport={{ once: true }}
          className="py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} JobNest. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-sm text-white/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All systems operational
            </span>
          </div>
        </motion.div>
      </div>
      
      {/* Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#ff5c2a] via-[#ffb39b] to-[#ff5c2a]"></div>
    </footer>
  );
};

export default Footer;

