const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targets: [{ type: String }], // formato: 'produto:id' | 'categoria:id' | 'subcategoria:id'
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Promotion', PromotionSchema);
