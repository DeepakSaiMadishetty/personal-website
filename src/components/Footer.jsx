import { FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-name">Deepak Sai Madishetty</p>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/deepaksaimadishetty" target="_blank" rel="noopener noreferrer">
            <FaLinkedin /> LinkedIn
          </a>
          <a href="mailto:deepaksaimadishetty7@gmail.com">
            <FaEnvelope /> Email
          </a>
          <a href="tel:+19295951696">
            <FaPhone /> Phone
          </a>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} Deepak Sai Madishetty. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
