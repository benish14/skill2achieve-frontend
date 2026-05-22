// src/components/HeroSection.jsx
// ── Only change: import ChatBot and add <ChatBot /> at the bottom ──
import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, FileText } from 'lucide-react'
import { SkillMatchCard } from './SkillMatchCard'
import { SkillSnapshot } from './SkillSnapshot'
import { SearchBar } from './SearchBar'
import { ChatBot } from './ChatBot'           // ← ADD THIS IMPORT
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './HeroSection.css'

// Sparkles
const sparkles = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 2,
}))

export function HeroSection() {

  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

  const dummyData = {
    jobs: [
      {
        role: "Upload Resume to See Matches",
        match: 0,
        matchedSkills: [],
        missingSkills: []
      }
    ]
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setAnalysis(null)
      return
    }

    const stored = localStorage.getItem("analysis")
    if (!stored) { setAnalysis(null); return }

    try {
      const parsed = JSON.parse(stored)
      let formatted = parsed

      if (!parsed.jobs) {
        formatted = {
          jobs: [
            {
              role: "Your Resume Match",
              match: parsed.score || 0,
              matchedSkills: parsed.matched_skills || [],
              missingSkills: parsed.missing_skills || []
            }
          ]
        }
      }

      setAnalysis(formatted)
    } catch (err) {
      setAnalysis(null)
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (location.state?.triggerUpload) {
      const timer = setTimeout(() => {
        if (!isLoggedIn) { navigate("/register"); return }
        fileInputRef.current?.click()
      }, 300)
      window.history.replaceState({}, document.title)
      return () => clearTimeout(timer)
    }
  }, [location.state, isLoggedIn, navigate])

  const handleUploadClick = () => {
    if (!localStorage.getItem("isLoggedIn")) {
      navigate("/register")
      return
    }
    fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("resume", file)
    setLoading(true)

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/analyze-resume/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      setAnalysis(res.data)
      localStorage.setItem("analysis", JSON.stringify(res.data))
    } catch (error) {
      console.error(error)
      alert("Upload failed ❌ Please try again")
    } finally {
      setLoading(false)
      e.target.value = ""
    }
  }

  return (
    <>
      <section className="hero-section">

        {/* Background */}
        <div className="hero-bg">
          <div className="hero-bg-wave1" />
          <div className="hero-bg-wave2" />
          <div className="hero-bg-grid" />
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="hero-sparkle"
              style={{ width: sparkle.size, height: sparkle.size, top: sparkle.top, left: sparkle.left }}
              animate={{ y: [0, -20, 0], opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
              transition={{ duration: sparkle.duration, repeat: Infinity, delay: sparkle.delay, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="hero-container">

          <div className="searchbar-wrapper">
            <SearchBar />
          </div>

          <div className="hero-grid">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-content"
            >
              <div className="hero-badge">Skill2Achieve Platform</div>

              <h1 className="hero-heading">
                <span className="hero-subheading">Turn Your</span>
                <span className="hero-skill-word"> Skills into the</span>
                <br />
                <span className="hero-right-career">Right Career</span>
                <span className="hero-star">✦</span>
              </h1>

              <p className="hero-description">
                Upload your resume or create one to discover best matching jobs using AI skill analysis.
              </p>

              <div className="hero-buttons">
                <input
                  id="resume-upload-input"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept=".pdf,.doc,.docx"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                  onClick={handleUploadClick}
                  disabled={loading}
                >
                  <FileText className="icon" />
                  {loading ? "Analyzing..." : "Upload Resume"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="btn-secondary"
                  onClick={() => navigate("/resume-options")}
                >
                  Create Resume
                  <ArrowRight className="icon" />
                </motion.button>
              </div>

              <div className="hero-features">
                <div className="feature"><Check className="feature-icon" />Free to start</div>
                <div className="feature"><Check className="feature-icon" />AI Powered</div>
                <div className="feature"><Check className="feature-icon" />No credit card</div>
              </div>
            </motion.div>

            {/* RIGHT */}
            <div className="hero-bright">
              <SkillMatchCard data={analysis || dummyData} />
            </div>

          </div>
        </div>
      </section>

      {/* Snapshot Section */}
      <section className="snapshot-section">
        <div className="hero-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="snapshot-section-header">
              <h2 className="snapshot-section-title">Your skill snapshot</h2>
              <p className="snapshot-section-sub">
                {analysis
                  ? "Click any role below to see your matched skills, gaps, and a personalised learning roadmap."
                  : "Upload your resume above to unlock your full skill snapshot across all matching roles."}
              </p>
            </div>
            <SkillSnapshot data={analysis} />
          </motion.div>
        </div>
      </section>

      {/* ── 🎓 ChatBot — fixed bottom-right, does NOT affect page layout ── */}
      <ChatBot />
    </>
  )
}