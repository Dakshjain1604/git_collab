import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GradientText from "./GradientText";
import { User2Icon } from "lucide-react";

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

  return (
    <nav className="w-full px-6 py-4 bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-4xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
          >
            Dmatch
          </GradientText>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="text-white hover:text-cyan-400 transition-colors"
          >
            Home
          </button>

          <button
            onClick={handleFeatureScroll}
            className="text-white hover:text-cyan-400 transition-colors"
          >
            Features
          </button>

          <button
            onClick={() => navigate("/user/DashBoard")}
            className="text-white hover:text-cyan-400 transition-colors"
          >
            Dashboard
          </button>

          <User2Icon onClick={() => navigate("/user/profile")}/>
            
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-4 bg-white/10 backdrop-blur-md p-4 rounded-lg text-white">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={handleFeatureScroll}>Features</button>
          <button onClick={() => navigate("/user/DashBoard")}>Dashboard</button>
          <button onClick={() => navigate("/user/profile")}>Profile</button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
