import React, { forwardRef } from "react";
import "./ResumePreview.css";
import { MapPin, Phone, Mail } from "lucide-react";

export const ResumePreview = forwardRef(({ data }, ref) => {
  const hasContact =
    data.city || data.country || data.phone || data.email;

  const hasEducation =
    data.education.degree || data.education.college;

  const hasExperience =
    data.experience.role || data.experience.company;

  return (
    /* ✅ IMPORTANT: attach ref here */
    <div className="preview-container" ref={ref}>
      <div className="resume-paper">

        {/* LEFT SIDE */}
        <div className="resume-left">

          <div className="name-section">
            <h1>
              {data.firstName || "First"} <br />
              {data.lastName || "Last"}
            </h1>
            <p>{data.profession || "Profession"}</p>
          </div>

          {hasContact && (
            <div className="section">
              <h2>Contact</h2>

              {(data.city || data.country) && (
                <div className="icon-text">
                  <MapPin size={12} />
                  <span>
                    {data.city} {data.country && `, ${data.country}`}
                  </span>
                </div>
              )}

              {data.phone && (
                <div className="icon-text">
                  <Phone size={12} />
                  <span>{data.phone}</span>
                </div>
              )}

              {data.email && (
                <div className="icon-text">
                  <Mail size={12} />
                  <span>{data.email}</span>
                </div>
              )}
            </div>
          )}

          {data.skills.length > 0 && (
            <div className="section">
              <h2>Skills</h2>
              <ul>
                {data.skills.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="resume-right">

          {data.summary && (
            <div className="section">
              <h2 className="blue">Profile</h2>
              <p>{data.summary}</p>
            </div>
          )}

          {hasExperience && (
            <div className="section">
              <h2 className="blue">Experience</h2>

              <h3>{data.experience.role || "Job Title"}</h3>
              <div className="row">
                <span>{data.experience.company || "Company"}</span>
                <span>{data.experience.duration || ""}</span>
              </div>
              <p>
                {data.experience.description ||
                  "Describe your work..."}
              </p>
            </div>
          )}

          {hasEducation && (
            <div className="section">
              <h2 className="blue">Education</h2>

              <h3>{data.education.degree || "Degree"}</h3>
              <div className="row">
                <span>{data.education.college || "College"}</span>
                <span>{data.education.percentage || ""}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
});