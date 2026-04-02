const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targets: [{ type: String }], // onde se aplica
  uses: { type: Number, default: 0 },
  perUser: { type: Number, default: 1 },
  type: { type: String, enum: ['percent', 'value'], default: 'percent' },
  value: { type: Number, required: true },
  active: { type: Boolean, default: true },
  requirements: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);
