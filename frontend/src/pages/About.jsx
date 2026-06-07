import { Link } from 'react-router-dom'

const stats = [
  { value: '500+', label: 'Trucks in Fleet' },
  { value: '15+', label: 'Years Experience' },
  { value: '28', label: 'States Covered' },
  { value: '10k+', label: 'Annual Deliveries' },
]

const values = [
  {
    icon: 'verified_user',
    title: 'Honesty',
    desc: "We believe in transparent pricing and clear communication. If there's a delay on the road, you'll know before we do.",
  },
  {
    icon: 'handshake',
    title: 'Reliability',
    desc: 'Our maintenance schedules are rigorous and our drivers are seasoned professionals. We show up when we say we will.',
  },
  {
    icon: 'volunteer_activism',
    title: 'Care',
    desc: 'From fragile freight to enterprise machinery, we handle every load with the respect and attention it deserves.',
  },
]

const galleryImages = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm1X-A79WQ9k2WCunLGIhL1dDsNQJN7LRiPa1poLLHUJ5mIgRF8gQconDKRQXKuK9-2PUHpw03x2NWomtd_KmkX1Mw6jOZiMjL2lAwHH4YjvhrYU2bgGef0FLTQv8RpOI579dCjaHp_X1q7LMejjZJip4gdfRYE45R-E2MEiXyN82WuopDEiK3K8qS3_p1Ym5sLB3TDC8OCKVo5RcBZXzXOn4O8WGvD83R1X4TF1axWA4b6CdKnIa0kJVFoC8skWyDJQQw0S_2NAZz',
    alt: 'Truck on Mountain Road',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB30l2jugmaged759pVAT0qT2mJCC1fOfL0cRi-axTb--XN3uuqRr_OwiGUqGe2iabfjvv25RBPiMJggkMaBnCaj4BOJ1vcfl3rbAC-IgqQfx4P6R-OEF2PEPCqrJPrW-JHKlHFkTfS6rrXjypowfhqZBb14Gxr3tf3m4J8X8crP3Pqf-Upj1bbC6tW-0MRcdYl5VSt6vl2ouAhZBTdJ7qfR6D8qKEKkwsBy7NZWRKsURZs_kgH2yJnU7XOMcU_N3dT9AHHqc_upNkM',
    alt: 'Loading Dock Operations',
    span: 'md:col-span-2 md:row-span-1',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7_UwlgcjR-6a-25UxjnQ9UpTPci2MYUQ8M_po3wR_wo40JbbOXh2ioiqgBI7L1eRAtvkf5CitlM3RL6-wBOFegIfYEeDlQ6NawdWTOYdaavWQkWNkIyz-_F7Z2d22Yrbs8CJXScQQhRQb1tHpOQ0EaSsFxi8vKZLEwTb4bLENwqNDExLEvNGB0lwPajlWrHs7wvh6vjGfKVdegueBPoubAsk11O5I0IAFBC4Qe7ONjH7a4G8SQf9k6fX3zVZuPNCG87KG1u81nyME',
    alt: 'Professional Driver',
    span: '',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT76t7nvbnMv03YDWH1-SF84NVV8YmsSyDAkynoJnTQKbzDwSwqPIz6A9UDb4Bek-mh86AWiliE4wHaXXikKCqZhjlr_GxD1-QwVsXKlJiK81eORUyuuU4DSx-3GrAQBz3bBUw2NqCXx9XjGoFAk3VYAg2bjC45iqdsDLAYF7L9bIENuRfivx_78A_7TABWCcSRJ4MAfnAHkbVyoDyvMTJXI3IfiWCXwmYPU4F1WIQay2UlxwUNV5QIizN4YMVRvMopZe5LkvmXa7V',
    alt: 'Maintenance Hub',
    span: '',
  },
]

