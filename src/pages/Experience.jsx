import Card from '../components/Card'
import { FaBriefcase } from 'react-icons/fa'
import './Experience.css'

const experiences = [
  {
    company: 'Cardone Ventures',
    location: 'Scottsdale, AZ',
    role: 'Data Analyst',
    period: 'Oct 2024 - Present',
    highlights: [
      'Built and deployed high-volume ETL/ELT pipelines using Azure Data Factory, PySpark, and SQL to process over 400K+ client and internal financial records, reducing data ingestion time by 40%.',
      'Developed real-time data pipelines using Microsoft Fabric and Azure Event Hub to monitor client financial metrics (GL, P&L, balance sheets), decreasing report latency by 50%.',
      'Implemented robust data quality frameworks and validation rules in Fabric Dataflows and Azure Data Factory, improving data consistency and governance across all domains by 35%.',
      'Modeled and optimized dimensional data structures within Azure Synapse Analytics for executive and client reporting across finance, employee, and operations domains.',
      'Collaborated cross-functionally with Business Operations, HR, and Finance to design standard data models and KPIs, reducing manual reconciliation efforts by 25%.',
      'Built CI/CD workflows using GitHub Actions and Azure DevOps for ETL pipelines and MDM processes, improving release reliability and cutting deployment time by 60%.',
      'Orchestrated and monitored batch and streaming workflows in Microsoft Fabric and Apache Airflow, ensuring SLAs and proactive alerting across key data domains.',
      'Architected a secure Azure Data Lakehouse integrated with Profisee MDM and Microsoft Purview, improving discoverability and regulatory compliance by 35%.',
      'Integrated Power BI dashboards with curated datasets to deliver interactive financial and operational insights, reducing decision cycle time by 30%.',
      'Led initiative to automate survey collection and reporting of 40 client-facing events (10,000 attendees) using Microsoft Power Pages, Power Automate, and Power BI.',
    ],
  },
  {
    company: 'DBS Tech India',
    location: 'Hyderabad',
    role: 'Senior Officer, Specialist, Application Development (Full Stack)',
    period: 'Jul 2021 - Jul 2022',
    highlights: [
      'Developed and optimized RESTful APIs using Java, Spring Boot, and MariaDB, improving query performance by 90% and ensuring low-latency data retrieval for high-traffic distributed systems.',
      'Built fault-tolerant data pipelines with Python, SQL, and Apache Airflow, automating data validation and anomaly detection, reducing data inconsistencies by 35%.',
      'Enhanced CI/CD pipelines with Jenkins and Docker, improving deployment efficiency and reducing system downtime by 50%.',
      'Built an Angular-based access management platform with integrated RBAC, eliminating 75% of manual interventions and improving security compliance.',
    ],
  },
]

function Experience() {
  return (
    <div className="page-container">
      <h2 className="section-title">Work Experience</h2>

      <div className="timeline">
        {experiences.map((exp, index) => (
          <Card key={index} className="timeline-card" delay={index * 0.15}>
            <div className="timeline-dot">
              <FaBriefcase />
            </div>
            <div className="timeline-header">
              <div>
                <h3 className="timeline-company">{exp.company}</h3>
                <p className="timeline-role">{exp.role}</p>
                <p className="timeline-location">{exp.location}</p>
              </div>
              <span className="timeline-period">{exp.period}</span>
            </div>
            <ul className="timeline-highlights">
              {exp.highlights.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Experience
