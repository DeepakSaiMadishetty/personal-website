import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import './Card.css'

function Card({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      className={`card ${className}`}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 40, scale: 0.96 }
      }
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {!isInView && <div className="card-shimmer" />}
      <div className={`card-content ${isInView ? 'card-content--loaded' : ''}`}>
        {children}
      </div>
    </motion.div>
  )
}

export default Card
