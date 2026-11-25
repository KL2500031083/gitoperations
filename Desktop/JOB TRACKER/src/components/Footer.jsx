import { Link } from 'react-router-dom'
import { BriefcaseBusiness, ArrowRight, Linkedin, Github, Twitter } from 'lucide-react'

export default function Footer() {
  return <footer className="site-footer"><div className="container footer-main">
    <div className="footer-brand"><Link className="brand brand-light" to="/"><span className="brand-mark"><BriefcaseBusiness size={19} /></span><span>jobtrack<span className="brand-period">.</span></span></Link><p>Your next opportunity is closer than you think. Make every move count.</p><div className="social-links"><a href="https://linkedin.com" aria-label="LinkedIn"><Linkedin size={17} /></a><a href="https://github.com" aria-label="GitHub"><Github size={17} /></a><a href="https://x.com" aria-label="X"><Twitter size={17} /></a></div></div>
    <div className="footer-column"><h4>Explore</h4><Link to="/jobs">Browse jobs</Link><Link to="/companies">Companies</Link><Link to="/about">About us</Link><Link to="/contact">Contact</Link></div>
    <div className="footer-column"><h4>For candidates</h4><Link to="/register">Create an account</Link><Link to="/login">Sign in</Link><Link to="/dashboard">Application tracker</Link></div>
    <div className="footer-newsletter"><h4>Make your next move</h4><p>Discover opportunities that match your ambitions.</p><Link className="footer-cta" to="/jobs">Explore open roles <ArrowRight size={16} /></Link></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} JobTrack. Built for your next chapter.</span><span>Made to move careers forward.</span></div></footer>
}
