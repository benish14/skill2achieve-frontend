// src/components/Header.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Menu, X, LayoutDashboard, LogOut } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const navigate = useNavigate()
  const location = useLocation() // 🔥 KEY FIX

  // =========================
  // ✅ ALWAYS SYNC LOGIN STATE
  // =========================
  const checkLogin = () => {
    const status = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(status)
  }

  // 🔥 RUN ON PAGE CHANGE (MAIN FIX)
  useEffect(() => {
    checkLogin()
  }, [location]) // 👈 THIS FIXES YOUR ISSUE

  // =========================
  // NAVIGATION
  // =========================
  const handleNav = (page) => {
    navigate(page)
    setIsMobileMenuOpen(false)
  }

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {

    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user_id")
    localStorage.removeItem("analysis")

    setIsLoggedIn(false)

    navigate("/")
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="header"
    >

      <div className="header-container">

        {/* LOGO */}
        <div
          className="logo-section"
          onClick={() => handleNav('/')}
        >
          <motion.div
            className="logo-icon"
            animate={{ rotate: [0, -8, 8, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
          >
            <GraduationCap className="logo-cap" />
          </motion.div>

          <span className="logo-text">
            <span className="logo-skill">Skill</span>
            <span className="logo-2achieve">2Achieve</span>
          </span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="desktop-nav">

          <button onClick={() => handleNav('/')}>
            Home
          </button>

          {isLoggedIn ? (
            <>
              <button onClick={() => handleNav('/dashboard')}>
                <LayoutDashboard className="nav-icon" />
                Dashboard
              </button>

              <div className="divider" />

              <button onClick={handleLogout}>
                <LogOut className="nav-icon" />
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="divider" />

              <button onClick={() => handleNav('/login')}>
                Login
              </button>

              <button
                onClick={() => handleNav('/register')}
                className="btn-register"
              >
                Register
              </button>
            </>
          )}

        </nav>

        {/* MOBILE */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>

      </div>

      {/* MOBILE NAV */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-nav"
          >

            <button onClick={() => handleNav('/')}>Home</button>

            {isLoggedIn ? (
              <>
                <button onClick={() => handleNav('/dashboard')}>
                  <LayoutDashboard className="nav-icon" />
                  Dashboard
                </button>

                <div className="divider-mobile" />

                <button onClick={handleLogout}>
                  <LogOut className="nav-icon" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="divider-mobile" />

                <button onClick={() => handleNav('/login')}>
                  Login
                </button>

                <button
                  onClick={() => handleNav('/register')}
                  className="btn-register-mobile"
                >
                  Register
                </button>
              </>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </motion.header>
  )
}

export default Header