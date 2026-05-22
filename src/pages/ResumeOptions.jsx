import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FilePlusIcon, Wand2Icon, ArrowRightIcon } from "lucide-react";
import "./ResumeOptions.css";

export function ResumeOptions() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate("/register");
    }
  };

  // ✅ DIRECT NAVIGATION TO BUILDER
  const handleCreateResume = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
      navigate("/resume-builder"); // 🔥 IMPORTANT ROUTE
    } else {
      localStorage.setItem("redirectAfterLogin", "resume-builder");
      navigate("/register");
    }
  };

  return (
    <div className="resume-container">
      <div className="resume-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="resume-title"
        >
          Improve Your Career with <span>Skill2Achieve</span>
        </motion.h1>

        <motion.p className="resume-subtitle">
          Our AI analyzes your resume and suggests matching job roles and
          missing skills to help you grow faster.
        </motion.p>
      </div>

      <div className="resume-grid">
        {/* ✅ CREATE RESUME */}
        <div className="resume-card" onClick={handleCreateResume}>
          <div className="icon-box">
            <FilePlusIcon size={36} />
          </div>

          <h3>Create New Resume</h3>
          <p>
            Start from scratch with our AI-powered resume builder designed
            to highlight your strengths.
          </p>

          <div className="card-action">
            Get Started <ArrowRightIcon size={18} />
          </div>
        </div>

        {/* Improve Resume */}
        <div
          className="resume-card highlight"
          onClick={() => handleNavigation("/upload-resume")}
        >
          <div className="icon-box blue">
            <Wand2Icon size={36} />
          </div>

          <h3>Improve My Resume</h3>
          <p>
            Let our AI optimize your existing resume, fix gaps, and tailor
            it for your dream roles.
          </p>

          <div className="card-action">
            Optimize Now <ArrowRightIcon size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}