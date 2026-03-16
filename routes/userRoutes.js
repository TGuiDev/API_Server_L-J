const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateRequest = require('../middleware/validateRequest');
const authenticate = require('../middleware/authMiddleware');
const Joi = require('joi');

// Schema de validação - Atualizar perfil
const atualizarPerfilSchema = Joi.object({
  nome: Joi.string().min(3),
  telefone: Joi.string(),
}).min(1);

// Schema de validação - Adicionar método de pagamento
const adicionarMetodoPagamentoSchema = Joi.object({
  tipo: Joi.string().valid('pix', 'cartao_credito', 'cartao_debito').required(),
  chavePixType: Joi.string().valid('cpf', 'email', 'telefone', 'aleatoria'),
  chavePix: Joi.string(),
  tipoCartao: Joi.string().valid('credito', 'debito'),
  ultimosDados: Joi.string(),
  titular: Joi.string(),
}).when('tipo', {
  is: 'pix',
  then: Joi.object({
    chavePixType: Joi.required(),
    chavePix: Joi.required(),
  }),
  otherwise: Joi.object({
    tipoCartao: Joi.required(),
    ultimosDados: Joi.required(),
    titular: Joi.required(),
  }),
});

// Rotas protegidas (verificar role)
router.get('/', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Apenas administradores podem listar usuários',
    });
  }
  userController.listarTodos(req, res);
});

// Rotas públicas (obter por ID)
router.get('/:id', userController.obterPorId);

// Rotas protegidas (usuário autenticado)
router.put(
  '/perfil/atualizar',
  authenticate,
  validateRequest(atualizarPerfilSchema),
  userController.atualizarPerfil
);

router.post(
  '/pagamento/adicionar',
  authenticate,
  validateRequest(adicionarMetodoPagamentoSchema),
  userController.adicionarMetodoPagamento
);

router.delete(
  '/pagamento/:metodoPagamentoId',
  authenticate,
  userController.removerMetodoPagamento
);

router.post('/favoritos/:produtoId', authenticate, userController.adicionarFavorito);
router.delete('/favoritos/:produtoId', authenticate, userController.removerFavorito);
router.get('/favoritos/listar', authenticate, userController.listarFavoritos);

router.delete('/deletar-conta', authenticate, userController.deletarConta);

module.exports = router;
