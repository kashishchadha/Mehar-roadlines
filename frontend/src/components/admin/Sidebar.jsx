import { NavLink, useNavigate } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-3 transition-colors duration-200 ${
      isActive
        ? 'text-white bg-white/10 border-l-4 border-secondary font-bold'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-primary flex flex-col py-4 border-r border-[#1a3a5a] z-50">
      <div className="px-6 py-6 flex items-center gap-2 mb-8">
        <span className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-3xl">local_shipping</span>
          Mehar Roadlines
        </span>
      </div>
      
      <nav className="flex-grow space-y-1">
        <NavLink to="/admin/dashboard" className={linkClass} end>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[15px] tracking-wide">Dashboard</span>
        </NavLink>
        
        <NavLink to="/admin/create" className={linkClass}>
          <span className="material-symbols-outlined">add_box</span>
          <span className="text-[15px] tracking-wide">New Shipment</span>
        </NavLink>

        <div className="h-px bg-white/10 my-4 mx-6" />

        <NavLink to="/" className={linkClass} end>
          <span className="material-symbols-outlined">home</span>
          <span className="text-[15px] tracking-wide">Go to Homepage</span>
        </NavLink>

        <NavLink to="/track" className={linkClass}>
          <span className="material-symbols-outlined">track_changes</span>
          <span className="text-[15px] tracking-wide">Track Shipment (Public)</span>
        </NavLink>
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-4 w-full text-left text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-[15px] tracking-wide font-semibold">Log Out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
