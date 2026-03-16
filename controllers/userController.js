const User = require('../models/User');
const { NotFoundError, ValidationError, ConflictError } = require('../config/errors');

// Listar todos os usuários (apenas admin)
const listarTodos = async (req, res) => {
  const usuarios = await User.find()
    .select('-senha')
    .populate('pedidos')
    .sort({ criadoEm: -1 });

  return res.status(200).json({
    success: true,
    total: usuarios.length,
    data: usuarios,
  });
};

// Obter usuário por ID
const obterPorId = async (req, res) => {
  const usuario = await User.findById(req.params.id)
    .select('-senha')
    .populate('pedidos')
    .populate('favoritos', 'nome preco imagem')
    .populate('avaliacoes');

  if (!usuario) {
    throw new NotFoundError('Usuário não encontrado');
  }

  return res.status(200).json({
    success: true,
    data: usuario,
  });
};

// Atualizar perfil do usuário
const atualizarPerfil = async (req, res) => {
  const { nome, telefone } = req.body;

  const usuario = await User.findByIdAndUpdate(
    req.user.id,
    { nome, telefone, atualizadoEm: new Date() },
    { new: true, runValidators: true }
  ).select('-senha');

  return res.status(200).json({
    success: true,
    message: 'Perfil atualizado com sucesso',
    data: usuario,
  });
};

// Adicionar método de pagamento
const adicionarMetodoPagamento = async (req, res) => {
  const { tipo, chavePixType, chavePix, tipoCartao, ultimosDados, titular } = req.body;

  const usuario = await User.findById(req.user.id);

  // Validar tipo de pagamento
  if (!['pix', 'cartao_credito', 'cartao_debito'].includes(tipo)) {
    throw new ValidationError('Tipo de pagamento inválido');
  }

  const novometodo = { tipo, dataSalvo: new Date() };

  if (tipo === 'pix') {
    novometodo.chavePixType = chavePixType;
    novometodo.chavePix = chavePix;
  } else {
    novometodo.tipoCartao = tipoCartao;
    novometodo.ultimosDados = ultimosDados;
    novometodo.titular = titular;
  }

  usuario.metodosPagamento.push(novometodo);
  await usuario.save();

  return res.status(201).json({
    success: true,
    message: 'Método de pagamento adicionado',
    data: usuario.toJSON(),
  });
};

// Remover método de pagamento
const removerMetodoPagamento = async (req, res) => {
  const { metodoPagamentoId } = req.params;

  const usuario = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { metodosPagamento: { _id: metodoPagamentoId } } },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: 'Método de pagamento removido',
    data: usuario.toJSON(),
  });
};

// Adicionar produto aos favoritos
const adicionarFavorito = async (req, res) => {
  const { produtoId } = req.params;

  const usuario = await User.findById(req.user.id);

  if (usuario.favoritos.includes(produtoId)) {
    throw new ConflictError('Produto já está nos favoritos');
  }

  usuario.favoritos.push(produtoId);
  await usuario.save();

  return res.status(201).json({
    success: true,
    message: 'Adicionado aos favoritos',
    data: usuario.toJSON(),
  });
};

// Remover produto dos favoritos
const removerFavorito = async (req, res) => {
  const { produtoId } = req.params;

  const usuario = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { favoritos: produtoId } },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: 'Removido dos favoritos',
    data: usuario.toJSON(),
  });
};

// Listar favoritos do usuário
const listarFavoritos = async (req, res) => {
  const usuario = await User.findById(req.user.id).populate('favoritos');

  return res.status(200).json({
    success: true,
    total: usuario.favoritos.length,
    data: usuario.favoritos,
  });
};

// Deletar usuário (própria conta)
const deletarConta = async (req, res) => {
  await User.findByIdAndDelete(req.user.id);

  return res.status(200).json({
    success: true,
    message: 'Conta deletada com sucesso',
  });
};

module.exports = {
  listarTodos,
  obterPorId,
  atualizarPerfil,
  adicionarMetodoPagamento,
  removerMetodoPagamento,
  adicionarFavorito,
  removerFavorito,
  listarFavoritos,
  deletarConta,
};
