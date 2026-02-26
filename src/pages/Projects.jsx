import Card from '../components/Card'
import FloatingButton from '../components/FloatingButton'
import { FaExternalLinkAlt } from 'react-icons/fa'
import './Projects.css'

const projects = [
  {
    title: 'Personalized Healthcare Intervention Optimization',
    period: 'Jun 2024',
    type: 'Personal Project',
    description:
      'A low-cost predictive analytics model using public healthcare datasets to optimize personalized interventions for patient care.',
    highlights: [
      'Used MIMIC-III and UCI Heart Disease datasets to increase treatment adherence prediction accuracy by 15%.',
      'Applied Logistic Regression, Random Forest, and Gradient Boosting achieving 85% F1-score on intervention effectiveness.',
      'Designed A/B tests on simulated patient engagement strategies, reducing ineffective outreach by 20%.',
      'Integrated wearable sensor data (heart rate, activity logs) preprocessed with Pandas and NumPy for real-time risk assessment.',
      'Built interactive Power BI dashboards to visualize patient response trends for medical professionals.',
    ],
    tags: ['Python', 'scikit-learn', 'Pandas', 'Power BI', 'Machine Learning', 'A/B Testing'],
  },
  {
    title: 'Azure Data Lakehouse Architecture',
    period: '2024 - Present',
    type: 'Professional Project',
    description:
      'End-to-end data lakehouse solution processing 400K+ records with real-time monitoring and automated governance.',
    highlights: [
      'Architected secure Azure Data Lakehouse integrated with Profisee MDM and Microsoft Purview.',
      'Built ETL/ELT pipelines with Azure Data Factory and PySpark, reducing ingestion time by 40%.',
      'Implemented real-time pipelines with Microsoft Fabric and Azure Event Hub, decreasing report latency by 50%.',
      'Integrated Power BI dashboards delivering interactive financial and operational insights.',
    ],
    tags: ['Azure', 'PySpark', 'Microsoft Fabric', 'Power BI', 'Data Engineering'],
  },
  {
    title: 'Event Survey Automation Platform',
    period: '2024',
    type: 'Professional Project',
    description:
      'Automated survey collection and reporting system for 40 client-facing events with 10,000+ attendees.',
    highlights: [
      'Built using Microsoft Power Pages, Power Automate, and Power BI.',
      'Enabled reporting on event experience, attendee counts, and product sales.',
      'Gained wide recognition across the company for streamlining event analytics.',
    ],
    tags: ['Power Pages', 'Power Automate', 'Power BI', 'Automation'],
  },
  {
    title: 'Access Management Platform',
    period: '2021 - 2022',
    type: 'Professional Project @ DBS Tech',
    description:
      'Angular-based role-based access control platform for enterprise security compliance.',
    highlights: [
      'Built with Angular and integrated RBAC, eliminating 75% of manual interventions.',
      'Improved security compliance across the organization.',
      'Backed by RESTful APIs with Java, Spring Boot, and MariaDB.',
    ],
    tags: ['Angular', 'Java', 'Spring Boot', 'MariaDB', 'RBAC'],
  },
]

function Projects() {
  return (
    <div className="page-container">
      <h2 className="section-title">Projects</h2>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <Card key={index} className="project-card" delay={index * 0.12}>
            <div className="project-type">{project.type}</div>
            <h3 className="project-title">{project.title}</h3>
            <span className="project-period">{project.period}</span>
            <p className="project-description">{project.description}</p>
            <ul className="project-highlights">
              {project.highlights.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <div className="project-tags">
              {project.tags.map((tag, i) => (
                <span key={i} className="project-tag">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Projects
