const mongoose = require('mongoose');

const storeConfigSchema = new mongoose.Schema({
  // Identificação da loja
  nomeLoja: {
    type: String,
    required: [true, 'Nome da loja é obrigatório'],
  },
  descricao: String,
  logo: String, // URL da logo
  banner: String, // URL do banner

  // Contato
  email: String,
  telefone: String,
  whatsapp: String,

  // Configurações de operação
  operacoes: {
    segunda: {
      aberto: { type: Boolean, default: true },
      abertura: String, // HH:MM
      fechamento: String, // HH:MM
    },
    terca: {
      aberto: { type: Boolean, default: true },
      abertura: String,
      fechamento: String,
    },
    quarta: {
      aberto: { type: Boolean, default: true },
      abertura: String,
      fechamento: String,
    },
    quinta: {
      aberto: { type: Boolean, default: true },
      abertura: String,
      fechamento: String,
    },
    sexta: {
      aberto: { type: Boolean, default: true },
      abertura: String,
      fechamento: String,
    },
    sabado: {
      aberto: { type: Boolean, default: false },
      abertura: String,
      fechamento: String,
    },
    domingo: {
      aberto: { type: Boolean, default: false },
      abertura: String,
      fechamento: String,
    },
  },

  // Rodízio
  rodizio: {
    ativo: {
      type: Boolean,
      default: true,
    },
    diasRodizio: {
      segunda: [String], // Nomes dos produtos disponíveis
      terca: [String],
      quarta: [String],
      quinta: [String],
      sexta: [String],
      sabado: [String],
      domingo: [String],
    },
  },

  // Configurações de entrega
  entrega: {
    aceita: {
      type: Boolean,
      default: true,
    },
    raioEntrega: {
      type: Number, // em km
      default: 5,
    },
    precoEntrega: {
      type: Number,
      default: 0,
    },
    tempoMedio: {
      type: Number, // em minutos
      default: 30,
    },
  },

  // Configurações de pagamento
  pagamento: {
    pixAtivo: {
      type: Boolean,
      default: true,
    },
    cartaoAtivo: {
      type: Boolean,
      default: true,
    },
    dinheiro: {
      type: Boolean,
      default: false,
    },
  },

  // Informações adicionais
  politicaDevolucao: String,
  termoServico: String,
  privacidade: String,

  // Dados para relatórios
  taxaPlatafoma: {
    type: Number,
    default: 0, // percentual
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

module.exports = mongoose.model('StoreConfig', storeConfigSchema);
