const PaymentProof = require('../models/PaymentProof');
const Order = require('../models/Order');
const { NotFoundError, ValidationError } = require('../config/errors');

// Listar comprovantes do usuário
const meusComprovantes = async (req, res) => {
  const comprovantes = await PaymentProof.find({ usuario: req.user.id })
    .populate('pedido', 'total status')
    .sort({ criadoEm: -1 });

  return res.status(200).json({
    success: true,
    total: comprovantes.length,
    data: comprovantes,
  });
};

// Listar todos os comprovantes (apenas admin)
const listarTodos = async (req, res) => {
  const { status, tipoPagamento } = req.query;
  const filtro = {};

  if (status) {
    filtro.status = status;
  }

  if (tipoPagamento) {
    filtro.tipoPagamento = tipoPagamento;
  }

  const comprovantes = await PaymentProof.find(filtro)
    .populate('usuario', 'nome email')
    .populate('pedido', 'total')
    .sort({ criadoEm: -1 });

  return res.status(200).json({
    success: true,
    total: comprovantes.length,
    data: comprovantes,
  });
};

// Obter comprovante por ID
const obterPorId = async (req, res) => {
  const { id } = req.params;

  const comprovante = await PaymentProof.findById(id)
    .populate('usuario', 'nome email telefone')
    .populate('pedido');

  if (!comprovante) {
    throw new NotFoundError('Comprovante não encontrado');
  }

  // Verificar permissão
  if (
    comprovante.usuario._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new UnauthorizedError('Você não tem acesso a este comprovante');
  }

  return res.status(200).json({
    success: true,
    data: comprovante,
  });
};

// Criar comprovante (para Pix)
const criarComprovantePixManual = async (req, res) => {
  const { pedidoId, valor, pixId, pixKey, qrCode, arquivo, tipo } = req.body;

  const pedido = await Order.findById(pedidoId);

  if (!pedido) {
    throw new NotFoundError('Pedido não encontrado');
  }

  if (pedido.usuario.toString() !== req.user.id) {
    throw new UnauthorizedError('Este pedido não é seu');
  }

  const comprovante = await PaymentProof.create({
    usuario: req.user.id,
    pedido: pedidoId,
    tipoPagamento: 'pix',
    valor,
    dataTransacao: new Date(),
    pixId,
    pixKey,
    qrCode,
    comprovante: {
      arquivo,
      tipo,
    },
    status: 'pendente',
  });

  // Atualizar ordem
  await Order.findByIdAndUpdate(pedidoId, {
    comprovante: comprovante._id,
    'metodosPagamento.status': 'processando',
  });

  return res.status(201).json({
    success: true,
    message: 'Comprovante Pix enviado. Aguardando confirmação.',
    data: comprovante,
  });
};

// Criar comprovante (para Cartão)
const criarComprovanteCartaoManual = async (req, res) => {
  const { pedidoId, valor, ultimosDados, transactionId, arquivo, tipo } = req.body;

  const pedido = await Order.findById(pedidoId);

  if (!pedido) {
    throw new NotFoundError('Pedido não encontrado');
  }

  if (pedido.usuario.toString() !== req.user.id) {
    throw new UnauthorizedError('Este pedido não é seu');
  }

  const comprovante = await PaymentProof.create({
    usuario: req.user.id,
    pedido: pedidoId,
    tipoPagamento: pedido.metodosPagamento.tipo,
    valor,
    dataTransacao: new Date(),
    ultimosDados,
    tranactionId: transactionId,
    comprovante: {
      arquivo,
      tipo,
    },
    status: 'pendente',
  });

  // Atualizar ordem
  await Order.findByIdAndUpdate(pedidoId, {
    comprovante: comprovante._id,
    'metodosPagamento.status': 'processando',
  });

  return res.status(201).json({
    success: true,
    message: 'Comprovante de cartão enviado. Aguardando confirmação.',
    data: comprovante,
  });
};

// Confirmar pagamento (apenas admin)
const confirmar = async (req, res) => {
  const { id } = req.params;

  const comprovante = await PaymentProof.findByIdAndUpdate(
    id,
    {
      status: 'confirmado',
      confirmadoEm: new Date(),
    },
    { new: true }
  );

  if (!comprovante) {
    throw new NotFoundError('Comprovante não encontrado');
  }

  // Atualizar status do pedido
  await Order.findByIdAndUpdate(comprovante.pedido, {
    'metodosPagamento.status': 'aprovado',
  });

  return res.status(200).json({
    success: true,
    message: 'Pagamento confirmado com sucesso',
    data: comprovante,
  });
};

// Rejeitar pagamento (apenas admin)
const rejeitar = async (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;

  const comprovante = await PaymentProof.findByIdAndUpdate(
    id,
    {
      status: 'recusado',
      observacoes: motivo,
    },
    { new: true }
  );

  if (!comprovante) {
    throw new NotFoundError('Comprovante não encontrado');
  }

  // Atualizar status do pedido
  await Order.findByIdAndUpdate(comprovante.pedido, {
    'metodosPagamento.status': 'recusado',
  });

  return res.status(200).json({
    success: true,
    message: 'Pagamento recusado',
    data: comprovante,
  });
};

// Reembolscar (apenas admin)
const reembolsar = async (req, res) => {
  const { id } = req.params;

  const comprovante = await PaymentProof.findByIdAndUpdate(
    id,
    { status: 'reembolsado' },
    { new: true }
  );

  if (!comprovante) {
    throw new NotFoundError('Comprovante não encontrado');
  }

  return res.status(200).json({
    success: true,
    message: 'Reembolso processado',
    data: comprovante,
  });
};

module.exports = {
  meusComprovantes,
  listarTodos,
  obterPorId,
  criarComprovantePixManual,
  criarComprovanteCartaoManual,
  confirmar,
  rejeitar,
  reembolsar,
};
