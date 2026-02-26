import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import './CursorIcon.css'

function CursorIcon() {
  const [rotation, setRotation] = useState(0)
  const containerRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
    const degrees = (angle * 180) / Math.PI
    setRotation(degrees)
  }, [])

  return (
    <div
      className="cursor-icon-area"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="cursor-icon"
        animate={{ rotate: rotation + 90 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="iconGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="50%" stopColor="#F7931E" />
              <stop offset="100%" stopColor="#FFD166" />
            </linearGradient>
          </defs>
          <circle cx="40" cy="40" r="36" fill="url(#iconGrad)" opacity="0.15" />
          <circle cx="40" cy="40" r="24" fill="url(#iconGrad)" opacity="0.3" />
          <polygon
            points="40,12 48,32 40,28 32,32"
            fill="url(#iconGrad)"
          />
          <circle cx="40" cy="40" r="8" fill="url(#iconGrad)" />
        </svg>
      </motion.div>
      <div className="cursor-icon-label">hover around me</div>
    </div>
  )
}

export default CursorIcon
