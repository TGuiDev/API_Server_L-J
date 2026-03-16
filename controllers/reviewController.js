const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { NotFoundError, ValidationError, ConflictError } = require('../config/errors');

// Listar avaliações de um produto
const listarPorProduto = async (req, res) => {
  const { produtoId } = req.params;
  const { aprovado } = req.query;

  const filtro = { produto: produtoId };

  if (aprovado === 'true') {
    filtro.aprovado = true;
  } else if (aprovado === 'false') {
    filtro.aprovado = false;
  }

  const avaliacoes = await Review.find(filtro)
    .populate('usuario', 'nome')
    .sort({ criadoEm: -1 });

  return res.status(200).json({
    success: true,
    total: avaliacoes.length,
    data: avaliacoes,
  });
};

// Obter avaliação por ID
const obterPorId = async (req, res) => {
  const avaliacao = await Review.findById(req.params.id)
    .populate('usuario', 'nome email')
    .populate('produto', 'nome');

  if (!avaliacao) {
    throw new NotFoundError('Avaliação não encontrada');
  }

  return res.status(200).json({
    success: true,
    data: avaliacao,
  });
};

// Criar avaliação
const criar = async (req, res) => {
  const { produtoId } = req.params;
  const { nota, comentario } = req.body;

  // Verificar se produto existe
  const produto = await Product.findById(produtoId);
  if (!produto) {
    throw new NotFoundError('Produto não encontrado');
  }

  // Verificar se usuário já avaliou este produto
  const jaAvaliou = await Review.findOne({
    produto: produtoId,
    usuario: req.user.id,
  });

  if (jaAvaliou) {
    throw new ConflictError('Você já avaliou este produto');
  }

  // Verificar se usuário comprou o produto
  const pedidoComProduto = await Order.findOne({
    usuario: req.user.id,
    'itens.produto': produtoId,
    status: 'entregue',
  });

  if (!pedidoComProduto) {
    throw new ValidationError('Você só pode avaliar produtos que comprou e recebeu');
  }

  const avaliacao = await Review.create({
    produto: produtoId,
    usuario: req.user.id,
    nota,
    comentario,
    aprovado: true,
  });

  // Atualizar média de avaliações do produto
  await atualizarMediaProduto(produtoId);

  const avaliacaoPopulada = await Review.findById(avaliacao._id)
    .populate('usuario', 'nome')
    .populate('produto', 'nome');

  return res.status(201).json({
    success: true,
    message: 'Avaliação criada com sucesso',
    data: avaliacaoPopulada,
  });
};

// Atualizar avaliação (própria avaliação apenas)
const atualizar = async (req, res) => {
  const { id } = req.params;
  const { nota, comentario } = req.body;

  const avaliacao = await Review.findById(id);

  if (!avaliacao) {
    throw new NotFoundError('Avaliação não encontrada');
  }

  if (avaliacao.usuario.toString() !== req.user.id) {
    throw new UnauthorizedError('Você não pode editar a avaliação de outro usuário');
  }

  avaliacao.nota = nota;
  avaliacao.comentario = comentario;
  avaliacao.atualizadoEm = new Date();

  await avaliacao.save();

  // Atualizar média do produto
  await atualizarMediaProduto(avaliacao.produto);

  const avaliacaoAtualizada = await Review.findById(id)
    .populate('usuario', 'nome')
    .populate('produto', 'nome');

  return res.status(200).json({
    success: true,
    message: 'Avaliação atualizada com sucesso',
    data: avaliacaoAtualizada,
  });
};

// Deletar avaliação (própria avaliação ou admin)
const deletar = async (req, res) => {
  const { id } = req.params;

  const avaliacao = await Review.findById(id);

  if (!avaliacao) {
    throw new NotFoundError('Avaliação não encontrada');
  }

  if (avaliacao.usuario.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new UnauthorizedError('Você não pode deletar a avaliação de outro usuário');
  }

  const produtoId = avaliacao.produto;

  await Review.findByIdAndDelete(id);

  // Atualizar média do produto
  await atualizarMediaProduto(produtoId);

  return res.status(200).json({
    success: true,
    message: 'Avaliação deletada com sucesso',
  });
};

// Marcar como útil
const marcarUtil = async (req, res) => {
  const { id } = req.params;

  const avaliacao = await Review.findByIdAndUpdate(
    id,
    { $inc: { 'util.sim': 1 } },
    { new: true }
  );

  if (!avaliacao) {
    throw new NotFoundError('Avaliação não encontrada');
  }

  return res.status(200).json({
    success: true,
    data: avaliacao,
  });
};

// Marcar como não útil
const marcarNaoUtil = async (req, res) => {
  const { id } = req.params;

  const avaliacao = await Review.findByIdAndUpdate(
    id,
    { $inc: { 'util.nao': 1 } },
    { new: true }
  );

  if (!avaliacao) {
    throw new NotFoundError('Avaliação não encontrada');
  }

  return res.status(200).json({
    success: true,
    data: avaliacao,
  });
};

// Aprovar avaliação (apenas admin)
const aprovar = async (req, res) => {
  const avaliacao = await Review.findByIdAndUpdate(
    req.params.id,
    { aprovado: true },
    { new: true }
  );

  if (!avaliacao) {
    throw new NotFoundError('Avaliação não encontrada');
  }

  // Atualizar média do produto
  await atualizarMediaProduto(avaliacao.produto);

  return res.status(200).json({
    success: true,
    data: avaliacao,
  });
};

// Rejeitar avaliação (apenas admin)
const rejeitar = async (req, res) => {
  const avaliacao = await Review.findByIdAndUpdate(
    req.params.id,
    { aprovado: false },
    { new: true }
  );

  if (!avaliacao) {
    throw new NotFoundError('Avaliação não encontrada');
  }

  // Atualizar média do produto
  await atualizarMediaProduto(avaliacao.produto);

  return res.status(200).json({
    success: true,
    data: avaliacao,
  });
};

// Helper: Atualizar média de avaliações do produto
const atualizarMediaProduto = async (produtoId) => {
  const resultado = await Review.aggregate([
    { $match: { produto: require('mongoose').Types.ObjectId(produtoId), aprovado: true } },
    { $group: { _id: null, media: { $avg: '$nota' }, total: { $sum: 1 } } },
  ]);

  if (resultado.length > 0) {
    await Product.findByIdAndUpdate(produtoId, {
      mediaAvaliacoes: resultado[0].media,
      totalAvaliacoes: resultado[0].total,
    });
  } else {
    await Product.findByIdAndUpdate(produtoId, {
      mediaAvaliacoes: 0,
      totalAvaliacoes: 0,
    });
  }
};

module.exports = {
  listarPorProduto,
  obterPorId,
  criar,
  atualizar,
  deletar,
  marcarUtil,
  marcarNaoUtil,
  aprovar,
  rejeitar,
};
