import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BadgeCheck, Bookmark, BriefcaseBusiness, Building2, Check, ChevronDown, Clock3, Compass, Eye, EyeOff, MapPin, Search, ShieldCheck, Sparkles, Target, UsersRound, Wallet, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import JobCard from '../components/JobCard'
import CompanyLogo from '../components/CompanyLogo'

const categories = [
  { name: 'Design', terms: ['design', 'figma', 'research'], icon: Sparkles, tint: 'lavender' },
  { name: 'Engineering', terms: ['engineer', 'developer', 'react', 'java', 'node'], icon: BriefcaseBusiness, tint: 'blue' },
  { name: 'Marketing', terms: ['marketing', 'seo', 'content'], icon: Target, tint: 'mint' },
  { name: 'Data & Analytics', terms: ['analyst', 'sql', 'data', 'power bi'], icon: Compass, tint: 'peach' },
]
function SearchHero({ initialKeyword = '', initialLocation = '' }) {
  const [keyword, setKeyword] = useState(initialKeyword)
  const [location, setLocation] = useState(initialLocation)
  const { jobs } = useApp()
  const cities = [...new Set(jobs.map((job) => job.location.split(',')[0].trim()).filter((city) => city !== 'Remote'))].sort()
  const navigate = useNavigate()
  const submit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (keyword.trim()) params.set('q', keyword.trim())
    if (location.trim()) params.set('location', location.trim())
    navigate(`/jobs${params.size ? `?${params}` : ''}`)
  }
  return <form className="hero-search" onSubmit={submit}>
    <label className="search-field"><Search size={19} /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Job title, skill or company" aria-label="Job title, skill or company" /></label>
    <span className="search-divider" />
    <label className="search-field location-field"><MapPin size={19} /><input list="india-city-options" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Any Indian city or remote" aria-label="Location" /></label><datalist id="india-city-options">{cities.map((city) => <option value={city} key={city} />)}<option value="Remote" /></datalist>
    <button className="button button-primary search-submit" type="submit">Search jobs <ArrowRight size={17} /></button>
  </form>
}

