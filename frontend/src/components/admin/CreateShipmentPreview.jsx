import React from 'react';

export default function CreateShipmentPreview({ formData, step, loading, handleSubmit, handleNext }) {
  return (
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
          className="w-full h-14 bg-secondary text-white font-bold rounded shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
        >
          {loading ? 'Processing...' : 'Create Shipment Now'}
          <span className="material-symbols-outlined">rocket_launch</span>
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full h-14 bg-secondary text-white font-bold rounded shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Continue Flow
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      )}
    </div>
  );
}
