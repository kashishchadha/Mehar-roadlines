import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function UpdateShipment() {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  
  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Update form states
  const [status, setStatus] = useState('')
  const [currentLocation, setCurrentLocation] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (shipment?.trackingId) {
      navigator.clipboard.writeText(shipment.trackingId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Route edit states
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [routePoints, setRoutePoints] = useState([])
  const [isEditingRoute, setIsEditingRoute] = useState(false)

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    onClose: null
  })

  const showModal = (title, message, type = 'success', onClose = null) => {
    setModal({ isOpen: true, title, message, type, onClose })
  }

  const closeModal = () => {
    const callback = modal.onClose
    setModal({ ...modal, isOpen: false })
    if (callback) callback()
  }

  const LOCATION_PRESETS = {
    City: ['Mumbai', 'Delhi', 'Ahmedabad', 'Pune', 'Bangalore', 'Indore', 'Surat', 'Jaipur', 'Gurugram'],
    Hub: ['Mumbai Hub', 'Delhi Hub', 'Bangalore Hub', 'Ahmedabad Hub', 'Pune Hub', 'Indore Hub', 'Jaipur Hub'],
    Warehouse: ['Aslali Warehouse (Ahmedabad)', 'Yeshwanthpur Warehouse (Bangalore)', 'Bhiwandi Warehouse (Mumbai)', 'Okhla Warehouse (Delhi)'],
    'Toll Plaza': ['Vadodara Toll Plaza', 'Lonavala Toll Plaza', 'Jaipur Toll Plaza', 'Delhi-Gurugram Border Toll']
  }

  const [newPoint, setNewPoint] = useState({
    type: 'City',
    name: 'Mumbai',
    customName: '',
    state: 'Maharashtra'
  })

  const handleAddPoint = () => {
    const nameToAdd = newPoint.name === 'Custom' || !newPoint.name ? newPoint.customName.trim() : newPoint.name;
    if (!nameToAdd) {
      showModal('Invalid Location', 'Please specify a location name.', 'error');
      return;
    }
    const updatedPoints = [
      ...routePoints,
      { type: newPoint.type, name: nameToAdd, state: newPoint.state }
    ];
    setRoutePoints(updatedPoints);
    
    // Set default preset for next select
    const nextPresets = LOCATION_PRESETS[newPoint.type] || [];
    setNewPoint({ ...newPoint, name: nextPresets[0] || 'Custom', customName: '' });
  };

  const handleRemovePoint = (index) => {
    const updatedPoints = routePoints.filter((_, i) => i !== index);
    setRoutePoints(updatedPoints);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updatedPoints = [...routePoints];
    const temp = updatedPoints[index];
    updatedPoints[index] = updatedPoints[index - 1];
    updatedPoints[index - 1] = temp;
    setRoutePoints(updatedPoints);
  };

  const handleMoveDown = (index) => {
    if (index === routePoints.length - 1) return;
    const updatedPoints = [...routePoints];
    const temp = updatedPoints[index];
    updatedPoints[index] = updatedPoints[index + 1];
    updatedPoints[index + 1] = temp;
    setRoutePoints(updatedPoints);
  };

  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, overIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === overIndex) return

    const items = [...routePoints]
    const draggedItem = items[draggedIndex]
    items.splice(draggedIndex, 1)
    items.splice(overIndex, 0, draggedItem)

    setDraggedIndex(overIndex)
    setRoutePoints(items)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const fetchShipment = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/shipments/${trackingId}`)
      if (!res.ok) {
        throw new Error('Shipment not found')
      }
      const data = await res.json()
      setShipment(data)
      setStatus(data.status)
      setCurrentLocation(data.currentLocation || '')
      setOrigin(data.origin || '')
      setDestination(data.destination || '')
      setRoutePoints(data.routePoints || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShipment()
  }, [trackingId])

  const handleUpdate = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    
    // Check if the current location is a new intermediate stop
    let finalRoutePoints = [...routePoints]
    const currentLocTrim = currentLocation.trim()
    
    if (currentLocTrim) {
      const exists = 
        currentLocTrim.toLowerCase() === origin.trim().toLowerCase() ||
        currentLocTrim.toLowerCase() === destination.trim().toLowerCase() ||
        routePoints.some(pt => pt.name.toLowerCase() === currentLocTrim.toLowerCase())

      if (!exists && 
          !currentLocTrim.toLowerCase().startsWith('origin depot') && 
          !currentLocTrim.toLowerCase().startsWith('destination depot')) {
        // Automatically add it as an intermediate stop!
        finalRoutePoints.push({
          type: 'City',
          name: currentLocTrim,
          state: 'Maharashtra'
        })
        setRoutePoints(finalRoutePoints)
      }
    }

    try {
      const res = await fetch(`http://localhost:5000/api/shipments/${trackingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status, 
          currentLocation,
          origin,
          destination,
          routePoints: finalRoutePoints
        })
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Failed to update shipment')
      }
      
      const updatedData = await res.json()
      setShipment(updatedData)
      setStatus(updatedData.status)
      setCurrentLocation(updatedData.currentLocation || '')
      setOrigin(updatedData.origin || '')
      setDestination(updatedData.destination || '')
      setRoutePoints(updatedData.routePoints || [])
      setIsEditingRoute(false)
      showModal('Shipment Updated', 'Shipment record and routes updated successfully!', 'success')
    } catch (err) {
      showModal('Update Failed', err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined animate-spin text-5xl text-secondary mb-4">refresh</span>
        <p className="text-on-surface-muted font-bold">Loading shipment details...</p>
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-6">
        <span className="material-symbols-outlined text-6xl text-red-500">warning</span>
        <h3 className="text-2xl font-bold text-primary">Error Loading Shipment</h3>
        <p className="text-on-surface-muted">{error || 'Shipment record could not be found.'}</p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-6 py-3 bg-secondary text-white font-bold rounded"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  const stepsToRender = shipment
    ? shipment.steps.filter(
        (s) =>
          s.id !== 'out_for_delivery' &&
          s.id !== 'out-for-delivery' &&
          s.label !== 'Out for Delivery'
      )
    : []

  const lastActiveOrDoneIndex = shipment
    ? [...stepsToRender].reverse().findIndex(s => s.done || s.active)
    : -1
  const activeStepIndex = lastActiveOrDoneIndex !== -1 ? stepsToRender.length - 1 - lastActiveOrDoneIndex : 0
  const progressPercent = stepsToRender.length > 1 ? (activeStepIndex / (stepsToRender.length - 1)) * 100 : 0

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Top Navbar Header */}
      <header className="flex justify-between items-center pb-6 border-b border-outline-light">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 hover:bg-surface-low rounded-full transition-all text-secondary"
            aria-label="Back to dashboard"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-2xl font-headline-sm font-bold text-primary flex items-center gap-2">
            <span>Shipment #{shipment.trackingId}</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-surface-low rounded transition-all text-on-surface-muted/65 hover:text-secondary cursor-pointer flex items-center justify-center border-none"
              title="Copy Tracking ID"
            >
              <span className="material-symbols-outlined text-[18px] leading-none">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </h1>
        </div>
        <div className="flex gap-3">
          <span className="px-4 py-1.5 bg-secondary text-on-secondary rounded font-bold text-sm">
            ETA: {shipment.estimatedArrival}
          </span>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        
        {/* LEFT COLUMN: Controls & Timeline (65%) */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Section 1: Update Status Form */}
          <section className="bg-white border border-outline-light rounded-lg p-6 shadow-sm">
            <h2 className="text-sm font-bold text-secondary mb-6 flex items-center gap-2 uppercase tracking-wider">
              <span className="material-symbols-outlined">sync_alt</span>
              Update Shipment Status
            </h2>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-on-surface-muted block">Quick Status Update</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { val: 'Picked Up', icon: 'inventory' },
                    { val: 'In Transit', icon: 'local_shipping' },
                    { val: 'Delivered', icon: 'task_alt' }
                  ].map(btn => (
                    <button
                      key={btn.val}
                      type="button"
                      onClick={() => {
                        setStatus(btn.val)
                        if (btn.val === 'Delivered' && destination) {
                          setCurrentLocation(destination)
                        } else if (btn.val === 'Picked Up' && origin) {
                          setCurrentLocation(origin)
                        }
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded border-2 transition-all gap-2 ${
                        status.toLowerCase() === btn.val.toLowerCase()
                          ? 'border-secondary bg-secondary/5 text-secondary'
                          : 'border-outline-light hover:border-secondary hover:bg-surface-low'
                      }`}
                    >
                      <span className="material-symbols-outlined">{btn.icon}</span>
                      <span className="text-xs font-bold">{btn.val}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-on-surface-muted block">Where is the truck now? (Current Location)</label>
                <input
                  type="text"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  placeholder="e.g. Near Vadodara Toll Plaza, NH-48"
                  className="w-full h-12 bg-white border border-outline-light rounded px-4 focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                />
                
                {/* Quick Select from Route stops */}
                {(() => {
                  const stopSequence = [
                    origin,
                    ...routePoints.map(pt => pt.name),
                    destination
                  ].filter(Boolean)

                  const selectedIndex = stopSequence.findIndex(name => {
                    const curr = currentLocation.trim().toLowerCase();
                    const stop = name.trim().toLowerCase();
                    return curr === stop;
                  })

                  return (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-xs font-bold text-on-surface-muted flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">ads_click</span>
                        Quick Select from Route stops:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {/* Origin */}
                        {origin && (() => {
                          const isSelected = selectedIndex === 0;
                          const isCovered = selectedIndex > 0;
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentLocation(origin)
                                setStatus('Picked Up')
                              }}
                              className={`px-3 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-primary border-primary text-white shadow-sm'
                                  : isCovered
                                  ? 'bg-slate-100 border-slate-200 text-slate-400 font-medium opacity-75'
                                  : 'bg-white border-outline-light text-primary hover:bg-surface-low'
                              }`}
                            >
                              {isCovered ? '✓ ' : ''}Origin: {origin}
                            </button>
                          );
                        })()}

                        {/* Intermediate stops */}
                        {routePoints.map((pt, index) => {
                          const stopSeqIndex = index + 1;
                          const isSelected = selectedIndex === stopSeqIndex;
                          const isCovered = selectedIndex > stopSeqIndex;
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setCurrentLocation(pt.name)
                                setStatus('In Transit')
                              }}
                              className={`px-3 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-secondary border-secondary text-white shadow-sm'
                                  : isCovered
                                  ? 'bg-slate-100 border-slate-200 text-slate-400 font-medium opacity-75'
                                  : 'bg-white border-outline-light text-secondary hover:bg-surface-low'
                              }`}
                            >
                              {isCovered ? '✓ ' : ''}Stop: {pt.name}
                            </button>
                          );
                        })}

                        {/* Destination */}
                        {destination && (() => {
                          const destSeqIndex = stopSequence.length - 1;
                          const isSelected = selectedIndex === destSeqIndex;
                          const isCovered = selectedIndex > destSeqIndex;
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentLocation(destination)
                                setStatus('Delivered')
                              }}
                              className={`px-3 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-green-700 border-green-700 text-white shadow-sm'
                                  : isCovered
                                  ? 'bg-slate-100 border-slate-200 text-slate-400 font-medium opacity-75'
                                  : 'bg-white border-outline-light text-green-700 hover:bg-surface-low'
                              }`}
                            >
                              {isCovered ? '✓ ' : ''}Dest: {destination}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full h-12 bg-secondary text-white text-sm font-bold rounded hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-75"
              >
                <span className="material-symbols-outlined">check_circle</span>
                {saving ? 'Saving...' : 'Save Status Update'}
              </button>
            </form>
          </section>

          {/* Section 2: Progress Timeline */}
          <section className="bg-white border border-outline-light rounded-lg p-6 shadow-sm">
            <h2 className="text-sm font-bold text-secondary mb-8 uppercase tracking-wider">Progress Timeline</h2>
            <div className="relative px-4 pb-4">
              {/* Stepper background line */}
              <div className="hidden md:block absolute top-[20px] left-[20px] right-[20px] h-1 bg-surface-mid rounded z-0">
                <div className="h-full bg-secondary transition-all duration-500 rounded" style={{ width: `${progressPercent}%` }} />
              </div>
              
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
                {stepsToRender.map((step) => (
                  <div key={step._id || step.id} className={`flex flex-row md:flex-col items-center gap-3 md:gap-1 text-left md:text-center z-10 ${step.pending ? 'opacity-40' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                      step.active
                        ? 'bg-secondary text-on-secondary ring-4 ring-secondary/20'
                        : step.done
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-mid text-on-surface-muted'
                    }`}>
                      <span className="material-symbols-outlined text-sm font-bold">{step.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-primary">{step.label}</span>
                      <span className="text-[10px] text-on-surface-muted font-medium">{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Timeline Route logs */}
          <section className="bg-white border border-outline-light rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-light bg-surface-low flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg font-bold">alt_route</span>
                <h2 className="text-xs font-bold text-secondary uppercase tracking-wider">Route Info &amp; Stops</h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-primary">Type: {shipment.shipmentType}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (isEditingRoute) {
                      // Cancel resets fields
                      setOrigin(shipment.origin || '')
                      setDestination(shipment.destination || '')
                      setRoutePoints(shipment.routePoints || [])
                    }
                    setIsEditingRoute(!isEditingRoute)
                  }}
                  className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">{isEditingRoute ? 'close' : 'edit'}</span>
                  {isEditingRoute ? 'Cancel' : 'Edit Route'}
                </button>
              </div>
            </div>

            {isEditingRoute ? (
              <div className="p-6 space-y-6 bg-surface-low">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface-muted">Origin City</label>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-on-surface-muted">Destination City</label>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                    />
                  </div>
                </div>

                {/* Intermediate Stops Editor */}
                <div className="border-t border-outline-light pt-4 space-y-4">
                  <h4 className="text-xs font-bold text-primary">Intermediate Stops &amp; Transit Points</h4>
                  
                  {/* Form to add point */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end bg-white p-3 rounded border border-outline-light shadow-sm">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-on-surface-muted">Point Type</label>
                      <select
                        value={newPoint.type}
                        onChange={(e) => {
                          const newType = e.target.value;
                          const presets = LOCATION_PRESETS[newType] || [];
                          setNewPoint({
                            ...newPoint,
                            type: newType,
                            name: presets[0] || 'Custom',
                            customName: '',
                            state: 'Maharashtra'
                          });
                        }}
                        className="h-9 px-2 bg-white border border-outline-light rounded text-xs outline-none focus:ring-1 focus:ring-secondary"
                      >
                        <option value="City">City</option>
                        <option value="Hub">Transit Hub</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Toll Plaza">Toll Plaza</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-on-surface-muted">Location Name</label>
                      <select
                        value={newPoint.name}
                        onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
                        className="h-9 px-2 bg-white border border-outline-light rounded text-xs outline-none focus:ring-1 focus:ring-secondary"
                      >
                        {(LOCATION_PRESETS[newPoint.type] || []).map(preset => (
                          <option key={preset} value={preset}>{preset}</option>
                        ))}
                        <option value="Custom">-- Custom Write-in --</option>
                      </select>
                    </div>

                    {newPoint.name === 'Custom' ? (
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-on-surface-muted">Custom Name</label>
                        <input
                          type="text"
                          value={newPoint.customName}
                          onChange={(e) => setNewPoint({ ...newPoint, customName: e.target.value })}
                          placeholder="Type location..."
                          className="h-9 px-2 bg-white border border-outline-light rounded text-xs outline-none focus:ring-1 focus:ring-secondary"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-on-surface-muted">State</label>
                        <select
                          value={newPoint.state}
                          onChange={(e) => setNewPoint({ ...newPoint, state: e.target.value })}
                          className="h-9 px-2 bg-white border border-outline-light rounded text-xs outline-none focus:ring-1 focus:ring-secondary"
                        >
                          <option>Maharashtra</option>
                          <option>Delhi</option>
                          <option>Gujarat</option>
                          <option>Punjab</option>
                          <option>Karnataka</option>
                          <option>Rajasthan</option>
                          <option>Madhya Pradesh</option>
                          <option>Haryana</option>
                        </select>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleAddPoint}
                      className="h-9 bg-secondary text-white text-xs font-bold rounded hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Add Stop
                    </button>
                  </div>

                  {/* Interactive stops list */}
                  <div className="relative pl-6 space-y-3 border-l-2 border-dashed border-outline-light">
                    {/* Origin */}
                    <div className="relative flex items-center justify-between bg-white px-3 py-2 rounded border border-outline-light shadow-sm text-xs">
                      <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full border-4 border-white"></div>
                      <span className="font-bold text-primary">Origin: {origin}</span>
                      <span className="text-[10px] text-on-surface-muted font-bold">Start Point</span>
                    </div>

                    {/* Stops */}
                    {routePoints.map((pt, idx) => (
                      <div 
                        key={idx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                        className={`relative flex items-center justify-between bg-white px-3 py-2 rounded border shadow-sm hover:border-secondary/30 transition-all cursor-grab active:cursor-grabbing ${
                          draggedIndex === idx 
                            ? 'opacity-40 border-secondary bg-surface-low shadow-inner' 
                            : 'border-outline-light'
                        }`}
                      >
                        <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full border-4 border-white z-10"></div>
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-on-surface-muted/30 text-[18px] select-none">
                            drag_indicator
                          </span>
                          <div>
                            <span className="px-1.5 py-0.5 bg-primary/10 text-primary font-bold text-[8px] rounded uppercase tracking-wider mr-2">
                              {pt.type}
                            </span>
                            <span className="font-bold text-primary">{pt.name}, {pt.state}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveUp(idx)}
                            className="p-1 hover:bg-surface-low rounded text-on-surface-muted disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                          </button>
                          <button
                            type="button"
                            disabled={idx === routePoints.length - 1}
                            onClick={() => handleMoveDown(idx)}
                            className="p-1 hover:bg-surface-low rounded text-on-surface-muted disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePoint(idx)}
                            className="p-1 hover:bg-red-50 hover:text-red-600 rounded text-on-surface-muted cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Destination */}
                    <div className="relative flex items-center justify-between bg-white px-3 py-2 rounded border border-outline-light shadow-sm text-xs">
                      <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-secondary rounded-full border-4 border-white"></div>
                      <span className="font-bold text-secondary">Destination: {destination}</span>
                      <span className="text-[10px] text-secondary font-bold font-mono">End Point</span>
                    </div>
                  </div>
                </div>

                {/* Save Route Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={saving}
                    className="h-10 px-6 bg-secondary text-white text-xs font-bold rounded hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">save</span>
                    {saving ? 'Saving Route...' : 'Save Route Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                <div className="relative pl-6 space-y-6 border-l-2 border-dashed border-outline-light">
                  
                  {/* Origin */}
                  <div className="relative flex items-start gap-4">
                    <div className="absolute -left-[33px] top-1 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-sm"></div>
                    <div>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold text-[9px] rounded uppercase tracking-wider">Origin</span>
                      <h4 className="text-sm font-bold text-primary mt-1">{shipment.origin}</h4>
                      <p className="text-xs text-on-surface-muted mt-0.5">SLA Dispatch Registered</p>
                    </div>
                  </div>

                  {/* Intermediate Stops */}
                  {shipment.routePoints && shipment.routePoints.map((pt, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className="absolute -left-[33px] top-1 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-sm"></div>
                      <div>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold text-[9px] rounded uppercase tracking-wider">
                          {pt.type}
                        </span>
                        <h4 className="text-sm font-bold text-primary mt-1">{pt.name}, {pt.state}</h4>
                      </div>
                    </div>
                  ))}

                  {/* Destination */}
                  <div className="relative flex items-start gap-4">
                    <div className="absolute -left-[33px] top-1 w-4 h-4 bg-secondary rounded-full border-4 border-white shadow-sm"></div>
                    <div>
                      <span className="px-2 py-0.5 bg-secondary/10 text-secondary font-bold text-[9px] rounded uppercase tracking-wider">Destination</span>
                      <h4 className="text-sm font-bold text-primary mt-1">{shipment.destination}</h4>
                      <p className="text-xs text-on-surface-muted mt-0.5">Final Delivery Location</p>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: Metadata (35%) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Customer Info */}
          <section className="bg-white border border-outline-light rounded overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-light bg-surface-low flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">person_outline</span>
              <h2 className="text-xs font-bold text-secondary uppercase tracking-wider">Customer Details</h2>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center font-extrabold text-white text-lg">
                  {shipment.customerName ? shipment.customerName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <p className="font-bold text-primary">{shipment.customerName || 'Mehar Premium Freight Client'}</p>
                  <p className="text-xs text-on-surface-muted mt-0.5">Registered Customer</p>
                </div>
              </div>
              <div className="space-y-3 pt-2 border-t border-outline-faint">
                <div className="flex justify-between">
                  <span className="text-on-surface-muted text-xs font-bold">Contact Phone</span>
                  <span className="font-bold text-primary">{shipment.phone || '+91 99967 61999'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Driver details */}
          {shipment.driver && (
            <section className="bg-white border border-outline-light rounded overflow-hidden shadow-sm">
              <div className="p-6 border-b border-outline-light bg-surface-low flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">inventory_2</span>
                <h2 className="text-xs font-bold text-secondary uppercase tracking-wider">Assigned Driver</h2>
              </div>
              <div className="p-6 space-y-6 text-sm">
                <div className="flex items-center gap-4">
                  <img
                    alt="Driver avatar"
                    className="w-12 h-12 rounded-full border border-secondary object-cover bg-surface-mid"
                    src={shipment.driver.photoUrl}
                  />
                  <div>
                    <p className="font-bold text-primary">{shipment.driver.name}</p>
                    <p className="text-xs text-on-surface-muted mt-0.5">Highway Operator</p>
                  </div>
                </div>
                <div className="space-y-3 pt-2 border-t border-outline-faint">
                  <div className="flex justify-between">
                    <span className="text-on-surface-muted text-xs font-bold">Vehicle Details</span>
                    <span className="font-bold text-primary">{shipment.vehicle || 'Tata Prima 4028 (HR 55 AT 4421)'}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Quick actions box */}
          <div className="flex flex-col gap-2 p-4 bg-white rounded border-2 border-dashed border-outline-light">
            <p className="text-[10px] text-center font-bold text-on-surface-muted uppercase py-1">Quick Utilities</p>
            <button
              onClick={() => window.print()}
              className="h-10 px-4 text-xs font-bold text-secondary hover:bg-surface-low rounded transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              Print Waybill Document
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`http://localhost:5173/track?id=${shipment.trackingId}`)
                showModal('Link Copied', 'User tracking link copied to clipboard!', 'success')
              }}
              className="h-10 px-4 text-xs font-bold text-secondary hover:bg-surface-low rounded transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">share</span>
              Copy Tracking URL
            </button>
          </div>
        </div>
      </div>
      {/* Custom Modal Dialog */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-outline-light rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4 space-y-4 scale-up-100 transition-all">
            <div className="flex items-center gap-3">
              {modal.type === 'success' && (
                <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
              )}
              {modal.type === 'error' && (
                <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
              )}
              {modal.type === 'info' && (
                <span className="material-symbols-outlined text-secondary text-3xl">info</span>
              )}
              <h3 className="text-lg font-bold text-primary">{modal.title}</h3>
            </div>
            
            <p className="text-sm text-on-surface-muted leading-relaxed">
              {modal.message}
            </p>
            
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 bg-secondary text-white text-xs font-bold rounded hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer animate-pulse-slow"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdateShipment
