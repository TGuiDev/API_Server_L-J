const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validateRequest = require('../middleware/validateRequest');
const authenticate = require('../middleware/authMiddleware');
const Joi = require('joi');

// Schema de validação - Criar categoria
const criarCategoriaSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  descricao: Joi.string(),
  icone: Joi.string().uri(),
  subcategorias: Joi.array().items(
    Joi.object({
      nome: Joi.string().required(),
      descricao: Joi.string(),
      icone: Joi.string().uri(),
    })
  ),
});

// Schema de validação - Atualizar categoria
const atualizarCategoriaSchema = Joi.object({
  nome: Joi.string().min(3),
  descricao: Joi.string(),
  icone: Joi.string().uri(),
  subcategorias: Joi.array().items(
    Joi.object({
      nome: Joi.string().required(),
      descricao: Joi.string(),
      icone: Joi.string().uri(),
    })
  ),
}).min(1);

// Schema de validação - Adicionar subcategoria
const adicionarSubcategoriaSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  descricao: Joi.string(),
  icone: Joi.string().uri(),
});

// Rotas públicas
router.get('/', categoryController.listarTodas);
router.get('/:id', categoryController.obterPorId);

// Rotas protegidas (admin)
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Apenas administradores podem executar esta ação',
    });
  }
  next();
};

router.post(
  '/',
  authenticate,
  adminOnly,
  validateRequest(criarCategoriaSchema),
  categoryController.criar
);

router.put(
  '/:id',
  authenticate,
  adminOnly,
  validateRequest(atualizarCategoriaSchema),
  categoryController.atualizar
);

router.delete('/:id', authenticate, adminOnly, categoryController.deletar);

router.post(
  '/:id/subcategorias',
  authenticate,
  adminOnly,
  validateRequest(adicionarSubcategoriaSchema),
  categoryController.adicionarSubcategoria
);

router.delete(
  '/:categoriaId/subcategorias/:subcategoriaId',
  authenticate,
  adminOnly,
  categoryController.removerSubcategoria
);

module.exports = router;
