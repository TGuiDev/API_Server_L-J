const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validateRequest = require('../middleware/validateRequest');
const authenticate = require('../middleware/authMiddleware');
const { upload, processImagePath } = require('../middleware/uploadMiddleware');
const Joi = require('joi');

// Schema de validação - Criar categoria
const criarCategoriaSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  descricao: Joi.string(),
  icone: Joi.string().optional(), // URL ou caminho opcional (se não enviar arquivo)
  subcategorias: Joi.array().items(
    Joi.object({
      nome: Joi.string().required(),
      descricao: Joi.string(),
      icone: Joi.string().optional(), // URL ou caminho opcional
    })
  ),
});

// Schema de validação - Atualizar categoria
const atualizarCategoriaSchema = Joi.object({
  nome: Joi.string().min(3),
  descricao: Joi.string(),
  icone: Joi.string().optional(), // URL ou caminho opcional (se não enviar arquivo)
  subcategorias: Joi.array().items(
    Joi.object({
      nome: Joi.string().required(),
      descricao: Joi.string(),
      icone: Joi.string().optional(), // URL ou caminho opcional
    })
  ),
}).min(1);

// Schema de validação - Adicionar subcategoria
const adicionarSubcategoriaSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  descricao: Joi.string(),
  icone: Joi.string().optional(), // URL ou caminho opcional (se não enviar arquivo)
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
  upload.single('icone'),
  processImagePath,
  validateRequest(criarCategoriaSchema),
  categoryController.criar
);

router.put(
  '/:id',
  authenticate,
  adminOnly,
  upload.single('icone'),
  processImagePath,
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

// Upload de imagem para categoria/subcategoria (retorna caminho da imagem)
router.post(
  '/upload-imagem',
  authenticate,
  adminOnly,
  upload.single('imagem'),
  processImagePath,
  (req, res) => {
    if (!req.file || !req.file.imagePath) {
      return res.status(400).json({
        success: false,
        message: 'Imagem não encontrada no upload',
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        imagePath: req.file.imagePath,
      },
    });
  }
);

router.delete(
  '/:categoriaId/subcategorias/:subcategoriaId',
  authenticate,
  adminOnly,
  categoryController.removerSubcategoria
);

module.exports = router;
