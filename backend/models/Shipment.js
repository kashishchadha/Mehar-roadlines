const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: String, required: true },
  date: { type: String, required: true },
  done: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  pending: { type: Boolean, default: true }
});

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photoUrl: { type: String },
  phone: { type: String },
  whatsapp: { type: String }
});

const RoutePointSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'City', 'Hub', 'Warehouse', 'Toll Plaza'
  name: { type: String, required: true },
  state: { type: String }
});

const ShipmentSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  currentLocation: { type: String },
  estimatedArrival: { type: String },
  shipmentType: { type: String },
  customerName: { type: String },
  phone: { type: String },
  vehicle: { type: String },
  driver: DriverSchema,
  steps: [StepSchema],
  routePoints: [RoutePointSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Shipment', ShipmentSchema);
