const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  origin: { type: String },
  destination: { type: String },
  message: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inquiry', InquirySchema);
