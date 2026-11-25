import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CalendarDays, Check, ChevronRight, CircleCheck, Clock3, FileText, MapPin, Plus, Search, Trash2, TrendingUp, UserRound } from 'lucide-react'
import { useApp } from '../context/AppContext'
import JobCard from '../components/JobCard'
import StatusBadge from '../components/StatusBadge'
import CompanyLogo from '../components/CompanyLogo'
import { FormField } from './PublicPages'

const dateLabel = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
function PageTitle({ eyebrow, title, highlight, text, action }) {
  return <div className="workspace-title-row"><div><span className="eyebrow">{eyebrow}</span><h1>{title} {highlight && <span>{highlight}</span>}</h1>{text && <p>{text}</p>}</div>{action}</div>
}

export function UserOverview() {
  const { user, jobs, applications, savedJobs, profiles } = useApp()
  const ownApps = applications.filter((item) => item.userEmail === user.email)
  const saved = savedJobs.filter((item) => item.userEmail === user.email).map((item) => jobs.find((job) => job.id === item.jobId)).filter(Boolean)
  const profile = profiles[user.email] || {}
  const stats = [{ label: 'Applications', value: ownApps.length, icon: BriefcaseBusiness, tint: 'blue' }, { label: 'Applied', value: ownApps.filter((item) => item.status === 'Applied').length, icon: Clock3, tint: 'teal' }, { label: 'Approved', value: ownApps.filter((item) => item.status === 'Approved').length, icon: CircleCheck, tint: 'green' }, { label: 'Shortlisted', value: ownApps.filter((item) => item.status === 'Shortlisted').length, icon: CircleCheck, tint: 'violet' }, { label: 'Interview', value: ownApps.filter((item) => item.status === 'Interview').length, icon: CalendarDays, tint: 'blue' }, { label: 'Offers', value: ownApps.filter((item) => item.status === 'Offer').length, icon: CircleCheck, tint: 'green' }, { label: 'Rejected', value: ownApps.filter((item) => item.status === 'Rejected').length, icon: FileText, tint: 'violet' }]
  const completionFields = ['phone', 'location', 'education', 'experience', 'skills', 'qualifications']
  const completion = Math.min(100, 25 + completionFields.filter((field) => profile[field]).length * 15)
  const recent = ownApps.slice().sort((a, b) => b.appliedAt.localeCompare(a.appliedAt)).slice(0, 4)
  return <div className="dashboard-page"><PageTitle eyebrow="CANDIDATE OVERVIEW" title="Your dashboard" text="Here’s what’s happening with your career search." action={<Link className="button button-primary" to="/jobs"><Search size={16} /> Explore jobs</Link>} />
    <div className="stats-grid candidate-stats-grid">{stats.map(({ label, value, icon: Icon, tint }) => <div className="stat-card" key={label}><div className={`stat-icon ${tint}`}><Icon size={19} /></div><div className="stat-value">{value}</div><div className="stat-label">{label}</div><span className="stat-subtle">Your career at a glance</span></div>)}</div>
    <div className="dashboard-columns"><section className="panel recent-panel"><div className="panel-heading"><div><h2>Recent applications</h2><p>Your latest career moves</p></div><Link className="text-link text-link-small" to="/dashboard/applications">View all <ArrowRight size={15} /></Link></div>{recent.length ? <div className="recent-list">{recent.map((item) => { const job = jobs.find((entry) => entry.id === item.jobId); return job && <div className="recent-item" key={item.id}><div className="company-logo company-logo-small" style={{ '--logo-color': job.color }}>{job.logo}</div><div className="recent-item-copy"><strong>{job.title}</strong><span>{job.company} · applied {dateLabel(item.appliedAt)}</span></div><StatusBadge status={item.status} /></div> })}</div> : <div className="dashboard-empty"><span className="empty-icon"><BriefcaseBusiness size={20} /></span><strong>Your next move starts here.</strong><p>Browse roles and keep your applications together.</p><Link className="text-link" to="/jobs">Find your first role <ArrowRight size={15} /></Link></div>}</section>
      <section className="panel profile-progress"><div className="panel-heading"><div><h2>Profile strength</h2><p>A complete profile gets noticed</p></div><UserRound size={19} className="muted-icon" /></div><div className="progress-ring" style={{ '--progress': `${completion}%` }}><div><strong>{completion}%</strong><span>complete</span></div></div><div className="progress-caption"><TrendingUp size={16} /><span>Add your skills and experience to stand out.</span></div><Link className="button button-outline button-full" to="/dashboard/profile">Complete your profile <ArrowRight size={15} /></Link></section></div>
    <section className="panel saved-preview"><div className="panel-heading"><div><h2>Saved for later</h2><p>Roles you want to come back to</p></div><Link className="text-link text-link-small" to="/dashboard/saved">See saved jobs <ArrowRight size={15} /></Link></div>{saved.length ? <div className="saved-mini-grid">{saved.slice(0, 2).map((job) => <Link className="saved-mini" to={`/jobs/${job.id}`} key={job.id}><div className="company-logo company-logo-small" style={{ '--logo-color': job.color }}>{job.logo}</div><div><strong>{job.title}</strong><span>{job.company} · {job.location}</span></div><ChevronRight size={17} /></Link>)}</div> : <p className="muted-copy">Save roles that catch your eye and they’ll be waiting here.</p>}</section>
  </div>
}

