import React from "react";
import "./Sidebar.css";
import { FileText, Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "Heading" },
  { id: 2, label: "Education" },
  { id: 3, label: "Experience" },
  { id: 4, label: "Skills" },
  { id: 5, label: "Summary" },
  { id: 6, label: "Finalize" },
];

export function Sidebar({ activeStep, setActiveStep }) {
  const progressHeight =
    ((activeStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="sidebar">

      {/* LOGO */}
      <div className="sidebar-header">
        <FileText className="logo-icon" />
        <span>Skill2Achieve</span>
      </div>

      {/* STEPS */}
      <div className="sidebar-steps">

        {/* Background line */}
        <div className="line-bg"></div>

        {/* Active progress */}
        <div
          className="line-progress"
          style={{ height: `${progressHeight}%` }}
        ></div>

        {STEPS.map((step) => {
          const isActive = activeStep === step.id;
          const isCompleted = activeStep > step.id;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`step ${isActive ? "active" : ""}`}
            >
              <div
                className={`circle 
                  ${isActive ? "active-circle" : ""}
                  ${isCompleted ? "completed-circle" : ""}
                `}
              >
                {isCompleted ? <Check size={14} /> : step.id}
              </div>

              <span className="label">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}