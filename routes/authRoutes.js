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

// Schema para solicitar reset de senha
const forgotPasswordSchema = Joi.object({
  emailOrPhone: Joi.string().required().messages({
    'any.required': 'Email ou telefone é obrigatório',
  }),
});

// Schema para verificar código de reset
const verifyCodeSchema = Joi.object({
  emailOrPhone: Joi.string().required().messages({
    'any.required': 'Email ou telefone é obrigatório',
  }),
  code: Joi.string().required().messages({
    'any.required': 'Código é obrigatório',
  }),
});

// Schema para redefinir senha
const resetPasswordSchema = Joi.object({
  emailOrPhone: Joi.string().required().messages({
    'any.required': 'Email ou telefone é obrigatório',
  }),
  code: Joi.string().required().messages({
    'any.required': 'Código é obrigatório',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter pelo menos 6 caracteres',
    'any.required': 'Nova senha é obrigatória',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'As senhas não coincidem',
    'any.required': 'Confirmação de senha é obrigatória',
  }),
});

// Rotas públicas
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.requestPasswordReset);
router.post('/verify-code', validateRequest(verifyCodeSchema), authController.verifyResetCode);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

// Rotas protegidas (requer autenticação)
router.get('/perfil', authenticate, authController.getPerfil);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
