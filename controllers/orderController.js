const Order = require('../models/Order');
const Product = require('../models/Product');
const { NotFoundError, ValidationError } = require('../config/errors');

// Listar pedidos do usuário autenticado
const meusPedidos = async (req, res) => {
  const pedidos = await Order.find({ usuario: req.user.id })
    .populate('itens.produto', 'nome preco imagem')
    .populate('comprovante')
    .sort({ criadoEm: -1 });

  return res.status(200).json({
    success: true,
    total: pedidos.length,
    data: pedidos,
  });
};

// Listar todos os pedidos (apenas admin)
const listarTodos = async (req, res) => {
  const { status, usuario } = req.query;
  const filtro = {};

  if (status) {
    filtro.status = status;
  }

  if (usuario) {
    filtro.usuario = usuario;
  }

  const pedidos = await Order.find(filtro)
    .populate('usuario', 'nome email telefone')
    .populate('itens.produto', 'nome preco')
    .sort({ criadoEm: -1 });

  return res.status(200).json({
    success: true,
    total: pedidos.length,
    data: pedidos,
  });
};

// Obter pedido por ID
const obterPorId = async (req, res) => {
  const { id } = req.params;

  const pedido = await Order.findById(id)
    .populate('usuario', 'nome email telefone')
    .populate({
      path: 'itens.produto',
      select: 'nome preco descricao imagem',
    })
    .populate('comprovante');

  if (!pedido) {
    throw new NotFoundError('Pedido não encontrado');
  }

  // Verificar se o usuário é o dono ou admin
  if (pedido.usuario._id.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new UnauthorizedError('Você não tem permissão para ver este pedido');
  }

  return res.status(200).json({
    success: true,
    data: pedido,
  });
};

// Criar pedido
const criar = async (req, res) => {
  const { itens, metodosPagamento, entrega, observacoes } = req.body;

  if (!itens || itens.length === 0) {
    throw new ValidationError('O pedido deve ter no mínimo 1 item');
  }

  // Verificar e calcular total
  let total = 0;
  const itensProcessados = [];

  for (const item of itens) {
    const produto = await Product.findById(item.produto);

    if (!produto) {
      throw new NotFoundError(`Produto ${item.produto} não encontrado`);
    }

    if (produto.estoque < item.quantidade) {
      throw new ValidationError(`Estoque insuficiente para ${produto.nome}`);
    }

    const subtotal = produto.preco * item.quantidade;
    total += subtotal;

    itensProcessados.push({
      produto: produto._id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: item.quantidade,
      subtotal,
      observacoes: item.observacoes || '',
    });
  }

  // Adicionar taxa de entrega se houver
  if (entrega.tipo === 'entrega' && entrega.precoEntrega) {
    total += entrega.precoEntrega;
  }

  const pedido = await Order.create({
    usuario: req.user.id,
    itens: itensProcessados,
    total,
    metodosPagamento,
    entrega,
    observacoes,
  });

  // Diminuir estoque dos produtos
  for (const item of itensProcessados) {
    await Product.findByIdAndUpdate(
      item.produto,
      { $inc: { estoque: -item.quantidade } }
    );
  }

  const pedidoPopulado = await Order.findById(pedido._id).populate('itens.produto');

  return res.status(201).json({
    success: true,
    message: 'Pedido criado com sucesso',
    data: pedidoPopulado,
  });
};

// Atualizar status do pedido (apenas admin)
const atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const statusValidos = [
    'pendente',
    'confirmado',
    'preparando',
    'pronto',
    'entregue',
    'cancelado',
  ];

  if (!statusValidos.includes(status)) {
    throw new ValidationError('Status inválido');
  }

  const pedido = await Order.findByIdAndUpdate(
    id,
    { status, atualizadoEm: new Date() },
    { new: true }
  );

  if (!pedido) {
    throw new NotFoundError('Pedido não encontrado');
  }

  return res.status(200).json({
    success: true,
    message: 'Status atualizado',
    data: pedido,
  });
};

// Atualizar entrega (apenas admin)
const atualizarEntrega = async (req, res) => {
  const { id } = req.params;
  const { dataPrevista, dataRealizada } = req.body;

  const pedido = await Order.findByIdAndUpdate(
    id,
    {
      $set: {
        'entrega.dataPrevista': dataPrevista,
        'entrega.dataRealizada': dataRealizada,
      },
    },
    { new: true }
  );

  if (!pedido) {
    throw new NotFoundError('Pedido não encontrado');
  }

  return res.status(200).json({
    success: true,
    message: 'Entrega atualizada',
    data: pedido,
  });
};

// Cancelar pedido
const cancelar = async (req, res) => {
  const { id } = req.params;

  const pedido = await Order.findById(id);

  if (!pedido) {
    throw new NotFoundError('Pedido não encontrado');
  }

  if (pedido.status === 'entregue' || pedido.status === 'cancelado') {
    throw new ValidationError(`Não é possível cancelar um pedido ${pedido.status}`);
  }

  // Devolver estoque
  for (const item of pedido.itens) {
    await Product.findByIdAndUpdate(
      item.produto,
      { $inc: { estoque: item.quantidade } }
    );
  }

  const pedidoCancelado = await Order.findByIdAndUpdate(
    id,
    { status: 'cancelado', atualizadoEm: new Date() },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: 'Pedido cancelado com sucesso',
    data: pedidoCancelado,
  });
};

module.exports = {
  meusPedidos,
  listarTodos,
  obterPorId,
  criar,
  atualizarStatus,
  atualizarEntrega,
  cancelar,
};
