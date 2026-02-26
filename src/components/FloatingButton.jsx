import { motion } from 'framer-motion'
import './FloatingButton.css'

function FloatingButton({ children, href, onClick, className = '' }) {
  const Component = href ? motion.a : motion.button

  return (
    <Component
      className={`floating-btn ${className}`}
      href={href}
      onClick={onClick}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: [0, -6, 0],
      }}
      transition={{
        y: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      {children}
    </Component>
  )
}

export default FloatingButton
