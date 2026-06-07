import React from 'react';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';

export default function UpdateStatusForm({
  status,
  setStatus,
  currentLocation,
  setCurrentLocation,
  deliveryDate,
  setDeliveryDate,
  deliveryTimeOfDay,
  setDeliveryTimeOfDay,
  estimatedArrival,
  isDeliveryNear,
  origin,
  destination,
  routePoints,
  saving,
  handleUpdate
}) {
  const stopSequence = [origin, ...routePoints.map(pt => pt.name), destination].filter(Boolean);
  const selectedIndex = stopSequence.findIndex(name => currentLocation.trim().toLowerCase() === name.trim().toLowerCase());

  return (
    <section className="bg-white border border-outline-light rounded-lg p-6 shadow-sm">
      <h2 className="text-sm font-bold text-secondary mb-6 flex items-center gap-2 uppercase tracking-wider">
        <span className="material-symbols-outlined">sync_alt</span>
        Update Shipment Status
      </h2>

      <form onSubmit={handleUpdate} className="space-y-6">
        {isDeliveryNear(estimatedArrival) && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-xs font-semibold flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0">warning</span>
            <div>
              <p className="font-bold text-red-700">Delivery Deadline Approaching</p>
              <p className="mt-0.5 text-red-600 font-medium">Estimated arrival is today or tomorrow. Please update the delivery date/ETA to prevent outdated status alerts.</p>
            </div>
          </div>
        )}

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
                className={`flex flex-col items-center justify-center p-4 rounded border-2 transition-all gap-2 cursor-pointer ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-bold text-on-surface-muted block">Where is the truck now? (Current Location)</label>
              <input
                type="text"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="e.g. Near Vadodara Toll Plaza, NH-48"
                className="w-full h-12 bg-white border border-outline-light rounded px-4 focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-on-surface-muted block">Delivery Date &amp; Time (ETA)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full h-12 bg-white border border-outline-light rounded px-4 focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                />
                <select
                  value={deliveryTimeOfDay}
                  onChange={(e) => setDeliveryTimeOfDay(e.target.value)}
                  className="w-full h-12 bg-white border border-outline-light rounded px-4 focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none"
                >
                  <option value="Any Time">Any Time</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-on-surface-muted flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">ads_click</span>
              Quick Select from Route stops:
            </span>
            <div className="flex flex-wrap gap-2">
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
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full h-12 bg-secondary text-white text-sm font-bold rounded hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-75 cursor-pointer"
        >
          <span className="material-symbols-outlined">check_circle</span>
          {saving ? 'Saving...' : 'Save Status Update'}
        </button>
      </form>
    </section>
  );
}
