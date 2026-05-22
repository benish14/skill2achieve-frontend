// src/App.jsx

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import { DashboardPage } from "./pages/DashBoardPage";
import { ResumeOptions } from "./pages/ResumeOptions";
import ResumeQuestions from "./pages/ResumeQuestions";
import { ResumeBuilder } from "./components/ResumeBuilder/ResumeBuilder";
import JobRoadmap from "./pages/Jobroadmap";
import { JobDetailPage } from "./pages/Jobdetailpage";



// Home wrapper
function Home() {
  return <HeroSection />;
}

function App() {
  return (
    <BrowserRouter>
      {/* Header visible on all pages */}
      <Header />

       <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" />} /> {/* redirect /home to / */}

        {/* Dashboard page */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Register page */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />

        <Route path="/resume-options" element={<ResumeOptions />} />

        <Route path="/resume-question" element={<ResumeQuestions />} />

        <Route path="/resume-builder" element={<ResumeBuilder />} />

        <Route path="/job-detail" element={<JobDetailPage />} />

        <Route path="/roadmap/:slug" element={<JobRoadmap />} />


        

      
      </Routes>
    </BrowserRouter>
  );
}

export default App;