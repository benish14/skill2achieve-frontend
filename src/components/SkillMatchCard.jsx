// src/components/SkillMatchCard.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles, Zap } from "lucide-react";
import "./SkillMatchCard.css";

/* =========================
   ANIMATION VARIANTS
========================= */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140, damping: 14 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* =========================
   ANIMATED COUNTER
========================= */
function AnimatedCounter({ value, duration = 1400 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(value, 100);
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{display}</>;
}

/* =========================
   SCORE RING — fixed sizing so 3 digits fit
========================= */
function ScoreRing({ percentage }) {
  const size = 110;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(percentage, 100) / 100) * circ;

  // color based on score
  const ringColor =
    percentage >= 80 ? "#1D9E75"
    : percentage >= 50 ? "#2563eb"
    : "#D4537E";

  const labelColor =
    percentage >= 80 ? "#065f46"
    : percentage >= 50 ? "#1e40af"
    : "#9f1239";

  const bgColor =
    percentage >= 80 ? "#d1fae5"
    : percentage >= 50 ? "#dbeafe"
    : "#fce7f3";

  return (
    <div className="smc-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        {/* progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>

      {/* center text — separate from SVG so it doesn't rotate */}
      <div className="smc-ring-center">
        <div
          className="smc-ring-bg"
          style={{ background: bgColor }}
        />
        <span className="smc-ring-number" style={{ color: labelColor }}>
          <AnimatedCounter value={percentage} />
          <span className="smc-ring-pct">%</span>
        </span>
        <span className="smc-ring-label">Match</span>
      </div>
    </div>
  );
}

/* =========================
   LEVEL BADGE
========================= */
function LevelBadge({ pct }) {
  const cfg =
    pct >= 90 ? { label: "Excellent", cls: "badge-excellent" }
    : pct >= 75 ? { label: "Strong", cls: "badge-strong" }
    : pct >= 50 ? { label: "Good", cls: "badge-good" }
    : { label: "Needs work", cls: "badge-low" };

  return <span className={`smc-level-badge ${cfg.cls}`}>{cfg.label}</span>;
}

/* =========================
   EMPTY STATE
========================= */
const EmptyState = () => (
  <motion.div
    className="smc-card smc-empty"
    variants={cardVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="smc-empty-icon-wrap">
      <Sparkles size={28} />
    </div>
    <h3 className="smc-empty-title">No analysis yet</h3>
    <p className="smc-empty-text">
      Upload or create your resume to see your AI skill match results here.
    </p>
    <div className="smc-empty-stats">
      <div className="smc-empty-stat">
        <span className="smc-empty-stat-num">0%</span>
        <span className="smc-empty-stat-lbl">Match</span>
      </div>
      <div className="smc-empty-divider" />
      <div className="smc-empty-stat">
        <span className="smc-empty-stat-num">–</span>
        <span className="smc-empty-stat-lbl">Matched</span>
      </div>
      <div className="smc-empty-divider" />
      <div className="smc-empty-stat">
        <span className="smc-empty-stat-num">–</span>
        <span className="smc-empty-stat-lbl">Missing</span>
      </div>
    </div>
  </motion.div>
);

/* =========================
   MAIN COMPONENT
========================= */
export function SkillMatchCard({ data }) {
  const hasValidData =
    data &&
    Array.isArray(data.jobs) &&
    data.jobs.length > 0 &&
    (data.jobs[0].matchedSkills || data.jobs[0].missingSkills);

  if (!hasValidData) return (
    <div className="smc-wrapper"><EmptyState /></div>
  );

  const job = data.jobs[0];
  const role = job?.role || "Resume Analysis";
  const pct = Math.max(0, Math.min(job?.match || 0, 100));
  const matchedSkills = Array.isArray(job?.matchedSkills) ? job.matchedSkills : [];
  const missingSkills = Array.isArray(job?.missingSkills) ? job.missingSkills : [];

  return (
    <div className="smc-wrapper">
      <motion.div
        className="smc-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >

        {/* ── Shimmer line at top ── */}
        <div className="smc-topline" />

        {/* ── Header ── */}
        <div className="smc-header">
          <ScoreRing percentage={pct} />

          <div className="smc-header-info">
            <div className="smc-ai-badge">
              <Zap size={11} />
              AI Analysis
            </div>
            <h3 className="smc-role">{role}</h3>
            <p className="smc-tagline">Skill matching result</p>
            <LevelBadge pct={pct} />
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="smc-stats-bar">
          <div className="smc-stat">
            <span className="smc-stat-num smc-green">{matchedSkills.length}</span>
            <span className="smc-stat-lbl">Matched</span>
          </div>
          <div className="smc-stat-divider" />
          <div className="smc-stat">
            <span className="smc-stat-num smc-red">{missingSkills.length}</span>
            <span className="smc-stat-lbl">Missing</span>
          </div>
          <div className="smc-stat-divider" />
          <div className="smc-stat">
            <span className="smc-stat-num smc-blue">{100 - pct}%</span>
            <span className="smc-stat-lbl">Gap</span>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="smc-progress-bar-wrap">
          <div className="smc-progress-track">
            <motion.div
              className="smc-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
              style={{
                background:
                  pct >= 80 ? "linear-gradient(90deg,#1D9E75,#5DCAA5)"
                  : pct >= 50 ? "linear-gradient(90deg,#2563eb,#60a5fa)"
                  : "linear-gradient(90deg,#D4537E,#f472b6)",
              }}
            />
          </div>
        </div>

        {/* ── Skills sections ── */}
        <motion.div
          className="smc-skills"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Matched */}
          <div className="smc-skill-section">
            <div className="smc-skill-header">
              <CheckCircle2 size={14} className="smc-icon-green" />
              <span className="smc-skill-title">Matched Skills</span>
            </div>
            <div className="smc-skill-list">
              {matchedSkills.length > 0
                ? matchedSkills.map((s, i) => (
                    <motion.span key={i} className="smc-tag smc-tag-green" variants={itemVariants}>
                      {s}
                    </motion.span>
                  ))
                : <span className="smc-empty-text-sm">No matched skills yet</span>
              }
            </div>
          </div>

          {/* Divider */}
          <div className="smc-divider" />

          {/* Missing */}
          <div className="smc-skill-section">
            <div className="smc-skill-header">
              <XCircle size={14} className="smc-icon-gray" />
              <span className="smc-skill-title">Missing Skills</span>
              <span className="smc-gap-tag">{100 - pct}% gap</span>
            </div>
            <div className="smc-skill-list">
              {missingSkills.length > 0
                ? missingSkills.map((s, i) => (
                    <motion.span key={i} className="smc-tag smc-tag-gray" variants={itemVariants}>
                      {s}
                    </motion.span>
                  ))
                : <span className="smc-empty-text-sm">No missing skills 🎉</span>
              }
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}