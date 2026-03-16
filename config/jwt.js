const jwt = require('jsonwebtoken');

// Gerar token JWT
const gerarToken = (usuarioId, email, role = 'user') => {
  const payload = {
    id: usuarioId,
    email: email,
    role: role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = {
  gerarToken,
};
