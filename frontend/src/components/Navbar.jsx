import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

function Navbar({ onQuoteClick }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo(0, 0)
    setIsAdmin(!!localStorage.getItem('adminToken'))
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkBase = 'text-on-surface-muted font-semibold text-[15px] tracking-wide hover:text-secondary transition-colors duration-200'
  const activeLink = 'text-secondary border-b-2 border-secondary pb-1 font-bold'

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/track', label: 'Track Shipment', highlight: true },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/quote', label: 'Get a Quote', accent: true },
  ]

  return (
    <header className={`w-full sticky top-0 z-50 bg-white border-b border-outline-light transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] flex justify-between items-center h-16">
        <NavLink to="/" className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-secondary text-3xl group-hover:scale-110 transition-transform duration-200">local_shipping</span>
          <span className="text-primary font-extrabold text-xl tracking-tight">Mehar Roadlines</span>
        </NavLink>

        <nav className="hidden md:flex gap-8 items-center">
          {navItems.map((item) =>
            item.accent ? (
              <button
                key={item.label}
                onClick={onQuoteClick}
                className="bg-secondary text-on-secondary px-5 py-2.5 rounded font-bold text-[15px] hover:bg-secondary-dark transition-all duration-200 shadow-md cursor-pointer border-none"
              >
                {item.label}
              </button>
            ) : item.highlight ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "px-4.5 py-2 rounded-sm bg-secondary text-white font-extrabold text-[14px] border border-secondary shadow-md shadow-secondary/15 transition-all duration-250 cursor-pointer"
                    : "px-4.5 py-2 rounded-sm border border-secondary/40 text-secondary hover:bg-secondary hover:text-white hover:shadow-md hover:shadow-secondary/10 transition-all duration-250 font-extrabold text-[14px] cursor-pointer"
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? `${linkBase} ${activeLink}` : linkBase)}
              >
                {item.label}
              </NavLink>
            )
          )}
          
          <div className="h-6 w-px bg-outline-light"></div>
          
          {isAdmin ? (
            <NavLink
              to="/admin/dashboard"
              className="bg-secondary text-white px-4 py-2 rounded font-bold text-[14px] hover:brightness-110 shadow-sm transition-all"
            >
              Admin Panel
            </NavLink>
          ) : (
            <NavLink
              to="/admin/login"
              className="border border-outline-light px-4 py-2 rounded font-bold text-[14px] text-on-surface-muted hover:text-secondary hover:border-secondary transition-all"
            >
              Login
            </NavLink>
          )}
        </nav>

        <button
          className="md:hidden p-2 text-on-surface"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined text-3xl">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-outline-light animate-in">
          <nav className="flex flex-col px-5 py-4 gap-1">
            {navItems.map((item) => (
              item.accent ? (
                <button
                  key={item.label}
                  onClick={() => {
                    setMobileOpen(false)
                    onQuoteClick()
                  }}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded font-bold text-[15px] mt-2 bg-secondary text-on-secondary hover:bg-secondary-dark transition-all duration-200 cursor-pointer shadow-sm border-none"
                >
                  <span className="material-symbols-outlined text-lg">request_quote</span>
                  {item.label}
                </button>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    item.highlight
                      ? `flex items-center gap-3 px-4 py-3 rounded text-[15px] font-bold transition-all border mt-1 ${
                          isActive
                            ? 'text-white bg-secondary border-secondary'
                            : 'text-secondary bg-secondary/5 border-secondary/20 hover:bg-secondary/10'
                        }`
                      : `flex items-center gap-3 px-4 py-3 rounded text-[15px] font-semibold transition-colors ${
                          isActive
                            ? 'text-secondary bg-surface-low'
                            : 'text-on-surface-muted hover:bg-surface-low hover:text-secondary'
                        }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            ))}
            
            <div className="h-px bg-outline-faint my-2"></div>
            
            {isAdmin ? (
              <NavLink
                to="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded font-bold text-[15px] bg-secondary text-white"
              >
                Admin Panel
              </NavLink>
            ) : (
              <NavLink
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded text-[15px] font-semibold border border-outline-light text-on-surface-muted hover:text-secondary"
              >
                Login
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
