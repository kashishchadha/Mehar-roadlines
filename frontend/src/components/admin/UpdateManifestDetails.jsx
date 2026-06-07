import React from 'react';

export default function UpdateManifestDetails({
  isEditingDetails,
  setIsEditingDetails,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  driverName,
  setDriverName,
  driverPhone,
  setDriverPhone,
  driverWhatsapp,
  setDriverWhatsapp,
  vehicle,
  setVehicle,
  weight,
  setWeight,
  packagesCount,
  setPackagesCount,
  shipmentType,
  setShipmentType,
  cargoDescription,
  setCargoDescription,
  specialInstructions,
  setSpecialInstructions,
  handleUpdate,
  saving,
  shipment,
  showModal
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-surface-low border border-outline-light rounded-lg px-4 py-3 shadow-sm">
        <h3 className="text-xs font-black text-primary uppercase tracking-wider">Shipment Manifest</h3>
        <button
          type="button"
          onClick={() => {
            if (isEditingDetails) {
              setCustomerName(shipment.customerName || '')
              setCustomerPhone(shipment.phone || '')
              setDriverName(shipment.driver?.name || '')
              setDriverPhone(shipment.driver?.phone || '')
              setDriverWhatsapp(shipment.driver?.whatsapp || '')
              setVehicle(shipment.vehicle || '')
              setWeight(shipment.weight || '')
              setPackagesCount(shipment.packagesCount || '')
              setShipmentType(shipment.shipmentType || 'Full Truck Load (FTL)')
              setCargoDescription(shipment.cargoDescription || '')
              setSpecialInstructions(shipment.specialInstructions || '')
            }
            setIsEditingDetails(!isEditingDetails)
          }}
          className="text-xs font-bold text-secondary hover:text-secondary-dark flex items-center gap-1 cursor-pointer bg-transparent border-none"
        >
          <span className="material-symbols-outlined text-[16px]">{isEditingDetails ? 'close' : 'edit'}</span>
          {isEditingDetails ? 'Cancel Edit' : 'Edit details'}
        </button>
      </div>

      <section className="bg-white border border-outline-light rounded-lg overflow-hidden shadow-sm">
        <div className="p-5 border-b border-outline-light bg-surface-low flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">person_outline</span>
          <h2 className="text-xs font-bold text-secondary uppercase tracking-wider">Customer Details</h2>
        </div>
        <div className="p-5 space-y-4 text-sm">
          {isEditingDetails ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-muted uppercase">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:border-secondary w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-muted uppercase">Contact Phone</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:border-secondary w-full"
                />
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>

      <section className="bg-white border border-outline-light rounded-lg overflow-hidden shadow-sm">
        <div className="p-5 border-b border-outline-light bg-surface-low flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">assignment_ind</span>
          <h2 className="text-xs font-bold text-secondary uppercase tracking-wider">Assigned Driver</h2>
        </div>
        <div className="p-5 space-y-4 text-sm">
          {isEditingDetails ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-muted uppercase">Driver Name</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:border-secondary w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-muted uppercase">Driver Phone</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:border-secondary w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-muted uppercase">WhatsApp Contact</label>
                <input
                  type="text"
                  value={driverWhatsapp}
                  onChange={(e) => setDriverWhatsapp(e.target.value)}
                  className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:border-secondary w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-muted uppercase">Vehicle Details</label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:border-secondary w-full"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <img
                  alt="Driver avatar"
                  className="w-12 h-12 rounded-full border border-secondary object-cover bg-surface-mid"
                  src={shipment.driver?.photoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwsl3zo4ZQrhUQ-4y0ut7mGYIB73kG7EWLiKcaWjkzAiRgEuWBgz3fvQbCd6yhsSYPn2jjVFd7Iy14ifn6mhfjAOqejTw6U7nqs6WMJjWek8F9JWfeyZ6iIN31YIulfDgM8unp7MFYxTKm0L9Y5gHlvqCoXYvW4EAqnCv783DhzHz99DxEVIA0Jt67vo6y8J4jpGRgEXBTW-IozCAO3j8LJX0CGAjC_J2ecvQCEi1oNsu38_L46hohgtKHEy4IUeeTlrAG0tU08xBb'}
                />
                <div>
                  <p className="font-bold text-primary">{shipment.driver?.name || 'Unassigned Driver'}</p>
                  <p className="text-xs text-on-surface-muted mt-0.5">Highway Operator</p>
                </div>
              </div>
              <div className="space-y-3 pt-2 border-t border-outline-faint">
                <div className="flex justify-between">
                  <span className="text-on-surface-muted text-xs font-bold">Driver Phone</span>
                  <span className="font-bold text-primary">{shipment.driver?.phone || 'Not Specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-muted text-xs font-bold">WhatsApp Contact</span>
                  <span className="font-bold text-primary">{shipment.driver?.whatsapp || 'Not Specified'}</span>
                </div>
                <div className="flex justify-between border-t border-outline-faint pt-2 mt-2">
                  <span className="text-on-surface-muted text-xs font-bold">Vehicle Details</span>
                  <span className="font-bold text-primary">{shipment.vehicle || 'Not Specified'}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="bg-white border border-outline-light rounded-lg overflow-hidden shadow-sm">
        <div className="p-5 border-b border-outline-light bg-surface-low flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">inventory_2</span>
          <h2 className="text-xs font-bold text-secondary uppercase tracking-wider">Cargo Details</h2>
        </div>
        <div className="p-5 space-y-4 text-sm">
          {isEditingDetails ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-muted uppercase">Shipment Type</label>
                <select
                  value={shipmentType}
                  onChange={(e) => setShipmentType(e.target.value)}
                  className="h-10 px-2 bg-white border border-outline-light rounded text-xs outline-none focus:border-secondary w-full"
                >
                  <option value="Full Truck Load (FTL)">Full Truck Load (FTL)</option>
                  <option value="Part Truck Load (PTL)">Part Truck Load (PTL)</option>
                  <option value="Express Consignment">Express Consignment</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-muted uppercase">Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:border-secondary w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-muted uppercase">Packages Count</label>
                <input
                  type="number"
                  value={packagesCount}
                  onChange={(e) => setPackagesCount(e.target.value)}
                  className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:border-secondary w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-muted uppercase">Cargo Description</label>
                <input
                  type="text"
                  value={cargoDescription}
                  onChange={(e) => setCargoDescription(e.target.value)}
                  className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:border-secondary w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-muted uppercase">Special Instructions</label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="h-10 px-3 bg-white border border-outline-light rounded text-xs outline-none focus:border-secondary w-full"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-on-surface-muted text-xs font-bold">Shipment Type</span>
                <span className="font-bold text-primary">{shipment.shipmentType || 'Full Truck Load (FTL)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-muted text-xs font-bold">Weight</span>
                <span className="font-bold text-primary">{shipment.weight || 'Not Specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-muted text-xs font-bold">Packages Count</span>
                <span className="font-bold text-primary">{shipment.packagesCount || 'Not Specified'}</span>
              </div>
              <div className="flex justify-between border-t border-outline-faint pt-2 mt-2">
                <span className="text-on-surface-muted text-xs font-bold">Cargo Description</span>
                <span className="font-bold text-primary text-right max-w-[180px] break-words">{shipment.cargoDescription || 'Not Specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-muted text-xs font-bold">Special Instructions</span>
                <span className="font-bold text-primary text-right max-w-[180px] break-words">{shipment.specialInstructions || 'None'}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {isEditingDetails && (
        <button
          type="button"
          onClick={handleUpdate}
          disabled={saving}
          className="w-full h-12 bg-secondary text-white text-sm font-bold rounded hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-75"
        >
          <span className="material-symbols-outlined text-sm">save</span>
          {saving ? 'Saving Manifest...' : 'Save Manifest Changes'}
        </button>
      )}

      <div className="flex flex-col gap-2 p-4 bg-white rounded border-2 border-dashed border-outline-light">
        <p className="text-[10px] text-center font-bold text-on-surface-muted uppercase py-1">Quick Utilities</p>
        <button
          onClick={() => window.print()}
          className="h-10 px-4 text-xs font-bold text-secondary hover:bg-surface-low rounded transition-colors flex items-center justify-center gap-2 border-none bg-transparent cursor-pointer w-full"
        >
          <span className="material-symbols-outlined text-sm">print</span>
          Print Waybill Document
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`http://localhost:5174/track?id=${shipment.trackingId}`)
            showModal('Link Copied', 'User tracking link copied to clipboard!', 'success')
          }}
          className="h-10 px-4 text-xs font-bold text-secondary hover:bg-surface-low rounded transition-colors flex items-center justify-center gap-2 border-none bg-transparent cursor-pointer w-full"
        >
          <span className="material-symbols-outlined text-sm">share</span>
          Copy Tracking URL
        </button>
      </div>
    </div>
  );
}
