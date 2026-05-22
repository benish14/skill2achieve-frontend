import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Register.css'

export default function RegisterPage() {

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14
      }
    }
  }

  const handleRegister = async (e) => {

    e.preventDefault()

    if (password !== confirmPassword) {

      alert("Passwords don't match ❌")
      return

    }

    setLoading(true)

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password,
            confirm_password: confirmPassword
          })
        }
      )

      const data = await res.json()

      if (res.ok) {

        alert("Account created successfully ✅")

        // redirect to login page
        navigate("/login")

      } else {

        alert(data.detail || "Registration failed ❌")

      }

    } catch (error) {

      console.error(error)

      alert("Server error ⚠")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="registerWrapper">

      <div className="bgPattern"></div>

      <div className="blurCircle topLeft"></div>

      <div className="blurCircle bottomRight"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="registerCardContainer"
      >

        <div className="registerCard">

          {/* logo */}
          <motion.div
            variants={itemVariants}
            className="registerHeader"
          >

            <div
              className="logoWrapper"
              onClick={() => navigate("/")}
            >

              <div className="logoIcon">
                <GraduationCap />
              </div>

              <span className="logoText">
                Skill
                <span className="highlight">2Achieve</span>
              </span>

            </div>

            <h1>Create your account</h1>

            <p>Join thousands finding their perfect career</p>

          </motion.div>


          {/* form */}
          <form
            className="registerForm"
            onSubmit={handleRegister}
          >

            {/* email */}
            <motion.div
              variants={itemVariants}
              className="formGroup"
            >

              <label>Email Address</label>

              <div className="inputWrapper">

                <Mail className="inputIcon" />

                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </motion.div>


            {/* password */}
            <motion.div
              variants={itemVariants}
              className="formGroup"
            >

              <label>Password</label>

              <div className="inputWrapper">

                <Lock className="inputIcon" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="passwordToggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >

                  {showPassword ? <EyeOff /> : <Eye />}

                </button>

              </div>

            </motion.div>


            {/* confirm password */}
            <motion.div
              variants={itemVariants}
              className="formGroup"
            >

              <label>Confirm Password</label>

              <div className="inputWrapper">

                <Lock className="inputIcon" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="passwordToggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >

                  {showConfirmPassword ? <EyeOff /> : <Eye />}

                </button>

              </div>

            </motion.div>


            {/* terms */}
            <motion.div
              variants={itemVariants}
              className="terms"
            >

              <input type="checkbox" required />

              <span>

                I agree to the
                <a href="#"> Terms </a>
                and
                <a href="#"> Privacy Policy </a>

              </span>

            </motion.div>


            {/* button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              className="registerBtn"
              disabled={loading}
            >

              {loading ? "Creating..." : "Create Account"}

            </motion.button>

          </form>


          {/* login link */}
          <motion.p
            variants={itemVariants}
            className="switchLogin"
          >

            Already have an account?

            <button
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>

          </motion.p>

        </div>

      </motion.div>

    </div>

  )

}  