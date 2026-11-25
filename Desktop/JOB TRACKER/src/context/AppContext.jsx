import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { initialJobs } from '../data/jobs'
import { readStorage, writeStorage } from '../utils/storage'

const AppContext = createContext(null)
const ADMIN_USER = { id: 'admin', name: 'JobTrack Admin', email: 'admin@jobtrack.com', password: 'Admin123!', role: 'admin' }

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = readStorage('jt-users', [])
    return saved.some((user) => user.email === ADMIN_USER.email) ? saved : [...saved, ADMIN_USER]
  })
  const [jobs, setJobs] = useState(() => {
    const storedJobs = readStorage('jt-jobs', initialJobs)
    if (readStorage('jt-jobs-version', 0) >= 4) return storedJobs
    const sampleIds = new Set([...initialJobs.map((job) => job.id), ...Array.from({ length: 12 }, (_, index) => `job-${index + 1}`)])
    const customJobs = storedJobs.filter((job) => !sampleIds.has(job.id))
    return [...initialJobs, ...customJobs]
  })
  const [applications, setApplications] = useState(() => readStorage('jt-applications', []))
  const [savedJobs, setSavedJobs] = useState(() => readStorage('jt-saved-jobs', []))
  const [profiles, setProfiles] = useState(() => readStorage('jt-profiles', {}))
  const [sessionEmail, setSessionEmail] = useState(() => readStorage('jt-session', null))
  const user = users.find((item) => item.email === sessionEmail) || null

  useEffect(() => { writeStorage('jt-users', users) }, [users])
  useEffect(() => { writeStorage('jt-jobs', jobs) }, [jobs])
  useEffect(() => { writeStorage('jt-jobs-version', 4) }, [])
  useEffect(() => { writeStorage('jt-applications', applications) }, [applications])
  useEffect(() => { writeStorage('jt-saved-jobs', savedJobs) }, [savedJobs])
  useEffect(() => { writeStorage('jt-profiles', profiles) }, [profiles])
  useEffect(() => { writeStorage('jt-session', sessionEmail) }, [sessionEmail])

  const value = useMemo(() => ({
    users, jobs, applications, savedJobs, profiles, user,
    login(email, password) {
      const match = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password)
      if (!match) return { error: 'The email or password you entered is incorrect.' }
      setSessionEmail(match.email)
      return { user: match }
    },
    register(name, email, password) {
      if (users.some((item) => item.email.toLowerCase() === email.toLowerCase())) return { error: 'An account with this email already exists.' }
      const created = { id: crypto.randomUUID(), name, email, password, role: 'user' }
      setUsers((current) => [...current, created])
      setSessionEmail(created.email)
      return { user: created }
    },
    resetPassword(email, password) {
      const exists = users.some((item) => item.email.toLowerCase() === email.toLowerCase() && item.role !== 'admin')
      if (!exists) return { error: 'No candidate account was found with that email.' }
      setUsers((current) => current.map((item) => item.email.toLowerCase() === email.toLowerCase() ? { ...item, password } : item))
      return { success: true }
    },
    logout() { setSessionEmail(null) },
    toggleSaved(jobId) {
      if (!user) return
      setSavedJobs((current) => current.some((item) => item.userEmail === user.email && item.jobId === jobId)
        ? current.filter((item) => !(item.userEmail === user.email && item.jobId === jobId))
        : [...current, { id: crypto.randomUUID(), userEmail: user.email, jobId, savedAt: new Date().toISOString() }])
    },
    apply(jobId) {
      if (!user) return { error: 'Please log in to apply for a job.' }
      if (applications.some((item) => item.userEmail === user.email && item.jobId === jobId)) return { error: 'You have already applied for this job.' }
      const appliedAt = new Date().toISOString()
      const profile = profiles[user.email] || {}
      const entry = {
        id: crypto.randomUUID(),
        userEmail: user.email,
        jobId,
        status: 'Applied',
        appliedAt,
        candidateProfile: {
          name: profile.name || user.name,
          email: user.email,
          skills: profile.skills || '',
          qualifications: profile.qualifications || '',
          education: profile.education || '',
          experience: profile.experience || '',
        },
        history: [{ status: 'Applied', date: appliedAt }],
      }
      setApplications((current) => [...current, entry])
      return { application: entry }
    },
    updateStatus(id, status) {
      setApplications((current) => current.map((item) => item.id === id
        ? item.status === status ? item : { ...item, status, history: [...(item.history || []), { status, date: new Date().toISOString() }] }
        : item))
    },
    removeApplication(id) { setApplications((current) => current.filter((item) => item.id !== id)) },
    updateApplication(id, changes) { setApplications((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item)) },
    saveProfile(profile) {
      if (!user) return
      setProfiles((current) => ({ ...current, [user.email]: { ...current[user.email], ...profile } }))
      setUsers((current) => current.map((item) => item.email === user.email ? { ...item, name: profile.name || item.name } : item))
    },
    addJob(job) { setJobs((current) => [{ ...job, id: crypto.randomUUID() }, ...current]) },
    updateJob(id, job) { setJobs((current) => current.map((item) => item.id === id ? { ...item, ...job } : item)) },
    deleteJob(id) { setJobs((current) => current.filter((item) => item.id !== id)) },
  }), [users, jobs, applications, savedJobs, profiles, user])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
