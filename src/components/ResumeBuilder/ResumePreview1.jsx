import React, { forwardRef } from "react";
import "./ResumePreview1.css";
import { MapPin, Phone, Mail } from "lucide-react";

export const ResumePreview1 = forwardRef(({ data }, ref) => {
  const hasContact =
    data.city || data.country || data.phone || data.email;

  const hasEducation =
    data.education.degree || data.education.college;

  const hasExperience =
    data.experience.role || data.experience.company;

  return (
    <div className="modern-preview" ref={ref}>
      <div className="modern-resume">

        {/* HEADER */}
        <div className="modern-header">
          <h1>
            {data.firstName || "First"} {data.lastName || "Last"}
          </h1>
          <p>{data.profession || "Profession"}</p>

          {hasContact && (
            <div className="modern-contact">
              {(data.city || data.country) && (
                <span>
                  <MapPin size={14} />
                  {data.city} {data.country && `, ${data.country}`}
                </span>
              )}
              {data.phone && (
                <span>
                  <Phone size={14} />
                  {data.phone}
                </span>
              )}
              {data.email && (
                <span>
                  <Mail size={14} />
                  {data.email}
                </span>
              )}
            </div>
          )}
        </div>

        {/* BODY */}
        <div className="modern-body">

          {/* LEFT */}
          <div className="modern-left">

            {data.summary && (
              <div className="section">
                <h2>Profile</h2>
                <p>{data.summary}</p>
              </div>
            )}

            {hasExperience && (
              <div className="section">
                <h2>Experience</h2>

                <h3>{data.experience.role || "Job Title"}</h3>
                <div className="row">
                  <span>{data.experience.company || "Company"}</span>
                  <span>{data.experience.duration}</span>
                </div>
                <p>
                  {data.experience.description ||
                    "Describe your work..."}
                </p>
              </div>
            )}

          </div>

          {/* RIGHT */}
          <div className="modern-right">

            {hasEducation && (
              <div className="section">
                <h2>Education</h2>

                <h3>{data.education.degree || "Degree"}</h3>
                <p>{data.education.college || "College"}</p>
                <span className="light">
                  {data.education.percentage}
                </span>
              </div>
            )}

            {data.skills.length > 0 && (
              <div className="section">
                <h2>Skills</h2>

                <div className="skill-tags">
                  {data.skills.map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
});