import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { parseEstimatedArrival, formatDateDDMMYYYY } from '../../utils/dateUtils'
import apiClient from '../../utils/apiClient'

import UpdateStatusForm from '../../components/admin/UpdateStatusForm'
import UpdateRouteStops from '../../components/admin/UpdateRouteStops'
import UpdateManifestDetails from '../../components/admin/UpdateManifestDetails'

function UpdateShipment() {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  
  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [status, setStatus] = useState('')
  const [currentLocation, setCurrentLocation] = useState('')
  const [estimatedArrival, setEstimatedArrival] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTimeOfDay, setDeliveryTimeOfDay] = useState('Any Time')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [driverName, setDriverName] = useState('')
  const [driverPhone, setDriverPhone] = useState('')
  const [driverWhatsapp, setDriverWhatsapp] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [weight, setWeight] = useState('')
  const [packagesCount, setPackagesCount] = useState('')
  const [shipmentType, setShipmentType] = useState('')
  const [cargoDescription, setCargoDescription] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [isEditingDetails, setIsEditingDetails] = useState(false)

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

  const handleCopy = () => {
    if (shipment?.trackingId) {
      navigator.clipboard.writeText(shipment.trackingId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const fetchShipment = async () => {
    try {
      const res = await apiClient.get(`/shipments/${trackingId}`)
      const data = res.data
      setShipment(data)
      setStatus(data.status)
      setCurrentLocation(data.currentLocation || '')
      setEstimatedArrival(data.estimatedArrival || '')
      const parsedEta = parseEstimatedArrival(data.estimatedArrival || data.expectedDeliveryDate || '')
      setDeliveryDate(parsedEta.date)
      setDeliveryTimeOfDay(parsedEta.timeOfDay)
      setOrigin(data.origin || '')
      setDestination(data.destination || '')
      setRoutePoints(data.routePoints || [])

      setCustomerName(data.customerName || '')
      setCustomerPhone(data.phone || '')
      setDriverName(data.driver?.name || '')
      setDriverPhone(data.driver?.phone || '')
      setDriverWhatsapp(data.driver?.whatsapp || '')
      setVehicle(data.vehicle || '')
      setWeight(data.weight || '')
      setPackagesCount(data.packagesCount || '')
      setShipmentType(data.shipmentType || 'Full Truck Load (FTL)')
      setCargoDescription(data.cargoDescription || '')
      setSpecialInstructions(data.specialInstructions || '')
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShipment()
  }, [trackingId])

  const checkDateDiff = (d) => {
    const today = new Date();
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dZero = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffTime = dZero.getTime() - todayZero.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 1;
  };

  const isDeliveryNear = (etaString) => {
    if (!etaString) return false;
    const lower = etaString.toLowerCase().trim();
    if (lower === 'completed' || lower === 'tbd' || lower === 'delivered' || lower === 'pending') return false;
    if (lower.includes('today') || lower.includes('tomorrow')) return true;
    
    try {
      const cleanStr = etaString.replace(/\([^)]*\)/g, '').trim();
      const ddmm = cleanStr.match(/^(\d{2})\s+(\d{2})\s+(\d{4})$/);
      if (ddmm) {
        const d = new Date(Number(ddmm[3]), Number(ddmm[2]) - 1, Number(ddmm[1]));
        return checkDateDiff(d);
      }
      
      const parsed = Date.parse(cleanStr);
      if (!isNaN(parsed)) {
        return checkDateDiff(new Date(parsed));
      }
    } catch (e) {
      // ignore
    }
    return false;
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    
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
        finalRoutePoints.push({
          type: 'City',
          name: currentLocTrim,
          state: 'Maharashtra'
        })
        setRoutePoints(finalRoutePoints)
      }
    }

    try {
      const res = await apiClient.put(`/shipments/${trackingId}`, { 
        status, 
        currentLocation,
        expectedDeliveryDate: deliveryDate,
        deliveryTimeOfDay,
        estimatedArrival: status === 'Delivered' ? 'Completed' : (deliveryDate ? `${deliveryDate}${deliveryTimeOfDay && deliveryTimeOfDay !== 'Any Time' ? ` (${deliveryTimeOfDay})` : ''}` : estimatedArrival),
        origin,
        destination,
        routePoints: finalRoutePoints,
        customerName,
        phone: customerPhone,
        driverName,
        driverPhone,
        driverWhatsapp,
        vehicle,
        weight,
        packagesCount,
        shipmentType,
        cargoDescription,
        specialInstructions
      })
      
      const updatedData = res.data
      setShipment(updatedData)
      setStatus(updatedData.status)
      setCurrentLocation(updatedData.currentLocation || '')
      setEstimatedArrival(updatedData.estimatedArrival || '')
      const parsedEta = parseEstimatedArrival(updatedData.estimatedArrival || updatedData.expectedDeliveryDate || '')
      setDeliveryDate(parsedEta.date)
      setDeliveryTimeOfDay(parsedEta.timeOfDay)
      setOrigin(updatedData.origin || '')
      setDestination(updatedData.destination || '')
      setRoutePoints(updatedData.routePoints || [])

      setCustomerName(updatedData.customerName || '')
      setCustomerPhone(updatedData.phone || '')
      setDriverName(updatedData.driver?.name || '')
      setDriverPhone(updatedData.driver?.phone || '')
      setDriverWhatsapp(updatedData.driver?.whatsapp || '')
      setVehicle(updatedData.vehicle || '')
      setWeight(updatedData.weight || '')
      setPackagesCount(updatedData.packagesCount || '')
      setShipmentType(updatedData.shipmentType || 'Full Truck Load (FTL)')
      setCargoDescription(updatedData.cargoDescription || '')
      setSpecialInstructions(updatedData.specialInstructions || '')

      setIsEditingRoute(false)
      setIsEditingDetails(false)
      showModal('Shipment Updated', 'Shipment record and routes updated successfully!', 'success')
    } catch (err) {
      showModal('Update Failed', err.response?.data?.message || err.message, 'error')
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
      <header className="flex justify-between items-center pb-6 border-b border-outline-light">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 hover:bg-surface-low rounded-full transition-all text-secondary cursor-pointer"
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
            ETA: {formatDateDDMMYYYY(shipment.estimatedArrival)}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        <div className="lg:col-span-6 space-y-8">
          <UpdateStatusForm
            status={status}
            setStatus={setStatus}
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
            deliveryDate={deliveryDate}
            setDeliveryDate={setDeliveryDate}
            deliveryTimeOfDay={deliveryTimeOfDay}
            setDeliveryTimeOfDay={setDeliveryTimeOfDay}
            estimatedArrival={estimatedArrival}
            isDeliveryNear={isDeliveryNear}
            origin={origin}
            destination={destination}
            routePoints={routePoints}
            saving={saving}
            handleUpdate={handleUpdate}
          />

          <section className="bg-white border border-outline-light rounded-lg p-6 shadow-sm">
            <h2 className="text-sm font-bold text-secondary mb-8 uppercase tracking-wider">Progress Timeline</h2>
            <div className="relative px-4 pb-4">
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

          <UpdateRouteStops
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
            routePoints={routePoints}
            setRoutePoints={setRoutePoints}
            isEditingRoute={isEditingRoute}
            setIsEditingRoute={setIsEditingRoute}
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
            handleUpdate={handleUpdate}
            saving={saving}
            shipment={shipment}
            LOCATION_PRESETS={LOCATION_PRESETS}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <UpdateManifestDetails
            isEditingDetails={isEditingDetails}
            setIsEditingDetails={setIsEditingDetails}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            driverName={driverName}
            setDriverName={setDriverName}
            driverPhone={driverPhone}
            setDriverPhone={setDriverPhone}
            driverWhatsapp={driverWhatsapp}
            setDriverWhatsapp={setDriverWhatsapp}
            vehicle={vehicle}
            setVehicle={setVehicle}
            weight={weight}
            setWeight={setWeight}
            packagesCount={packagesCount}
            setPackagesCount={setPackagesCount}
            shipmentType={shipmentType}
            setShipmentType={setShipmentType}
            cargoDescription={cargoDescription}
            setCargoDescription={setCargoDescription}
            specialInstructions={specialInstructions}
            setSpecialInstructions={setSpecialInstructions}
            handleUpdate={handleUpdate}
            saving={saving}
            shipment={shipment}
            showModal={showModal}
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

export default UpdateShipment