function About({ onQuoteClick }) {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[614px] min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/60 z-10 mix-blend-multiply" />
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPa8U-2Vbuyec3acDgKZLvuk0PaNQ7NgkOgAUi3MOJ38BE_Lr2GvZlysm7QdB7dZi-SrPGLTJWEJP0D1sFGFEWEdmPe6h3MNbKyTtvrbciww1OAIeaVJhZnbI5VAs3TtWApJl8wQwSGr-OqU-yscbdOn7LGDE2DsSG7glpWAbuIa-cTz_qdg06A5GgQBm7asXxB9lV6d1syYmDRj2rLGxstp3G1g6e4GVj_fuweeMx7SrYs-WWjebRvImDISBQ4fqP6wXI-8LoSuok"
          alt="Mehar Roadlines fleet at sunrise on the highway"
        />
        <div className="relative z-20 max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] w-full">
          <div className="max-w-2xl">
            <h1 className="text-surface text-5xl md:text-[56px] font-bold leading-tight tracking-tight font-serif">
              Built on Roads.<br />Built on Trust.
            </h1>
            <div className="w-24 h-1.5 bg-secondary mt-4 mb-6" />
            <p className="text-surface-high text-lg md:text-xl max-w-lg opacity-90 leading-relaxed">
              Over fifteen years of grit, reliability, and precision across every kilometer of the Indian landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-secondary/10 -z-10 rounded" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-secondary -z-10" />
            <img
              className="w-full aspect-[4/5] object-cover rounded shadow-xl grayscale-[20%] hover:grayscale-0 transition-all duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCau_blc7QteNCycocPalcYI59uwrlNJWcu2zoTV54rXs_nGUaYkQ9cLPmmp6TXR12bYcL4bbwO2j1v9DK1nJhW6-JTM-XG7TV8YvrsRLsWEnVEZdyXeYeK_STdXwX55qHkAadXyk2WdO9K51rVXOnlYSaQZg43WHbm2EoJ9bCz4MQ7Edj5Ol7HZzn59eJkZwMyiFV_uacNWOMDSNg_gCSjKk_9Bo9XD8rNS3BsrF0gFWIZ9x0wduFF5MapIZHXaTwma1PQ7V5UXfN2"
              alt="Founder of Mehar Roadlines"
            />
          </div>
          <div className="space-y-6">
            <span className="text-secondary font-semibold text-[15px] uppercase tracking-[0.2em]">Our Legacy</span>
            <h2 className="text-3xl md:text-[40px] font-bold text-primary leading-tight font-serif">The Promise Behind the Wheel</h2>
            <p className="text-on-surface-muted leading-relaxed">
              Mehar Roadlines started with one truck and one promise: to move goods with the same care as if they were our own. What began as a local operation in the heart of the logistics corridor has grown into a nationwide network, but the founding principles remain unchanged.
            </p>
            <p className="text-on-surface-muted leading-relaxed">
              We don't just see cargo; we see the livelihoods of our partners and the needs of enterprise managers who depend on precision. Our journey is etched into every highway and bypass across 28 states, driven by a team that values human connection over corporate abstraction.
            </p>
            <div className="pt-4">
              <Link
                to="/contact"
                className="bg-primary text-white font-bold px-8 py-4 rounded hover:bg-primary-light hover:shadow-lg transition-all inline-flex items-center gap-3"
              >
                Meet Our Leadership
                <span className="material-symbols-outlined text-secondary">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2">
                <span className="text-secondary text-5xl md:text-[56px] font-bold font-serif">{stat.value}</span>
                <span className="text-white/70 font-semibold text-sm uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-surface-low">
        <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-bold text-[15px] uppercase tracking-widest mb-2 block">Our Foundation</span>
            <h2 className="text-3xl md:text-[40px] font-bold text-primary mb-4 leading-tight font-serif">Values We Live By</h2>
            <p className="text-on-surface-muted">Our operations are built on a bedrock of principles that ensure every shipment is handled with professional integrity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val) => (
              <div key={val.title} className="bg-white p-10 border border-outline-light/50 rounded shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-secondary text-4xl group-hover:text-white transition-colors">{val.icon}</span>
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-4 font-serif">{val.title}</h3>
                <p className="text-on-surface-muted leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Gallery */}
      <section className="py-24 max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)]">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-[40px] font-bold text-primary leading-tight font-serif">Our Fleet in Motion</h2>
            <p className="text-on-surface-muted mt-2">A glimpse into the daily life on the road with Mehar Roadlines.</p>
          </div>
          <Link to="/contact" className="hidden md:flex items-center gap-2 text-primary font-bold group hover:text-secondary transition-colors">
            View Entire Fleet
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[800px]">
          {galleryImages.map((img) => (
            <div key={img.alt} className={`${img.span} overflow-hidden rounded border border-outline-light min-h-[200px]`}>
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                src={img.src}
                alt={img.alt}
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-[40px] font-bold mb-4 leading-tight font-serif">Partner with a Legacy of Trust</h2>
            <p className="text-white/80 text-lg">Whether you need a single shipment or a dedicated fleet, we're ready to hit the road for you.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onQuoteClick}
              className="bg-secondary text-primary font-bold px-10 py-5 rounded hover:brightness-110 shadow-lg transition-all inline-flex items-center justify-center cursor-pointer"
            >
              Get a Quote
            </button>
            <Link
              to="/contact"
              className="border-2 border-white/30 text-white font-bold px-10 py-5 rounded hover:bg-white hover:text-primary transition-all inline-flex items-center justify-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
