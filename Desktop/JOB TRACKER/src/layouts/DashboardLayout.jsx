import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Bookmark, BriefcaseBusiness, ChartNoAxesCombined, CircleHelp, LayoutDashboard, LogOut, Settings, Users, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function DashboardLayout({ admin = false }) {
  const { user, logout } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const links = admin
    ? [{ to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true }, { to: '/admin/jobs', label: 'Manage jobs', icon: BriefcaseBusiness }, { to: '/admin/jobs/new', label: 'Add a job', icon: Bookmark }, { to: '/admin/users', label: 'Users', icon: Users }, { to: '/admin/applications', label: 'Applications', icon: ChartNoAxesCombined }, { to: '/admin/settings', label: 'Settings', icon: Settings }]
    : [{ to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true }, { to: '/jobs', label: 'Browse jobs', icon: BriefcaseBusiness }, { to: '/dashboard/saved', label: 'Saved jobs', icon: Bookmark }, { to: '/dashboard/applications', label: 'My applications', icon: ChartNoAxesCombined }, { to: '/dashboard/profile', label: 'My profile', icon: UserRound }, { to: '/dashboard/settings', label: 'Settings', icon: Settings }]
  const leave = () => { logout(); navigate('/') }
  return <div className="workspace">
    {mobileOpen && <button className="sidebar-backdrop" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
    <aside className={`workspace-sidebar ${mobileOpen ? 'sidebar-visible' : ''}`}>
      <div className="sidebar-brand-row"><a className="brand" href={admin ? '/admin' : '/dashboard'}><span className="brand-mark"><BriefcaseBusiness size={19} /></span><span>jobtrack<span className="brand-period">.</span></span></a><button className="icon-button sidebar-close" onClick={() => setMobileOpen(false)}><X size={19} /></button></div>
      <div className="sidebar-section-label">{admin ? 'ADMIN WORKSPACE' : 'CANDIDATE SPACE'}</div>
      <nav className="sidebar-nav">{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}><Icon size={18} /><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-help"><div className="help-icon"><CircleHelp size={18} /></div><strong>Need a hand?</strong><p>We’re here to help you make your next move.</p><a href="mailto:hello@jobtrack.example">Contact support</a></div>
      <button className="sidebar-logout" onClick={leave}><LogOut size={17} /> Log out</button>
      <div className="sidebar-profile"><div className="avatar">{(user?.name || 'U').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div><strong>{user?.name}</strong><span>{admin ? 'Administrator' : 'Candidate'}</span></div></div>
    </aside>
    <main className="workspace-main"><header className="workspace-topbar"><button className="icon-button workspace-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><span className="menu-lines">☰</span></button><span className="workspace-breadcrumb">{admin ? 'Admin workspace' : 'Candidate workspace'}</span><span className="topbar-spacer" /><div className="avatar avatar-small">{(user?.name || 'U')[0].toUpperCase()}</div></header><div className="workspace-content"><Outlet /></div></main>
  </div>
}
