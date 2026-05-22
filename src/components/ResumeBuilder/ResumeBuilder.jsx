import React, { useState, useRef } from "react";
import "./ResumeBuilder.css";
import { Sidebar } from "./Sidebar";
import { ResumeForm } from "./ResumeForm";
import { ResumePreview } from "./ResumePreview";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function ResumeBuilder() {
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState({
    firstName: "",
    lastName: "",
    profession: "",
    city: "",
    country: "",
    pinCode: "",
    phone: "",
    email: "",
    education: {
      degree: "",
      college: "",
      percentage: "",
    },
    experience: {
      role: "",
      company: "",
      duration: "",
      description: "",
    },
    skills: [],
    summary: "",
  });

  const previewRef = useRef();

  /* =========================
     📄 DOWNLOAD RESUME
  ========================= */
  const handleDownload = async () => {
    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("resume.pdf");
  };

  /* =========================
     🔥 ANALYZE RESUME (FIXED FLOW)
  ========================= */
  const handleAnalyze = async () => {
    setLoading(true);

    try {
      const payload = {
        summary: resumeData.summary,
        skills: resumeData.skills,
        experience: resumeData.experience,
        education: resumeData.education,
      };

      const res = await axios.post(
        "http://127.0.0.1:8000/api/analyze_created_resume/",
        payload
      );

      console.log("🔥 Analyze Result:", res.data);

      // ✅ STANDARD FORMAT (MATCH upload resume flow)
      const formatted = {
        jobs: res.data.jobs || [],
        top_match: res.data.top_match || null,
        match_score: res.data.top_match?.match || 0,
        skills: res.data.skills || [],
      };

      // 💾 IMPORTANT: SAME KEY USED BY SkillMatchCard
      localStorage.setItem("analysis", JSON.stringify(formatted));

      // 🔥 notify SkillMatchCard to refresh
      window.dispatchEvent(new Event("storage"));

      // 🔥 UX loading delay
      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 800);

    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Analysis failed ❌");
    }
  };

  return (
    <div className="builder-container">

      {/* LEFT SIDEBAR */}
      <div className="builder-sidebar">
        <Sidebar
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />
      </div>

      {/* CENTER FORM */}
      <div className="builder-form">
        <ResumeForm
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          data={resumeData}
          setData={setResumeData}
          onDownload={handleDownload}
          onAnalyze={handleAnalyze}
          loading={loading}
        />
      </div>

      {/* RIGHT PREVIEW */}
      <div className="builder-preview">
        <div className="preview-wrapper">
          <ResumePreview
            ref={previewRef}
            data={resumeData}
          />
        </div>
      </div>

    </div>
  );
}