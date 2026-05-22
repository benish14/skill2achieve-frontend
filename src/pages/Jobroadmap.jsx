// src/pages/Jobroadmap.jsx
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Briefcase, TrendingUp, Lightbulb, FileText, PlusCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import './Jobroadmap.css'

// ─── Job Data ─────────────────────────────────────────────────────────────────
const JOBS = {
  'frontend-developer': {
    title: 'Frontend Developer',
    tagline: 'Build beautiful, interactive user interfaces for the web',
    salary: [
      { label: 'Entry', value: '₹3–6 LPA' },
      { label: 'Mid', value: '₹8–18 LPA' },
      { label: 'Senior', value: '₹20–40 LPA' },
    ],
    skills: [
      { name: 'HTML & CSS', level: 'must' },
      { name: 'JavaScript (ES6+)', level: 'must' },
      { name: 'React', level: 'must' },
      { name: 'TypeScript', level: 'good' },
      { name: 'Git & GitHub', level: 'must' },
      { name: 'REST APIs', level: 'good' },
      { name: 'Next.js', level: 'good' },
      { name: 'Tailwind CSS', level: 'good' },
      { name: 'Testing (Jest)', level: 'bonus' },
      { name: 'GraphQL', level: 'bonus' },
      { name: 'Docker basics', level: 'bonus' },
    ],
    roadmap: [
      { phase: 'Month 1–2', heading: 'Web fundamentals', color: '#7F77DD', items: ['HTML5 semantics', 'CSS Flexbox & Grid', 'JS basics (ES6+)', 'Git & GitHub'] },
      { phase: 'Month 3–4', heading: 'JavaScript deep dive', color: '#378ADD', items: ['DOM manipulation', 'Async / Promises', 'Fetch API', 'Local Storage'] },
      { phase: 'Month 5–6', heading: 'React ecosystem', color: '#1D9E75', items: ['React hooks', 'State management', 'React Router', 'Component design'] },
      { phase: 'Month 7–9', heading: 'Job-ready skills', color: '#D4537E', items: ['TypeScript', 'Next.js', 'Deploy on Vercel', '3 Portfolio projects'] },
    ],
    opinion: "Frontend is one of the most accessible paths into tech — you see results instantly and creativity matters. Build at least 3 real projects you're proud of before applying. Don't chase every framework; master React first. The job market in India is strong for frontend devs in product companies and startups. Focus on performance and accessibility — interviewers notice when candidates think beyond just making things look good.",
    resources: ['The Odin Project', 'freeCodeCamp', 'Frontend Masters', 'React official docs'],
  },
  'backend-developer': {
    title: 'Backend Developer',
    tagline: 'Power applications with APIs, databases, and server logic',
    salary: [
      { label: 'Entry', value: '₹4–8 LPA' },
      { label: 'Mid', value: '₹10–22 LPA' },
      { label: 'Senior', value: '₹25–50 LPA' },
    ],
    skills: [
      { name: 'Python / Node.js', level: 'must' },
      { name: 'REST API design', level: 'must' },
      { name: 'SQL databases', level: 'must' },
      { name: 'Git & GitHub', level: 'must' },
      { name: 'Authentication (JWT)', level: 'good' },
      { name: 'Docker', level: 'good' },
      { name: 'Redis / Caching', level: 'good' },
      { name: 'NoSQL (MongoDB)', level: 'good' },
      { name: 'Kubernetes', level: 'bonus' },
      { name: 'GraphQL', level: 'bonus' },
      { name: 'Message queues', level: 'bonus' },
    ],
    roadmap: [
      { phase: 'Month 1–2', heading: 'Programming foundations', color: '#7F77DD', items: ['Python or Node.js', 'OOP concepts', 'Git basics', 'Command line'] },
      { phase: 'Month 3–4', heading: 'Databases & APIs', color: '#378ADD', items: ['SQL (PostgreSQL)', 'REST API design', 'Express / FastAPI', 'Postman testing'] },
      { phase: 'Month 5–6', heading: 'Real-world backend', color: '#1D9E75', items: ['Auth (JWT/OAuth)', 'Error handling', 'Docker basics', 'Cloud intro (AWS/GCP)'] },
      { phase: 'Month 7–9', heading: 'Scale & production', color: '#D4537E', items: ['Redis caching', 'Message queues', 'CI/CD pipelines', 'System design basics'] },
    ],
    opinion: "Backend engineering has huge long-term demand — every app needs a solid server. Pick one language and go deep rather than jumping around. Python has massive demand in India, especially near AI/ML roles. System design is your path to senior levels — start learning it early. Contribute to open source once comfortable; it dramatically improves your resume.",
    resources: ['cs50.harvard.edu', 'roadmap.sh/backend', 'Full Stack Open', 'NeetCode system design'],
  },
  'full-stack-developer': {
    title: 'Full Stack Developer',
    tagline: 'Build complete web applications from frontend to backend',
    salary: [
      { label: 'Entry', value: '₹4–8 LPA' },
      { label: 'Mid', value: '₹10–22 LPA' },
      { label: 'Senior', value: '₹25–50 LPA' },
    ],
    skills: [
      { name: 'HTML / CSS / JS', level: 'must' },
      { name: 'React', level: 'must' },
      { name: 'Node.js / Python', level: 'must' },
      { name: 'SQL & NoSQL', level: 'must' },
      { name: 'REST APIs', level: 'must' },
      { name: 'Git & GitHub', level: 'must' },
      { name: 'TypeScript', level: 'good' },
      { name: 'Docker basics', level: 'good' },
      { name: 'Cloud deployment', level: 'good' },
      { name: 'GraphQL', level: 'bonus' },
    ],
    roadmap: [
      { phase: 'Month 1–3', heading: 'Frontend fundamentals', color: '#7F77DD', items: ['HTML5 & CSS', 'JavaScript (ES6+)', 'React basics', 'Git & GitHub'] },
      { phase: 'Month 4–5', heading: 'Backend & databases', color: '#378ADD', items: ['Node.js + Express', 'REST API design', 'SQL (PostgreSQL)', 'MongoDB'] },
      { phase: 'Month 6–7', heading: 'Integration & auth', color: '#1D9E75', items: ['JWT authentication', 'Full CRUD apps', 'Error handling', 'Testing basics'] },
      { phase: 'Month 8–10', heading: 'Production & portfolio', color: '#D4537E', items: ['Next.js', 'Docker basics', 'Deploy to cloud', '2 full-stack projects'] },
    ],
    opinion: "Full stack is one of the most valuable profiles for startups — you can own an entire feature end to end. Get solid on one side (preferably frontend first) before spreading across the stack. In India, full stack developers are extremely sought after in product startups. Build complete, deployed apps — not just tutorials — before applying.",
    resources: ['Full Stack Open', 'The Odin Project', 'roadmap.sh/full-stack', 'Scrimba'],
  },
  'data-scientist': {
    title: 'Data Scientist',
    tagline: 'Uncover insights from data and build predictive models',
    salary: [
      { label: 'Entry', value: '₹5–9 LPA' },
      { label: 'Mid', value: '₹12–25 LPA' },
      { label: 'Senior', value: '₹28–55 LPA' },
    ],
    skills: [
      { name: 'Python', level: 'must' },
      { name: 'Statistics & Math', level: 'must' },
      { name: 'Pandas / NumPy', level: 'must' },
      { name: 'Machine Learning', level: 'must' },
      { name: 'SQL', level: 'good' },
      { name: 'Data visualization', level: 'good' },
      { name: 'Scikit-learn', level: 'good' },
      { name: 'TensorFlow / PyTorch', level: 'good' },
      { name: 'Spark / Big Data', level: 'bonus' },
      { name: 'MLOps', level: 'bonus' },
    ],
    roadmap: [
      { phase: 'Month 1–2', heading: 'Python & math foundation', color: '#7F77DD', items: ['Python programming', 'Linear algebra', 'Statistics & probability', 'Pandas, NumPy'] },
      { phase: 'Month 3–4', heading: 'Data analysis', color: '#378ADD', items: ['Exploratory data analysis', 'Data cleaning', 'SQL for data', 'Matplotlib / Seaborn'] },
      { phase: 'Month 5–6', heading: 'Machine learning', color: '#1D9E75', items: ['Supervised learning', 'Unsupervised learning', 'Scikit-learn', 'Model evaluation'] },
      { phase: 'Month 7–9', heading: 'Specialization', color: '#D4537E', items: ['Deep learning basics', 'Kaggle competitions', 'End-to-end ML project', 'Portfolio + GitHub'] },
    ],
    opinion: "Data Science is genuinely exciting but competitive. Many students underestimate the math — you need a real foundation in statistics. Work on real datasets beyond Titanic/Iris and enter at least one Kaggle competition before job hunting. In India, analytics roles are abundant in banking, e-commerce, and startups. Combine data skills with domain knowledge and you become far more valuable.",
    resources: ['Kaggle Learn', 'fast.ai', 'StatQuest on YouTube', 'Coursera ML Specialization'],
  },
  'ui-ux-designer': {
    title: 'UI/UX Designer',
    tagline: 'Design intuitive, beautiful experiences that users love',
    salary: [
      { label: 'Entry', value: '₹3–5 LPA' },
      { label: 'Mid', value: '₹7–15 LPA' },
      { label: 'Senior', value: '₹18–35 LPA' },
    ],
    skills: [
      { name: 'Figma', level: 'must' },
      { name: 'User research', level: 'must' },
      { name: 'Wireframing', level: 'must' },
      { name: 'Design systems', level: 'good' },
      { name: 'Prototyping', level: 'good' },
      { name: 'HTML/CSS basics', level: 'good' },
      { name: 'Usability testing', level: 'good' },
      { name: 'Accessibility (a11y)', level: 'good' },
      { name: 'Motion design', level: 'bonus' },
    ],
    roadmap: [
      { phase: 'Month 1–2', heading: 'Design fundamentals', color: '#7F77DD', items: ['Typography', 'Color theory', 'Layout & grids', 'Figma basics'] },
      { phase: 'Month 3–4', heading: 'UX process', color: '#378ADD', items: ['User research', 'Personas & journeys', 'Wireframing', 'Information architecture'] },
      { phase: 'Month 5–6', heading: 'Interaction design', color: '#1D9E75', items: ['High-fidelity mockups', 'Prototyping', 'Usability testing', 'Design systems'] },
      { phase: 'Month 7–9', heading: 'Portfolio & job prep', color: '#D4537E', items: ['3 case studies', 'HTML/CSS basics', 'Design handoff', 'Interview prep'] },
    ],
    opinion: "UX is one of the most human-centered careers in tech. The biggest mistake students make is focusing only on tools (Figma) and not on thinking. Recruiters hire for problem-solving and empathy. Your portfolio should show your process, not just final screens. In India, product companies like Flipkart, Swiggy, and CRED are great targets.",
    resources: ['Google UX Design Certificate', 'Refactoring UI book', 'Nielsen Norman Group', 'Figma Community'],
  },
  'devops-engineer': {
    title: 'DevOps Engineer',
    tagline: 'Bridge development and operations to ship software faster',
    salary: [
      { label: 'Entry', value: '₹5–9 LPA' },
      { label: 'Mid', value: '₹12–24 LPA' },
      { label: 'Senior', value: '₹28–55 LPA' },
    ],
    skills: [
      { name: 'Linux / Bash', level: 'must' },
      { name: 'Docker', level: 'must' },
      { name: 'Kubernetes', level: 'must' },
      { name: 'CI/CD pipelines', level: 'must' },
      { name: 'Cloud (AWS/GCP)', level: 'good' },
      { name: 'Terraform', level: 'good' },
      { name: 'Monitoring (Grafana)', level: 'good' },
      { name: 'Git', level: 'must' },
      { name: 'Ansible', level: 'bonus' },
      { name: 'Security basics', level: 'bonus' },
    ],
    roadmap: [
      { phase: 'Month 1–2', heading: 'Linux & networking', color: '#7F77DD', items: ['Linux commands', 'Bash scripting', 'Networking basics', 'Git & GitHub'] },
      { phase: 'Month 3–4', heading: 'Containers & CI/CD', color: '#378ADD', items: ['Docker', 'Docker Compose', 'GitHub Actions', 'Jenkins basics'] },
      { phase: 'Month 5–6', heading: 'Kubernetes & cloud', color: '#1D9E75', items: ['Kubernetes (K8s)', 'AWS / GCP fundamentals', 'Terraform', 'IAM & security'] },
      { phase: 'Month 7–9', heading: 'Observability & SRE', color: '#D4537E', items: ['Prometheus & Grafana', 'Log management', 'Incident response', 'Cloud certifications'] },
    ],
    opinion: "DevOps is one of the highest-paying tracks for students willing to get comfortable with infrastructure. Cloud certifications (AWS Solutions Architect, Google ACE) are genuinely worth it in India's market and open doors even without full-time experience. The best DevOps engineers love automation and have a 'fix it properly' mindset.",
    resources: ['Linux Foundation courses', 'KodeKloud', 'AWS free tier', 'roadmap.sh/devops'],
  },
  'ml-engineer': {
    title: 'ML Engineer',
    tagline: 'Build and deploy machine learning systems at production scale',
    salary: [
      { label: 'Entry', value: '₹7–12 LPA' },
      { label: 'Mid', value: '₹15–30 LPA' },
      { label: 'Senior', value: '₹35–70 LPA' },
    ],
    skills: [
      { name: 'Python', level: 'must' },
      { name: 'Deep learning', level: 'must' },
      { name: 'PyTorch / TensorFlow', level: 'must' },
      { name: 'MLOps', level: 'must' },
      { name: 'SQL & data pipelines', level: 'good' },
      { name: 'Docker / K8s', level: 'good' },
      { name: 'Cloud ML (SageMaker)', level: 'good' },
      { name: 'Statistics', level: 'must' },
      { name: 'LLM fine-tuning', level: 'bonus' },
      { name: 'Spark', level: 'bonus' },
    ],
    roadmap: [
      { phase: 'Month 1–2', heading: 'ML foundations', color: '#7F77DD', items: ['Python (advanced)', 'Statistics', 'Scikit-learn', 'NumPy / Pandas'] },
      { phase: 'Month 3–5', heading: 'Deep learning', color: '#378ADD', items: ['Neural networks', 'PyTorch / TensorFlow', 'CNNs, RNNs, Transformers', 'GPU training basics'] },
      { phase: 'Month 6–7', heading: 'MLOps & deployment', color: '#1D9E75', items: ['Model serving (FastAPI)', 'Docker & Kubernetes', 'Experiment tracking (MLflow)', 'Feature stores'] },
      { phase: 'Month 8–10', heading: 'Production systems', color: '#D4537E', items: ['Cloud ML platforms', 'A/B testing models', 'Data pipelines', 'LLM integration'] },
    ],
    opinion: "ML Engineering is one of the hottest fields and will only grow. There's a big gap between running a notebook tutorial and shipping a model that handles millions of requests. Focus on MLOps early — most students ignore it. In India, companies building AI products are desperate for engineers who bridge research and production.",
    resources: ['fast.ai', 'Hugging Face courses', 'Full Stack Deep Learning', 'MLflow docs'],
  },
}

