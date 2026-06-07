import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="w-full bg-primary">
      <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] py-16 grid grid-cols-1 md:grid-cols-4 gap-12 text-surface-low">
        <div className="col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6 group">
            <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">local_shipping</span>
            <span className="font-extrabold text-xl text-white">Mehar Roadlines</span>
          </Link>
          <p className="text-surface-highest/80 text-[15px] leading-relaxed mb-8">
            Pioneering reliable logistics across the heart of India. Built on grit, integrity, and performance since 2009.
          </p>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-surface-highest/30 flex items-center justify-center text-surface-highest hover:text-secondary hover:border-secondary transition-colors" aria-label="Facebook">
              <span className="material-symbols-outlined text-[20px]">public</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-surface-highest/30 flex items-center justify-center text-surface-highest hover:text-secondary hover:border-secondary transition-colors" aria-label="LinkedIn">
              <span className="material-symbols-outlined text-[20px]">group</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-secondary font-bold text-sm uppercase tracking-[0.15em] mb-8">Navigation</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="text-surface-highest/80 text-[15px] hover:text-secondary transition-colors">Home</Link></li>
            <li><Link to="/track" className="text-surface-highest/80 text-[15px] hover:text-secondary transition-colors">Track Shipment</Link></li>
            <li><Link to="/about" className="text-surface-highest/80 text-[15px] hover:text-secondary transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-surface-highest/80 text-[15px] hover:text-secondary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-secondary font-bold text-sm uppercase tracking-[0.15em] mb-8">Resources</h4>
          <ul className="space-y-4">
            <li><Link to="/about" className="text-surface-highest/80 text-[15px] hover:text-secondary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/about" className="text-surface-highest/80 text-[15px] hover:text-secondary transition-colors">Terms of Service</Link></li>
            <li><Link to="/admin/login" className="text-surface-highest/80 text-[15px] hover:text-secondary transition-colors">Carrier Network</Link></li>
            <li><Link to="/admin/login" className="text-surface-highest/80 text-[15px] hover:text-secondary transition-colors">Driver Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-secondary font-bold text-sm uppercase tracking-[0.15em] mb-8">Contact</h4>
          <address className="not-italic space-y-6 text-[15px]">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-secondary mt-0.5">location_on</span>
              <span className="text-surface-highest/80">Plot 42, Transport Nagar, New Delhi, India 110001</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-secondary">call</span>
              <a href="tel:+919996761999" className="text-surface-highest/80 hover:text-secondary transition-colors">+91 99967 61999</a>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-secondary">mail</span>
              <a href="mailto:ops@meharroadlines.com" className="text-surface-highest/80 hover:text-secondary transition-colors">ops@meharroadlines.com</a>
            </div>
          </address>
        </div>
      </div>

      <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] py-8 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-surface-highest/40 text-sm">© {new Date().getFullYear()} Mehar Roadlines. All rights reserved.</p>
        <div className="flex gap-8 text-surface-highest/40 text-sm">
          <a href="#" className="hover:text-secondary transition-colors">Safety</a>
          <a href="#" className="hover:text-secondary transition-colors">Sustainability</a>
          <a href="#" className="hover:text-secondary transition-colors">Compliance</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
