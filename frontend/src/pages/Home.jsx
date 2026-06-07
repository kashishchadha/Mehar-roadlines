import { Link } from 'react-router-dom'

const trustBadges = [
  { icon: 'inventory', label: '500+ TRUCKS' },
  { icon: 'history_edu', label: '15+ YEARS EXPERIENCE' },
  { icon: 'map', label: 'PAN-INDIA COVERAGE' },
  { icon: 'support_agent', label: '24/7 SUPPORT' },
]

const steps = [
  { num: '1', title: 'Book a Load', desc: 'Simple digital booking or a single call to our operations center.' },
  { num: '2', title: 'We Dispatch', desc: 'Vetted drivers and well-maintained machinery assigned to your cargo.' },
  { num: '3', title: 'Track & Deliver', desc: 'Real-time monitoring until the safe arrival of your goods.' },
]

const features = [
  { icon: 'schedule', title: 'On-Time Delivery', desc: 'Precise scheduling and buffer management ensure your cargo arrives exactly when needed.' },
  { icon: 'gps_fixed', title: 'Real-Time GPS', desc: 'Live tracking systems integrated across our fleet for 100% transparency.' },
  { icon: 'person_pin', title: 'Experienced Drivers', desc: 'Our drivers are industry veterans with impeccable safety records and highway knowledge.' },
  { icon: 'headset_mic', title: '24/7 Support', desc: 'A dedicated support team always ready to answer your queries, day or night.' },
]

const testimonials = [
  {
    quote: "Mehar Roadlines has been our primary logistics partner for 5 years. Their reliability on the Delhi-Mumbai corridor is unmatched.",
    name: 'Rajesh Khanna', initials: 'RK', company: 'Indus Steels',
  },
  {
    quote: "What sets them apart is the communication. I never have to call to ask where my truck is. The GPS tracking is flawless.",
    name: 'Amit Sharma', initials: 'AS', company: 'Green Logistics India',
  },
  {
    quote: "Handling sensitive electronics across rural routes is tough, but Mehar's drivers are careful and professional every time.",
    name: 'Priya Nair', initials: 'PN', company: 'TechFlow Solutions',
  },
]

const offices = [
  { city: 'Mumbai Hub', address: '102, Logistics Tower, JNPT Road, Navi Mumbai, Maharashtra - 400701', phone: '+91 22 4567 8900' },
  { city: 'Delhi Hub', address: 'Plot 45, Sanjay Gandhi Transport Nagar, New Delhi - 110042', phone: '+91 11 2345 6789' },
  { city: 'Ahmedabad Hub', address: 'Shop 12, Transport Nagar, Aslali, Ahmedabad, Gujarat - 382427', phone: '+91 79 9876 5432' },
  { city: 'Bangalore Hub', address: '2nd Phase, Peenya Industrial Area, Bangalore, Karnataka - 560058', phone: '+91 80 5544 3322' },
]

