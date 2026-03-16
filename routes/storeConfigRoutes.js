const express = require('express');
const router = express.Router();
const storeConfigController = require('../controllers/storeConfigController');
const validateRequest = require('../middleware/validateRequest');
const authenticate = require('../middleware/authMiddleware');
const Joi = require('joi');

// Schema de validação - Atualizar configuração
const atualizarConfigSchema = Joi.object({
  nomeLoja: Joi.string().min(3),
  descricao: Joi.string(),
  logo: Joi.string().uri(),
  banner: Joi.string().uri(),
  email: Joi.string().email(),
  telefone: Joi.string(),
  whatsapp: Joi.string(),
  entrega: Joi.object({
    aceita: Joi.boolean(),
    raioEntrega: Joi.number().min(0),
    precoEntrega: Joi.number().min(0),
    tempoMedio: Joi.number().min(0),
  }),
  pagamento: Joi.object({
    pixAtivo: Joi.boolean(),
    cartaoAtivo: Joi.boolean(),
    dinheiro: Joi.boolean(),
  }),
  politicaDevolucao: Joi.string(),
  termoServico: Joi.string(),
  privacidade: Joi.string(),
}).min(1);

// Schema de validação - Atualizar horário
const atualizarHorarioSchema = Joi.object({
  dia: Joi.string()
    .valid('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo')
    .required(),
  aberto: Joi.boolean().required(),
  abertura: Joi.string().pattern(/^\d{2}:\d{2}$/),
  fechamento: Joi.string().pattern(/^\d{2}:\d{2}$/),
});

// Schema de validação - Atualizar rodízio
const atualizarRodizioSchema = Joi.object({
  dia: Joi.string()
    .valid('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo')
    .required(),
  produtos: Joi.array().items(Joi.string()).required(),
});

// Rotas públicas
router.get('/', storeConfigController.obter);
router.get('/rodizio/hoje', storeConfigController.getRodizioHoje);
router.get('/status/aberto', storeConfigController.estaAbertoAgora);

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

router.put(
  '/',
  authenticate,
  adminOnly,
  validateRequest(atualizarConfigSchema),
  storeConfigController.atualizar
);

router.patch(
  '/horario',
  authenticate,
  adminOnly,
  validateRequest(atualizarHorarioSchema),
  storeConfigController.atualizarHorario
);

router.patch(
  '/rodizio',
  authenticate,
  adminOnly,
  validateRequest(atualizarRodizioSchema),
  storeConfigController.atualizarRodizio
);

module.exports = router;
