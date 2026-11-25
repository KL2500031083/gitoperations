import { Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import { AboutPage, CompaniesPage, ContactPage, HomePage, JobDetailPage, JobsPage, LoginPage, RegisterPage } from './pages/PublicPages'
import { ApplicationsPage, ProfilePage, SavedJobsPage, UserOverview, UserSettingsPage } from './pages/UserPages'
import { AdminApplicationsPage, AdminJobFormPage, AdminJobsPage, AdminOverview, AdminSettingsPage, AdminUsersPage } from './pages/AdminPages'

function PublicLayout() {
  return <><Navbar /><Outlet /><Footer /></>
}

function NotFound() {
  return <main className="page-main"><div className="container empty-state"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>This page took a wrong turn.</h1><p>Let’s get you back to finding your next opportunity.</p><a className="button button-primary" href="/">Back to JobTrack</a></div></main>
}

export default function App() {
  return <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>
    <Route element={<ProtectedRoute role="user" />}>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<UserOverview />} />
        <Route path="saved" element={<SavedJobsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<UserSettingsPage />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute role="admin" />}>
      <Route path="/admin" element={<DashboardLayout admin />}>
        <Route index element={<AdminOverview />} />
        <Route path="jobs" element={<AdminJobsPage />} />
        <Route path="jobs/new" element={<AdminJobFormPage />} />
        <Route path="jobs/:id/edit" element={<AdminJobFormPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="applications" element={<AdminApplicationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
}