const LEVEL_CONFIG = {
  must:  { label: 'Must have',    cls: 'skill-must' },
  good:  { label: 'Good to have', cls: 'skill-good' },
  bonus: { label: 'Bonus',        cls: 'skill-bonus' },
}

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
})

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
}

const cardVariant = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function JobRoadmap() {
  const { slug } = useParams()
  const navigate  = useNavigate()
  const job       = JOBS[slug]

  if (!job) {
    return (
      <div className="jr-not-found">
        <h2>Job not found</h2>
        <p>We don't have a roadmap for "{slug}" yet.</p>
        <button className="jr-back-btn" onClick={() => navigate('/')}>← Go home</button>
      </div>
    )
  }

  return (
    <div className="jr-page">
      <div className="jr-bg" />

      <div className="jr-content">

        {/* ── Back button ── */}
        <motion.button
          className="jr-back-btn"
          onClick={() => navigate(-1)}
          {...fadeUp(0)}
        >
          <ArrowLeft size={15} /> Back to search
        </motion.button>

        {/* ── Header card ── */}
        <motion.div className="jr-header-card" {...fadeUp(0.08)}>
          <div className="jr-header-left">
            <div className="jr-badge"><Briefcase size={11} /> Career Roadmap</div>
            <h1 className="jr-title">{job.title}</h1>
            <p className="jr-tagline">{job.tagline}</p>
          </div>
          <div className="jr-salary-row">
            {job.salary.map(s => (
              <div key={s.label} className="jr-salary-card">
                <div className="jr-sal-label">{s.label}</div>
                <div className="jr-sal-value">{s.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Skills ── */}
        <motion.section {...fadeUp(0.16)}>
          <div className="jr-section-header">
            <h2 className="jr-section-title"><CheckCircle2 size={18} /> Skills to learn</h2>
            <div className="jr-legend">
              <span className="jr-dot must" /> Must have
              <span className="jr-dot good" /> Good to have
              <span className="jr-dot bonus" /> Bonus
            </div>
          </div>
          <motion.div className="jr-skills-grid" variants={stagger} initial="initial" animate="animate">
            {job.skills.map(skill => (
              <motion.div key={skill.name} className="jr-skill-card" variants={cardVariant}>
                <div className="jr-skill-name">{skill.name}</div>
                <span className={`jr-skill-badge ${LEVEL_CONFIG[skill.level].cls}`}>
                  {LEVEL_CONFIG[skill.level].label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Roadmap ── */}
        <motion.section {...fadeUp(0.24)}>
          <h2 className="jr-section-title" style={{ margin: '2rem 0 1.25rem' }}>
            <TrendingUp size={18} /> Learning roadmap
          </h2>
          <div className="jr-timeline">
            {job.roadmap.map((step, i) => (
              <motion.div
                key={i}
                className="jr-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                <div className="jr-step-left">
                  <div className="jr-step-dot" style={{ background: step.color }}>{i + 1}</div>
                  {i < job.roadmap.length - 1 && <div className="jr-step-line" />}
                </div>
                <div className="jr-step-body">
                  <div className="jr-step-phase">{step.phase}</div>
                  <div className="jr-step-heading">{step.heading}</div>
                  <div className="jr-step-tags">
                    {step.items.map(item => (
                      <span key={item} className="jr-step-tag">{item}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Career advice ── */}
        <motion.div className="jr-advice-box" {...fadeUp(0.4)}>
          <div className="jr-advice-header">
            <Lightbulb size={15} /> Career advice for students
          </div>
          <p className="jr-advice-text">{job.opinion}</p>
          {job.resources && (
            <div className="jr-resources">
              <span className="jr-res-label">Start with:</span>
              {job.resources.map(r => (
                <span key={r} className="jr-res-chip">{r}</span>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── CTA Buttons ── */}
        <motion.div className="jr-cta-section" {...fadeUp(0.5)}>
          <div className="jr-cta-icon">🎯</div>
          <p className="jr-cta-title">Ready to land this role?</p>
          <p className="jr-cta-label">Upload your resume to check your skill match, or build one from scratch</p>
          <div className="jr-cta-buttons">
            {/* Goes to home and triggers the file upload input automatically */}
            <button
              className="jr-btn-primary"
              onClick={() => navigate('/', { state: { triggerUpload: true } })}
            >
              <FileText size={17} /> Upload Resume
            </button>
            {/* Goes to resume creation flow — same as HeroSection Create Resume */}
            <button
              className="jr-btn-secondary"
              onClick={() => navigate('/resume-options')}
            >
              <PlusCircle size={17} /> Create Resume
            </button>
          </div>
          <p className="jr-cta-note">✓ Free to use &nbsp;·&nbsp; ✓ AI Powered &nbsp;·&nbsp; ✓ No credit card</p>
        </motion.div>

      </div>
    </div>
  )
}