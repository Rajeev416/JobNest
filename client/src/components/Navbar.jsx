import React, { useContext, useEffect, useState } from "react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Zap, Briefcase, Bookmark } from "lucide-react";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setShowRecruiterLogin } = useContext(AppContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="h-4"></div>
      <div
        className={`${scrolled ? "fixed animate-slideDown" : "relative"} top-0 left-0 right-0 z-30 w-full transition-all duration-300`}
      >
        <nav
          className={`transition-all duration-300 flex items-center justify-between ${
            scrolled
              ? "mx-4 my-3 max-w-6xl md:mx-auto surface-panel rounded-2xl px-6 py-4"
              : "mx-6 rounded-2xl bg-white/70 border border-[#e7ddcf] px-8 py-6 shadow-sm"
          }`}
        >
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-[#0b1220] p-2.5 rounded-xl group-hover:scale-[1.04] transition-transform">
              <Zap size={22} className="text-[#f6f1e8]" />
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-semibold tracking-wide text-[#0b1220]">
                JobNest
              </span>
              <span className="block text-xs text-[#6f685d] uppercase tracking-[0.2em]">
                Job Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/applications"
                  className="hidden md:flex items-center gap-2 text-[#0b1220] hover:text-[#ff5c2a] transition-colors px-3 py-2 rounded-lg"
                >
                  <Briefcase size={18} />
                  <span className="font-medium">My Jobs</span>
                </Link>
                <Link
                  to="/saved-jobs"
                  className="hidden md:flex items-center gap-2 text-[#0b1220] hover:text-[#ff5c2a] transition-colors px-3 py-2 rounded-lg"
                >
                  <Bookmark size={18} />
                  <span className="font-medium">Saved</span>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="hidden md:block">
                    <span className="text-sm font-medium text-[#6f685d]">
                      Hi, {user.firstName}
                    </span>
                  </div>
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "h-10 w-10 border-2 border-[#e7ddcf] shadow-sm",
                        userButtonPopoverCard: "shadow-2xl rounded-xl border border-[#e7ddcf]",
                        userButtonTrigger: "focus:ring-2 focus:ring-[#ff5c2a]/30",
                      },
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowRecruiterLogin(true)}
                  className="hidden md:block text-sm font-medium text-[#6f685d] hover:text-[#0b1220] transition-colors px-4 py-2 rounded-lg"
                >
                  Recruiter Portal
                </button>
                <button
                  onClick={() => openSignIn()}
                  className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold transition-transform hover:-translate-y-0.5"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;