export function HomePage() {
  const { jobs, applications } = useApp()
  const companyPriority = ['Google', 'Amazon', 'Microsoft', 'Flipkart', 'Amazon Web Services', 'PhonePe']
  const companies = [...new Map(jobs.map((job) => [job.company, job])).values()]
    .sort((a, b) => {
      const aPriority = companyPriority.indexOf(a.company)
      const bPriority = companyPriority.indexOf(b.company)
      return (aPriority < 0 ? Infinity : aPriority) - (bPriority < 0 ? Infinity : bPriority)
    }).slice(0, 6)
  const cities = new Set(jobs.map((job) => job.location.split(',')[0].trim()))
  return <main>
    <section className="hero-section"><div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" /><div className="container hero-grid">
      <div className="hero-copy"><div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> YOUR NEXT CHAPTER STARTS HERE</div><h1>Find your dream job.<br /><span>Build your future.</span></h1><p>Discover opportunities, connect with companies, and track your career journey in one place.</p><SearchHero /><div className="hero-proof"><div className="proof-avatars"><span>AK</span><span>SM</span><span>JR</span><span>+</span></div><div><strong>12,000+ professionals</strong><small>found their next opportunity</small></div><div className="proof-rating"><span>★★★★★</span><small>4.9/5 candidate rating</small></div></div></div>
      <div className="hero-visual"><div className="visual-glow" /><div className="hero-card hero-card-main"><div className="match-heading"><span className="match-icon"><BriefcaseBusiness size={17} /></span><span>Featured opportunities</span><span className="live-dot" /></div>{jobs.slice(0, 3).map((job) => <div className="match-job" key={job.id}><CompanyLogo job={job} /><div><strong>{job.title}</strong><span>{job.company} · {job.location.replace(', India', '')}</span></div></div>)}<Link className="view-matches" to="/jobs">Explore all opportunities <ArrowRight size={15} /></Link></div><div className="floating-stat floating-stat-top"><span className="floating-stat-icon"><BadgeCheck size={18} /></span><div><strong>Find your fit</strong><small>Explore roles from growing teams</small></div></div><div className="floating-stat floating-stat-bottom"><div className="mini-bars"><i /><i /><i /><i /><i /></div><div><strong>Keep your search organized</strong><small>Track your progress in one place</small></div></div></div>
    </div><div className="hero-bottom container"><span>Explore opportunities across India</span><div className="hero-company-list">{companies.slice(0, 5).map((company) => <b key={company.company}>{company.company}</b>)}</div></div></section>
    <section className="section section-categories"><div className="container"><div className="section-heading"><div><span className="eyebrow">EXPLORE OPPORTUNITIES</span><h2>Find work that <span>fits you.</span></h2><p>Explore roles across the fields shaping tomorrow.</p></div><Link className="text-link" to="/jobs">Explore all jobs <ArrowRight size={17} /></Link></div><div className="category-grid">{categories.map(({ name, terms, icon: Icon, tint }) => { const count = jobs.filter((job) => terms.some((term) => `${job.title} ${job.skills?.join(' ')}`.toLowerCase().includes(term))).length; return <Link className="category-card" to={`/jobs?q=${encodeURIComponent(terms[0])}`} key={name}><span className={`category-icon ${tint}`}><Icon size={21} /></span><span className="category-info"><strong>{name}</strong><small>{count} matching roles</small></span><ArrowUpRight className="category-arrow" size={18} /></Link> })}</div></div></section>
    <section className="section companies-section" id="companies"><div className="container"><div className="section-heading"><div><span className="eyebrow">GREAT TEAMS, GREAT WORK</span><h2>Meet your next <span>team.</span></h2><p>Explore startups and established employers from across the country.</p></div><Link className="text-link" to="/companies">Browse all {new Set(jobs.map((job) => job.company)).size} companies <ArrowRight size={17} /></Link></div><div className="companies-grid">{companies.map((company) => <Link className="company-card" to={`/jobs?q=${encodeURIComponent(company.company)}`} key={company.company}><div className="company-logo" style={{ '--logo-color': company.color }}>{company.logo}</div><strong>{company.company}</strong><small>View sample roles <ArrowUpRight size={13} /></small></Link>)}</div></div></section>
    <section className="section latest-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">FRESH OPPORTUNITIES</span><h2>Latest openings.</h2><p>New possibilities, added every day.</p></div><Link className="text-link" to="/jobs">View all jobs <ArrowRight size={17} /></Link></div><div className="featured-jobs-grid">{jobs.slice(0, 3).map((job) => <JobCard job={job} key={job.id} compact />)}</div></div></section>
    <section className="stats-band"><div className="container stats-inner"><div><strong>{jobs.length}</strong><small>Sample job listings</small></div><div><strong>{new Set(jobs.map((job) => job.company)).size}</strong><small>Companies represented</small></div><div><strong>{cities.size}</strong><small>Indian cities represented</small></div><div><strong>{applications.length}</strong><small>Applications tracked</small></div></div></section>
    <section className="section how-section"><div className="container"><div className="center-heading"><span className="eyebrow">A BETTER WAY FORWARD</span><h2>Your career, <span>in motion.</span></h2><p>Everything you need for your next move, thoughtfully connected.</p></div><div className="how-grid"><div className="how-card"><span className="how-number">01</span><div className="how-icon"><Search size={22} /></div><h3>Discover roles</h3><p>Find relevant openings from teams that align with your goals, skills, and way of working.</p></div><div className="how-card"><span className="how-number">02</span><div className="how-icon"><BriefcaseBusiness size={22} /></div><h3>Apply with confidence</h3><p>Keep your profile ready and make each application a considered next step.</p></div><div className="how-card"><span className="how-number">03</span><div className="how-icon"><ChartNoAxesCombinedIcon /></div><h3>Stay in the know</h3><p>Track every application in one clear place and see your progress at a glance.</p></div></div></div></section>
    <section className="why-section"><div className="container why-grid"><div><span className="eyebrow">MORE THAN A JOB BOARD</span><h2>A smarter way to<br />move your career <span>forward.</span></h2><p>JobTrack brings your search, applications, and career momentum together — so you can focus on the opportunity ahead.</p><Link className="button button-primary" to="/about">Why JobTrack <ArrowRight size={17} /></Link></div><div className="why-points"><div><span><ShieldCheck size={19} /></span><div><strong>Your search, in one place</strong><p>Organize opportunities and applications without the spreadsheet shuffle.</p></div></div><div><span><Sparkles size={19} /></span><div><strong>Opportunities with purpose</strong><p>Explore roles with the details you need to make an informed next move.</p></div></div><div><span><UsersRound size={19} /></span><div><strong>Built around your progress</strong><p>Stay on top of every step from first application to offer.</p></div></div></div></div></section>
    <section className="cta-section"><div className="container cta-panel"><div><span className="eyebrow eyebrow-light">THE NEXT CHAPTER IS YOURS</span><h2>Ready to make your<br />next move?</h2><p>Your next opportunity is waiting to be found.</p></div><div className="cta-actions"><Link className="button button-white" to="/register">Create your free account <ArrowRight size={17} /></Link><Link className="cta-secondary" to="/jobs">Explore open roles</Link></div><div className="cta-decoration">JT</div></div></section>
  </main>
}

