import Card from '../components/Card'
import './Skills.css'

const skillCategories = [
  {
    title: 'Programming Languages',
    skills: ['Python', 'Java', 'R', 'C/C++', 'Shell Script', 'SQL'],
    color: '#FF6B35',
  },
  {
    title: 'Frameworks & Libraries',
    skills: ['Apache Spark', 'Apache Airflow', 'TensorFlow', 'scikit-learn', 'FastAPI', 'Keras'],
    color: '#F7931E',
  },
  {
    title: 'Cloud & Data Platforms',
    skills: [
      'Azure Data Factory',
      'Azure Synapse',
      'Azure Event Hub',
      'Microsoft Fabric',
      'Profisee MDM',
      'Microsoft Purview',
    ],
    color: '#FF4E50',
  },
  {
    title: 'BI & Automation',
    skills: ['Power BI', 'Power Pages', 'Power Automate'],
    color: '#FFD166',
  },
  {
    title: 'DevOps & Tools',
    skills: ['GitHub Actions', 'Docker', 'Jenkins', 'UNIX Utilities', 'Azure DevOps'],
    color: '#FF8C5A',
  },
  {
    title: 'Databases',
    skills: ['MySQL', 'MongoDB', 'MariaDB', 'Azure SQL', 'Apache Hive'],
    color: '#E55A2B',
  },
]

function Skills() {
  return (
    <div className="page-container">
      <h2 className="section-title">Technical Skills</h2>

      <div className="skills-grid">
        {skillCategories.map((category, index) => (
          <Card key={index} className="skill-category-card" delay={index * 0.1}>
            <div
              className="skill-category-bar"
              style={{ background: category.color }}
            />
            <h3 className="skill-category-title">{category.title}</h3>
            <div className="skill-chips">
              {category.skills.map((skill, i) => (
                <span
                  key={i}
                  className="skill-chip"
                  style={{
                    borderColor: category.color,
                    color: category.color,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Skills
