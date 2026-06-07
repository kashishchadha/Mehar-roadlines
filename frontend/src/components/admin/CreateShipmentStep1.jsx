import React from 'react';

export default function Step1Details({ formData, handleChange, idValidation, handleRegenerateId, handleNext }) {
  return (
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
          <label className="text-sm font-bold text-on-surface-muted">Shipment Date &amp; Time</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              name="shipmentDate"
              value={formData.shipmentDate}
              onChange={handleChange}
              className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none w-full"
            />
            <select
              name="shipmentTimeOfDay"
              value={formData.shipmentTimeOfDay}
              onChange={handleChange}
              className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none w-full"
            >
              <option value="Any Time">Any Time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface-muted">Expected Delivery Date &amp; Time</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              name="expectedDeliveryDate"
              value={formData.expectedDeliveryDate}
              onChange={handleChange}
              className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none w-full"
            />
            <select
              name="deliveryTimeOfDay"
              value={formData.deliveryTimeOfDay}
              onChange={handleChange}
              className="h-12 px-4 bg-white border border-outline-light rounded focus:ring-1 focus:ring-secondary focus:border-secondary text-sm outline-none w-full"
            >
              <option value="Any Time">Any Time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-outline-faint">
        <button
          type="button"
          onClick={handleNext}
          className="h-12 px-8 bg-secondary text-white font-bold text-sm rounded hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          Next Route
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
