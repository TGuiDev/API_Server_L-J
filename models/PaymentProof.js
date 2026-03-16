const mongoose = require('mongoose');

const paymentProofSchema = new mongoose.Schema({
  // Referências
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pedido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },

  // Tipo de pagamento
  tipoPagamento: {
    type: String,
    enum: ['pix', 'cartao_credito', 'cartao_debito', 'outro'],
    required: true,
  },

  // Informações do comprovante
  valor: {
    type: Number,
    required: true,
  },
  dataTransacao: {
    type: Date,
    required: true,
  },

  // Pix específico
  pixId: String, // ID da transação Pix
  pixKey: String, // Chave Pix utilizada
  qrCode: String, // URL ou dados do QR code

  // Cartão específico
  ultimosDados: String, // Últimos 4 dígitos
  tranactionId: String, // ID da transação da operadora

  // Arquivo/Comprovante
  comprovante: {
    arquivo: String, // URL da imagem/PDF
    tipo: String, // 'image' ou 'pdf'
  },

  // Status
  status: {
    type: String,
    enum: ['pendente', 'confirmado', 'recusado', 'reembolsado'],
    default: 'pendente',
  },

  // Timestamps
  criadoEm: {
    type: Date,
    default: Date.now,
  },
  confirmadoEm: Date,
});

// Índices
paymentProofSchema.index({ usuario: 1, criadoEm: -1 });
paymentProofSchema.index({ pedido: 1 });
paymentProofSchema.index({ status: 1 });

module.exports = mongoose.model('PaymentProof', paymentProofSchema);
