// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import './ChatBot.css'

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  text: "Hi! 👋 I'm your **Career AI Assistant** powered by Skill2Achieve.\n\nAsk me anything about:\n• 🎯 Career paths & job roles\n• 🛠️ Skills to learn\n• 🏢 Companies & tech stacks\n• 📄 Resume tips\n• 🗺️ Learning roadmaps",
  time: new Date(),
}

const SUGGESTIONS = [
  "What skills do I need for Full Stack?",
  "How to become a Data Scientist?",
  "Best companies for freshers in India?",
  "How do I improve my resume?",
]

function formatText(text) {
  // Bold **text**
  let parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    // Handle newlines and bullet points
    return part.split('\n').map((line, j) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < part.split('\n').length - 1 && <br />}
      </span>
    ))
  })
}

function TypingDots() {
  return (
    <div className="cb-typing">
      <span /><span /><span />
    </div>
  )
}

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const sendMessage = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return

    setInput('')
    setShowSuggestions(false)

    const userMsg = { id: Date.now(), role: 'user', text: userText, time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/chat/', { message: userText })
      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: res.data.reply,
        time: new Date(),
      }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: "Sorry, I'm having trouble connecting right now. Please make sure the backend is running! 🔧",
        time: new Date(),
        error: true,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([WELCOME])
    setShowSuggestions(true)
  }

  return (
    <>
      {/* ── FAB Button ── */}
      <motion.button
        className="cb-fab"
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Open Career AI Chatbot"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="cb-fab-icon"
            >✕</motion.span>
          ) : (
            <motion.span
              key="cap"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="cb-fab-icon"
            >🎓</motion.span>
          )}
        </AnimatePresence>
        {!open && <span className="cb-fab-pulse" />}
      </motion.button>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="cb-panel"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            {/* Header */}
            <div className="cb-header">
              <div className="cb-header-left">
                <div className="cb-avatar">🎓</div>
                <div>
                  <div className="cb-header-title">Career AI Assistant</div>
                  <div className="cb-header-sub">
                    <span className="cb-online-dot" />
                    Powered by Groq · Skill2Achieve
                  </div>
                </div>
              </div>
              <button className="cb-clear-btn" onClick={clearChat} title="Clear chat">
                🗑️
              </button>
            </div>

            {/* Messages */}
            <div className="cb-messages">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`cb-msg-row ${msg.role}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    {msg.role === 'assistant' && (
                      <div className="cb-msg-avatar">🎓</div>
                    )}
                    <div className={`cb-bubble ${msg.role} ${msg.error ? 'error' : ''}`}>
                      <div className="cb-bubble-text">{formatText(msg.text)}</div>
                      <div className="cb-bubble-time">
                        {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Suggestions */}
                {showSuggestions && messages.length === 1 && (
                  <motion.div
                    className="cb-suggestions"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="cb-suggestions-label">Try asking:</div>
                    {SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        className="cb-suggestion-chip"
                        onClick={() => sendMessage(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Loading dots */}
                {loading && (
                  <motion.div
                    className="cb-msg-row assistant"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="cb-msg-avatar">🎓</div>
                    <div className="cb-bubble assistant">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="cb-input-area">
              <textarea
                ref={inputRef}
                className="cb-input"
                placeholder="Ask about careers, skills, jobs..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                disabled={loading}
              />
              <motion.button
                className={`cb-send-btn ${(!input.trim() || loading) ? 'disabled' : ''}`}
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                whileHover={input.trim() && !loading ? { scale: 1.08 } : {}}
                whileTap={input.trim() && !loading ? { scale: 0.93 } : {}}
              >
                {loading ? (
                  <span className="cb-send-spinner" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </motion.button>
            </div>

            <div className="cb-footer">Press Enter to send · Shift+Enter for new line</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}