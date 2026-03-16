const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Produto avaliado
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },

  // Usuário que avaliou
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Avaliação
  nota: {
    type: Number,
    required: [true, 'Nota é obrigatória'],
    min: 1,
    max: 5,
  },

  // Comentário
  comentario: {
    type: String,
    required: [true, 'Comentário é obrigatório'],
    minlength: [10, 'Comentário deve ter no mínimo 10 caracteres'],
    maxlength: [500, 'Comentário não pode exceder 500 caracteres'],
  },

  // Útil?
  util: {
    sim: {
      type: Number,
      default: 0,
    },
    nao: {
      type: Number,
      default: 0,
    },
  },

  // Status
  aprovado: {
    type: Boolean,
    default: true,
  },

  // Timestamps
  criadoEm: {
    type: Date,
    default: Date.now,
  },
  atualizadoEm: {
    type: Date,
    default: Date.now,
  },
});

// Índice composto para evitar avaliações duplicadas
reviewSchema.index({ produto: 1, usuario: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
