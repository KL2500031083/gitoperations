import { Bookmark, MapPin, BriefcaseBusiness, Clock3, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import CompanyLogo from './CompanyLogo'

export default function JobCard({ job, compact = false }) {
  const { user, savedJobs, toggleSaved } = useApp()
  const isSaved = savedJobs.some((item) => item.userEmail === user?.email && item.jobId === job.id)
  return (
    <article className={`job-card ${compact ? 'job-card-compact' : ''}`}>
      <div className="job-card-top">
        <CompanyLogo job={job} />
        <button className={`icon-button save-button ${isSaved ? 'is-saved' : ''}`} onClick={() => toggleSaved(job.id)} aria-label={isSaved ? 'Remove saved job' : 'Save job'}>
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="job-heading">
        <div><h3>{job.title}</h3><span className="company-name">{job.company}</span></div>
        <span className="posted-label"><Clock3 size={13} /> {job.posted === new Date().toISOString().slice(0, 10) ? 'Today' : job.posted}</span>
      </div>
      <div className="job-meta">
        <span><MapPin size={15} />{job.location}</span>
        <span><BriefcaseBusiness size={15} />{job.experience}</span>
      </div>
      <div className="job-meta secondary-meta"><span>{job.salary}</span><span>{job.type}</span><span>{job.mode}</span></div>
      <div className="skill-list">{job.skills?.slice(0, compact ? 2 : 4).map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}</div>
      <div className="job-card-actions">
        <Link className="button button-outline button-small" to={`/jobs/${job.id}`}>View details <ArrowUpRight size={15} /></Link>
        <Link className="button button-primary button-small" to={`/jobs/${job.id}`}>Apply now</Link>
      </div>
    </article>
  )
}
