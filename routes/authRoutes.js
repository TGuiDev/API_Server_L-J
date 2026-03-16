const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');
const authenticate = require('../middleware/authMiddleware');
const Joi = require('joi');

// Schema de validação para registro
const registerSchema = Joi.object({
  nome: Joi.string().min(3).required().messages({
    'string.min': 'Nome deve ter pelo menos 3 caracteres',
    'any.required': 'Nome é obrigatório',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ser válido',
    'any.required': 'Email é obrigatório',
  }),
  senha: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter pelo menos 6 caracteres',
    'any.required': 'Senha é obrigatória',
  }),
  senhaConfirm: Joi.string().valid(Joi.ref('senha')).required().messages({
    'any.only': 'As senhas não coincidem',
    'any.required': 'Confirmação de senha é obrigatória',
  }),
});

// Schema de validação para login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ser válido',
    'any.required': 'Email é obrigatório',
  }),
  senha: Joi.string().required().messages({
    'any.required': 'Senha é obrigatória',
  }),
});

// Rotas públicas
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);

// Rotas protegidas (requer autenticação)
router.get('/perfil', authenticate, authController.getPerfil);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