export function ApplicationsPage() {
  const { user, jobs, applications, updateApplication, removeApplication } = useApp()
  const [expanded, setExpanded] = useState('')
  const [search, setSearch] = useState('')
  const own = applications.filter((item) => item.userEmail === user.email).map((item) => ({ ...item, job: jobs.find((job) => job.id === item.jobId) })).filter((item) => item.job && `${item.job.company} ${item.job.title}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
  return <div className="dashboard-page"><PageTitle eyebrow="YOUR JOB SEARCH" title="My applications" text="Every opportunity, conversation, and next step in one place." action={<Link className="button button-primary" to="/jobs"><Plus size={16} /> Find a job</Link>} />
    <div className="panel table-panel"><div className="panel-heading table-toolbar"><div><h2>Application history</h2><p>{own.length} {own.length === 1 ? 'role' : 'roles'} in your tracker</p></div><label className="table-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applications" /></label></div>
      {own.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Company / role</th><th>Date applied</th><th>Status</th><th>Details</th></tr></thead><tbody>{own.map((item) => <ApplicationRow key={item.id} item={item} expanded={expanded === item.id} onExpand={() => setExpanded(expanded === item.id ? '' : item.id)} onUpdate={(changes) => updateApplication(item.id, changes)} onRemove={() => { if (window.confirm('Remove this application from your tracker?')) removeApplication(item.id) }} />)}</tbody></table></div> : <EmptyDashboard title="Your tracker is ready." text="Apply to a role and you’ll see every step of your journey here." action={<Link className="button button-primary" to="/jobs">Browse jobs <ArrowRight size={16} /></Link>} />}
    </div>
  </div>
}

function ApplicationRow({ item, expanded, onExpand, onUpdate, onRemove }) {
  const job = item.job
  return <>
    <tr><td><div className="table-company"><div className="company-logo company-logo-small" style={{ '--logo-color': job.color }}>{job.logo}</div><div><strong>{job.company}</strong><Link to={`/jobs/${job.id}`}>{job.title}</Link></div></div></td><td>{dateLabel(item.appliedAt)}</td><td><StatusBadge status={item.status} /></td><td><button className="table-action" onClick={onExpand}>{expanded ? 'Close details' : 'View progress'} <ChevronRight className={expanded ? 'rotate-icon' : ''} size={15} /></button></td></tr>
    {expanded && <tr className="expanded-row"><td colSpan="4"><div className="application-expanded"><div className="timeline"><strong>Application progress</strong><div className="timeline-track">{(item.history || [{ status: 'Applied', date: item.appliedAt }]).map((event, index) => <div className="timeline-event" key={`${event.status}-${index}`}><span className="timeline-dot"><Check size={11} /></span><div><b>{event.status}</b><small>{dateLabel(event.date)}</small></div></div>)}</div></div><div className="application-note"><label className="form-field"><span>Your private note</span><textarea rows="2" value={item.note || ''} onChange={(event) => onUpdate({ note: event.target.value })} placeholder="Add a reminder or follow-up note..." /></label><button className="button button-outline button-small" onClick={onRemove}><Trash2 size={14} /> Remove application</button></div></div></td></tr>}
  </>
}

export function SavedJobsPage() {
  const { user, jobs, savedJobs, toggleSaved, apply } = useApp()
  const [notice, setNotice] = useState('')
  const list = savedJobs.filter((item) => item.userEmail === user.email).map((item) => jobs.find((job) => job.id === item.jobId)).filter(Boolean)
  const applySaved = (id) => { const result = apply(id); setNotice(result.error || 'Application added. You can follow its progress in My Applications.') }
  return <div className="dashboard-page"><PageTitle eyebrow="YOUR SHORTLIST" title="Saved jobs" text="A shortlist for the possibilities you want to revisit." action={<Link className="button button-outline" to="/jobs"><Search size={16} /> Discover roles</Link>} />{notice && <div className="notice notice-info">{notice}<button onClick={() => setNotice('')}>×</button></div>}{list.length ? <div className="saved-jobs-grid">{list.map((job) => <div className="saved-job-wrap" key={job.id}><JobCard job={job} /><div className="saved-actions"><button className="text-button" onClick={() => toggleSaved(job.id)}><Trash2 size={14} /> Remove from saved</button><button className="button button-primary button-small" onClick={() => applySaved(job.id)}>Apply now <ArrowRight size={15} /></button></div></div>)}</div> : <EmptyDashboard title="Keep the good ones close." text="Save jobs you’re interested in and they’ll be collected here." action={<Link className="button button-primary" to="/jobs">Explore jobs <ArrowRight size={16} /></Link>} />}</div>
}

export function ProfilePage() {
  const { user, profiles, saveProfile } = useApp()
  const profile = profiles[user.email] || {}
  const [form, setForm] = useState(() => ({
    name: user.name,
    email: user.email,
    phone: '',
    location: '',
    education: '',
    experience: '',
    qualifications: '',
    linkedin: '',
    github: '',
    resumeName: '',
    ...profile,
    skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || '',
  }))
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const chooseResume = (event) => { const file = event.target.files?.[0]; if (file) setForm((current) => ({ ...current, resumeName: file.name })) }
  const submit = (event) => { event.preventDefault(); if (!form.name.trim()) { setError('Please enter your full name.'); return } saveProfile(form); setError(''); setMessage('Your profile has been saved successfully.') }
  return <div className="dashboard-page"><PageTitle eyebrow="YOUR PROFESSIONAL PRESENCE" title="My profile" text="Add your skills and qualifications so employers can review them with your application." /><form className="panel profile-form" onSubmit={submit}><div className="profile-form-heading"><div className="profile-avatar-large">{user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div><h2>{form.name || 'Your profile'}</h2><p>{form.location || 'Add your location'} · Candidate profile</p></div><span className="profile-private"><Check size={14} /> Private to you</span></div>{error && <div className="form-alert form-alert-error">{error}</div>}{message && <div className="form-alert form-alert-success">{message}</div>}<div className="profile-fields"><div className="form-section-label">Personal information</div><FormField label="Full name" name="name" required value={form.name} onChange={update} placeholder="Your full name" /><FormField label="Email address" name="email" type="email" disabled value={form.email} onChange={update} /><FormField label="Phone number" name="phone" type="tel" value={form.phone} onChange={update} placeholder="+91 98765 43210" /><FormField label="Location" name="location" value={form.location} onChange={update} placeholder="City, country" /><div className="form-section-label">Experience & education</div><FormField label="Education" name="education" value={form.education} onChange={update} placeholder="Degree, institution" /><FormField label="Experience" name="experience" value={form.experience} onChange={update} placeholder="e.g. 3 years in product design" /><label className="form-field profile-field-full"><span>Skills</span><textarea name="skills" rows="3" value={form.skills} onChange={update} placeholder="e.g. React, SQL, communication, project management" /><small className="field-hint">Separate each skill with a comma.</small></label><label className="form-field profile-field-full"><span>Qualifications & certifications</span><textarea name="qualifications" rows="4" value={form.qualifications} onChange={update} placeholder="List relevant qualifications, certifications, licenses, or achievements." /><small className="field-hint">Include relevant degrees, certifications, licenses, or other role-related qualifications.</small></label><div className="form-section-label">Links & resume</div><FormField label="LinkedIn profile" name="linkedin" type="url" value={form.linkedin} onChange={update} placeholder="https://linkedin.com/in/yourname" /><FormField label="GitHub profile" name="github" type="url" value={form.github} onChange={update} placeholder="https://github.com/yourname" /><label className="resume-upload profile-field-full"><span className="resume-icon"><FileText size={20} /></span><span><strong>{form.resumeName || 'Upload your resume'}</strong><small>PDF or DOCX · Your file stays on this device</small></span><span className="button button-outline button-small">Choose file</span><input type="file" accept=".pdf,.doc,.docx" onChange={chooseResume} /></label></div><div className="profile-form-footer"><span>Your saved skills and qualifications are included with new applications.</span><button className="button button-primary"><Check size={16} /> Save profile</button></div></form></div>
}

export function UserSettingsPage() {
  const { user, logout } = useApp()
  return <div className="dashboard-page"><PageTitle eyebrow="PREFERENCES" title="Settings" text="Manage your account and personal preferences." /><div className="settings-grid"><section className="panel settings-card"><div className="settings-icon"><UserRound size={20} /></div><h2>Account details</h2><p>Your JobTrack account information.</p><div className="settings-detail"><span>Name</span><strong>{user.name}</strong></div><div className="settings-detail"><span>Email</span><strong>{user.email}</strong></div><Link className="text-link" to="/dashboard/profile">Edit your profile <ArrowRight size={15} /></Link></section><section className="panel settings-card"><div className="settings-icon"><ShieldCheckIcon /></div><h2>Privacy & data</h2><p>Your demo data is stored in this browser’s local storage and is not sent to a server.</p><div className="settings-detail"><span>Data storage</span><strong>On this device</strong></div><div className="settings-detail"><span>Account type</span><strong>Candidate</strong></div><button className="button button-outline" onClick={() => { if (window.confirm('Log out of JobTrack?')) { logout(); window.location.href = '/' } }}>Log out <ArrowRight size={15} /></button></section></div></div>
}

function ShieldCheckIcon() {
  return <Check size={20} />
}

function EmptyDashboard({ title, text, action }) {
  return <div className="dashboard-empty large-empty"><span className="empty-icon"><BriefcaseBusiness size={23} /></span><h2>{title}</h2><p>{text}</p>{action}</div>
}
