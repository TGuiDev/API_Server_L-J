/**
 * Rotas de IA
 * Endpoints para análises preditivas e inteligência artificial
 */

const express = require('express');
const router = express.Router();
const AIController = require('./aiController');
const authenticate = require('../middleware/authMiddleware');
const Joi = require('joi');
const validateRequest = require('../middleware/validateRequest');

// Schemas de validação
const sentimentoSchema = Joi.object({
  texto: Joi.string().required().min(5).max(1000).messages({
    'string.required': 'Campo "texto" é obrigatório',
    'string.min': 'Texto deve ter pelo menos 5 caracteres'
  })
});

const fraudeSchema = Joi.object({
  usuarioId: Joi.string().regex(/^[a-f\d]{24}$/i).required().messages({
    'string.required': 'ID do usuário é obrigatório',
    'string.pattern.base': 'ID do usuário inválido'
  }),
  valor: Joi.number().positive().required().messages({
    'number.required': 'Valor da transação é obrigatório',
    'number.positive': 'Valor deve ser maior que 0'
  })
});

/**
 * POST /api/ai/sentimento
 * Analisar sentimento de texto
 * @body {string} texto - Texto a analisar (mín 5, máx 1000 caracteres)
 * @returns {object} Análise de sentimento com score, confiança, motivo
 */
router.post('/sentimento', validateRequest(sentimentoSchema), AIController.analisarSentimento);

/**
 * POST /api/ai/recomendacoes/:usuarioId
 * Gerar recomendações personalizadas
 * @param {string} usuarioId - ID do usuário
 * @returns {object} Array de recomendações com produtos e motivos
 */
router.post('/recomendacoes/:usuarioId', authenticate, AIController.gerarRecomendacoes);

/**
 * POST /api/ai/fraude
 * Detectar fraude em transação
 * @body {string} usuarioId - ID do usuário
 * @body {number} valor - Valor da transação
 * @returns {object} Análise de fraude com risco e motivo
 */
router.post('/fraude', authenticate, validateRequest(fraudeSchema), AIController.detectarFraude);

/**
 * GET /api/ai/segmentacao/:usuarioId
 * Segmentar cliente (VIP, Fiel, Novo, etc)
 * @param {string} usuarioId - ID do usuário
 * @returns {object} Segmentação e recomendações de ações
 */
router.get('/segmentacao/:usuarioId', authenticate, AIController.segmentarCliente);

/**
 * GET /api/ai/churn/:usuarioId
 * Prever probabilidade de churn
 * @param {string} usuarioId - ID do usuário
 * @returns {object} Risk score (0-100), motivo e ações sugeridas
 */
router.get('/churn/:usuarioId', authenticate, AIController.preverChurn);

/**
 * GET /api/ai/demanda
 * Prever demanda para próximos dias
 * @query {number} dias - Quantos dias prever (padrão 7)
 * @query {string} categoria - Filtrar por categoria (opcional)
 * @returns {object} Nível de demanda, estimativa de pedidos, dias pico
 */
router.get('/demanda', authenticate, AIController.preverDemanda);

/**
 * GET /api/ai/status
 * Verificar status dos serviços de IA
 * @returns {object} Disponibilidade de Ollama e Gemini
 */
router.get('/status', AIController.statusServicos);

module.exports = router;
