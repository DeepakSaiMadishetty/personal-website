import { useState } from 'react'
import Card from '../components/Card'
import FloatingButton from '../components/FloatingButton'
import { FaEnvelope, FaPhone, FaLinkedin, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa'
import './Contact.css'

const contactInfo = [
  {
    icon: <FaEnvelope />,
    label: 'Email',
    value: 'deepaksaimadishetty7@gmail.com',
    href: 'mailto:deepaksaimadishetty7@gmail.com',
  },
  {
    icon: <FaPhone />,
    label: 'Phone',
    value: '(929) 595-1696',
    href: 'tel:+19295951696',
  },
  {
    icon: <FaLinkedin />,
    label: 'LinkedIn',
    value: 'linkedin.com/in/deepaksaimadishetty',
    href: 'https://www.linkedin.com/in/deepaksaimadishetty',
  },
  {
    icon: <FaMapMarkerAlt />,
    label: 'Location',
    value: 'Scottsdale, AZ',
    href: null,
  },
]

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const mailtoLink = `mailto:deepaksaimadishetty7@gmail.com?subject=Message from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.name} (${formData.email})`
    window.location.href = mailtoLink
  }

  return (
    <div className="page-container">
      <h2 className="section-title">Get in Touch</h2>

      <div className="contact-layout">
        <div className="contact-info-col">
          <Card delay={0.1}>
            <h3 className="contact-heading">Let's Connect</h3>
            <p className="contact-subtext">
              I'm always open to discussing new opportunities, data engineering challenges,
              or just having a great conversation about technology.
            </p>
          </Card>
          {contactInfo.map((item, index) => (
            <Card key={index} className="contact-info-card" delay={0.15 + index * 0.08}>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="contact-info-link">
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <p className="contact-info-label">{item.label}</p>
                    <p className="contact-info-value">{item.value}</p>
                  </div>
                </a>
              ) : (
                <div className="contact-info-link">
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <p className="contact-info-label">{item.label}</p>
                    <p className="contact-info-value">{item.value}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Card className="contact-form-card" delay={0.2}>
          <h3 className="contact-form-title">Send a Message</h3>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows="5"
                required
              />
            </div>
            <FloatingButton onClick={() => {}} className="contact-submit">
              <FaPaperPlane /> Send Message
            </FloatingButton>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Contact
