import { useState } from 'react'

const contactInfo = [
  {
    icon: 'phone_android',
    label: 'Phone',
    value: '+91 99967 61999',
    href: 'tel:+919996761999',
    sub: 'Toll-free across India',
  },
  {
    icon: 'mail',
    label: 'Email',
    value: 'contact@meharroadlines.com',
    href: 'mailto:contact@meharroadlines.com',
    sub: 'Support within 24 hours',
  },
  {
    icon: 'location_on',
    label: 'Address',
    value: '12/B, Transport Nagar, Phase III, Ludhiana, Punjab 141003',
  },
  {
    icon: 'schedule',
    label: 'Business Hours',
    value: 'Mon - Sat: 08:00 AM - 10:00 PM',
    sub: 'Sun: 09:00 AM - 02:00 PM',
  },
]

const quickActions = [
  { icon: 'call', label: 'Call Now', href: 'tel:+919996761999' },
  { icon: 'chat', label: 'WhatsApp Us', href: 'https://wa.me/919996761999' },
  { icon: 'directions', label: 'Get Directions', href: 'https://maps.google.com/?q=Mehar+Roadlines+Ludhiana' },
]

function Contact() {
  const [formData, setFormData] = useState({
    name: '', phone: '', origin: '', destination: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to submit inquiry')
      }

      setSubmitted(true)
      setFormData({ name: '', phone: '', origin: '', destination: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-primary py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] relative z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-[48px] font-extrabold mb-6 leading-tight tracking-tight">
              Let's Move Something Together.
            </h1>
            <p className="text-lg md:text-xl opacity-90 leading-relaxed">
              Reach out for quotes, queries, or support. Our fleet and logistics experts are standing by to power your supply chain.
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none hidden md:flex items-center justify-end pr-12">
          <span className="material-symbols-outlined text-secondary text-[280px] rotate-12">conveyor_belt</span>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white border-b border-outline-light">
        <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target={action.href.startsWith('https') ? '_blank' : undefined}
                rel={action.href.startsWith('https') ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-center gap-4 py-6 px-8 bg-surface-low border border-outline-light hover:border-secondary transition-all duration-300 group"
              >
                <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">{action.icon}</span>
                <span className="font-bold text-primary">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column */}
          <div className="lg:w-5/12 space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8 border-l-4 border-secondary pl-4">Contact Information</h2>
              <ul className="space-y-8">
                {contactInfo.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <div className="bg-primary p-3 rounded">
                      <span className="material-symbols-outlined text-secondary">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wider text-on-surface-muted mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-lg font-bold text-primary hover:text-secondary transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-lg font-bold text-primary">{item.value}</p>
                      )}
                      {item.sub && <p className="text-on-surface-muted text-sm">{item.sub}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-64 w-full bg-surface-high rounded overflow-hidden border border-outline-light relative">
              <iframe
                title="Mehar Roadlines Ludhiana Office Map"
                className="w-full h-full border-none grayscale brightness-95"
                src="https://maps.google.com/maps?q=12/B,+Transport+Nagar,+Phase+III,+Ludhiana,+Punjab+141003&t=m&z=16&iwloc=A&output=embed"
                allowFullScreen
                loading="lazy"
              />
              <div className="absolute inset-0 border-4 border-primary/10 pointer-events-none" />
            </div>
          </div>

          {/* Right Column — Form */}
          <div className="lg:w-7/12">
            <div className="bg-white p-8 md:p-12 border border-outline-light shadow-sm rounded">
              <h3 className="text-2xl font-semibold text-primary mb-8">Send a Message</h3>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="material-symbols-outlined text-secondary text-6xl mb-4">check_circle</span>
                  <h4 className="text-xl font-bold text-primary mb-2">Message Sent!</h4>
                  <p className="text-on-surface-muted">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold block text-on-surface-muted">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        required
                        className="w-full h-12 border border-outline-light bg-surface-low p-4 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all placeholder:text-outline rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold block text-on-surface-muted">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 00000 00000"
                        required
                        className="w-full h-12 border border-outline-light bg-surface-low p-4 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all placeholder:text-outline rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold block text-on-surface-muted">Origin City</label>
                      <input
                        type="text"
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        placeholder="City of departure"
                        className="w-full h-12 border border-outline-light bg-surface-low p-4 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all placeholder:text-outline rounded"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold block text-on-surface-muted">Destination City</label>
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder="Arrival city"
                        className="w-full h-12 border border-outline-light bg-surface-low p-4 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all placeholder:text-outline rounded"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold block text-on-surface-muted">Your Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your cargo or specific requirements..."
                      rows="5"
                      className="w-full border border-outline-light bg-surface-low p-4 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all placeholder:text-outline rounded"
                    />
                  </div>
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-3">
                      <span className="material-symbols-outlined">error</span>
                      <span className="font-semibold">{error}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-12 h-12 bg-secondary text-white font-bold hover:bg-secondary-dark active:scale-95 transition-all flex items-center justify-center gap-2 rounded disabled:opacity-70"
                  >
                    {loading ? 'Sending...' : 'Send Inquiry'}
                    <span className="material-symbols-outlined animate-in">{loading ? 'sync' : 'send'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] mb-24">
        <div className="bg-primary text-white p-12 rounded flex flex-col md:flex-row items-center justify-between gap-8 border-b-[6px] border-secondary">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-semibold mb-2">Partner with India's best fleet.</h3>
            <p className="opacity-80">Looking for dedicated fleet solutions for your business?</p>
          </div>
          <button className="bg-secondary text-white px-8 h-12 font-bold hover:bg-secondary-dark transition-colors rounded">
            Carrier Portal
          </button>
        </div>
      </section>
    </main>
  )
}

export default Contact
