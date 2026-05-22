// src/components/SkillSnapshot.jsx
import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Sparkles, ChevronRight, TrendingUp, Upload } from "lucide-react"
import "./SkillSnapshot.css"

const BAR_COLORS = [
  { bar: "#1D9E75", text: "#065f46", bg: "#d1fae5", border: "#6ee7b7" },
  { bar: "#2563eb", text: "#1e40af", bg: "#dbeafe", border: "#93c5fd" },
  { bar: "#f59e0b", text: "#92400e", bg: "#fef3c7", border: "#fcd34d" },
  { bar: "#D4537E", text: "#9d174d", bg: "#fce7f3", border: "#f9a8d4" },
  { bar: "#7c3aed", text: "#4c1d95", bg: "#ede9fe", border: "#c4b5fd" },
  { bar: "#0891b2", text: "#164e63", bg: "#cffafe", border: "#67e8f9" },
]

function SnapshotBar({ job, index, onClick }) {
  const color = BAR_COLORS[index % BAR_COLORS.length]
  const pct = Math.max(0, Math.min(job.match || 0, 100))

  return (
    <motion.div
      className="ssn-row"
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.38, ease: "easeOut" }}
      onClick={() => onClick(job)}
      whileHover={{ x: 3 }}
    >
      <span className="ssn-role-name">{job.role}</span>

      <div className="ssn-bar-wrap">
        <motion.div
          className="ssn-bar-fill"
          style={{ background: color.bar }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: index * 0.07 + 0.2, duration: 0.9, ease: "easeOut" }}
        />
      </div>

      <div className="ssn-right">
        <span className="ssn-pct" style={{ color: color.bar }}>{pct}%</span>
        <ChevronRight size={13} className="ssn-arrow" style={{ color: color.bar }} />
      </div>
    </motion.div>
  )
}

export function SkillSnapshot({ data }) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  const hasData =
    data &&
    Array.isArray(data.jobs) &&
    data.jobs.length > 0 &&
    data.jobs.some(j => (j.matchedSkills?.length > 0 || j.missingSkills?.length > 0))

  useEffect(() => {
    if (hasData) {
      const t = setTimeout(() => setVisible(true), 100)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [hasData])

  const handleJobClick = (job) => {
    navigate("/job-detail", { state: { job, allJobs: data.jobs } })
  }

  if (!hasData) {
    return (
      <div className="ssn-empty-wrap">
        <div className="ssn-empty-inner">
          <div className="ssn-empty-icon">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="ssn-empty-title">Your skill snapshot will appear here</div>
            <div className="ssn-empty-sub">Upload your resume above to see all matching job roles with percentages</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="ssn-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="ssn-header">
            <div className="ssn-header-left">
              <div className="ssn-ai-badge">
                <Sparkles size={11} />
                AI Skill Snapshot
              </div>
              <p className="ssn-header-sub">Click any role to see details &amp; learning roadmap</p>
            </div>
            <div className="ssn-header-right">
              <span className="ssn-count">{data.jobs.length} roles matched</span>
            </div>
          </div>

          <div className="ssn-list">
            {data.jobs.map((job, i) => (
              <SnapshotBar key={i} job={job} index={i} onClick={handleJobClick} />
            ))}
          </div>

          <div className="ssn-footer">
            <span>Results based on your uploaded resume · </span>
            <button className="ssn-reupload" onClick={() => document.getElementById("resume-upload-input")?.click()}>
              <Upload size={11} /> Re-upload resume
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}