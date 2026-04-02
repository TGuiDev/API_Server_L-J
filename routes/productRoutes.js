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
  // imagens devem ser enviadas como arquivos multipart - não aceitar URLs no body
  categoria: Joi.string().required(),
  subcategoria: Joi.string().required(),
  ingredientes: Joi.array().items(
    Joi.object({
      nome: Joi.string().required(),
      quantidade: Joi.string().required(),
    })
  ).default([]),
  disponivel: Joi.boolean().required(),
  estoque: Joi.number().min(0).required(),
  diasDisponiveis: Joi.object({
    segunda: Joi.boolean().required(),
    terca: Joi.boolean().required(),
    quarta: Joi.boolean().required(),
    quinta: Joi.boolean().required(),
    sexta: Joi.boolean().required(),
    sabado: Joi.boolean().required(),
    domingo: Joi.boolean().required(),
  }).required(),
});

// Schema de validação - Atualizar produto
const atualizarProdutoSchema = Joi.object({
  nome: Joi.string().min(3),
  descricao: Joi.string().min(10),
  preco: Joi.number().positive(),
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

// Middleware para validar número de arquivos e proibir envio de imagens via body
const validateUploadedImages = (req, res, next) => {
  // proibir envio de imagens por URL no body
  if (req.body.imagem || req.body.imagens) {
    return res.status(400).json({ success: false, message: 'Imagens devem ser enviadas como arquivos multipart, URLs não são aceitas' });
  }

  const files = req.files;
  if (!files || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ success: false, message: 'Ao menos 1 imagem é obrigatória' });
  }

  if (files.length > 5) {
    return res.status(400).json({ success: false, message: 'Máximo de 5 imagens permitido' });
  }

  next();
};

router.post(
  '/',
  authenticate,
  adminOnly,
  upload.array('imagens', 5),
  processImagePath,
  validateUploadedImages,
  validateRequest(criarProdutoSchema),
  productController.criar
);

router.put(
  '/:id',
  authenticate,
  adminOnly,
  upload.array('imagens', 5),
  processImagePath,
  // validar que, se enviar imagens no body (URLs), rejeitar; se enviar arquivos, garantir 1-5
  (req, res, next) => {
    if (req.body.imagem || req.body.imagens) {
      return res.status(400).json({ success: false, message: 'Imagens devem ser enviadas como arquivos multipart, URLs não são aceitas' });
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 5) {
      return res.status(400).json({ success: false, message: 'Máximo de 5 imagens permitido' });
    }
    next();
  },
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
