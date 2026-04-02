const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantidade: { type: Number, default: 1, min: 1 },
  precoSnapshot: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  itens: [cartItemSchema],
  atualizadoEm: { type: Date, default: Date.now },
  criadoEm: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', cartSchema);
