// src/components/Login.jsx
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "./Login.css"

export default function LoginPage() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 14 },
    },
  }

  // =========================
  // 🔥 FETCH USER ANALYSIS (FIXED)
  // =========================
  const fetchUserAnalysis = async (userId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/get-user-analysis/${userId}/`
      )

      if (!res.ok) return

      const data = await res.json()

      console.log("🔥 Loaded user analysis:", data)

      // ✅ IMPORTANT: store per user (NOT global)
      localStorage.setItem(
        `analysis_${userId}`,
        JSON.stringify(data)
      )

      // optional cleanup of old buggy storage
      localStorage.removeItem("analysis")
      localStorage.removeItem("skillData")

    } catch (err) {
      console.error("Error fetching analysis:", err)
    }
  }

  // =========================
  // 🔐 LOGIN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        // =========================
        // SESSION SETUP
        // =========================
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("user_id", data.user_id)

        // 🔥 IMPORTANT RESET (prevents old Fullstack bug)
        localStorage.removeItem("analysis")
        localStorage.removeItem("skillData")

        // load latest analysis for this user
        await fetchUserAnalysis(data.user_id)

        alert("Login successful! ✅")

        const redirect = localStorage.getItem("redirectAfterLogin")

        if (redirect === "resume") {
          localStorage.removeItem("redirectAfterLogin")
          navigate("/resume-options")
        } else {
          navigate("/")
        }
      } else {
        alert(data.error || data.detail || "Login failed ❌")
      }
    } catch (err) {
      console.error("Login Error:", err)
      alert("Server error ❌ Please check backend")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="loginWrapper">
      <div className="bgPattern" />
      <div className="blurCircle topRight" />
      <div className="blurCircle bottomLeft" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="loginCardContainer"
      >
        <div className="loginCard">

          {/* HEADER */}
          <motion.div variants={itemVariants} className="loginHeader">
            <div className="logoWrapper">
              <div className="logoIcon">
                <GraduationCap />
              </div>
              <span className="logoText">
                Skill<span className="highlight">2Achieve</span>
              </span>
            </div>

            <h1>Welcome back</h1>
            <p>Sign in to continue to your account</p>
          </motion.div>

          {/* FORM */}
          <form className="loginForm" onSubmit={handleSubmit}>

            <motion.div variants={itemVariants}>
              <label>Email Address</label>
              <div className="inputWrapper">
                <Mail className="inputIcon" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label>Password</label>
              <div className="inputWrapper">
                <Lock className="inputIcon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="passwordToggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="loginExtras">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#">Forgot password?</a>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              className="loginBtn"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>

          </form>

          <motion.p variants={itemVariants} className="registerText">
            Don't have an account?
            <button onClick={() => navigate("/register")}>
              Create one
            </button>
          </motion.p>

        </div>
      </motion.div>
    </div>
  )
}