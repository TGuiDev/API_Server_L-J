const express = require('express');
const router = express.Router();
const paymentProofController = require('../controllers/paymentProofController');
const validateRequest = require('../middleware/validateRequest');
const authenticate = require('../middleware/authMiddleware');
const Joi = require('joi');

// Schema de validação - Enviar comprovante Pix
const comprovantePixSchema = Joi.object({
  pedidoId: Joi.string().required(),
  valor: Joi.number().positive().required(),
  pixId: Joi.string().required(),
  pixKey: Joi.string().required(),
  qrCode: Joi.string(),
  arquivo: Joi.string().uri(),
  tipo: Joi.string().valid('image', 'pdf').required(),
});

// Schema de validação - Enviar comprovante Cartão
const comprovanteCartaoSchema = Joi.object({
  pedidoId: Joi.string().required(),
  valor: Joi.number().positive().required(),
  ultimosDados: Joi.string().required(),
  transactionId: Joi.string().required(),
  arquivo: Joi.string().uri(),
  tipo: Joi.string().valid('image', 'pdf').required(),
});

// Rotas protegidas (usuário autenticado)
router.get('/meus-comprovantes', authenticate, paymentProofController.meusComprovantes);
router.get('/:id', authenticate, paymentProofController.obterPorId);

router.post(
  '/pix',
  authenticate,
  validateRequest(comprovantePixSchema),
  paymentProofController.criarComprovantePixManual
);

router.post(
  '/cartao',
  authenticate,
  validateRequest(comprovanteCartaoSchema),
  paymentProofController.criarComprovanteCartaoManual
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

router.get('/', authenticate, adminOnly, paymentProofController.listarTodos);

router.patch('/:id/confirmar', authenticate, adminOnly, paymentProofController.confirmar);

router.patch(
  '/:id/rejeitar',
  authenticate,
  adminOnly,
  validateRequest(Joi.object({ motivo: Joi.string() })),
  paymentProofController.rejeitar
);

router.patch('/:id/reembolsar', authenticate, adminOnly, paymentProofController.reembolsar);

module.exports = router;