function Home({ onQuoteClick }) {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJKEVKXKj0h-Eeegj1zsmdLpL9Nsj2kMB-yM-8tTeW-9tEueUVaeFziSf3rgedy9Mbtihl-Pg_y2j8B2wyqrI539fAro90olTXoyvJDOiWqsHzQyYoxqQPkXLyectmWhjDAhZSGqAEMd8ILnZmLeuWYBzHYD7MBbxPq2uA71lwx0NA8UvgraC0WZfX80QIi-27UR3rNp5eQQr16LBpPuPQb5KCdQNTfwjrgkoqoWw4WozVy2oXpnLECHH3gnAqcOyopNi49J_dKYMJ"
            alt="Heavy-duty truck driving on an Indian highway during golden hour"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] w-full">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-[56px] font-extrabold mb-6 leading-tight tracking-tight">
              Delivering Trust. <br />Mile After Mile.
            </h1>
            <p className="text-lg md:text-xl mb-10 opacity-90 text-surface-low max-w-xl leading-relaxed">
              Pan-India freight, trucking &amp; logistics — built on reliability and years of highway experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/track"
                className="bg-secondary text-on-secondary px-8 h-[52px] font-bold text-lg inline-flex items-center hover:brightness-110 active:scale-95 transition-all shadow-xl rounded"
              >
                Track Your Shipment
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white/50 text-white px-8 h-[52px] font-bold text-lg inline-flex items-center hover:bg-white hover:text-primary transition-all active:scale-95 rounded backdrop-blur-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badge Strip */}
      <section className="bg-primary py-8 border-y border-white/10">
        <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)]">
          <div className="flex flex-wrap justify-between items-center gap-6 text-surface-low font-semibold text-[15px] tracking-wider">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-3">
                {i > 0 && <div className="hidden md:block h-6 w-px bg-white/20 -ml-3 mr-3" />}
                <span className="material-symbols-outlined text-secondary">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] text-center">
          <h2 className="text-3xl md:text-[40px] font-bold text-primary mb-6 leading-tight">Simple. Reliable. On Time.</h2>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="hidden md:block absolute top-12 left-[16.6%] right-[16.6%] h-[2px] bg-slate-200 z-0" />
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center group">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-8 border-2 border-primary group-hover:border-secondary transition-colors duration-300 shadow-sm relative z-10">
                  <span className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">{step.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">{step.title}</h3>
                <p className="text-on-surface-muted max-w-[280px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-surface-low">
        <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)]">
          <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="text-3xl md:text-[40px] font-bold text-primary leading-tight">Why Partners Choose Mehar</h2>
              <div className="h-1.5 w-24 bg-secondary mt-4" />
            </div>
            <p className="max-w-md text-on-surface-muted border-l-4 border-outline-light pl-6">
              Built on the principles of grit and transparency, we treat every shipment like it's our own.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => (
              <div key={feat.title} className="bg-white p-8 border border-outline-light rounded shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-surface-low rounded flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-secondary text-4xl">{feat.icon}</span>
                </div>
                <h4 className="text-xl font-semibold text-primary mb-4">{feat.title}</h4>
                <p className="text-on-surface-muted">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Banner */}
      <section className="h-[450px] relative">
        <img
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWrjjqTaMbpMlM8Ek22mLUxhgVCT1_elFZyg4CTO2o3AyLxa6VDi5Y-UuCPpoxmsX-L7524VakxFS9hQ2-8hbBicWvn_g_mIYNJhFdXO__NF6gI-F8q3Q6KTgbPORUzpV7t-iFx5rVHeLJUJNQuRdmtIsz_M5KO0cT16MTWKlN65xdzRWTR-4xdZD5OTt-v4VEUPpZk6kdXEPvRe_g9jF6Lu8tZ7X-Hcs7T0UNiPcovxuYZYn_4nycPGBOCvNeJ0Lpgq4kA_qwaZ2k"
          alt="Busy logistics loading dock with workers coordinating cargo onto trucks"
        />
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)]">
          <h2 className="text-3xl md:text-[40px] font-bold text-primary text-center mb-20 leading-tight">Trusted by Businesses Across India</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((t) => (
              <div key={t.initials} className="bg-surface-low p-10 rounded-xl relative shadow-sm border border-outline-light/30">
                <span className="material-symbols-outlined text-secondary absolute -top-4 left-8 text-6xl opacity-50">format_quote</span>
                <p className="text-lg text-on-surface mb-8 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">{t.initials}</div>
                  <div>
                    <p className="text-primary font-bold">{t.name}</p>
                    <p className="text-on-surface-muted text-sm font-medium">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-secondary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 text-on-secondary">
            <div className="text-center lg:text-left max-w-2xl">
              <h2 className="text-3xl md:text-[40px] font-bold mb-4 text-primary leading-tight">Ready to Move Your Cargo?</h2>
              <p className="text-lg text-primary/80">Get a competitive quote or talk to an expert today for a seamless freight experience.</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={onQuoteClick}
                className="bg-primary text-on-primary px-10 h-[60px] font-bold text-lg inline-flex items-center hover:bg-primary-light transition-all active:scale-95 rounded shadow-lg cursor-pointer"
              >
                Get a Quote
              </button>
              <a
                href="tel:+919996761999"
                className="border-2 border-primary text-primary px-10 h-[60px] font-bold text-lg inline-flex items-center hover:bg-primary hover:text-on-primary transition-all active:scale-95 rounded"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Offices */}
      <section className="py-24 bg-surface-low">
        <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)]">
          <div className="mb-16">
            <h2 className="text-3xl md:text-[40px] font-bold text-primary leading-tight">Our Offices</h2>
            <div className="h-1.5 w-24 bg-secondary mt-4" />
            <p className="mt-6 text-on-surface-muted">Strategically located hubs to serve your logistics needs across the subcontinent.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office) => (
              <div key={office.city} className="bg-white p-8 border border-outline-light rounded shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-secondary text-2xl">location_on</span>
                  <h4 className="text-xl font-semibold text-primary">{office.city}</h4>
                </div>
                <div className="space-y-4 mb-8">
                  <p className="text-on-surface-muted">{office.address}</p>
                  <div className="flex items-center gap-2 text-on-surface-muted">
                    <span className="material-symbols-outlined text-sm">phone</span>
                    <span>{office.phone}</span>
                  </div>
                </div>
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Mehar Roadlines ' + office.city + ' ' + office.address)}`, '_blank')}
                  className="w-full border-2 border-primary text-primary py-2 rounded font-bold text-sm hover:bg-primary hover:text-on-primary transition-all active:scale-95 cursor-pointer"
                >
                  VIEW ON MAP
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
