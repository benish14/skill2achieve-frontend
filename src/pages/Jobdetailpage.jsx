// src/pages/JobDetailPage.jsx
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, CheckCircle2, XCircle, BookOpen,
  ExternalLink, Zap, Trophy, Target, Clock, ChevronDown, ChevronUp, ChevronRight
} from "lucide-react"
import "./JobDetailPage.css"

/* ─── Static roadmap data by role keywords ─────────────────── */
const ROADMAP_DB = {
  "full stack": [
    { week: "Week 1–2", title: "Master Node.js & Express", desc: "Build RESTful APIs, middleware, authentication with JWT. Connect MongoDB/PostgreSQL.", resources: [{ name: "freeCodeCamp Node.js", url: "https://www.freecodecamp.org" }, { name: "The Odin Project", url: "https://www.theodinproject.com" }], level: "Foundation" },
    { week: "Week 3–4", title: "Docker & Containerisation", desc: "Containerise React + Node apps, Docker Compose for multi-service setup, push to Docker Hub.", resources: [{ name: "Docker Docs", url: "https://docs.docker.com" }, { name: "TechWorld with Nana", url: "https://www.youtube.com/@TechWorldwithNana" }], level: "Intermediate" },
    { week: "Week 5–6", title: "TypeScript deep dive", desc: "Types, generics, decorators — migrate your JS projects to TS for production quality.", resources: [{ name: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs" }, { name: "Matt Pocock Tutorials", url: "https://www.totaltypescript.com" }], level: "Intermediate" },
    { week: "Week 7–8", title: "Deploy your full project", desc: "Build and deploy a complete full stack app on Railway or Render. Add CI/CD with GitHub Actions.", resources: [{ name: "Railway.app", url: "https://railway.app" }, { name: "GitHub Actions Docs", url: "https://docs.github.com/en/actions" }], level: "Advanced" },
  ],
  "frontend": [
    { week: "Week 1–2", title: "TypeScript & advanced React", desc: "Hooks deep dive, Context, performance optimisation, custom hooks, TypeScript with React.", resources: [{ name: "React Docs", url: "https://react.dev" }, { name: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs" }], level: "Foundation" },
    { week: "Week 3", title: "State management", desc: "Redux Toolkit or Zustand — global state, async thunks, devtools.", resources: [{ name: "Redux Toolkit", url: "https://redux-toolkit.js.org" }, { name: "Zustand Docs", url: "https://zustand-demo.pmnd.rs" }], level: "Intermediate" },
    { week: "Week 4–5", title: "Testing with Vitest", desc: "Unit tests, React Testing Library, E2E with Playwright.", resources: [{ name: "Vitest Docs", url: "https://vitest.dev" }, { name: "Playwright", url: "https://playwright.dev" }], level: "Intermediate" },
    { week: "Week 6", title: "Performance & accessibility", desc: "Core Web Vitals, lazy loading, WCAG 2.1 accessibility — ship a perfect Lighthouse score.", resources: [{ name: "web.dev", url: "https://web.dev" }], level: "Advanced" },
  ],
  "backend": [
    { week: "Week 1–2", title: "Django REST Framework", desc: "Serializers, ViewSets, authentication, permissions, filtering.", resources: [{ name: "DRF Docs", url: "https://www.django-rest-framework.org" }, { name: "Corey Schafer YouTube", url: "https://www.youtube.com/@coreyms" }], level: "Foundation" },
    { week: "Week 3", title: "Redis & Celery", desc: "Caching strategies, async task queues, background jobs.", resources: [{ name: "Redis University", url: "https://university.redis.com" }], level: "Intermediate" },
    { week: "Week 4–5", title: "Docker & PostgreSQL", desc: "Containerise Django, production-grade Postgres setup, migrations.", resources: [{ name: "Docker Docs", url: "https://docs.docker.com" }], level: "Intermediate" },
    { week: "Week 6", title: "API security & testing", desc: "Rate limiting, OAuth2, pytest — ship a battle-tested API.", resources: [{ name: "OWASP API Security", url: "https://owasp.org/www-project-api-security" }], level: "Advanced" },
  ],
  "data analyst": [
    { week: "Week 1–2", title: "Power BI & Tableau", desc: "Build dashboards, DAX basics, connect to multiple data sources, publish reports.", resources: [{ name: "Microsoft Learn Power BI", url: "https://learn.microsoft.com/en-us/power-bi" }, { name: "Tableau Public", url: "https://public.tableau.com" }], level: "Foundation" },
    { week: "Week 3", title: "Matplotlib & Seaborn", desc: "Data visualisation in Python — charts, heatmaps, distributions, storytelling.", resources: [{ name: "Kaggle Python", url: "https://www.kaggle.com/learn/python" }], level: "Intermediate" },
    { week: "Week 4", title: "Statistics for analysts", desc: "Hypothesis testing, A/B testing, correlation, regression — the math you actually need.", resources: [{ name: "StatQuest YouTube", url: "https://www.youtube.com/@statquest" }, { name: "Khan Academy Stats", url: "https://www.khanacademy.org/math/statistics-probability" }], level: "Intermediate" },
    { week: "Week 5", title: "SQL advanced + ETL", desc: "Window functions, CTEs, query optimisation, build a simple ETL pipeline.", resources: [{ name: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial" }], level: "Advanced" },
  ],
  "devops": [
    { week: "Week 1–2", title: "Kubernetes fundamentals", desc: "Pods, Deployments, Services, ConfigMaps, Helm charts — run apps on K8s.", resources: [{ name: "Kubernetes.io Docs", url: "https://kubernetes.io/docs" }, { name: "TechWorld with Nana K8s", url: "https://www.youtube.com/@TechWorldwithNana" }], level: "Foundation" },
    { week: "Week 3–4", title: "Terraform & IaC", desc: "Provision AWS/GCP resources with Terraform, modules, remote state, workspaces.", resources: [{ name: "HashiCorp Learn", url: "https://developer.hashicorp.com/terraform" }], level: "Intermediate" },
    { week: "Week 5", title: "Prometheus & Grafana", desc: "Monitoring, alerting, dashboards — PromQL, alert rules, on-call setup.", resources: [{ name: "Grafana Docs", url: "https://grafana.com/docs" }, { name: "DevOps Directive", url: "https://www.youtube.com/@DevOpsDirective" }], level: "Intermediate" },
    { week: "Week 6", title: "CI/CD with GitHub Actions", desc: "Build full CI/CD pipelines, Docker build + push, deploy to K8s on merge.", resources: [{ name: "GitHub Actions Docs", url: "https://docs.github.com/en/actions" }], level: "Advanced" },
  ],
  "machine learning": [
    { week: "Week 1–2", title: "PyTorch fundamentals", desc: "Tensors, autograd, building neural networks from scratch, training loops.", resources: [{ name: "fast.ai", url: "https://www.fast.ai" }, { name: "PyTorch Tutorials", url: "https://pytorch.org/tutorials" }], level: "Foundation" },
    { week: "Week 3", title: "Model serving with FastAPI", desc: "REST API for ML models, async endpoints, Pydantic validation, Docker packaging.", resources: [{ name: "FastAPI Docs", url: "https://fastapi.tiangolo.com" }], level: "Intermediate" },
    { week: "Week 4–5", title: "MLflow & experiment tracking", desc: "Track experiments, model registry, A/B testing models, deployment pipelines.", resources: [{ name: "MLflow Docs", url: "https://mlflow.org/docs/latest/index.html" }], level: "Intermediate" },
    { week: "Week 6", title: "Capstone project", desc: "Build an end-to-end ML system — data → model → API → monitoring.", resources: [{ name: "Kaggle Competitions", url: "https://www.kaggle.com/competitions" }], level: "Advanced" },
  ],
  "default": [
    { week: "Week 1–2", title: "Core skill fundamentals", desc: "Master the foundational concepts for this role through structured learning.", resources: [{ name: "freeCodeCamp", url: "https://www.freecodecamp.org" }, { name: "Coursera", url: "https://www.coursera.org" }], level: "Foundation" },
    { week: "Week 3–4", title: "Build hands-on projects", desc: "Apply your skills by building 2–3 real projects you can add to your portfolio.", resources: [{ name: "GitHub", url: "https://github.com" }], level: "Intermediate" },
    { week: "Week 5–6", title: "Interview preparation", desc: "Practice role-specific interview questions, system design, and coding challenges.", resources: [{ name: "LeetCode", url: "https://leetcode.com" }, { name: "Glassdoor", url: "https://www.glassdoor.com" }], level: "Advanced" },
  ],
}

function getRoadmap(roleName) {
  const lower = (roleName || "").toLowerCase()
  if (lower.includes("full stack") || lower.includes("fullstack")) return ROADMAP_DB["full stack"]
  if (lower.includes("frontend") || lower.includes("front-end")) return ROADMAP_DB["frontend"]
  if (lower.includes("backend") || lower.includes("back-end")) return ROADMAP_DB["backend"]
  if (lower.includes("data anal")) return ROADMAP_DB["data analyst"]
  if (lower.includes("devops") || lower.includes("dev ops") || lower.includes("cloud") || lower.includes("sre")) return ROADMAP_DB["devops"]
  if (lower.includes("machine learning") || lower.includes("ml ") || lower.includes("ai ")) return ROADMAP_DB["machine learning"]
  return ROADMAP_DB["default"]
}

/* ─── Score Ring ─────────────────────────────────────────── */
function ScoreRing({ pct }) {
  const size = 120, stroke = 10
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = pct >= 80 ? "#1D9E75" : pct >= 50 ? "#2563eb" : "#D4537E"
  const bg = pct >= 80 ? "#d1fae5" : pct >= 50 ? "#dbeafe" : "#fce7f3"
  const textColor = pct >= 80 ? "#065f46" : pct >= 50 ? "#1e40af" : "#9d174d"

  return (
    <div className="jd-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="jd-ring-center">
        <div className="jd-ring-bg" style={{ background: bg }} />
        <motion.span
          className="jd-ring-num" style={{ color: textColor }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {pct}<span className="jd-ring-pct-sym">%</span>
        </motion.span>
        <span className="jd-ring-lbl">Match</span>
      </div>
    </div>
  )
}

/* ─── Level badge ────────────────────────────────────────── */
function LevelBadge({ pct }) {
  const cfg = pct >= 90 ? { label: "Excellent match", cls: "jd-badge-excellent" }
    : pct >= 75 ? { label: "Strong match", cls: "jd-badge-strong" }
    : pct >= 50 ? { label: "Good match", cls: "jd-badge-good" }
    : { label: "Needs work", cls: "jd-badge-low" }
  return <span className={`jd-level-badge ${cfg.cls}`}>{cfg.label}</span>
}

/* ─── Roadmap Week Card ──────────────────────────────────── */
const LEVEL_COLORS = {
  "Foundation": { bg: "#dbeafe", text: "#1e40af" },
  "Intermediate": { bg: "#fef3c7", text: "#92400e" },
  "Advanced": { bg: "#d1fae5", text: "#065f46" },
}

function RoadmapCard({ item, index }) {
  const [open, setOpen] = useState(index === 0)
  const lc = LEVEL_COLORS[item.level] || LEVEL_COLORS["Foundation"]

  return (
    <motion.div
      className="jd-rm-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.38, ease: "easeOut" }}
    >
      <div className="jd-rm-header" onClick={() => setOpen(o => !o)}>
        <div className="jd-rm-step">
          <div className="jd-rm-step-num">{index + 1}</div>
          <div className="jd-rm-step-line" />
        </div>
        <div className="jd-rm-title-wrap">
          <div className="jd-rm-week">{item.week}</div>
          <div className="jd-rm-title">{item.title}</div>
        </div>
        <div className="jd-rm-right">
          <span className="jd-rm-level" style={{ background: lc.bg, color: lc.text }}>{item.level}</span>
          {open ? <ChevronUp size={15} className="jd-rm-chevron" /> : <ChevronDown size={15} className="jd-rm-chevron" />}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="jd-rm-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <p className="jd-rm-desc">{item.desc}</p>
            <div className="jd-rm-resources">
              <Clock size={12} className="jd-rm-res-icon" />
              <span className="jd-rm-res-label">Resources:</span>
              {item.resources.map((r, ri) => (
                <a key={ri} href={r.url} target="_blank" rel="noreferrer" className="jd-rm-res-link">
                  {r.name} <ExternalLink size={10} />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── MAIN PAGE ─────────────────────────────────────────────── */
export function JobDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { job, allJobs } = location.state || {}

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (!job) {
    return (
      <div className="jd-not-found">
        <p>No job data found.</p>
        <button onClick={() => navigate(-1)}>Go back</button>
      </div>
    )
  }

  const pct = Math.max(0, Math.min(job.match || 0, 100))
  const matched = Array.isArray(job.matchedSkills) ? job.matchedSkills : []
  const missing = Array.isArray(job.missingSkills) ? job.missingSkills : []
  const roadmap = getRoadmap(job.role)
  const estWeeks = missing.length === 0 ? 0 : roadmap.length * 2

  const otherJobs = (allJobs || []).filter(j => j.role !== job.role).slice(0, 3)

  return (
    <div className="jd-page">

      {/* ── Decorative background ── */}
      <div className="jd-bg">
        <div className="jd-bg-blob1" />
        <div className="jd-bg-blob2" />
        <div className="jd-bg-grid" />
      </div>

      <div className="jd-container">

        {/* ── Back button ── */}
        <motion.button
          className="jd-back-btn"
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ x: -3 }}
        >
          <ArrowLeft size={16} />
          Back to snapshot
        </motion.button>

        {/* ── Hero section ── */}
        <motion.div
          className="jd-hero-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="jd-hero-topline" />

          <div className="jd-hero-body">
            <ScoreRing pct={pct} />

            <div className="jd-hero-info">
              <div className="jd-ai-badge">
                <Zap size={11} />
                AI Analysis
              </div>
              <h1 className="jd-role-title">{job.role}</h1>
              <LevelBadge pct={pct} />

              <div className="jd-stats-row">
                <div className="jd-stat">
                  <span className="jd-stat-num jd-green">{matched.length}</span>
                  <span className="jd-stat-lbl">Skills matched</span>
                </div>
                <div className="jd-stat-div" />
                <div className="jd-stat">
                  <span className="jd-stat-num jd-red">{missing.length}</span>
                  <span className="jd-stat-lbl">Skills missing</span>
                </div>
                <div className="jd-stat-div" />
                <div className="jd-stat">
                  <span className="jd-stat-num jd-blue">{estWeeks > 0 ? `~${estWeeks}w` : "Ready"}</span>
                  <span className="jd-stat-lbl">Est. to ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* progress bar */}
          <div className="jd-progress-wrap">
            <div className="jd-progress-track">
              <motion.div
                className="jd-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
                style={{
                  background: pct >= 80 ? "linear-gradient(90deg,#1D9E75,#5DCAA5)"
                    : pct >= 50 ? "linear-gradient(90deg,#2563eb,#60a5fa)"
                    : "linear-gradient(90deg,#D4537E,#f472b6)"
                }}
              />
            </div>
            <div className="jd-progress-labels">
              <span>0%</span>
              <span style={{ color: pct >= 80 ? "#059669" : pct >= 50 ? "#2563eb" : "#D4537E", fontWeight: 700 }}>{pct}% match</span>
              <span>100%</span>
            </div>
          </div>
        </motion.div>

        {/* ── Two column layout ── */}
        <div className="jd-two-col">

          {/* LEFT — Skills */}
          <div className="jd-left">

            {/* Matched Skills */}
            <motion.div
              className="jd-skills-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <div className="jd-skills-header">
                <CheckCircle2 size={16} className="jd-icon-green" />
                <h2 className="jd-skills-title">Matched skills</h2>
                <span className="jd-skills-count jd-count-green">{matched.length}</span>
              </div>
              <p className="jd-skills-sub">You already have these — great foundation!</p>
              <div className="jd-tag-list">
                {matched.length > 0
                  ? matched.map((s, i) => (
                      <motion.span
                        key={i} className="jd-tag jd-tag-green"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.04 }}
                      >{s}</motion.span>
                    ))
                  : <p className="jd-empty-sm">No matched skills yet — upload a stronger resume.</p>
                }
              </div>
            </motion.div>

            {/* Missing Skills */}
            {missing.length > 0 && (
              <motion.div
                className="jd-skills-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                <div className="jd-skills-header">
                  <XCircle size={16} className="jd-icon-red" />
                  <h2 className="jd-skills-title">Missing skills</h2>
                  <span className="jd-skills-count jd-count-red">{missing.length}</span>
                </div>
                <p className="jd-skills-sub">Learn these to become job-ready for this role.</p>
                <div className="jd-tag-list">
                  {missing.map((s, i) => (
                    <motion.span
                      key={i} className="jd-tag jd-tag-red"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.04 }}
                    >{s}</motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {missing.length === 0 && (
              <motion.div
                className="jd-ready-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                <Trophy size={28} className="jd-ready-icon" />
                <h3 className="jd-ready-title">You're job-ready!</h3>
                <p className="jd-ready-sub">100% skill match — start applying now. Polish your portfolio and update your LinkedIn.</p>
                <a href="https://www.linkedin.com/jobs" target="_blank" rel="noreferrer" className="jd-apply-btn">
                  Browse jobs on LinkedIn <ExternalLink size={13} />
                </a>
              </motion.div>
            )}

            {/* Other roles */}
            {otherJobs.length > 0 && (
              <motion.div
                className="jd-other-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <div className="jd-skills-header" style={{ marginBottom: "0.9rem" }}>
                  <Target size={15} className="jd-icon-blue" />
                  <h2 className="jd-skills-title">Other matched roles</h2>
                </div>
                {otherJobs.map((j, i) => {
                  const p = Math.max(0, Math.min(j.match || 0, 100))
                  return (
                    <div
                      key={i} className="jd-other-row"
                      onClick={() => navigate("/job-detail", { state: { job: j, allJobs } })}
                    >
                      <span className="jd-other-name">{j.role}</span>
                      <div className="jd-other-bar-wrap">
                        <div className="jd-other-bar" style={{ width: `${p}%`, background: p >= 75 ? "#1D9E75" : p >= 50 ? "#2563eb" : "#f59e0b" }} />
                      </div>
                      <span className="jd-other-pct">{p}%</span>
                      <ChevronRight size={13} style={{ color: "#94a3b8" }} />
                    </div>
                  )
                })}
              </motion.div>
            )}
          </div>

          {/* RIGHT — Roadmap */}
          <div className="jd-right">
            <motion.div
              className="jd-rm-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="jd-rm-section-header">
                <div className="jd-rm-section-badge">
                  <BookOpen size={12} />
                  Learning roadmap
                </div>
                <h2 className="jd-rm-section-title">
                  {missing.length === 0
                    ? "Keep your skills sharp"
                    : `Close your ${missing.length} skill gap${missing.length > 1 ? "s" : ""}`}
                </h2>
                <p className="jd-rm-section-sub">
                  {missing.length === 0
                    ? "You're ready — explore advanced topics to stay ahead."
                    : `Follow this week-by-week plan to become job-ready for ${job.role}.`}
                </p>
              </div>

              <div className="jd-rm-list">
                {roadmap.map((item, i) => (
                  <RoadmapCard key={i} item={item} index={i} />
                ))}
              </div>

              {/* tip */}
              <div className="jd-rm-tip">
                <Zap size={13} style={{ color: "#f59e0b", flexShrink: 0 }} />
                <span>Tip: Dedicate 2–3 hours/day and you'll be interview-ready in {roadmap.length * 2} weeks.</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  )
}