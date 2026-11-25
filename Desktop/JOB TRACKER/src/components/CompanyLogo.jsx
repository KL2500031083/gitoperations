import { useState } from 'react'

export default function CompanyLogo({ job, className = '' }) {
  const [imageFailed, setImageFailed] = useState(false)
  return (
    <div className={`company-logo ${className}`} style={{ '--logo-color': job.color || '#2563eb' }}>
      {job.logoUrl && !imageFailed
        ? <img src={job.logoUrl} alt={`${job.company} logo`} onError={() => setImageFailed(true)} />
        : job.logo || job.company?.[0] || '?'}
    </div>
  )
}
