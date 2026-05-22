// src/components/SearchBar.jsx
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './SearchBar.css'

const JOB_SUGGESTIONS = [
  { title: 'Frontend Developer', category: 'Web Dev', icon: '◈' },
  { title: 'Backend Developer', category: 'Web Dev', icon: '⬡' },
  { title: 'Full Stack Developer', category: 'Web Dev', icon: '◉' },
  { title: 'Data Scientist', category: 'Data', icon: '◆' },
  { title: 'Data Analyst', category: 'Data', icon: '◇' },
  { title: 'ML Engineer', category: 'AI/ML', icon: '★' },
  { title: 'AI Engineer', category: 'AI/ML', icon: '✦' },
  { title: 'DevOps Engineer', category: 'Ops', icon: '⬢' },
  { title: 'Cloud Engineer', category: 'Ops', icon: '◑' },
  { title: 'UI/UX Designer', category: 'Design', icon: '◍' },
  { title: 'Mobile Developer', category: 'Mobile', icon: '▣' },
  { title: 'Android Developer', category: 'Mobile', icon: '▤' },
  { title: 'iOS Developer', category: 'Mobile', icon: '▥' },
  { title: 'Cybersecurity Engineer', category: 'Security', icon: '◬' },
  { title: 'Blockchain Developer', category: 'Web3', icon: '◭' },
  { title: 'Game Developer', category: 'Gaming', icon: '◮' },
  { title: 'QA Engineer', category: 'Testing', icon: '◯' },
  { title: 'Product Manager', category: 'Product', icon: '◰' },
]

const TRENDING = [
  'Frontend Developer',
  'Data Scientist',
  'ML Engineer',
  'DevOps Engineer',
  'UI/UX Designer',
]

// Converts job title to URL-safe slug
export function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)
  const navigate = useNavigate()

  // Filter suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setIsOpen(false)
      return
    }
    const q = query.toLowerCase()
    const filtered = JOB_SUGGESTIONS.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q)
    ).slice(0, 6)
    setSuggestions(filtered)
    setIsOpen(filtered.length > 0)
    setActiveIndex(-1)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (title) => {
    setQuery(title)
    setIsOpen(false)
    navigate(`/roadmap/${toSlug(title)}`, { state: { jobTitle: title } })
  }

  const handleSearch = () => {
    if (!query.trim()) return
    // Try to find an exact or close match
    const match = JOB_SUGGESTIONS.find((j) =>
      j.title.toLowerCase() === query.toLowerCase()
    )
    if (match) {
      handleSelect(match.title)
    } else if (suggestions.length > 0) {
      handleSelect(suggestions[0].title)
    }
  }

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter') handleSearch()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0) {
        handleSelect(suggestions[activeIndex].title)
      } else {
        handleSearch()
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      className="searchbar-wrapper"
      ref={wrapperRef}
    >
      {/* Main search bar */}
      <div className={`searchbar-container ${isOpen ? 'suggestions-open' : ''}`}>
        <div className="searchbar-icon">
          <Search className="icon" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true)
          }}
          placeholder="Search jobs, skills, companies..."
          className="searchbar-input"
          autoComplete="off"
        />

        <button className="searchbar-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="suggestions-dropdown"
          >
            <div className="suggestions-label">Suggested roles</div>
            {suggestions.map((job, i) => (
              <div
                key={job.title}
                className={`suggestion-item ${i === activeIndex ? 'active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelect(job.title)
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className="sug-icon">{job.icon}</span>
                <span className="sug-title">{job.title}</span>
                <span className="sug-category">{job.category}</span>
                <span className="sug-action">View roadmap →</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trending chips (shown when input is empty) */}
      {!query && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="trending-row"
        >
          <span className="trending-label">
            <TrendingUp size={12} style={{ display: 'inline', marginRight: 4 }} />
            Trending:
          </span>
          {TRENDING.map((t) => (
            <button
              key={t}
              className="trending-chip"
              onClick={() => handleSelect(t)}
            >
              {t}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}