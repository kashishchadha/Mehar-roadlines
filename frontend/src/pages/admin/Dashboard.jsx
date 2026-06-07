import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function Dashboard() {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filters state
  const [copiedId, setCopiedId] = useState(null)

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [timeFilter, setTimeFilter] = useState('All Time')

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/shipments')
        if (!res.ok) throw new Error('Failed to fetch shipments')
        const data = await res.json()
        setShipments(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchShipments()
  }, [])

  // Calculate statistics
  const totalShipments = shipments.length
  const inTransitCount = shipments.filter(s => s.status.toLowerCase() === 'in transit').length
  const deliveredCount = shipments.filter(s => s.status.toLowerCase() === 'delivered').length
  const pendingCount = shipments.filter(s => ['booked', 'dispatched', 'picked up'].includes(s.status.toLowerCase())).length

  // CSV Exporter for "Export Excel"
  const handleExportCSV = () => {
    if (filteredShipments.length === 0) return
    const headers = ['Tracking ID', 'From', 'To', 'Status', 'Last Updated']
    const rows = filteredShipments.map(s => [
      s.trackingId,
      s.origin,
      s.destination,
      s.status.toUpperCase(),
      new Date(s.updatedAt).toLocaleString()
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      .join('\n')
      
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'mehar_roadlines_shipments.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter shipments
  const filteredShipments = shipments.filter(shipment => {
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = 
      shipment.trackingId.toLowerCase().includes(query) ||
      shipment.origin.toLowerCase().includes(query) ||
      shipment.destination.toLowerCase().includes(query) ||
      shipment.status.toLowerCase().includes(query)

    const matchesLocation = 
      selectedLocation === 'All Locations' || 
      shipment.origin.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(selectedLocation.toLowerCase())

    // Date filtering logic
    let matchesTime = true
    if (timeFilter !== 'All Time') {
      const lastUpdated = new Date(shipment.updatedAt)
      const diffTime = Math.abs(new Date() - lastUpdated)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (timeFilter === 'Last Week') {
        matchesTime = diffDays <= 7
      } else if (timeFilter === 'Last Month') {
        matchesTime = diffDays <= 30
      }
    }

    return matchesSearch && matchesLocation && matchesTime
  })

  // Status badge style helper
  const getStatusBadge = (status) => {
    const s = status.toLowerCase()
    if (s === 'delivered') {
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-[11px] font-bold uppercase tracking-wider">Delivered</span>
    }
    if (s === 'in transit') {
      return <span className="px-3 py-1 bg-orange-100 text-orange-850 rounded-full text-[11px] font-bold uppercase tracking-wider">In Transit</span>
    }
    if (s === 'booked' || s === 'pending') {
      return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[11px] font-bold uppercase tracking-wider">Pending</span>
    }
    if (s === 'dispatched' || s === 'picked up') {
      return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-[11px] font-bold uppercase tracking-wider">Dispatched</span>
    }
    return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-[11px] font-bold uppercase tracking-wider">{status}</span>
  }

  // Extract unique locations for filter dropdown
  const locations = ['All Locations', ...new Set(
    shipments.flatMap(s => [s.origin, s.destination]).filter(Boolean)
  )]

  return (
    <div className="p-8 space-y-8 max-w-[1440px] mx-auto w-full">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Operations Dashboard</h1>
          <p className="text-sm text-on-surface-muted mt-1">Real-time overview of fleet and shipment operations.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-on-surface-muted bg-white px-4 py-2 rounded border border-outline-light shadow-sm">
          <span className="material-symbols-outlined text-secondary text-lg">calendar_today</span>
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <span className="font-semibold">Error: {error}</span>
        </div>
      )}

      {/* Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded border border-outline-light shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs text-on-surface-muted font-bold uppercase tracking-wider">Total Shipments</p>
            <span className="material-symbols-outlined text-on-surface-muted/30 text-2xl">inventory_2</span>
          </div>
          <p className="text-3xl font-extrabold text-primary leading-none">{loading ? '...' : totalShipments}</p>
          <div className="mt-4 flex items-center text-[13px] text-green-600 font-bold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span className="ml-1">Active ledger tracking</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded border border-outline-light shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs text-on-surface-muted font-bold uppercase tracking-wider">In Transit</p>
            <span className="material-symbols-outlined text-on-surface-muted/30 text-2xl">local_shipping</span>
          </div>
          <p className="text-3xl font-extrabold text-primary leading-none">{loading ? '...' : inTransitCount}</p>
          <div className="mt-4 flex items-center text-[13px] text-orange-600 font-bold">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span className="ml-1">Moving on highways</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded border border-outline-light shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs text-on-surface-muted font-bold uppercase tracking-wider">Delivered</p>
            <span className="material-symbols-outlined text-on-surface-muted/30 text-2xl">check_circle</span>
          </div>
          <p className="text-3xl font-extrabold text-primary leading-none">{loading ? '...' : deliveredCount}</p>
          <div className="mt-4 flex items-center text-[13px] text-green-600 font-bold">
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            <span className="ml-1">SLA fulfilled successfully</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded border border-outline-light shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs text-on-surface-muted font-bold uppercase tracking-wider">Pending / Booked</p>
            <span className="material-symbols-outlined text-on-surface-muted/30 text-2xl">pending_actions</span>
          </div>
          <p className="text-3xl font-extrabold text-primary leading-none">{loading ? '...' : pendingCount}</p>
          <div className="mt-4 flex items-center text-[13px] text-on-surface-muted font-bold">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span className="ml-1">Awaiting dispatch</span>
          </div>
        </div>
      </section>

      {/* Quick Action Buttons */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/create"
          className="flex items-center justify-center gap-3 bg-secondary text-white h-[60px] rounded font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined">add_circle</span>
          + Create New Shipment
        </Link>
        <Link
          to="/track"
          target="_blank"
          className="flex items-center justify-center gap-3 bg-white border border-outline-light text-primary h-[60px] rounded font-bold hover:bg-surface-low active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined">manage_search</span>
          Open User-Facing Tracking Site
        </Link>
      </section>

      {/* Recent Shipments Table */}
      <section className="bg-white rounded border border-outline-light shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-light flex justify-between items-center">
          <h2 className="text-lg text-primary font-bold">Recent Shipments</h2>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedLocation('All Locations')
              setTimeFilter('All Time')
            }}
            className="text-sm text-secondary font-bold hover:underline flex items-center gap-1"
          >
            View All Records
            <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
          </button>
        </div>

        {/* Filters Bar matching design screenshot */}
        <div className="px-6 py-4 bg-white border-b border-outline-light flex flex-wrap items-center justify-between gap-4">
          <div className="w-full sm:w-80 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted text-[18px]">filter_list</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by ID or Code..."
              className="w-full bg-white border border-outline-light rounded pl-10 pr-4 py-2 text-[13px] text-primary font-medium focus:ring-1 focus:ring-secondary focus:border-secondary outline-none placeholder:text-on-surface-muted/50"
            />
          </div>
          
          <div className="flex items-center flex-wrap gap-3">
            {/* Custom Location Select */}
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="appearance-none bg-white border border-outline-light rounded pl-3 pr-8 py-2 text-[13px] text-on-surface-muted font-bold outline-none focus:ring-1 focus:ring-secondary cursor-pointer"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none text-on-surface-muted">
                keyboard_arrow_down
              </span>
            </div>
            
            {/* Time filters as separate outlined buttons */}
            <div className="flex items-center gap-2">
              {['All Time', 'Last Week', 'Last Month'].map(option => (
                <button
                  key={option}
                  onClick={() => setTimeFilter(option)}
                  className={`px-4 py-2 text-[13px] font-bold rounded border transition-all cursor-pointer ${
                    timeFilter === option
                      ? 'bg-secondary border-secondary text-white'
                      : 'bg-white border-outline-light text-on-surface-muted hover:bg-surface-low'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            <div className="h-6 w-px bg-outline-light mx-1 hidden sm:block"></div>
            
            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-light rounded text-[13px] font-bold text-on-surface-muted hover:bg-surface-low transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Excel
            </button>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-5xl text-secondary mb-4">refresh</span>
            <p className="text-on-surface-muted font-bold">Loading shipments from database...</p>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">search_off</span>
            <h3 className="text-xl font-bold text-primary mb-1">No Shipments Found</h3>
            <p className="text-on-surface-muted text-sm max-w-sm">No shipments matched your filters. Try search keywords or create a new entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-low border-b border-outline-light">
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-muted uppercase tracking-wider">Tracking ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-muted uppercase tracking-wider">From</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-muted uppercase tracking-wider">To</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-muted uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-muted uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-faint">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment._id} className="hover:bg-surface-low transition-colors duration-150">
                    <td className="px-6 py-5 font-bold text-primary text-sm tracking-wider font-mono">
                      <div className="flex items-center gap-2 group/id">
                        <span className="inline-block w-28 shrink-0">{shipment.trackingId}</span>
                        <button
                          onClick={() => handleCopy(shipment.trackingId)}
                          className="p-1 hover:bg-surface-mid rounded transition-all text-on-surface-muted/65 hover:text-secondary cursor-pointer"
                          title="Copy Tracking ID"
                        >
                          <span className="material-symbols-outlined text-[16px] leading-none block">
                            {copiedId === shipment.trackingId ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-on-surface-muted text-sm font-medium">{shipment.origin}</td>
                    <td className="px-6 py-5 text-on-surface-muted text-sm font-medium">{shipment.destination}</td>
                    <td className="px-6 py-5">{getStatusBadge(shipment.status)}</td>
                    <td className="px-6 py-5 text-on-surface-muted text-sm font-medium">
                      {formatRelativeTime(shipment.updatedAt)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        to={`/admin/shipment/${shipment.trackingId}`}
                        className="text-secondary hover:bg-secondary/10 px-4 py-2 rounded text-sm font-bold transition-all inline-block"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="mt-8 text-center text-xs text-on-surface-muted/60">
        Mehar Roadlines Admin Control Portal © {new Date().getFullYear()} • Powered by TransTrack Enterprise
      </footer>
    </div>
  )
}

export default Dashboard
