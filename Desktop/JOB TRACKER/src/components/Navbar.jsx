import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, Menu, X, UserRound, LogOut, LayoutDashboard } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard'
  const signOut = () => { logout(); setOpen(false); navigate('/') }
  const nav = <><NavLink to="/">Home</NavLink><NavLink to="/jobs">Find jobs</NavLink><NavLink to="/companies">Companies</NavLink><NavLink to="/about">About</NavLink></>
  return (
    <header className="site-header">
      <div className="container navbar">
        <Link className="brand" to="/"><span className="brand-mark"><BriefcaseBusiness size={19} /></span><span>jobtrack<span className="brand-period">.</span></span></Link>
        <nav className={`nav-links ${open ? 'nav-open' : ''}`}>{nav}<div className="mobile-nav-actions">{user ? <Link className="button button-primary" to={dashboardPath} onClick={() => setOpen(false)}>Dashboard</Link> : <><Link className="button button-outline" to="/login" onClick={() => setOpen(false)}>Log in</Link><Link className="button button-primary" to="/register" onClick={() => setOpen(false)}>Get started</Link></>}</div></nav>
        <div className="nav-actions">{user ? <><Link className="nav-user" to={dashboardPath}><UserRound size={17} />{user.name.split(' ')[0]}</Link><Link className="button button-outline button-small" to={dashboardPath}><LayoutDashboard size={15} /> Dashboard</Link><button className="icon-button" onClick={signOut} title="Log out"><LogOut size={17} /></button></> : <><Link className="nav-login" to="/login">Log in</Link><Link className="button button-primary button-small" to="/register">Create account</Link></>}</div>
        <button className="mobile-menu icon-button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">{open ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </header>
  )
}
