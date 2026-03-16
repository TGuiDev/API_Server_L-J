const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../config/errors');

// Middleware para verificar token Bearer
const authenticate = (req, res, next) => {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token não fornecido ou formato inválido');
    }

    // Remover "Bearer " e pegar o token
    const token = authHeader.substring(7);

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adicionar dados do usuário ao request
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Token inválido ou expirado');
    }
    throw error;
  }
};

module.exports = authenticate;
