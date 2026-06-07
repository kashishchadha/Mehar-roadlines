import React from 'react';

export default function Step3Cargo({ formData, handleChange, handleBack }) {
  return (
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
          className="h-12 px-6 border border-primary text-primary font-bold text-sm rounded hover:bg-surface-low transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
      </div>
    </div>
  );
}
