import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GradientText from "./GradientText";
import { User, Menu, X, Home, Zap } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleFeatureScroll = () => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById("features-section");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const navLinks = [
    { label: "Home", icon: Home, onClick: () => { navigate("/"); setOpen(false); } },
    { label: "Features", icon: Zap, onClick: () => { handleFeatureScroll(); setOpen(false); } },
    { label: "Dashboard", icon: Zap, onClick: () => { navigate("/user/DashBoard"); setOpen(false); } },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 opacity-95 backdrop-blur-lg" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-indigo-600/10" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="text-3xl sm:text-4xl font-bold">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
              >
                Dmatch
              </GradientText>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.button
                key={link.label}
                whileHover={{ scale: 1.05, color: "#40ffaa" }}
                whileTap={{ scale: 0.95 }}
                onClick={link.onClick}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5 font-medium text-sm"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </motion.button>
            ))}
          </div>

          {/* Desktop Profile Icon */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/user/profile")}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 text-cyan-400 hover:bg-blue-600/30 transition-all"
          >
            <User className="w-5 h-5" />
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-gray-300 hover:text-cyan-400 p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Dropdown */}
        <motion.div
          initial={false}
          animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-4 space-y-2 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-md rounded-lg mt-2">
            {navLinks.map((link) => (
              <motion.button
                key={link.label}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={link.onClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-white/10 transition-all rounded-lg font-medium"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              onClick={() => { navigate("/user/profile"); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-white/10 transition-all rounded-lg font-medium"
            >
              <User className="w-4 h-4" />
              Profile
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </nav>
  );
};

export default NavBar;
