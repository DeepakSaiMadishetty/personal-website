import Card from '../components/Card'
import './About.css'

function About() {
  return (
    <div className="page-container">
      <h2 className="section-title">About Me</h2>

      <div className="about-layout">
        <Card className="about-photo-card" delay={0.1}>
          <div className="about-photo-placeholder">
            <div className="photo-placeholder-inner">
              <span>DS</span>
            </div>
            <p className="photo-coming-soon">Photo coming soon</p>
          </div>
        </Card>

        <Card className="about-bio-card" delay={0.2}>
          <h3>Deepak Sai Madishetty</h3>
          <p className="about-role">Data Analyst & Full Stack Developer</p>
          <p className="about-text">
            I'm a data-driven professional with a Master's in Computer Science from Arizona State University
            (GPA: 3.89). I specialize in building high-performance ETL/ELT pipelines, real-time data systems,
            and interactive dashboards that transform raw data into actionable business insights.
          </p>
          <p className="about-text">
            Currently at Cardone Ventures, I architect cloud-based data solutions using Azure, Microsoft Fabric,
            and Power BI, processing over 400K+ records and reducing data ingestion time by 40%. My full-stack
            background from DBS Tech India gives me a unique edge in building end-to-end data solutions.
          </p>
        </Card>
      </div>

      <div className="about-interests">
        <h3 className="about-subtitle">Interests & Activities</h3>
        <div className="interests-grid">
          <Card delay={0.1}>
            <div className="interest-icon">&#9889;</div>
            <h4>Data Engineering</h4>
            <p>Building scalable pipelines and architecting data lakehouses</p>
          </Card>
          <Card delay={0.15}>
            <div className="interest-icon">&#9729;</div>
            <h4>Cloud Architecture</h4>
            <p>Designing solutions on Azure and Microsoft Fabric</p>
          </Card>
          <Card delay={0.2}>
            <div className="interest-icon">&#128202;</div>
            <h4>Data Visualization</h4>
            <p>Creating interactive Power BI dashboards for insights</p>
          </Card>
          <Card delay={0.25}>
            <div className="interest-icon">&#129302;</div>
            <h4>Machine Learning</h4>
            <p>Applying ML models for predictive analytics and optimization</p>
          </Card>
          <Card delay={0.3}>
            <div className="interest-icon">&#128187;</div>
            <h4>Full Stack Dev</h4>
            <p>Building robust web applications with modern frameworks</p>
          </Card>
          <Card delay={0.35}>
            <div className="interest-icon">&#127891;</div>
            <h4>Continuous Learning</h4>
            <p>Exploring emerging technologies and staying current</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default About
