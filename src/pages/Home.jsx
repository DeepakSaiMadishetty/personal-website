import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaLinkedin } from 'react-icons/fa'
import CursorIcon from '../components/CursorIcon'
import FloatingButton from '../components/FloatingButton'
import Card from '../components/Card'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-hero-content">
          <motion.p
            className="home-greeting"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Hello, I'm
          </motion.p>
          <motion.h1
            className="home-name"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <span className="gradient-text">Deepak Sai</span>
            <br />
            Madishetty
          </motion.h1>
          <motion.p
            className="home-tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Data Analyst & Full Stack Developer crafting data-driven solutions
            with expertise in cloud architecture, ETL pipelines, and interactive dashboards.
          </motion.p>
          <motion.div
            className="home-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <FloatingButton>
              <Link to="/contact" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
                Get in Touch <FaArrowRight />
              </Link>
            </FloatingButton>
            <FloatingButton
              href="https://www.linkedin.com/in/deepaksaimadishetty"
              className="floating-btn--secondary"
            >
              <FaLinkedin /> LinkedIn
            </FloatingButton>
          </motion.div>
        </div>

        <motion.div
          className="home-hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <CursorIcon />
        </motion.div>
      </div>

      <div className="home-highlights">
        <Card delay={0.1}>
          <div className="highlight-number">2+</div>
          <div className="highlight-label">Years Experience</div>
        </Card>
        <Card delay={0.2}>
          <div className="highlight-number">M.S.</div>
          <div className="highlight-label">Computer Science, ASU</div>
        </Card>
        <Card delay={0.3}>
          <div className="highlight-number">15+</div>
          <div className="highlight-label">Technologies Mastered</div>
        </Card>
      </div>
    </div>
  )
}

export default Home
