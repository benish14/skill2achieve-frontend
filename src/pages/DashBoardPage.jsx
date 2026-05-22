import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  Briefcase,
  TrendingUp,
  MapPin,
  DollarSign,
} from 'lucide-react'
import './DashboardPage.css'

export function DashboardPage() {

  const [analysis, setAnalysis] = useState({
    match: 0,
    matchedSkills: [],
    missingSkills: [],
    role: "No Role"
  })

  // =========================
  // 🔥 LOAD + SYNC DATA (REAL APP FIX)
  // =========================
  const loadData = () => {
    const data =
      localStorage.getItem("analysis") ||
      localStorage.getItem("skillData")

    if (!data) return

    const parsed = JSON.parse(data)

    let formatted = {}

    if (parsed.jobs) {
      const top = parsed.jobs[0] || {}

      formatted = {
        match: top.match || 0,
        matchedSkills: top.matchedSkills || [],
        missingSkills: top.missingSkills || [],
        role: top.role || "Recommended Role"
      }
    } else {
      formatted = {
        match: parsed.score || 0,
        matchedSkills: parsed.matched_skills || [],
        missingSkills: parsed.missing_skills || [],
        role: "Your Resume Match"
      }
    }

    setAnalysis(formatted)
  }

  useEffect(() => {
    loadData()

    // 🔥 Listen for updates (important)
    window.addEventListener("storage", loadData)

    return () => {
      window.removeEventListener("storage", loadData)
    }
  }, [])

  // =========================
  // PROFILE LEVEL
  // =========================
  const getLevel = (score) => {
    if (score >= 90) return "Excellent"
    if (score >= 75) return "Strong"
    if (score >= 50) return "Good"
    return "Needs Improvement"
  }

  // =========================
  // JOBS (DYNAMIC FROM ROLE)
  // =========================
  const generateJobs = () => {
    const baseRole = analysis.role || "Developer"

    return [
      {
        title: baseRole,
        match: analysis.match,
        company: "TCS",
        location: "Chennai, India",
        salary: "₹6L - ₹12L"
      },
      {
        title: `${baseRole} (React)` ,
        match: Math.max(analysis.match - 5, 0),
        company: "Infosys",
        location: "Bangalore, India",
        salary: "₹5L - ₹10L"
      },
      {
        title: `${baseRole} Intern`,
        match: Math.max(analysis.match - 15, 0),
        company: "Zoho",
        location: "Chennai, India",
        salary: "₹2L - ₹4L"
      }
    ]
  }

  const jobs = generateJobs()

  // =========================
  // APPLY
  // =========================
  const handleApply = (job) => {
    if (analysis.match < 100) {
      alert("⚠️ Reach 100% match to unlock apply feature")
      return
    }
    alert(`✅ Demo Apply to ${job.company}`)
  }

  // =========================
  // CIRCLE CALC
  // =========================
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (analysis.match / 100) * circumference

  return (
    <div className="dashboardWrapper">
      <div className="dashboardContainer">

        {/* HEADER */}
        <div className="dashboardHeader">
          <h1>Dashboard</h1>
          <p>AI-powered profile insights</p>
        </div>

        <div className="dashboardGrid">

          {/* LEFT */}
          <div className="leftColumn">

            {/* PROFILE */}
            <div className="card profileStrength">

              <h2>Profile Strength</h2>

              <div className="progressWrapper">
                <div className="progressCircle modern">

                  <svg viewBox="0 0 120 120">

                    <defs>
                      <linearGradient id="blueGradient">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>

                    {/* Track */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="#e2e8f0"
                      strokeWidth="10"
                      fill="none"
                    />

                    {/* Progress */}
                    <motion.circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="url(#blueGradient)"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: offset }}
                      transition={{ duration: 1.5 }}
                    />

                  </svg>

                  {/* CENTER TEXT */}
                  <div className="progressCenter">
                    <span className="percent">{analysis.match}%</span>
                    <span className="level">{getLevel(analysis.match)}</span>
                  </div>

                </div>
              </div>

              <p className="roleText">
                Target Role: <b>{analysis.role}</b>
              </p>

            </div>

            {/* SKILLS */}
            <div className="card skillBreakdown">
              <h2>Skill Analysis</h2>

              {/* MATCHED */}
              <div className="skillGroup">
                <div className="skillHeader">
                  <CheckCircle2 className="greenIcon" />
                  <h3>Matched Skills</h3>
                </div>

                <div className="skillList">
                  {analysis.matchedSkills.length > 0
                    ? analysis.matchedSkills.map(skill => (
                        <span key={skill} className="skillTag greenTag">
                          {skill}
                        </span>
                      ))
                    : <span>No matched skills</span>}
                </div>
              </div>

              <div className="divider" />

              {/* MISSING */}
              <div className="skillGroup">
                <div className="skillHeader">
                  <XCircle className="orangeIcon" />
                  <h3>Missing Skills</h3>
                </div>

                <div className="skillList">
                  {analysis.missingSkills.length > 0
                    ? analysis.missingSkills.map(skill => (
                        <span key={skill} className="skillTag orangeTag">
                          {skill}
                        </span>
                      ))
                    : <span>No missing skills 🎉</span>}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="rightColumn">

            <h2>Recommended Jobs</h2>

            {jobs.map((job, i) => (
              <div key={i} className="card jobCard">

                <div className="jobFlex">

                  <div className="jobInfoFlex">
                    <Briefcase />

                    <div>
                      <h3>{job.title}</h3>
                      <p>{job.company}</p>

                      <div className="jobDetails">
                        <div><MapPin /> {job.location}</div>
                        <div><DollarSign /> {job.salary}</div>
                      </div>

                      <span className="matchTag">
                        <TrendingUp /> {job.match}%
                      </span>
                    </div>
                  </div>

                  <button
                    className="applyBtn"
                    disabled={analysis.match < 100}
                    onClick={() => handleApply(job)}
                  >
                    {analysis.match === 100 ? "Apply Now" : "Improve Skills"}
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  )
}