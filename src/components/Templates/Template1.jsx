import React from "react";
import "./Template1.css";

function Template1({ data }) {
  return (
    <div className="resume">

      {/* LEFT SIDEBAR */}
      <div className="left">
        <div className="profile"></div>

        <h2>About Me</h2>
        <p>{data.experience || "Write about yourself..."}</p>

        <h2>Education</h2>
        <p><b>{data.degree}</b></p>
        <p>{data.college}</p>

        <h2>Skills</h2>
        <p>{data.skills}</p>
      </div>

      {/* RIGHT */}
      <div className="right">
        <div className="header">
          <h1>{data.firstName} {data.lastName}</h1>
          <p>{data.role}</p>
        </div>

        <div className="contact">
          <p>{data.phone}</p>
          <p>{data.email}</p>
          <p>{data.city}, {data.country}</p>
        </div>

        <h2>Experience</h2>
        <p>{data.experience}</p>
      </div>

    </div>
  );
}

export default Template1;