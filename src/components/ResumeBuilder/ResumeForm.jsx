// src/components/ResumeBuilder/ResumeForm.jsx
import React, { useState } from "react";
import "./ResumeForm.css";
import axios from "axios";
import {
  CheckIcon,
  XIcon,
  PlusIcon,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  Loader2,
  Wand2,
  Download,
  BarChart2,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ══════════════════════════════════════════════════════════
   MASSIVE SKILL DATABASE — IT + Non-IT
══════════════════════════════════════════════════════════ */
const ALL_SKILLS = [
  // ── Frontend ──────────────────────────────────────────
  "HTML","CSS","JavaScript","TypeScript","React","Vue.js","Angular","Next.js",
  "Nuxt.js","Svelte","Tailwind CSS","Bootstrap","SASS/SCSS","jQuery","Redux",
  "Zustand","Webpack","Vite","Figma","Responsive Design","UI/UX Design",
  "Framer Motion","Three.js","WebGL","Web Accessibility",
  // ── Backend ───────────────────────────────────────────
  "Node.js","Express.js","Python","Django","FastAPI","Flask","Java","Spring Boot",
  "PHP","Laravel","Ruby","Ruby on Rails","C#",".NET","Go","Rust","Kotlin",
  "REST API","GraphQL","gRPC","WebSocket","Microservices","MVC Architecture",
  // ── Databases ─────────────────────────────────────────
  "MySQL","PostgreSQL","MongoDB","SQLite","Redis","Firebase","Supabase",
  "Oracle DB","Microsoft SQL Server","Cassandra","DynamoDB","Elasticsearch",
  "Prisma","Mongoose","SQL","NoSQL","Database Design",
  // ── DevOps & Cloud ────────────────────────────────────
  "Docker","Kubernetes","AWS","GCP","Azure","CI/CD","GitHub Actions","Jenkins",
  "Terraform","Ansible","Nginx","Linux","Bash Scripting","Shell Scripting",
  "Prometheus","Grafana","ELK Stack","Helm","ArgoCD","Netlify","Vercel",
  // ── Data Science & ML ─────────────────────────────────
  "Machine Learning","Deep Learning","Python (Data Science)","Pandas","NumPy",
  "Scikit-learn","TensorFlow","PyTorch","Keras","OpenCV","NLP","LLMs",
  "Hugging Face","LangChain","Data Analysis","Data Visualization","Tableau",
  "Power BI","Matplotlib","Seaborn","Statistics","R","Jupyter Notebook",
  "Feature Engineering","Model Deployment","MLOps","Kaggle",
  // ── Mobile ────────────────────────────────────────────
  "React Native","Flutter","Android Development","iOS Development","Swift",
  "Kotlin (Mobile)","Ionic","Expo","Firebase (Mobile)","App Store Deployment",
  // ── Security ──────────────────────────────────────────
  "Cybersecurity","Ethical Hacking","Penetration Testing","OWASP","Network Security",
  "Cryptography","SSL/TLS","Authentication","JWT","OAuth2","Kali Linux","Metasploit",
  // ── Tools & Version Control ───────────────────────────
  "Git","GitHub","GitLab","Bitbucket","Jira","Trello","Notion","Postman",
  "VS Code","IntelliJ","Figma","Adobe XD","Slack","Confluence","npm","yarn","pnpm",
  // ── Programming Languages ─────────────────────────────
  "C","C++","Java","Python","JavaScript","TypeScript","Go","Rust","Scala",
  "Perl","Haskell","Elixir","Erlang","Lua","MATLAB","R","Swift","Kotlin","Dart",
  // ── Testing ───────────────────────────────────────────
  "Jest","Cypress","Selenium","Playwright","Vitest","React Testing Library",
  "Unit Testing","Integration Testing","TDD","BDD","Mocha","Chai","Jasmine",
  // ── Blockchain ────────────────────────────────────────
  "Solidity","Web3.js","Ethers.js","Hardhat","Smart Contracts","NFT Development",
  "DeFi","IPFS","Ethereum","Polygon",
  // ── Non-IT — Business & Management ───────────────────
  "Project Management","Agile","Scrum","Kanban","Product Management","Business Analysis",
  "Strategic Planning","Team Leadership","Stakeholder Management","Risk Management",
  "Change Management","Operations Management","Business Development","Consulting",
  // ── Non-IT — Marketing & Sales ───────────────────────
  "Digital Marketing","SEO","SEM","Social Media Marketing","Content Marketing",
  "Email Marketing","Google Ads","Meta Ads","Copywriting","Brand Management",
  "Market Research","Customer Acquisition","Sales","CRM","HubSpot","Salesforce",
  "Lead Generation","Growth Hacking","Affiliate Marketing","Influencer Marketing",
  // ── Non-IT — Design & Creative ────────────────────────
  "Graphic Design","Adobe Photoshop","Adobe Illustrator","Adobe Premiere Pro",
  "Adobe After Effects","Video Editing","Motion Graphics","Photography",
  "3D Modeling","AutoCAD","Sketch","Canva","Branding","Typography",
  // ── Non-IT — Finance & Accounting ─────────────────────
  "Financial Analysis","Accounting","Bookkeeping","Tally","SAP","QuickBooks",
  "Tax Planning","Auditing","MS Excel (Advanced)","Financial Modeling",
  "Investment Analysis","Risk Assessment","Budgeting","Cost Accounting",
  // ── Non-IT — HR & Communication ───────────────────────
  "Human Resources","Talent Acquisition","Recruitment","Employee Relations",
  "Training & Development","Performance Management","Payroll","HRMS",
  "Public Speaking","Communication Skills","Presentation Skills","Negotiation",
  "Technical Writing","Content Writing","Blogging","Journalism",
  // ── Non-IT — Healthcare ───────────────────────────────
  "Clinical Research","Medical Coding","Healthcare Management","Pharmacology",
  "Patient Care","Medical Billing","Health Informatics","Laboratory Skills",
  // ── Non-IT — Education ────────────────────────────────
  "Curriculum Development","Teaching","E-learning","Instructional Design",
  "Classroom Management","Student Counseling","Educational Technology",
  // ── Non-IT — Engineering (non-software) ───────────────
  "Mechanical Engineering","Electrical Engineering","Civil Engineering",
  "Structural Analysis","AutoCAD (Civil)","SolidWorks","ANSYS","MATLAB",
  "PLC Programming","Embedded Systems","PCB Design","IoT","Arduino","Raspberry Pi",
  // ── Soft Skills ───────────────────────────────────────
  "Problem Solving","Critical Thinking","Teamwork","Adaptability","Time Management",
  "Attention to Detail","Leadership","Creativity","Emotional Intelligence",
  "Decision Making","Conflict Resolution","Multitasking","Self-Motivation",
].sort()

/* ══════════════════════════════════════════════════════════
   INPUT COMPONENTS
══════════════════════════════════════════════════════════ */
const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="form-group">
    <label>{label}</label>
    <div className="input-wrapper">
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
      />
      {value?.length > 2 && <CheckIcon className="check-icon" />}
    </div>
  </div>
);

