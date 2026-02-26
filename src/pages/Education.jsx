import Card from '../components/Card'
import { FaGraduationCap, FaAward } from 'react-icons/fa'
import './Education.css'

function Education() {
  const coursework = [
    'Information Assurance and Security',
    'Data Processing at Scale',
    'Data Mining',
    'Statistical Machine Learning',
  ]

  return (
    <div className="page-container">
      <h2 className="section-title">Education & Qualifications</h2>

      <Card className="edu-main-card" delay={0.1}>
        <div className="edu-icon">
          <FaGraduationCap />
        </div>
        <div className="edu-details">
          <h3>Master of Science in Computer Science</h3>
          <p className="edu-school">Arizona State University, Tempe, AZ</p>
          <div className="edu-meta">
            <span className="edu-gpa">GPA: 3.89</span>
            <span className="edu-date">Graduated May 2024</span>
          </div>
        </div>
      </Card>

      <h3 className="subsection-title">Relevant Coursework</h3>
      <div className="coursework-grid">
        {coursework.map((course, index) => (
          <Card key={index} className="coursework-card" delay={0.1 + index * 0.08}>
            <FaAward className="coursework-icon" />
            <span>{course}</span>
          </Card>
        ))}
      </div>

      <h3 className="subsection-title">Certifications & Skills Domains</h3>
      <div className="cert-grid">
        <Card delay={0.1}>
          <h4>Cloud & Data Engineering</h4>
          <p>Azure Data Factory, Azure Synapse Analytics, Microsoft Fabric, Azure Event Hub, Data Lakehouse Architecture</p>
        </Card>
        <Card delay={0.15}>
          <h4>Data Governance & MDM</h4>
          <p>Profisee MDM, Microsoft Purview, Data Quality Frameworks, Regulatory Compliance</p>
        </Card>
        <Card delay={0.2}>
          <h4>Machine Learning & Analytics</h4>
          <p>TensorFlow, scikit-learn, Keras, Statistical Machine Learning, Predictive Analytics, A/B Testing</p>
        </Card>
        <Card delay={0.25}>
          <h4>Full Stack Development</h4>
          <p>Java, Spring Boot, Angular, RESTful APIs, Docker, Jenkins, CI/CD Pipelines</p>
        </Card>
      </div>
    </div>
  )
}

export default Education
