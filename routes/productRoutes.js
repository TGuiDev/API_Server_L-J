const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validateRequest = require('../middleware/validateRequest');
const authenticate = require('../middleware/authMiddleware');
const { upload, processImagePath } = require('../middleware/uploadMiddleware');
const Joi = require('joi');

// Schema de validação - Criar produto
const criarProdutoSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  descricao: Joi.string().min(10).required(),
  preco: Joi.number().positive().required(),
  imagem: Joi.string().uri().optional(), // URL opcional (se não enviar arquivo)
  categoria: Joi.string().required(),
  subcategoria: Joi.string(),
  ingredientes: Joi.array().items(
    Joi.object({
      nome: Joi.string().required(),
      quantidade: Joi.string().required(),
    })
  ),
  disponivel: Joi.boolean(),
  estoque: Joi.number().min(0),
  diasDisponiveis: Joi.object({
    segunda: Joi.boolean(),
    terca: Joi.boolean(),
    quarta: Joi.boolean(),
    quinta: Joi.boolean(),
    sexta: Joi.boolean(),
    sabado: Joi.boolean(),
    domingo: Joi.boolean(),
  }),
});

// Schema de validação - Atualizar produto
const atualizarProdutoSchema = Joi.object({
  nome: Joi.string().min(3),
  descricao: Joi.string().min(10),
  preco: Joi.number().positive(),
  imagem: Joi.string().uri().optional(), // URL opcional (se não enviar arquivo)
  categoria: Joi.string(),
  subcategoria: Joi.string(),
  ingredientes: Joi.array().items(
    Joi.object({
      nome: Joi.string().required(),
      quantidade: Joi.string().required(),
    })
  ),
  disponivel: Joi.boolean(),
  estoque: Joi.number().min(0),
  diasDisponiveis: Joi.object({
    segunda: Joi.boolean(),
    terca: Joi.boolean(),
    quarta: Joi.boolean(),
    quinta: Joi.boolean(),
    sexta: Joi.boolean(),
    sabado: Joi.boolean(),
    domingo: Joi.boolean(),
  }),
}).min(1);

// Schema de validação - Atualizar estoque
const atualizarEstoqueSchema = Joi.object({
  quantidade: Joi.number().min(0).required(),
});

// Rotas públicas
router.get('/', productController.listarTodos);
router.get('/buscar', productController.buscar);
router.get('/categoria/:categoriaId', productController.porCategoria);
router.get('/:id', productController.obterPorId);

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
  upload.single('imagem'),
  processImagePath,
  validateRequest(criarProdutoSchema),
  productController.criar
);

router.put(
  '/:id',
  authenticate,
  adminOnly,
  upload.single('imagem'),
  processImagePath,
  validateRequest(atualizarProdutoSchema),
  productController.atualizar
);

router.delete('/:id', authenticate, adminOnly, productController.deletar);

router.patch(
  '/:id/estoque',
  authenticate,
  adminOnly,
  validateRequest(atualizarEstoqueSchema),
  productController.atualizarEstoque
);

module.exports = router;
