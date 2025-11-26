import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, LogOut, User, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopNavBar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    onLogout?.();
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleSignIn = () => {
    navigate("/user/signin");
    setIsMenuOpen(false);
  };

  const handleSignUp = () => {
    navigate("/user/signup");
    setIsMenuOpen(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsMenuOpen(false);
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-b border-white/10 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-blue-400" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white hidden sm:block">
              Resume Analyzer
            </h1>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white sm:hidden">
              RA
            </h1>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleProfile}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.username || user.email || "Profile"}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/50 hover:bg-red-600/70 text-white transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSignIn}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-all text-sm font-medium"
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleSignUp}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all text-sm font-medium"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 space-y-3"
          >
            {user ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleProfile}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-all text-sm font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>{user.username || user.email || "Profile"}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-600/50 hover:bg-red-600/70 text-white transition-all text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleSignIn}
                  className="w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-all text-sm font-medium"
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleSignUp}
                  className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all text-sm font-medium"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default TopNavBar;