function ChartNoAxesCombinedIcon() {
  return <BriefcaseBusiness size={22} />
}

export function JobsPage() {
  const { jobs } = useApp()
  const [params, setParams] = useSearchParams()
  const [keyword, setKeyword] = useState(params.get('q') || '')
  const [location, setLocation] = useState(params.get('location') || '')
  const [type, setType] = useState('')
  const [mode, setMode] = useState('')
  const [experience, setExperience] = useState('')
  const [sort, setSort] = useState('newest')
  const [salary, setSalary] = useState('')
  const filtered = useMemo(() => {
    const q = keyword.toLowerCase().trim()
    const loc = location.toLowerCase().trim()
    return jobs.filter((job) => (!q || [job.title, job.company, ...(job.skills || [])].some((value) => (value || '').toLowerCase().includes(q)))
      && (!loc || (job.location || '').toLowerCase().includes(loc))
      && (!type || job.type === type) && (!mode || job.mode === mode)
      && (!experience || job.experience.toLowerCase().includes(experience))
      && (!salary || Number(job.salary?.match(/\d+(?:\.\d+)?/)?.[0] || 0) >= Number(salary)))
      .sort((a, b) => sort === 'newest' ? b.posted.localeCompare(a.posted) : a.title.localeCompare(b.title))
  }, [jobs, keyword, location, type, mode, experience, salary, sort])
  const clear = () => { setKeyword(''); setLocation(''); setType(''); setMode(''); setExperience(''); setSalary(''); setParams({}) }
  const search = (event) => { event.preventDefault(); const next = {}; if (keyword.trim()) next.q = keyword.trim(); if (location.trim()) next.location = location.trim(); setParams(next) }
  const cities = [...new Set(jobs.map((job) => job.location.split(',')[0].trim()).filter((city) => city !== 'Remote'))].sort()
  const jobTypes = [...new Set(jobs.map((job) => job.type).filter(Boolean))].sort()
  const workModes = [...new Set(jobs.map((job) => job.mode).filter(Boolean))].sort()
  const experienceLevels = [...new Set(jobs.map((job) => job.experience).filter(Boolean))].sort()
  return <main className="page-main"><div className="container"><div className="page-heading jobs-heading"><div><span className="eyebrow">OPPORTUNITIES ACROSS INDIA</span><h1>Find a job you’ll <span>love.</span></h1><p>Explore sample roles from well-known employers across cities and industries in India.</p></div><div className="jobs-heading-note">{jobs.length} sample listings</div></div>
    <form className="jobs-searchbar" onSubmit={search}><label><Search size={19} /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Job title, skill or company" /></label><span /><label><MapPin size={19} /><input list="india-city-options" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Any Indian city or remote" /></label><datalist id="india-city-options">{cities.map((city) => <option value={city} key={city} />)}<option value="Remote" /></datalist><button className="button button-primary">Search jobs</button></form>
    <div className="jobs-layout"><aside className="filter-panel"><div className="filter-heading"><h3>Filters</h3><button className="text-button" onClick={clear}>Clear all</button></div><FilterSelect label="Job type" value={type} onChange={setType} options={jobTypes} /><FilterSelect label="Work arrangement" value={mode} onChange={setMode} options={workModes} /><FilterSelect label="Experience" value={experience} onChange={setExperience} options={experienceLevels} /><div className="filter-group"><label className="filter-label" htmlFor="salary-filter">Minimum salary</label><select className="filter-select" id="salary-filter" value={salary} onChange={(event) => setSalary(event.target.value)}><option value="">Any salary</option><option value="10">₹10L+ per year</option><option value="15">₹15L+ per year</option><option value="20">₹20L+ per year</option><option value="25">₹25L+ per year</option></select></div><div className="filter-tip"><Sparkles size={17} /><strong>Sample listings</strong><p>These are demo listings for your project, not live employer vacancies.</p></div></aside>
    <section className="job-results"><div className="results-toolbar"><div><strong>{filtered.length} jobs</strong><span> matching your search</span></div><label className="sort-select">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Most recent</option><option value="title">Job title</option></select><ChevronDown size={14} /></label></div>{filtered.length ? <div className="results-list">{filtered.map((job) => <JobCard job={job} key={job.id} />)}</div> : <div className="empty-state"><div className="empty-icon"><Search size={25} /></div><h3>No matching roles just yet</h3><p>Try adjusting your filters or search terms to uncover more opportunities.</p><button className="button button-outline" onClick={clear}>Clear filters</button></div>}</section></div></div></main>
}

