import React from 'react';

export default function UpdateRouteStops({
  origin,
  setOrigin,
  destination,
  setDestination,
  routePoints,
  setRoutePoints,
  isEditingRoute,
  setIsEditingRoute,
  newPoint,
  setNewPoint,
  handleAddPoint,
  handleRemovePoint,
  handleMoveUp,
  handleMoveDown,
  draggedIndex,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  handleUpdate,
  saving,
  shipment,
  LOCATION_PRESETS
}) {
  return (
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

          <div className="border-t border-outline-light pt-4 space-y-4">
            <h4 className="text-xs font-bold text-primary">Intermediate Stops &amp; Transit Points</h4>
            
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

            <div className="relative pl-6 space-y-3 border-l-2 border-dashed border-outline-light">
              <div className="relative flex items-center justify-between bg-white px-3 py-2 rounded border border-outline-light shadow-sm text-xs">
                <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full border-4 border-white"></div>
                <span className="font-bold text-primary">Origin: {origin}</span>
                <span className="text-[10px] text-on-surface-muted font-bold">Start Point</span>
              </div>

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

              <div className="relative flex items-center justify-between bg-white px-3 py-2 rounded border border-outline-light shadow-sm text-xs">
                <div className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-secondary rounded-full border-4 border-white"></div>
                <span className="font-bold text-secondary">Destination: {destination}</span>
                <span className="text-[10px] text-secondary font-bold font-mono">End Point</span>
              </div>
            </div>
          </div>

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
            <div className="relative flex items-start gap-4">
              <div className="absolute -left-[33px] top-1 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-sm"></div>
              <div>
                <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold text-[9px] rounded uppercase tracking-wider">Origin</span>
                <h4 className="text-sm font-bold text-primary mt-1">{shipment.origin}</h4>
                <p className="text-xs text-on-surface-muted mt-0.5">SLA Dispatch Registered</p>
              </div>
            </div>

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
  );
}
