import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateShipment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    trackingId: `MR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    shipmentType: 'Full Truck Load (FTL)',
    customerName: '',
    phone: '',
    originCity: '',
    originState: 'Maharashtra',
    destinationCity: '',
    destinationState: 'Gujarat',
    shipmentDate: '',
    expectedDeliveryDate: '',
    cargoDescription: '',
    weight: '',
    packagesCount: '',
    specialInstructions: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    department: 'Operations',
    routePoints: []
  })

  const [idValidation, setIdValidation] = useState({
    checking: false,
    available: true,
    error: ''
  })

  // Debounced live check for Tracking ID availability
  useState(() => {
    // Check initial random ID availability
    const checkInitial = async () => {
      try {
        const initialId = `MR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const res = await fetch(`http://localhost:5000/api/shipments/check-id/${initialId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.available) {
            setFormData(prev => ({ ...prev, trackingId: initialId }));
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkInitial();
  });

  const checkIdAvailability = async (id) => {
    if (!id || !id.trim()) {
      setIdValidation({ checking: false, available: false, error: 'Tracking ID cannot be empty.' });
      return;
    }
    setIdValidation(prev => ({ ...prev, checking: true, error: '' }));
    try {
      const res = await fetch(`http://localhost:5000/api/shipments/check-id/${id.trim()}`);
      if (!res.ok) throw new Error('Failed to validate ID');
      const data = await res.json();
      setIdValidation({
        checking: false,
        available: data.available,
        error: data.available ? '' : 'Tracking ID is already in use.'
      });
    } catch (err) {
      setIdValidation({
        checking: false,
        available: true,
        error: ''
      });
    }
  }

  const handleRegenerateId = () => {
    const newId = `MR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setFormData(prev => ({ ...prev, trackingId: newId }));
    checkIdAvailability(newId);
  }

  useEffect(() => {
    if (formData.trackingId) {
      const timer = setTimeout(() => {
        checkIdAvailability(formData.trackingId);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [formData.trackingId]);

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
      ...formData.routePoints,
      { type: newPoint.type, name: nameToAdd, state: newPoint.state }
    ];
    setFormData({ ...formData, routePoints: updatedPoints });
    
    // Set default preset for next select
    const nextPresets = LOCATION_PRESETS[newPoint.type] || [];
    setNewPoint({ ...newPoint, name: nextPresets[0] || 'Custom', customName: '' });
  };

  const handleRemovePoint = (index) => {
    const updatedPoints = formData.routePoints.filter((_, i) => i !== index);
    setFormData({ ...formData, routePoints: updatedPoints });
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updatedPoints = [...formData.routePoints];
    const temp = updatedPoints[index];
    updatedPoints[index] = updatedPoints[index - 1];
    updatedPoints[index - 1] = temp;
    setFormData({ ...formData, routePoints: updatedPoints });
  };

  const handleMoveDown = (index) => {
    if (index === formData.routePoints.length - 1) return;
    const updatedPoints = [...formData.routePoints];
    const temp = updatedPoints[index];
    updatedPoints[index] = updatedPoints[index + 1];
    updatedPoints[index + 1] = temp;
    setFormData({ ...formData, routePoints: updatedPoints });
  };

  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, overIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === overIndex) return

    const items = [...formData.routePoints]
    const draggedItem = items[draggedIndex]
    items.splice(draggedIndex, 1)
    items.splice(overIndex, 0, draggedItem)

    setDraggedIndex(overIndex)
    setFormData({ ...formData, routePoints: items })
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.customerName || !formData.phone || !formData.originCity) {
        setError('Please fill in Customer Name, Contact, and Origin City.')
        return
      }
      if (!idValidation.available) {
        setError(idValidation.error || 'The selected Tracking ID is already in use. Please enter a different ID.')
        return
      }
      if (idValidation.checking) {
        setError('Validating Tracking ID uniqueness. Please wait...')
        return
      }
    } else if (step === 2) {
      if (!formData.destinationCity) {
        setError('Please fill in Delivery Destination City.')
        return
      }
    }
    setError(null)
    setStep(step + 1)
  }

  const handleBack = () => {
    setError(null)
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:5000/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to create shipment')
      }

      const result = await res.json()
      showModal('Shipment Created', `Shipment ${result.shipment.trackingId} created successfully!`, 'success', () => navigate('/admin/dashboard'))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-[1200px] w-full mx-auto pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-8 text-sm text-on-surface-muted">
        <Link to="/admin/dashboard" className="hover:text-secondary font-medium">Dashboard</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-bold">New Shipment</span>
      </nav>

      <div className="mb-10 pb-6 border-b border-outline-light flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Create New Shipment</h1>
          <p className="text-sm text-on-surface-muted mt-1">Register a new cargo entry in the digital log.</p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded flex items-center justify-center font-bold ${
              step > 1 ? 'bg-secondary text-white' : 'bg-secondary text-white ring-4 ring-white/30'
            }`}>
              {step > 1 ? <span className="material-symbols-outlined text-lg">check</span> : '1'}
            </div>
            <span className="text-xs font-bold text-primary">Details</span>
          </div>
          <div className={`w-8 h-[2px] ${step > 1 ? 'bg-secondary' : 'bg-outline-light'}`}></div>
          
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded flex items-center justify-center font-bold ${
              step > 2 ? 'bg-secondary text-white' : step === 2 ? 'bg-secondary text-white ring-4 ring-white/30' : 'bg-surface-mid text-on-surface-muted'
            }`}>
              {step > 2 ? <span className="material-symbols-outlined text-lg">check</span> : '2'}
            </div>
            <span className={`text-xs font-bold ${step >= 2 ? 'text-primary' : 'text-on-surface-muted'}`}>Route</span>
          </div>
          <div className={`w-8 h-[2px] ${step > 2 ? 'bg-secondary' : 'bg-outline-light'}`}></div>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded flex items-center justify-center font-bold ${
              step === 3 ? 'bg-secondary text-white ring-4 ring-white/30' : 'bg-surface-mid text-on-surface-muted'
            }`}>
              3
            </div>
            <span className={`text-xs font-bold ${step === 3 ? 'text-primary' : 'text-on-surface-muted'}`}>Cargo</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Shipment Details */}
          {step === 1 && (
            <div className="bg-white border border-outline-light p-8 rounded-xl shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-outline-light pb-4">
                <span className="material-symbols-outlined text-primary text-3xl">assignment</span>
                <h3 className="text-xl font-bold text-primary">Basic Shipment Info</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted flex justify-between items-center">
                    <span>Tracking ID (Auto or Custom)</span>
                    {idValidation.checking && (
                      <span className="text-xs text-secondary flex items-center gap-1 font-medium animate-pulse">
                        <span className="material-symbols-outlined animate-spin text-[14px]">refresh</span>
                        Validating...
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="trackingId"
                      value={formData.trackingId}
                      onChange={handleChange}
                      placeholder="e.g. MR-2026-12345"
                      className={`h-12 px-4 flex-grow bg-white border rounded text-sm outline-none font-mono font-bold tracking-wider ${
                        idValidation.available === false
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500 text-red-700'
                          : idValidation.available === true && formData.trackingId
                          ? 'border-green-500 focus:ring-1 focus:ring-green-500 focus:border-green-500 text-green-700'
                          : 'border-outline-light focus:ring-1 focus:ring-secondary focus:border-secondary'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleRegenerateId}
                      className="w-12 h-12 bg-surface-low border border-outline-light hover:bg-surface-mid active:scale-95 rounded flex items-center justify-center text-on-surface-muted cursor-pointer transition-all"
                      title="Generate Random ID"
                    >
                      <span className="material-symbols-outlined text-lg">autorenew</span>
                    </button>
                  </div>
                  {formData.trackingId && (
                    <div className="text-xs mt-0.5">
                      {idValidation.available === false && (
                        <p className="text-red-600 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">cancel</span>
                          {idValidation.error}
                        </p>
                      )}
                      {idValidation.available === true && !idValidation.checking && (
                        <p className="text-green-600 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          ID is unique and available.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Shipment Type</label>
                  <select
                    name="shipmentType"
                    value={formData.shipmentType}
                    onChange={handleChange}
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  >
                    <option>Full Truck Load (FTL)</option>
                    <option>Less than Truckload (LTL)</option>
                    <option>Express Delivery</option>
                    <option>Bulk Cargo</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Enter Full Legal Name or Company"
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Phone / Contact</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-muted font-bold text-sm">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      className="w-full h-12 pl-14 pr-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Origin City</label>
                  <input
                    type="text"
                    name="originCity"
                    value={formData.originCity}
                    onChange={handleChange}
                    placeholder="e.g. Delhi"
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Shipment Date</label>
                  <input
                    type="date"
                    name="shipmentDate"
                    value={formData.shipmentDate}
                    onChange={handleChange}
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Expected Delivery Date</label>
                  <input
                    type="date"
                    name="expectedDeliveryDate"
                    value={formData.expectedDeliveryDate}
                    onChange={handleChange}
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-outline-faint">
                <button
                  type="button"
                  onClick={handleNext}
                  className="h-12 px-8 bg-secondary text-white font-bold text-sm rounded hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
                >
                  Next Route
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Route Details */}
          {step === 2 && (
            <div className="bg-white border border-outline-light p-8 rounded-xl shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-outline-light pb-4">
                <span className="material-symbols-outlined text-primary text-3xl">map</span>
                <h3 className="text-xl font-bold text-primary">Destination &amp; Route Setup</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Origin City (Confirmed)</label>
                  <input
                    type="text"
                    disabled
                    value={formData.originCity}
                    className="h-12 px-4 bg-surface-low border border-outline-light rounded text-on-surface-muted cursor-not-allowed text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Origin State</label>
                  <select
                    name="originState"
                    value={formData.originState}
                    onChange={handleChange}
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  >
                    <option>Maharashtra</option>
                    <option>Delhi</option>
                    <option>Gujarat</option>
                    <option>Punjab</option>
                    <option>Karnataka</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Destination City</label>
                  <input
                    type="text"
                    name="destinationCity"
                    value={formData.destinationCity}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Destination State</label>
                  <select
                    name="destinationState"
                    value={formData.destinationState}
                    onChange={handleChange}
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  >
                    <option>Gujarat</option>
                    <option>Maharashtra</option>
                    <option>Karnataka</option>
                    <option>Rajasthan</option>
                    <option>Delhi</option>
                  </select>
                </div>
              </div>

              {/* Map Placeholder Decoration */}
              <div className="relative w-full h-[180px] rounded-lg overflow-hidden border border-outline-light bg-surface-mid">
                <img
                  className="w-full h-full object-cover grayscale opacity-80"
                  alt="Logistics Map representation"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuASQ83Iu-UWn9Xp3lCh_V-s6AJREpYtKxZO8UESIiTTQt9W-xCuXVlQxiDznRdHgzy2YSNiVLXJoHFBP-hmEenKapx96TBelJJyEuyeqy9a9NJPRzoDnzhvT4HSK7l6ZYwJbLov5bIsMgiYGA4laiHsAMqjJlfildF4iwe2mOONmTgb2CCzppx-0nTAARrHlCsqV96HNpwNBVv_5VF5UbpWoIiWtQ8qC_EEIcKTPzi9DZPabjIg1d9i00NlQkFYiRQxLQYXOX4h1Fmz"
                />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded border border-outline-light text-xs font-bold text-primary shadow-sm">
                  Estimated Distance: 780 km
                </div>
              </div>

              {/* Intermediate Stops Route Builder */}
              <div className="border border-outline-light rounded-lg p-6 bg-surface-low space-y-6">
                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">alt_route</span>
                  Route Stops &amp; Hubs Builder
                </h4>
                
                {/* Form to add point */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end bg-white p-4 rounded border border-outline-light">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-on-surface-muted">Point Type</label>
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
                      className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                    >
                      <option value="City">City</option>
                      <option value="Hub">Transit Hub</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Toll Plaza">Toll Plaza</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-on-surface-muted">Location Name</label>
                    <select
                      value={newPoint.name}
                      onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
                      className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                    >
                      {(LOCATION_PRESETS[newPoint.type] || []).map(preset => (
                        <option key={preset} value={preset}>{preset}</option>
                      ))}
                      <option value="Custom">-- Custom Write-in --</option>
                    </select>
                  </div>

                  {newPoint.name === 'Custom' ? (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-on-surface-muted">Custom Name</label>
                      <input
                        type="text"
                        value={newPoint.customName}
                        onChange={(e) => setNewPoint({ ...newPoint, customName: e.target.value })}
                        placeholder="Type location name..."
                        className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-on-surface-muted">State</label>
                      <select
                        value={newPoint.state}
                        onChange={(e) => setNewPoint({ ...newPoint, state: e.target.value })}
                        className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
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
                    className="h-10 bg-secondary text-white text-xs font-bold rounded hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Add Stop
                  </button>
                </div>

                {/* Timeline display of stops */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-on-surface-muted">Route Timeline preview:</p>
                  
                  <div className="relative pl-6 space-y-4 border-l-2 border-dashed border-outline-light">
                    
                    {/* Origin (Fixed) */}
                    <div className="relative flex items-center justify-between bg-white p-3 rounded border border-outline-light shadow-sm">
                      <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-sm"></div>
                      <div>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold text-[9px] rounded uppercase tracking-wider">Origin</span>
                        <h5 className="text-xs font-bold text-primary mt-0.5">
                          {formData.originCity || 'Unspecified Origin'}, {formData.originState}
                        </h5>
                      </div>
                      <span className="text-[10px] text-on-surface-muted font-bold">Start Depot</span>
                    </div>

                    {/* Intermediate Points */}
                    {formData.routePoints.map((pt, idx) => (
                      <div 
                        key={idx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                        className={`relative flex items-center justify-between bg-white p-3 rounded border shadow-sm hover:border-secondary/30 transition-all cursor-grab active:cursor-grabbing ${
                          draggedIndex === idx 
                            ? 'opacity-40 border-secondary bg-surface-low shadow-inner' 
                            : 'border-outline-light'
                        }`}
                      >
                        <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-sm z-10"></div>
                        
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-on-surface-muted/30 text-[18px] select-none">
                            drag_indicator
                          </span>
                          <div>
                            <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold text-[9px] rounded uppercase tracking-wider">
                              {pt.type}
                            </span>
                            <h5 className="text-xs font-bold text-primary mt-0.5">
                              {pt.name}, {pt.state}
                            </h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveUp(idx)}
                            className="p-1 hover:bg-surface-low rounded text-on-surface-muted disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            title="Move Up"
                          >
                            <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                          </button>
                          <button
                            type="button"
                            disabled={idx === formData.routePoints.length - 1}
                            onClick={() => handleMoveDown(idx)}
                            className="p-1 hover:bg-surface-low rounded text-on-surface-muted disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            title="Move Down"
                          >
                            <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePoint(idx)}
                            className="p-1 hover:bg-red-50 hover:text-red-600 rounded text-on-surface-muted/65 cursor-pointer ml-1"
                            title="Remove Point"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Destination (Fixed) */}
                    <div className="relative flex items-center justify-between bg-white p-3 rounded border border-outline-light shadow-sm">
                      <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-4 h-4 bg-secondary rounded-full border-4 border-white shadow-sm"></div>
                      <div>
                        <span className="px-2 py-0.5 bg-secondary/10 text-secondary font-bold text-[9px] rounded uppercase tracking-wider">Destination</span>
                        <h5 className="text-xs font-bold text-primary mt-0.5">
                          {formData.destinationCity || 'Unspecified Destination'}, {formData.destinationState}
                        </h5>
                      </div>
                      <span className="text-[10px] text-secondary font-bold">Final Delivery</span>
                    </div>

                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-outline-faint">
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-12 px-6 border border-primary text-primary font-bold text-sm rounded hover:bg-surface-low transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="h-12 px-8 bg-secondary text-white font-bold text-sm rounded hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
                >
                  Next Info
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact & Load */}
          {step === 3 && (
            <div className="bg-white border border-outline-light p-8 rounded-xl shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-outline-light pb-4">
                <span className="material-symbols-outlined text-primary text-3xl">inventory_2</span>
                <h3 className="text-xl font-bold text-primary">Load &amp; Driver Contact</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Contact Person Name</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Receiver/Agent name"
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+91 99999 99999"
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Cargo Description</label>
                  <input
                    type="text"
                    name="cargoDescription"
                    value={formData.cargoDescription}
                    onChange={handleChange}
                    placeholder="e.g. Steel Sheets, Industrial Gears"
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted font-mono">Weight (Tonnes)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full h-12 px-4 pr-12 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-muted/60">MT</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Packages Count</label>
                  <input
                    type="number"
                    name="packagesCount"
                    value={formData.packagesCount}
                    onChange={handleChange}
                    placeholder="Count"
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Special Instructions</label>
                  <input
                    type="text"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    placeholder="Fragile handling, etc."
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-on-surface-muted">Assigned Driver Name</label>
                  <input
                    type="text"
                    name="driverName"
                    value={formData.driverName || ''}
                    onChange={handleChange}
                    placeholder="e.g. Sarabjit Singh"
                    className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-outline-faint">
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-12 px-6 border border-primary text-primary font-bold text-sm rounded hover:bg-surface-low transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary & Final Action */}
        <div className="lg:col-span-1">
          <div className="sticky top-[96px] space-y-6">
            <div className="bg-white border-l-8 border-l-primary border border-outline-light rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">info</span>
                <div>
                  <h3 className="text-lg font-bold text-primary">Shipment Preview</h3>
                  <p className="text-xs text-on-surface-muted mt-1">SLA calculation will apply on dispatch.</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-outline-faint text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-muted">Customer</span>
                  <span className="font-bold text-primary truncate max-w-[120px]">{formData.customerName || 'None'}</span>
                </div>
                <div className="flex justify-between flex-col gap-1 border-b border-outline-faint pb-2">
                  <div className="flex justify-between w-full">
                    <span className="text-on-surface-muted">Route</span>
                    <span className="font-bold text-primary truncate max-w-[150px]">
                      {formData.originCity || 'TBD'} → {formData.destinationCity || 'TBD'}
                    </span>
                  </div>
                  {formData.routePoints?.length > 0 && (
                    <span className="text-[10px] font-bold text-secondary text-right block">
                      + {formData.routePoints.length} intermediate stop{formData.routePoints.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-muted">Type</span>
                  <span className="font-bold text-secondary">{formData.shipmentType}</span>
                </div>
              </div>
            </div>

            {step === 3 ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-14 bg-secondary text-white font-bold rounded shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {loading ? 'Processing...' : 'Create Shipment Now'}
                <span className="material-symbols-outlined">rocket_launch</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full h-14 bg-secondary text-white font-bold rounded shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Continue Flow
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            )}
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

// Inline helper for breadcrumb linking since React Router is initialized
function Link({ to, children, className }) {
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault()
        window.history.pushState({}, '', to)
        window.dispatchEvent(new PopStateEvent('popstate'))
      }}
      className={className}
    >
      {children}
    </a>
  )
}

export default CreateShipment