function FilterSelect({ label, value, onChange, options }) {
  return <div className="filter-group"><label className="filter-label" htmlFor={label}>{label}</label><select className="filter-select" id={label} value={value} onChange={(event) => onChange(event.target.value)}><option value="">All {label.toLowerCase()}s</option>{options.map((option) => <option value={option} key={option}>{option}</option>)}</select></div>
}

export function CompaniesPage() {
  const { jobs } = useApp()
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const cities = [...new Set(jobs.map((job) => job.location.split(',')[0].trim()).filter((value) => value !== 'Remote'))].sort()
  const companies = [...new Map(jobs.map((job) => [job.company, job])).values()]
    .filter((company) => (!query || company.company.toLowerCase().includes(query.toLowerCase()))
      && (!city || jobs.some((job) => job.company === company.company && job.location.toLowerCase().includes(city.toLowerCase()))))
    .sort((a, b) => a.company.localeCompare(b.company))
  return <main className="page-main"><div className="container">
    <div className="page-heading"><span className="eyebrow">EMPLOYERS ACROSS INDIA</span><h1>Explore <span>companies.</span></h1><p>Browse startups, growing businesses, and established employers represented in our sample directory.</p></div>
    <div className="company-directory-toolbar"><label className="table-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search any company" /></label><label className="company-city-filter"><MapPin size={17} /><select aria-label="Filter companies by city" value={city} onChange={(event) => setCity(event.target.value)}><option value="">All listed cities</option>{cities.map((name) => <option key={name}>{name}</option>)}</select></label><span className="company-directory-count">{companies.length} companies · sample directory</span></div>
    {companies.length ? <div className="companies-directory-grid">{companies.map((company) => { const openings = jobs.filter((job) => job.company === company.company); return <Link className="company-directory-card" to={`/jobs?q=${encodeURIComponent(company.company)}`} key={company.company}><div className="company-logo" style={{ '--logo-color': company.color }}>{company.logo}</div><div className="company-directory-info"><strong>{company.company}</strong><span>{[...new Set(openings.map((job) => job.location.split(',')[0].trim()))].slice(0, 3).join(' · ')}</span><small>{openings.length} sample role{openings.length === 1 ? '' : 's'}</small></div><ArrowUpRight size={17} /></Link> })}</div> : <div className="empty-state"><div className="empty-icon"><Building2 size={24} /></div><h3>No matching companies</h3><p>Try a different company name or clear the city filter.</p><button className="button button-outline" onClick={() => { setQuery(''); setCity('') }}>Clear filters</button></div>}
    <p className="directory-disclaimer">This is a locally stored demonstration directory, not a live list of every Indian employer or current vacancy. Search any listed company to see its sample roles.</p>
  </div></main>
}

export function JobDetailPage() {
  const { id } = useParams()
  const { jobs, user, applications, apply, toggleSaved, savedJobs } = useApp()
  const navigate = useNavigate()
  const [notice, setNotice] = useState('')
  const job = jobs.find((item) => item.id === id)
  if (!job) return <main className="page-main"><div className="container empty-state"><h2>We couldn’t find that job</h2><Link className="button button-primary" to="/jobs">Back to jobs</Link></div></main>
  const alreadyApplied = applications.some((item) => item.userEmail === user?.email && item.jobId === job.id)
  const isSaved = savedJobs.some((item) => item.userEmail === user?.email && item.jobId === job.id)
  const handleApply = () => {
    if (!user) { navigate('/login'); return }
    if (user.role === 'admin') { setNotice('Admin accounts cannot apply to candidate roles.'); return }
    const result = apply(job.id)
    setNotice(result.error || 'Your application has been added to My Applications.')
  }
  return <main className="page-main"><div className="container detail-container"><Link className="back-link" to="/jobs">← Back to jobs</Link>{notice && <div className="notice notice-info"><span>{notice}</span><button onClick={() => setNotice('')}><X size={15} /></button></div>}<div className="detail-layout"><div className="detail-main"><section className="detail-header"><CompanyLogo job={job} className="logo-large" /><div className="detail-title"><span className="eyebrow">{job.company}</span><h1>{job.title}</h1><div className="job-meta"><span><MapPin size={15} />{job.location}</span><span><BriefcaseBusiness size={15} />{job.experience}</span><span><Clock3 size={15} />Posted {job.posted}</span></div></div><button className={`icon-button detail-save ${isSaved ? 'is-saved' : ''}`} onClick={() => { if (!user) navigate('/login'); else toggleSaved(job.id) }} aria-label="Save job"><Bookmark size={19} fill={isSaved ? 'currentColor' : 'none'} /></button></section>
      <section className="detail-section"><h2>About the role</h2><p>{job.description}</p></section><section className="detail-section"><h2>What you’ll do</h2><ul className="check-list">{job.responsibilities?.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul></section><section className="detail-section"><h2>What you’ll bring</h2><ul className="check-list">{job.qualifications?.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul><div className="detail-skills">{job.skills?.map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}</div></section><section className="detail-section about-company"><h2>About {job.company}</h2><p>{job.about}</p></section></div>
      <aside className="detail-sidebar"><div className="apply-card"><span className="eyebrow">ROLE OVERVIEW</span><h2>{job.salary}</h2><p>Estimated annual salary</p><div className="overview-row"><BriefcaseBusiness size={17} /><div><small>Job type</small><strong>{job.type}</strong></div></div><div className="overview-row"><MapPin size={17} /><div><small>Work arrangement</small><strong>{job.mode}</strong></div></div><div className="overview-row"><Wallet size={17} /><div><small>Experience</small><strong>{job.experience}</strong></div></div><button className="button button-primary button-full" onClick={handleApply}>{alreadyApplied ? 'Application submitted' : 'Apply for this job'} <ArrowRight size={17} /></button>{alreadyApplied && <span className="applied-hint"><Check size={14} /> You’ve already applied</span>}<small className="apply-note">Your application is tracked privately in your dashboard.</small></div><div className="detail-safety"><ShieldCheck size={18} /><div><strong>Search with confidence</strong><p>JobTrack never charges candidates to apply.</p></div></div></aside></div></div></main>
}

export function LoginPage() {
  const { login, resetPassword } = useApp()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [forgot, setForgot] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })
  const [reset, setReset] = useState({ email: '', password: '' })
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => { event.preventDefault(); setError(''); const result = login(form.email, form.password); if (result.error) setError(result.error); else navigate(result.user.role === 'admin' ? '/admin' : '/dashboard') }
  const doReset = (event) => { event.preventDefault(); setError(''); const result = resetPassword(reset.email, reset.password); if (result.error) setError(result.error); else { setForgot(false); setMessage('Password updated. You can now sign in with your new password.') } }
  return <main className="auth-page"><div className="auth-card"><div className="auth-logo"><span className="brand-mark"><BriefcaseBusiness size={19} /></span></div><span className="eyebrow">{forgot ? 'ACCOUNT RECOVERY' : 'ACCOUNT ACCESS'}</span><h1>{forgot ? 'Reset your password' : 'Sign in to your account.'}</h1><p>{forgot ? 'Enter your email and choose a new password.' : 'Access your applications and saved roles.'}</p>{error && <div className="form-alert form-alert-error">{error}</div>}{message && <div className="form-alert form-alert-success">{message}</div>}
    {forgot ? <form className="form-stack" onSubmit={doReset}><FormField label="Email address" name="email" type="email" required value={reset.email} onChange={(event) => setReset({ ...reset, email: event.target.value })} placeholder="you@example.com" /><FormField label="New password" name="password" type="password" required minLength={8} value={reset.password} onChange={(event) => setReset({ ...reset, password: event.target.value })} placeholder="At least 8 characters" /><button className="button button-primary button-full">Update password <ArrowRight size={16} /></button><button type="button" className="auth-back" onClick={() => { setForgot(false); setError('') }}>Back to sign in</button></form>
      : <form className="form-stack" onSubmit={submit}><FormField label="Email address" name="email" type="email" required value={form.email} onChange={update} placeholder="you@example.com" /><label className="form-field"><span>Password</span><div className="password-wrap"><input name="password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={update} placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label><div className="form-options"><label><input type="checkbox" /> Remember me</label><button type="button" className="text-button" onClick={() => { setForgot(true); setError(''); setMessage('') }}>Forgot password?</button></div><button className="button button-primary button-full">Sign in <ArrowRight size={16} /></button><p className="auth-switch">New to JobTrack? <Link to="/register">Create an account</Link></p><div className="demo-credentials"><strong>Demo admin access</strong><span>admin@jobtrack.com · Admin123!</span></div></form>}
  </div></main>
}

export function RegisterPage() {
  const { register } = useApp()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => { event.preventDefault(); setError(''); if (form.password.length < 8) { setError('Your password must be at least 8 characters.'); return } if (form.password !== form.confirm) { setError('Your passwords don’t match.'); return } const result = register(form.name.trim(), form.email.trim(), form.password); if (result.error) setError(result.error); else navigate('/dashboard') }
  return <main className="auth-page"><div className="auth-card"><div className="auth-logo"><span className="brand-mark"><BriefcaseBusiness size={19} /></span></div><span className="eyebrow">MAKE YOUR NEXT MOVE</span><h1>Create your account.</h1><p>One place for your job search and every step forward.</p>{error && <div className="form-alert form-alert-error">{error}</div>}<form className="form-stack" onSubmit={submit}><FormField label="Full name" name="name" required value={form.name} onChange={update} placeholder="Your full name" minLength={2} /><FormField label="Email address" name="email" type="email" required value={form.email} onChange={update} placeholder="you@example.com" /><label className="form-field"><span>Password</span><div className="password-wrap"><input name="password" type={showPassword ? 'text' : 'password'} required minLength={8} value={form.password} onChange={update} placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label><FormField label="Confirm password" name="confirm" type={showPassword ? 'text' : 'password'} required value={form.confirm} onChange={update} placeholder="Enter your password again" /><label className="terms-check"><input type="checkbox" required /> I agree to the <Link to="/about">Terms of Use</Link> and privacy policy.</label><button className="button button-primary button-full">Create account <ArrowRight size={16} /></button><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></form></div></main>
}

export function FormField({ label, ...props }) {
  return <label className="form-field"><span>{label}</span><input {...props} /></label>
}

export function AboutPage() {
  return <main className="page-main"><div className="container about-page"><div className="about-hero"><span className="eyebrow">ABOUT JOBTRACK</span><h1>Your career deserves<br /><span>a little less chaos.</span></h1><p>JobTrack brings discovery, applications, and progress into one thoughtful place — giving you more space to focus on what comes next.</p><Link to="/jobs" className="button button-primary">Explore opportunities <ArrowRight size={17} /></Link></div><div className="about-metrics"><div><strong>One</strong><span>place for your search</span></div><div><strong>Every</strong><span>step, thoughtfully tracked</span></div><div><strong>Your</strong><span>next move, on your terms</span></div></div><section className="about-story"><div><span className="eyebrow">WHY WE’RE HERE</span><h2>Searching for work<br />should feel more <span>human.</span></h2></div><p>Finding the right role is more than matching a title to a résumé. It’s a journey of decisions, conversations, and possibility. JobTrack was designed to make that journey clearer — from the first search to the follow-up after an interview.<br /><br />We bring meaningful opportunities and practical organization together so candidates can spend less time managing tabs, and more time building a future that feels like theirs.</p></section><section className="about-features"><div className="center-heading"><span className="eyebrow">A PURPOSEFUL TOOLKIT</span><h2>Clarity at every <span>step.</span></h2></div><div className="about-feature-grid"><AboutFeature icon={<Search size={21} />} title="Discover" text="Find considered opportunities from teams and companies that fit your ambitions." /><AboutFeature icon={<BriefcaseBusiness size={21} />} title="Apply" text="Keep your profile ready and your applications organized in one private space." /><AboutFeature icon={<ChartNoAxesCombinedIcon />} title="Move forward" text="Follow your progress and stay present through every stage of your search." /></div></section><section className="about-mission-grid"><div className="mission-card"><span className="eyebrow eyebrow-light">OUR MISSION</span><h2>Make the next career move feel more considered.</h2><p>We bring meaningful opportunities and practical organization together in one candidate-first experience.</p></div><div className="mission-card mission-vision"><span className="eyebrow eyebrow-light">OUR VISION</span><h2>A world where every career journey has more clarity.</h2><p>We believe opportunity should be easier to find, and progress easier to see.</p></div></section></div></main>
}

function AboutFeature({ icon, title, text }) {
  return <article className="about-feature"><span className="how-icon">{icon}</span><h3>{title}</h3><p>{text}</p></article>
}

export function ContactPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => { event.preventDefault(); if (!form.name.trim() || !form.message.trim()) { setError('Please complete each field before submitting.'); return } setError(''); setSent(true); setForm({ name: '', email: '', subject: '', message: '' }) }
  return <main className="page-main"><div className="container contact-layout"><div className="contact-copy"><span className="eyebrow">WE’RE HERE TO HELP</span><h1>Let’s start a <span>conversation.</span></h1><p>Have a question, a thought, or just want to say hello? Send us a note and we’ll be in touch.</p><div className="contact-detail"><div className="contact-icon"><BriefcaseBusiness size={18} /></div><div><strong>General enquiries</strong><span>hello@jobtrack.example</span></div></div><div className="contact-detail"><div className="contact-icon"><Clock3 size={18} /></div><div><strong>Our response time</strong><span>Usually within one business day</span></div></div><div className="contact-note"><ShieldCheck size={18} /><p>Your message stays private and is used only to respond to your enquiry.</p></div></div><form className="contact-form" onSubmit={submit}><h2>Send us a message</h2><p>All fields are required unless noted otherwise.</p>{error && <div className="form-alert form-alert-error">{error}</div>}{sent && <div className="form-alert form-alert-success">Thanks for reaching out. Your message is ready for our team.</div>}<div className="contact-form-grid"><FormField label="Your name" name="name" required value={form.name} onChange={update} placeholder="Name" /><FormField label="Email address" name="email" type="email" required value={form.email} onChange={update} placeholder="you@example.com" /></div><FormField label="Subject" name="subject" required value={form.subject} onChange={update} placeholder="What can we help with?" /><label className="form-field"><span>Message</span><textarea name="message" rows="5" required minLength="10" value={form.message} onChange={update} placeholder="Tell us a little more..." /></label><button className="button button-primary">Send message <ArrowRight size={17} /></button></form></div></main>
}
