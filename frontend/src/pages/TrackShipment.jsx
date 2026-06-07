import { useState } from 'react'
import { formatDateDDMMYYYY } from '../utils/dateUtils'
import apiClient from '../utils/apiClient'

function TrackShipment() {
  const [trackingId, setTrackingId] = useState('')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shipment, setShipment] = useState(null)
  const [error, setError] = useState(null)

  const fetchTracking = async (id) => {
    if (!id.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get(`/shipments/${id}`)
      setShipment(res.data)
      setSearched(true)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      setShipment(null)
      setSearched(false)
    } finally {
      setLoading(false)
    }
  }



  const handleTrack = (e) => {
    e.preventDefault()
    fetchTracking(trackingId)
  }

  const stepsToRender = shipment
    ? shipment.steps.filter(
        (s) =>
          s.id !== 'out_for_delivery' &&
          s.id !== 'out-for-delivery' &&
          s.label !== 'Out for Delivery'
      )
    : []

  const isCurrentLocation = (locationName) => {
    if (!shipment || !shipment.currentLocation) return false
    const curr = shipment.currentLocation.toLowerCase()
    const name = locationName.toLowerCase()
    return curr === name || curr.includes(name) || name.includes(curr)
  }

  const lastActiveOrDoneIndex = shipment
    ? [...stepsToRender].reverse().findIndex(s => s.done || s.active)
    : -1
  const activeStepIndex = lastActiveOrDoneIndex !== -1 ? stepsToRender.length - 1 - lastActiveOrDoneIndex : 0
  const progressPercent = stepsToRender.length > 1 ? (activeStepIndex / (stepsToRender.length - 1)) * 100 : 0

  const shipmentDetails = shipment ? [
    { label: 'Tracking ID', value: shipment.trackingId, bold: true },
    { label: 'Current Status', value: shipment.status, highlight: true },
    { label: 'Route', route: { from: shipment.origin, to: shipment.destination } },
    { label: 'Current Location', value: shipment.currentLocation || 'Origin Depot' },
    { label: 'Vehicle Details', value: shipment.vehicle || 'Unassigned' },
    { label: 'Estimated Arrival', value: formatDateDDMMYYYY(shipment.estimatedArrival), bold: true },
    { label: 'Cargo Description', value: shipment.cargoDescription || 'Not Specified' },
    { label: 'Weight / Packages', value: `${shipment.weight || 'TBD'} MT / ${shipment.packagesCount || 'TBD'} Pkgs` },
    { label: 'Shipment Type', value: shipment.shipmentType },
  ] : []


  return (
    <main className="relative z-10 pb-16">
      <div className="max-w-[var(--spacing-container)] mx-auto px-5 md:px-[var(--spacing-edge)] py-12">
        
        {!searched ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-6">
            {/* Left Side: Search & Instructions */}
            <div className="lg:col-span-7 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 text-secondary text-xs font-extrabold rounded-full tracking-wider uppercase border border-secondary/10">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span>
                  Consignment Tracker
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
                  Track Your Shipment
                </h1>
                <p className="text-base md:text-lg text-on-surface-muted leading-relaxed">
                  Real-time updates for your cargo. Simple, fast, and reliable logistics at your fingertips.
                </p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleTrack} className="flex flex-col sm:flex-row bg-white border border-outline-light rounded-2xl overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-secondary/40 focus-within:border-secondary transition-all">
                <div className="flex-grow flex items-center px-6 py-4">
                  <span className="material-symbols-outlined text-on-surface-muted mr-3">search</span>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. MR-00123)"
                    className="w-full border-none focus:ring-0 focus:outline-none text-base md:text-lg py-2 bg-transparent placeholder:text-outline outline-none"
                    aria-label="Tracking ID Input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-secondary text-on-secondary font-bold text-base md:text-lg px-8 py-4 sm:py-5 active:scale-[0.98] transition-all hover:bg-secondary-dark disabled:opacity-70 flex items-center justify-center min-w-[150px] cursor-pointer"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-2xl">refresh</span>
                  ) : (
                    'Track Now'
                  )}
                </button>
              </form>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-3">
                  <span className="material-symbols-outlined">error</span>
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {/* How to Track Card */}
              <div className="bg-white border border-outline-light p-8 rounded-2xl shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2 border-b border-outline-faint pb-4">
                  <span className="material-symbols-outlined text-secondary">info</span>
                  How to Track Your Consignment
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm">
                      1
                    </div>
                    <h4 className="font-bold text-primary text-sm">Locate Tracking ID</h4>
                    <p className="text-xs text-on-surface-muted leading-relaxed">
                      Find your ID (e.g., <code className="bg-surface-low px-1.5 py-0.5 rounded font-mono font-bold text-secondary text-[11px]">MR-00123</code>) on your waybill or invoice.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm">
                      2
                    </div>
                    <h4 className="font-bold text-primary text-sm">Enter Details</h4>
                    <p className="text-xs text-on-surface-muted leading-relaxed">
                      Input your tracking code in the input field above and hit "Track Now".
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm">
                      3
                    </div>
                    <h4 className="font-bold text-primary text-sm">Get Live Status</h4>
                    <p className="text-xs text-on-surface-muted leading-relaxed">
                      View transit history, active driver contact, and estimated arrival timelines.
                    </p>
                  </div>
                </div>

                <div className="bg-surface-low border border-outline-faint p-4 rounded-xl flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5">help_outline</span>
                  <div>
                    <h5 className="text-xs font-bold text-primary">Need Assistance?</h5>
                    <p className="text-[11px] text-on-surface-muted mt-1 leading-relaxed">
                      If you lost your waybill copy, please dial our helpline at <a href="tel:+919996761999" className="text-secondary font-bold hover:underline">+91 99967 61999</a> or query through WhatsApp support.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Premium Graphics Banner */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-outline-light p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                {/* Generated Illustration Image */}
                <div className="h-[250px] w-full rounded-xl overflow-hidden bg-surface-low relative mb-6">
                  <img
                    src="/logistics_illustration.png"
                    alt="Premium Cargo Logistics"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent"></div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-primary">Mehar Premium Fleet Tracker</h3>
                  <p className="text-sm text-on-surface-muted leading-relaxed">
                    Access real-time GPS coordinate telemetry, route hazard assessments, and automated ETA calculation powered by TransTrack Enterprise.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-faint">
                    <div className="bg-surface-low p-3.5 rounded-xl border border-outline-faint text-center">
                      <p className="text-2xl font-black text-secondary">500+</p>
                      <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-wider mt-0.5">Active Fleet</p>
                    </div>
                    <div className="bg-surface-low p-3.5 rounded-xl border border-outline-faint text-center">
                      <p className="text-2xl font-black text-primary">99.8%</p>
                      <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-wider mt-0.5">On-Time SLA</p>
                    </div>
                  </div>

                  <div className="bg-secondary/5 rounded-xl p-4 border border-secondary/15 flex items-center gap-3 mt-4">
                    <span className="material-symbols-outlined text-secondary text-2xl animate-pulse-slow">verified_user</span>
                    <div className="text-xs text-secondary-dark font-semibold">
                      Full Transit Insurance Cover &amp; Secure Deliveries
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Header + Search box at the top when searched */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-outline-light">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-secondary/10 text-secondary text-[11px] font-extrabold rounded-full uppercase tracking-wider border border-secondary/10">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-ping mr-1"></span>
                  Live Consignment Ledger
                </span>
                <h2 className="text-3xl font-extrabold text-primary tracking-tight mt-1.5">
                  Tracking Result
                </h2>
              </div>

              {/* Small inline search bar for query modifications */}
              <form onSubmit={handleTrack} className="w-full md:w-auto flex bg-white border border-outline-light rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-secondary/40 focus-within:border-secondary transition-all">
                <div className="flex items-center px-4 py-2 w-full md:w-[280px]">
                  <span className="material-symbols-outlined text-on-surface-muted mr-2 text-lg">search</span>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter Tracking ID..."
                    className="w-full border-none focus:ring-0 focus:outline-none text-sm bg-transparent placeholder:text-outline outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-secondary text-white font-bold text-sm px-6 py-3 hover:bg-secondary-dark transition-all cursor-pointer border-none"
                >
                  Track
                </button>
              </form>
            </div>

            {/* Split layout: Stepper and Timeline on Left, Details & Driver on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (col-span-8): Stepper & Transit timeline */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Progress Stepper Card */}
                <section className="bg-white border border-outline-light p-8 md:p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  {/* Desktop Layout (horizontal line stepper) */}
                  <div className="hidden md:block relative px-4">
                    {/* Stepper background line with calculated left/right offsets to align exactly to step centers */}
                    <div className="absolute top-[22px] left-[12.5%] right-[12.5%] h-[4px] bg-slate-100 rounded-full z-0">
                      <div
                        className="h-full bg-secondary rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    
                    <div className="relative flex justify-between items-start w-full">
                      {stepsToRender.map((step) => {
                        const isDone = step.done;
                        const isActive = step.active;
                        const isPending = step.pending;
                        return (
                          <div key={step.id || step._id} className="flex-1 flex flex-col items-center text-center relative z-10 w-full">
                            <div className={`relative w-11 h-11 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                              isActive
                                ? 'bg-secondary border-orange-100 text-white ring-4 ring-secondary/20 shadow-[0_0_15px_rgba(255,107,0,0.4)] scale-105'
                                : isDone
                                ? 'bg-secondary border-orange-100 text-white shadow-[0_0_10px_rgba(255,107,0,0.2)]'
                                : 'bg-white border-slate-100 text-slate-400'
                            }`}>
                              <span className="material-symbols-outlined text-lg font-bold">
                                {isDone || isActive ? 'check' : step.icon}
                              </span>
                              {isActive && (
                                <div className="absolute inset-0 rounded-full border-2 border-secondary animate-ping opacity-60" />
                              )}
                            </div>
                            <span className={`font-extrabold text-sm mt-3 tracking-tight ${isActive ? 'text-secondary' : isPending ? 'text-slate-400' : 'text-primary'}`}>
                              {step.label}
                            </span>
                            <span className={`text-[11px] font-semibold mt-1 ${isActive ? 'text-secondary-dark' : 'text-on-surface-muted/60'}`}>
                              {formatDateDDMMYYYY(step.date)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile Layout (vertical timeline stepper) */}
                  <div className="block md:hidden relative pl-8 py-2">
                    {/* Vertical line running down the left */}
                    <div className="absolute left-[16px] top-4 bottom-4 w-[3px] bg-slate-100 rounded-full z-0">
                      {/* Sub-line for progress vertical filling */}
                      <div 
                        className="w-full bg-secondary rounded-full transition-all duration-700 ease-out"
                        style={{ height: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="space-y-8">
                      {stepsToRender.map((step) => {
                        const isDone = step.done;
                        const isActive = step.active;
                        return (
                          <div key={step.id || step._id} className="relative flex items-start gap-4">
                            <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-4 flex-shrink-0 transition-all duration-300 ${
                              isActive
                                ? 'bg-secondary border-orange-100 text-white ring-4 ring-secondary/20 shadow-[0_0_12px_rgba(255,107,0,0.4)]'
                                : isDone
                                ? 'bg-secondary border-orange-100 text-white shadow-[0_0_8px_rgba(255,107,0,0.2)]'
                                : 'bg-white border-slate-100 text-slate-400'
                            }`}>
                              <span className="material-symbols-outlined text-sm font-bold">
                                {isDone || isActive ? 'check' : step.icon}
                              </span>
                            </div>
                            <div className="flex flex-col pt-0.5">
                              <span className={`font-extrabold text-sm ${isActive ? 'text-secondary' : 'text-primary'}`}>
                                {step.label}
                              </span>
                              <span className="text-xs text-on-surface-muted mt-0.5">
                                {formatDateDDMMYYYY(step.date)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* Detailed Route Timeline if available */}
                {shipment.routePoints && shipment.routePoints.length > 0 && (
                  <section className="bg-white border border-outline-light p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">alt_route</span>
                      Detailed Transit Route Path
                    </h3>
                    <div className="relative pl-8 border-l-2 border-dashed border-outline-light ml-4 space-y-6">
                      {/* Origin */}
                      {(() => {
                        const isCurrent = isCurrentLocation(shipment.origin);
                        return (
                          <div className="relative flex items-start gap-4">
                            <div className={`absolute -left-[43px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                              isCurrent ? 'bg-secondary ring-4 ring-secondary/20 animate-pulse' : 'bg-primary'
                            }`}>
                              {isCurrent && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                            </div>
                            <div className={`flex-grow border p-4 rounded-xl transition-all ${
                              isCurrent 
                                ? 'bg-secondary/5 border-secondary/35 shadow-sm shadow-secondary/5' 
                                : 'bg-surface-low/30 border-outline-faint hover:border-outline-light'
                            }`}>
                              <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                  <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold text-[9px] rounded uppercase tracking-wider">Origin</span>
                                  <h4 className="text-sm font-bold text-primary mt-1">{shipment.origin}</h4>
                                  <p className="text-xs text-on-surface-muted mt-0.5">Start Depot</p>
                                </div>
                                {isCurrent && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full border border-secondary/20 animate-pulse">
                                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                    Current Location
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Intermediate Stops */}
                      {shipment.routePoints.map((pt, idx) => {
                        const isCurrent = isCurrentLocation(pt.name);
                        return (
                          <div key={idx} className="relative flex items-start gap-4">
                            <div className={`absolute -left-[43px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                              isCurrent 
                                ? 'bg-secondary ring-4 ring-secondary/20 animate-pulse' 
                                : 'bg-primary'
                            }`}>
                              {isCurrent && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                            </div>
                            <div className={`flex-grow border p-4 rounded-xl transition-all ${
                              isCurrent 
                                ? 'bg-secondary/5 border-secondary/35 shadow-sm shadow-secondary/5' 
                                : 'bg-surface-low/30 border-outline-faint hover:border-outline-light'
                            }`}>
                              <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                  <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold text-[9px] rounded uppercase tracking-wider">
                                    {pt.type}
                                  </span>
                                  <h4 className="text-sm font-bold text-primary mt-1">{pt.name}{pt.state ? `, ${pt.state}` : ''}</h4>
                                  <p className="text-xs text-on-surface-muted mt-0.5">Intermediate Transit Point</p>
                                </div>
                                {isCurrent && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full border border-secondary/20 animate-pulse">
                                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                    Current Location
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Destination */}
                      {(() => {
                        const isCurrent = isCurrentLocation(shipment.destination);
                        return (
                          <div className="relative flex items-start gap-4">
                            <div className={`absolute -left-[43px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                              isCurrent ? 'bg-secondary ring-4 ring-secondary/20 animate-pulse' : 'bg-primary'
                            }`}>
                              {isCurrent && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                            </div>
                            <div className={`flex-grow border p-4 rounded-xl transition-all ${
                              isCurrent 
                                ? 'bg-secondary/5 border-secondary/35 shadow-sm shadow-secondary/5' 
                                : 'bg-surface-low/30 border-outline-faint hover:border-outline-light'
                            }`}>
                              <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                  <span className="px-2 py-0.5 bg-secondary/10 text-secondary font-bold text-[9px] rounded uppercase tracking-wider">Destination</span>
                                  <h4 className="text-sm font-bold text-primary mt-1">{shipment.destination}</h4>
                                  <p className="text-xs text-on-surface-muted mt-0.5">Final Delivery Location</p>
                                </div>
                                {isCurrent && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full border border-secondary/20 animate-pulse">
                                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                                    Current Location
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </section>
                )}
              </div>

              {/* Right Column (col-span-4): Shipment details & Driver info */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Details Card */}
                <div className="bg-white border border-outline-light p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-6">
                  <h3 className="text-lg font-bold text-primary border-b border-outline-faint pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">description</span>
                    Shipment Details
                  </h3>
                  
                  <div className="space-y-4">
                    {shipmentDetails.map((detail) => (
                      <div key={detail.label} className="border-b border-outline-faint/40 pb-3 last:border-b-0 last:pb-0">
                        <p className="text-on-surface-muted text-xs font-bold uppercase tracking-wider mb-1.5">{detail.label}</p>
                        {detail.route ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-extrabold text-primary">{detail.route.from}</span>
                            <span className="material-symbols-outlined text-secondary text-sm">trending_flat</span>
                            <span className="text-base font-extrabold text-primary">{detail.route.to}</span>
                          </div>
                        ) : (
                          <p className={`text-base ${detail.highlight ? 'font-black text-secondary' : detail.bold ? 'font-bold text-primary' : 'text-primary font-semibold'}`}>
                            {detail.value}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Driver Support Card */}
                {shipment.driver && (
                  <div className="bg-white border border-outline-light p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-primary border-b border-outline-faint pb-3 flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-secondary">local_shipping</span>
                        Transit Crew
                      </h3>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-mid border-2 border-outline-light shrink-0">
                          <img
                            alt={`Driver ${shipment.driver.name}`}
                            className="w-full h-full object-cover"
                            src={shipment.driver.photoUrl}
                          />
                        </div>
                        <div>
                          <p className="text-on-surface-muted text-xs font-bold uppercase tracking-wider">Assigned Driver</p>
                          <p className="text-lg font-bold text-primary mt-0.5">{shipment.driver.name}</p>
                          <p className="text-xs text-on-surface-muted">Licensed Heavy Cargo Handler</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-outline-faint">
                      <p className="text-on-surface-muted text-xs italic text-center">Need operational assistance for this shipment?</p>
                      <a
                        href={`tel:${shipment.driver.phone}`}
                        className="flex items-center justify-center gap-2 w-full bg-primary text-on-primary font-bold py-3.5 rounded-xl hover:bg-primary-light transition-all shadow-sm cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg">call</span>
                        Call Driver Support
                      </a>
                      <a
                        href={`https://wa.me/${shipment.driver.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-whatsapp text-white font-bold py-3.5 rounded-xl hover:brightness-110 transition-all shadow-sm cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-lg">chat</span>
                        WhatsApp Dispatch Desk
                      </a>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Atmospheric Photo */}
        <section className="mt-16">
          <div className="relative h-[320px] w-full rounded-2xl overflow-hidden shadow-lg group">
            <img
              className="w-full h-full object-cover brightness-[0.55] group-hover:scale-102 transition-transform duration-1000"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCALlweNQugX-QyVhF21Lb8C3QX_Bp4-zO7xfRXB5DwKpwM0GjDq_piVQBfQZGF-hiLO0PEOZUSxVMd-tq80RtFFkd1jGnHgf-jZtsCJUay5N11YzvuXK_f1SJCvkBFuyOHP4_bRJsfQ2KGdCoqr3Duxna9KeLLRis1B-Uf0WM__CHlXaVnn8bkG6dmMywFAj7VwzRV-7XcTToY7dTnLctZSQMTRNoBsEcEDPrR0ZZKVSVQ2kRFaZrYAIRXIHIl60Z3Jav5GOi72Hzm"
              alt="Cargo truck driving down a highway during sunset"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 bg-gradient-to-t from-primary/80 to-transparent">
              <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Relentless for your success.</h2>
              <p className="text-white/90 text-sm md:text-base max-w-xl">Every mile we cover is a promise kept. Your shipment is in safe, experienced hands across India's highways.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default TrackShipment
