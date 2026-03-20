const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Informações básicas
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [3, 'Nome deve ter pelo menos 3 caracteres'],
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email deve ser válido'],
  },
  telefone: {
    type: String,
    trim: true,
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
    select: false, // Não retorna senha por padrão nas queries
  },

  // Dados de pagamento (opcional)
  metodosPagamento: [
    {
      tipo: {
        type: String,
        enum: ['pix', 'cartao_credito', 'cartao_debito'],
      },
      principal: {
        type: Boolean,
        default: false,
      },
      // Para Pix
      chavePixType: {
        type: String,
        enum: ['cpf', 'email', 'telefone', 'aleatoria'],
      },
      chavePix: String,
      // Para Cartão
      tipoCartao: {
        type: String,
        enum: ['credito', 'debito'],
      },
      ultimosDados: String, // Últimos 4 dígitos
      titular: String,
      dataSalvo: Date,
    },
  ],

  // Referências a outras coleções
  pedidos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  favoritos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  avaliacoes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  comprovante_pagamentos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PaymentProof',
    },
  ],

  // Status
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  ativo: {
    type: Boolean,
    default: true,
  },

  // Reset de senha
  codigoReset: {
    type: String,
    select: false,
  },
  expiracaoCodigoReset: {
    type: Date,
    select: false,
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

// Hash da senha antes de salvar
userSchema.pre('save', async function (next) {
  // Se a senha não foi modificada, pula o hashing
  if (!this.isModified('senha')) {
    return next();
  }

  try {
    // Gerar salt e hash da senha
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
userSchema.methods.compararSenha = async function (senhaFornecida) {
  return await bcrypt.compare(senhaFornecida, this.senha);
};

// Método para retornar usuário sem a senha
userSchema.methods.toJSON = function () {
  const usuarioObj = this.toObject();
  delete usuarioObj.senha;
  return usuarioObj;
};

// Método para gerar código de reset de senha
userSchema.methods.gerarCodigoReset = function () {
  // Gerar código de 6 dígitos
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash do código para armazenar no banco
  const codigoHash = require('crypto')
    .createHash('sha256')
    .update(codigo)
    .digest('hex');

  this.codigoReset = codigoHash;
  // Expira em 15 minutos
  this.expiracaoCodigoReset = Date.now() + 15 * 60 * 1000;

  return codigo; // Retorna o código em texto puro para ser enviado
};

// Método para verificar se o código de reset é válido
userSchema.methods.verificarCodigoReset = function (codigoFornecido) {
  const crypto = require('crypto');
  const codigoHash = crypto
    .createHash('sha256')
    .update(codigoFornecido)
    .digest('hex');

  const codigoValido = codigoHash === this.codigoReset;
  const naoExpirou = this.expiracaoCodigoReset > Date.now();

  return codigoValido && naoExpirou;
};

// Método para limpar código de reset
userSchema.methods.limparCodigoReset = function () {
  this.codigoReset = undefined;
  this.expiracaoCodigoReset = undefined;
};

module.exports = mongoose.model('User', userSchema);
