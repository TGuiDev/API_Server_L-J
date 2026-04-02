const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

// Todas rotas requerem autenticação
router.use(authenticate);

// GET /api/cart - obter carrinho do usuário
router.get('/', cartController.obterCarrinho);

// POST /api/cart/items - adicionar ou atualizar item (body: { produtoId, quantidade })
router.post('/items', cartController.adicionarOuAtualizarItem);

// PATCH /api/cart/items/:itemId - atualizar quantidade
router.patch('/items/:itemId', cartController.atualizarQuantidade);

// DELETE /api/cart/items/:itemId - remover item
router.delete('/items/:itemId', cartController.removerItem);

// DELETE /api/cart/clear - limpar carrinho
router.delete('/clear', cartController.limparCarrinho);

module.exports = router;
