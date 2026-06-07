import React from 'react';

export default function Step2Route({
  formData,
  handleChange,
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
  handleBack,
  handleNext,
  LOCATION_PRESETS
}) {
  return (
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

      <div className="border border-outline-light rounded-lg p-6 bg-surface-low space-y-6">
        <h4 className="text-sm font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">alt_route</span>
          Route Stops &amp; Hubs Builder
        </h4>
        
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

        <div className="space-y-4">
          <p className="text-xs font-bold text-on-surface-muted">Route Timeline preview:</p>
          
          <div className="relative pl-6 space-y-4 border-l-2 border-dashed border-outline-light">
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
          className="h-12 px-6 border border-primary text-primary font-bold text-sm rounded hover:bg-surface-low transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="h-12 px-8 bg-secondary text-white font-bold text-sm rounded hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          Next Info
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
