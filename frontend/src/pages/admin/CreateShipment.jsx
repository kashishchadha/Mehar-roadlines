import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../utils/apiClient'

import Step1Details from '../../components/admin/CreateShipmentStep1'
import Step2Route from '../../components/admin/CreateShipmentStep2'
import Step3Cargo from '../../components/admin/CreateShipmentStep3'
import CreateShipmentPreview from '../../components/admin/CreateShipmentPreview'

function CreateShipment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
    shipmentTimeOfDay: 'Any Time',
    expectedDeliveryDate: '',
    deliveryTimeOfDay: 'Any Time',
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

  useState(() => {
    const checkInitial = async () => {
      try {
        const initialId = `MR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const res = await apiClient.get(`/shipments/check-id/${initialId}`);
        if (res.data.available) {
          setFormData(prev => ({ ...prev, trackingId: initialId }));
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
      const res = await apiClient.get(`/shipments/check-id/${id.trim()}`);
      setIdValidation({
        checking: false,
        available: res.data.available,
        error: res.data.available ? '' : 'Tracking ID is already in use.'
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
      const res = await apiClient.post('/shipments', formData)
      showModal('Shipment Created', `Shipment ${res.data.shipment.trackingId} created successfully!`, 'success', () => navigate('/admin/dashboard'))
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-[1200px] w-full mx-auto pb-24">
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
          {step === 1 && (
            <Step1Details
              formData={formData}
              handleChange={handleChange}
              idValidation={idValidation}
              handleRegenerateId={handleRegenerateId}
              handleNext={handleNext}
            />
          )}

          {step === 2 && (
            <Step2Route
              formData={formData}
              handleChange={handleChange}
              newPoint={newPoint}
              setNewPoint={setNewPoint}
              handleAddPoint={handleAddPoint}
              handleRemovePoint={handleRemovePoint}
              handleMoveUp={handleMoveUp}
              handleMoveDown={handleMoveDown}
              draggedIndex={draggedIndex}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragEnd={handleDragEnd}
              handleBack={handleBack}
              handleNext={handleNext}
              LOCATION_PRESETS={LOCATION_PRESETS}
            />
          )}

          {step === 3 && (
            <Step3Cargo
              formData={formData}
              handleChange={handleChange}
              handleBack={handleBack}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <CreateShipmentPreview
            formData={formData}
            step={step}
            loading={loading}
            handleSubmit={handleSubmit}
            handleNext={handleNext}
          />
        </div>
      </div>

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
