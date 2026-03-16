const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const validateRequest = require('../middleware/validateRequest');
const authenticate = require('../middleware/authMiddleware');
const Joi = require('joi');

// Schema de validação - Criar pedido
const criarPedidoSchema = Joi.object({
  itens: Joi.array()
    .items(
      Joi.object({
        produto: Joi.string().required(),
        quantidade: Joi.number().min(1).required(),
        observacoes: Joi.string(),
      })
    )
    .min(1)
    .required(),
  metodosPagamento: Joi.object({
    tipo: Joi.string().valid('pix', 'cartao_credito', 'cartao_debito').required(),
    status: Joi.string(),
  }).required(),
  entrega: Joi.object({
    tipo: Joi.string().valid('retirada', 'entrega').required(),
    precoEntrega: Joi.number().min(0),
    endereco: Joi.when('tipo', {
      is: 'entrega',
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
  }).required(),
  observacoes: Joi.string(),
});

// Schema de validação - Atualizar status
const atualizarStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pendente', 'confirmado', 'preparando', 'pronto', 'entregue', 'cancelado')
    .required(),
});

// Schema de validação - Atualizar entrega
const atualizarEntregaSchema = Joi.object({
  dataPrevista: Joi.date(),
  dataRealizada: Joi.date(),
});

// Rotas protegidas
router.get('/meus-pedidos', authenticate, orderController.meusPedidos);
router.get('/:id', authenticate, orderController.obterPorId);

router.post(
  '/',
  authenticate,
  validateRequest(criarPedidoSchema),
  orderController.criar
);

router.patch(
  '/:id/cancelar',
  authenticate,
  orderController.cancelar
);

// Rotas admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Apenas administradores podem executar esta ação',
    });
  }
  next();
};

router.get('/', authenticate, adminOnly, orderController.listarTodos);

router.patch(
  '/:id/status',
  authenticate,
  adminOnly,
  validateRequest(atualizarStatusSchema),
  orderController.atualizarStatus
);

router.patch(
  '/:id/entrega',
  authenticate,
  adminOnly,
  validateRequest(atualizarEntregaSchema),
  orderController.atualizarEntrega
);

module.exports = router;
