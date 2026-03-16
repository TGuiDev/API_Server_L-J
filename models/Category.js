const mongoose = require('mongoose');

// Schema para subcategorias
const subCategoriaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da subcategoria é obrigatório'],
    trim: true,
  },
  descricao: String,
  icone: String, // URL da imagem/ícone
});

// Schema para categorias
const categoriaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da categoria é obrigatório'],
    unique: true,
    trim: true,
  },
  descricao: String,
  icone: String, // URL da imagem/ícone
  subcategorias: [subCategoriaSchema],
  ativo: {
    type: Boolean,
    default: true,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
  atualizadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Category', categoriaSchema);
