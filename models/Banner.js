const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: { type: String },
  imagePath: { type: String },
  actionType: { type: String, enum: ['none', 'url', 'produto', 'categoria', 'subcategoria', 'promocao'], default: 'none' },
  actionTarget: { type: String },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Banner', BannerSchema);
