import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const [searchId, setSearchId] = useState('')
  const [timeString, setTimeString] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
  const [dateString, setDateString] = useState(new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      setDateString(new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleQuickTrack = (e) => {
    e.preventDefault()
    if (!searchId.trim()) return
    // Navigate to update shipment page directly
    navigate(`/admin/shipment/${searchId.trim()}`)
    setSearchId('')
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/')
  }

  return (
    <header className="flex justify-between items-center h-[64px] px-8 bg-white border-b border-outline-light sticky top-0 z-40 shrink-0">
      {/* Search / Track form */}
      <form onSubmit={handleQuickTrack} className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted">search</span>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Quick search Tracking ID to update..."
            className="w-full bg-surface-low border border-outline-light rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all placeholder:text-outline"
          />
        </div>
      </form>

      {/* Utilities: Digital Clock & Quick Actions */}
      <div className="flex items-center gap-6">
        {/* Handy Digital Clock */}
        <div className="hidden md:flex flex-col text-right select-none pr-2">
          <span className="text-sm font-extrabold text-primary font-mono tracking-wider">{timeString}</span>
          <span className="text-[10px] text-on-surface-muted font-bold uppercase tracking-wider">{dateString}</span>
        </div>

        <div className="h-6 w-px bg-outline-light hidden md:block"></div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 px-3 py-2 border border-outline-light rounded-lg text-xs font-bold text-primary hover:text-secondary hover:border-secondary transition-all cursor-pointer bg-white"
            title="View Public Site"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span className="hidden sm:inline">Public Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold text-red-700 transition-all cursor-pointer"
            title="Log Out"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
