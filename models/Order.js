const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  nome: String,
  preco: Number,
  quantidade: {
    type: Number,
    required: true,
    min: 1,
  },
  subtotal: Number,
  observacoes: String, // ex: "sem cebola", "extra queijo"
});

const orderSchema = new mongoose.Schema({
  // Usuário
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Itens do pedido
  itens: [orderItemSchema],

  // Total do pedido
  total: {
    type: Number,
    required: true,
  },

  // Pagamento
  metodosPagamento: {
    tipo: {
      type: String,
      enum: ['pix', 'cartao_credito', 'cartao_debito'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pendente', 'processando', 'aprovado', 'recusado'],
      default: 'pendente',
    },
  },

  // Comprovante
  comprovante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentProof',
  },

  // Entrega
  entrega: {
    tipo: {
      type: String,
      enum: ['retirada', 'entrega'],
      required: true,
    },
    precoEntrega: {
      type: Number,
      default: 0,
    },
    endereco: String, // Se for entrega
    dataPrevista: Date,
    dataRealizada: Date,
  },

  // Status do pedido
  status: {
    type: String,
    enum: ['pendente', 'confirmado', 'preparando', 'pronto', 'entregue', 'cancelado'],
    default: 'pendente',
  },

  // Notas
  observacoes: String,

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

// Índices para buscas rápidas
orderSchema.index({ usuario: 1, criadoEm: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