/* ── TextArea with optional AI Strengthen button ── */
const TextAreaField = ({ label, value, onChange, placeholder, onAiStrengthen, aiLoading }) => (
  <div className="form-group">
    <div className="field-label-row">
      <label>{label}</label>
      {onAiStrengthen && (
        <button
          type="button"
          className="ai-strengthen-btn"
          onClick={onAiStrengthen}
          disabled={aiLoading || !value?.trim()}
          title={!value?.trim() ? "Write something first" : "AI will strengthen this"}
        >
          {aiLoading
            ? <><Loader2 size={13} className="spin" /> Strengthening...</>
            : <><Wand2 size={13} /> AI Strengthen</>
          }
        </button>
      )}
    </div>
    <div className="input-wrapper">
      <textarea
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={5}
      />
      {value?.length > 5 && <CheckIcon className="check-icon textarea-check" />}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export function ResumeForm({
  activeStep,
  setActiveStep,
  data,
  setData,
  onAnalyze,
  loading,
}) {
  const [skillInput, setSkillInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // AI loading states per field
  const [aiLoading, setAiLoading] = useState({
    summary: false,
    description: false,
    skills: false,
  });

  // AI result feedback
  const [aiToast, setAiToast] = useState("")

  const showToast = (msg) => {
    setAiToast(msg)
    setTimeout(() => setAiToast(""), 3000)
  }

  /* ── Navigation ── */
  const handleNext = () => setActiveStep(Math.min(6, activeStep + 1));
  const handleBack = () => setActiveStep(Math.max(1, activeStep - 1));

  /* ── PDF Download ── */
  const handleDownload = async () => {
    const element = document.querySelector(".preview-container");
    if (!element) { alert("Resume preview not found!"); return; }
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save("resume.pdf");
  };

  /* ── Skill helpers ── */
  const handleAddSkill = (customSkill) => {
    const value = (customSkill || skillInput).trim();
    if (value && !data.skills.includes(value)) {
      setData((prev) => ({ ...prev, skills: [...prev.skills, value] }));
    }
    setSkillInput("");
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); }
  };

  const removeSkill = (skill) => {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const filteredSkills = skillInput.trim()
    ? ALL_SKILLS.filter(
        (s) =>
          s.toLowerCase().includes(skillInput.toLowerCase()) &&
          !data.skills.includes(s)
      ).slice(0, 10)
    : [];

  /* ══════════════════════════════════════════════════════
     🤖 AI STRENGTHEN HANDLERS
  ══════════════════════════════════════════════════════ */

  /* ── Strengthen Summary ── */
  const handleStrengthenSummary = async () => {
    if (!data.summary?.trim()) return;
    setAiLoading((p) => ({ ...p, summary: true }));
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/strengthen_content/", {
        field: "summary",
        content: data.summary,
        context: {
          profession: data.profession,
          skills: data.skills,
          experience_role: data.experience?.role,
        },
      });
      setData((prev) => ({ ...prev, summary: res.data.strengthened }));
      showToast("✨ Summary strengthened!")
    } catch (err) {
      showToast("❌ AI failed. Try again.")
    } finally {
      setAiLoading((p) => ({ ...p, summary: false }));
    }
  };

  /* ── Strengthen Experience Description ── */
  const handleStrengthenDescription = async () => {
    if (!data.experience?.description?.trim()) return;
    setAiLoading((p) => ({ ...p, description: true }));
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/strengthen_content/", {
        field: "experience_description",
        content: data.experience.description,
        context: {
          role: data.experience?.role,
          company: data.experience?.company,
          duration: data.experience?.duration,
          skills: data.skills,
        },
      });
      setData((prev) => ({
        ...prev,
        experience: { ...prev.experience, description: res.data.strengthened },
      }));
      showToast("✨ Experience strengthened!")
    } catch (err) {
      showToast("❌ AI failed. Try again.")
    } finally {
      setAiLoading((p) => ({ ...p, description: false }));
    }
  };

  /* ── AI Suggest Skills ── */
  const handleSuggestSkills = async () => {
    setAiLoading((p) => ({ ...p, skills: true }));
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/strengthen_content/", {
        field: "skills",
        content: data.skills.join(", "),
        context: {
          profession: data.profession,
          summary: data.summary,
          experience_role: data.experience?.role,
        },
      });
      // AI returns comma-separated or JSON array of suggested skills
      let suggested = [];
      try {
        suggested = JSON.parse(res.data.strengthened);
      } catch {
        suggested = res.data.strengthened.split(",").map((s) => s.trim());
      }
      // Add only new skills not already in the list
      const newSkills = suggested.filter(
        (s) => s && !data.skills.includes(s)
      );
      if (newSkills.length > 0) {
        setData((prev) => ({ ...prev, skills: [...prev.skills, ...newSkills] }));
        showToast(`✨ Added ${newSkills.length} AI-suggested skills!`)
      } else {
        showToast("Your skills already look great!")
      }
    } catch (err) {
      showToast("❌ AI failed. Try again.")
    } finally {
      setAiLoading((p) => ({ ...p, skills: false }));
    }
  };

  /* ── Analyze ── */
  const handleAnalyzeClick = async () => {
    if (!onAnalyze) return;
    const result = await onAnalyze();
    if (result) {
      const formatted = {
        jobs: result.jobs || [],
        skills: result.skills || [],
        top_match: result.top_match || null,
        match_score: result.match_score || 0,
      };
      localStorage.setItem("skillData", JSON.stringify(formatted));
      window.dispatchEvent(new Event("storage"));
    }
  };

  /* ══════════════════════════════════════════════════════
     STEP RENDER
  ══════════════════════════════════════════════════════ */
  const renderStep = () => {
    switch (activeStep) {

      /* ── Step 1: Personal Info ── */
      case 1:
        return (
          <>
            <div className="grid-2">
              <InputField label="First Name" value={data.firstName}
                onChange={(e) => setData((p) => ({ ...p, firstName: e.target.value }))} />
              <InputField label="Last Name" value={data.lastName}
                onChange={(e) => setData((p) => ({ ...p, lastName: e.target.value }))} />
            </div>
            <InputField label="Profession" value={data.profession}
              onChange={(e) => setData((p) => ({ ...p, profession: e.target.value }))} />
            <div className="grid-3">
              <InputField label="City" value={data.city}
                onChange={(e) => setData((p) => ({ ...p, city: e.target.value }))} />
              <InputField label="Country" value={data.country}
                onChange={(e) => setData((p) => ({ ...p, country: e.target.value }))} />
              <InputField label="Pin Code" value={data.pinCode}
                onChange={(e) => setData((p) => ({ ...p, pinCode: e.target.value }))} />
            </div>
            <div className="grid-2">
              <InputField label="Phone" value={data.phone}
                onChange={(e) => setData((p) => ({ ...p, phone: e.target.value }))} />
              <InputField label="Email" type="email" value={data.email}
                onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))} />
            </div>
          </>
        );

      /* ── Step 2: Education ── */
      case 2:
        return (
          <>
            <InputField label="Degree" value={data.education.degree}
              onChange={(e) => setData((p) => ({ ...p, education: { ...p.education, degree: e.target.value } }))} />
            <InputField label="College" value={data.education.college}
              onChange={(e) => setData((p) => ({ ...p, education: { ...p.education, college: e.target.value } }))} />
            <InputField label="Percentage / CGPA" value={data.education.percentage}
              onChange={(e) => setData((p) => ({ ...p, education: { ...p.education, percentage: e.target.value } }))} />
          </>
        );

      /* ── Step 3: Experience ── */
      case 3:
        return (
          <>
            <InputField label="Role" value={data.experience.role}
              onChange={(e) => setData((p) => ({ ...p, experience: { ...p.experience, role: e.target.value } }))} />
            <div className="grid-2">
              <InputField label="Company" value={data.experience.company}
                onChange={(e) => setData((p) => ({ ...p, experience: { ...p.experience, company: e.target.value } }))} />
              <InputField label="Duration" value={data.experience.duration}
                onChange={(e) => setData((p) => ({ ...p, experience: { ...p.experience, duration: e.target.value } }))} />
            </div>
            <TextAreaField
              label="Description"
              value={data.experience.description}
              onChange={(e) => setData((p) => ({ ...p, experience: { ...p.experience, description: e.target.value } }))}
              placeholder="Describe your responsibilities and achievements..."
              onAiStrengthen={handleStrengthenDescription}
              aiLoading={aiLoading.description}
            />
          </>
        );

      /* ── Step 4: Skills ── */
      case 4:
        return (
          <>
            {/* AI suggest button */}
            <div className="ai-skills-bar">
              <span className="ai-skills-hint">
                Type to search from 200+ skills, or let AI suggest based on your profile
              </span>
              <button
                type="button"
                className="ai-strengthen-btn ai-suggest-btn"
                onClick={handleSuggestSkills}
                disabled={aiLoading.skills}
              >
                {aiLoading.skills
                  ? <><Loader2 size={13} className="spin" /> Suggesting...</>
                  : <><Sparkles size={13} /> AI Suggest Skills</>
                }
              </button>
            </div>

            {/* Skill input */}
            <div className="form-group">
              <label>Add Skills</label>
              <div className="input-wrapper skill-input-wrapper">
                <input
                  value={skillInput}
                  onChange={(e) => { setSkillInput(e.target.value); setShowSuggestions(true); }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Type skill name e.g. React, Python, Photoshop..."
                  autoComplete="off"
                />
                <button onClick={() => handleAddSkill()} className="add-btn">
                  <PlusIcon size={16} />
                </button>
              </div>

              {/* Dropdown suggestions */}
              {showSuggestions && filteredSkills.length > 0 && (
                <div className="suggestions-dropdown">
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill}
                      className="suggestion-item"
                      onMouseDown={() => handleAddSkill(skill)}
                    >
                      <PlusIcon size={12} />
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Added skills */}
            {data.skills.length > 0 && (
              <div className="skills-container">
                {data.skills.map((skill) => (
                  <span key={skill} className="skill-chip">
                    {skill}
                    <button onClick={() => removeSkill(skill)}>
                      <XIcon size={13} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {data.skills.length === 0 && (
              <p className="skills-empty-hint">
                No skills added yet. Search above or click "AI Suggest Skills".
              </p>
            )}
          </>
        );

      /* ── Step 5: Summary ── */
      case 5:
        return (
          <>
            <TextAreaField
              label="Professional Summary"
              value={data.summary}
              onChange={(e) => setData((p) => ({ ...p, summary: e.target.value }))}
              placeholder="Write 2-3 sentences about yourself, your skills, and career goals..."
              onAiStrengthen={handleStrengthenSummary}
              aiLoading={aiLoading.summary}
            />
            <div className="summary-tips">
              <p className="tips-label">💡 Tips for a strong summary:</p>
              <ul>
                <li>Mention your top 2–3 skills</li>
                <li>State your career goal clearly</li>
                <li>Keep it to 2–4 sentences</li>
              </ul>
            </div>
          </>
        );

      /* ── Step 6: Finalize ── */
      case 6:
        return (
          <div className="final-step">
            <div className="final-header">
              <GraduationCap size={32} className="final-icon" />
              <h2>You're Ready! 🎉</h2>
              <p>Your resume looks great. Choose what to do next.</p>
            </div>

            {/* Checklist */}
            <div className="final-checklist">
              {[
                { label: "Personal info filled", done: !!(data.firstName && data.email) },
                { label: "Education added", done: !!(data.education?.degree) },
                { label: "Experience described", done: !!(data.experience?.description) },
                { label: "Skills added", done: data.skills.length > 0 },
                { label: "Summary written", done: !!(data.summary) },
              ].map((item) => (
                <div key={item.label} className={`checklist-item ${item.done ? "done" : "pending"}`}>
                  {item.done
                    ? <CheckIcon size={14} />
                    : <span className="checklist-dot" />
                  }
                  {item.label}
                </div>
              ))}
            </div>

            <div className="final-actions">
              <button className="primary-btn final-download-btn" onClick={handleDownload}>
                <Download size={15} /> Download PDF
              </button>
              <button
                className="match-btn final-analyze-btn"
                onClick={handleAnalyzeClick}
                disabled={loading}
              >
                {loading
                  ? <><Loader2 size={15} className="spin" /> Analyzing...</>
                  : <><BarChart2 size={15} /> Analyze Skills</>
                }
              </button>
            </div>

            <p className="final-note">
              Skill analysis matches your resume to real job roles using AI
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const titles = ["Personal Info", "Education", "Experience", "Skills", "Summary", "Finalize"];

  return (
    <div className="form-container">
      <h1>{titles[activeStep - 1]}</h1>

      {/* AI toast notification */}
      {aiToast && (
        <div className="ai-toast">
          {aiToast}
        </div>
      )}

      <div className="form-card">{renderStep()}</div>

      <div className="form-nav">
        <button onClick={handleBack} disabled={activeStep === 1}>
          <ChevronLeft size={16} /> Back
        </button>
        {activeStep < 6 && (
          <button className="primary-btn" onClick={handleNext}>
            Next <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}