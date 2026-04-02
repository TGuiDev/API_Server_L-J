const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Informações básicas
  nome: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true,
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
  },
  preco: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo'],
  },
  imagens: [
    {
      type: String, // URL ou caminho da imagem
    },
  ],

  // Categorias
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Categoria é obrigatória'],
  },
  subcategoria: String, // Nome da subcategoria

  // Informações nutricionais
  ingredientes: [
    {
      nome: String,
      quantidade: String, // ex: "100g", "2 unidades"
    },
  ],

  // Disponibilidade
  disponivel: {
    type: Boolean,
    default: true,
  },
  estoque: {
    type: Number,
    default: 0,
  },

  // Dias de disponibilidade
  diasDisponiveis: {
    segunda: { type: Boolean, default: true },
    terca: { type: Boolean, default: true },
    quarta: { type: Boolean, default: true },
    quinta: { type: Boolean, default: true },
    sexta: { type: Boolean, default: true },
    sabado: { type: Boolean, default: false },
    domingo: { type: Boolean, default: false },
  },

  // Avaliações e comentários
  avaliacoes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  mediaAvaliacoes: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalAvaliacoes: {
    type: Number,
    default: 0,
  },

  // Status
  ativo: {
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

// Índice para buscas
productSchema.index({ nome: 'text', descricao: 'text' });

module.exports = mongoose.model('Product', productSchema);
