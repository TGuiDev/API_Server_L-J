const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const validateRequest = require('../middleware/validateRequest');
const authenticate = require('../middleware/authMiddleware');
const Joi = require('joi');

// Schema de validação - Criar avaliação
const criarAvaliacaoSchema = Joi.object({
  nota: Joi.number().min(1).max(5).required(),
  comentario: Joi.string().min(10).max(500).required(),
});

// Schema de validação - Atualizar avaliação
const atualizarAvaliacaoSchema = Joi.object({
  nota: Joi.number().min(1).max(5),
  comentario: Joi.string().min(10).max(500),
}).min(1);

// Rotas públicas
router.get('/produto/:produtoId', reviewController.listarPorProduto);
router.get('/:id', reviewController.obterPorId);

// Rotas protegidas (usuário autenticado)
router.post(
  '/produto/:produtoId',
  authenticate,
  validateRequest(criarAvaliacaoSchema),
  reviewController.criar
);

router.put(
  '/:id',
  authenticate,
  validateRequest(atualizarAvaliacaoSchema),
  reviewController.atualizar
);

router.delete('/:id', authenticate, reviewController.deletar);

router.post('/:id/util', authenticate, reviewController.marcarUtil);
router.post('/:id/nao-util', authenticate, reviewController.marcarNaoUtil);

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

router.patch('/:id/aprovar', authenticate, adminOnly, reviewController.aprovar);
router.patch('/:id/rejeitar', authenticate, adminOnly, reviewController.rejeitar);

module.exports = router;
