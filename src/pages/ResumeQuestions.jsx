// src/pages/ResumeQuestions.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ResumeQuestions.css";

const ResumeQuestions = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState({});

  const next = () => setStep((prev) => prev + 1);

  const handleSkip = () => {
    window.location.reload(); // 🔥 your requirement
  };

  return (
    <div className="rq-overlay">
      <motion.div
        className="rq-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Close */}
        <button className="rq-close" onClick={handleSkip}>
          ✕
        </button>

        {/* Progress */}
        {step > 0 && (
          <div className="rq-progress">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className={step === i ? "active" : ""}></span>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 0 */}
          {step === 0 && (
            <motion.div
              key="step0"
              className="rq-step"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="resume"
                className="rq-img"
              />

              <h2>Best templates for students</h2>
              <p>
                We’ll personalize your template choices in 4 easy steps.
              </p>

              <div className="rq-buttons">
                <button className="rq-skip" onClick={handleSkip}>
                  Skip
                </button>
                <button className="rq-next" onClick={next}>
                  Let’s go
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="step1" className="rq-step">
              <h2>How long have you been working?</h2>

              <div className="rq-grid">
                {["0-3 Years", "3-5 Years", "5-10 Years", "10+ Years"].map(
                  (item) => (
                    <div
                      key={item}
                      className={`rq-card ${
                        selected.exp === item ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelected({ ...selected, exp: item });
                        next();
                      }}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="step2" className="rq-step">
              <h2>Will you be adding a photo?</h2>

              <div className="rq-grid">
                <div
                  className={`rq-card ${
                    selected.photo === true ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelected({ ...selected, photo: true });
                    next();
                  }}
                >
                  With Photo
                </div>

                <div
                  className={`rq-card ${
                    selected.photo === false ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelected({ ...selected, photo: false });
                    next();
                  }}
                >
                  Without Photo
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="step3" className="rq-step">
              <h2>What layout suits you best?</h2>

              <div className="rq-grid">
                <div
                  className={`rq-card ${
                    selected.layout === "two" ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelected({ ...selected, layout: "two" });
                    next();
                  }}
                >
                  Two columns
                </div>

                <div
                  className={`rq-card ${
                    selected.layout === "one" ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelected({ ...selected, layout: "one" });
                    next();
                  }}
                >
                  One column
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div key="step4" className="rq-step">
              <h2>What style do you prefer?</h2>

              <div className="rq-grid">
                {["Simple", "Modern", "Bold"].map((style) => (
                  <div
                    key={style}
                    className={`rq-card ${
                      selected.style === style ? "active" : ""
                    }`}
                    onClick={() =>
                      setSelected({ ...selected, style: style })
                    }
                  >
                    {style}
                  </div>
                ))}
              </div>

              <button className="rq-next final-btn" onClick={onClose}>
                Next
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ResumeQuestions;