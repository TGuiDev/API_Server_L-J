const { ValidationError } = require('../config/errors');

// Middleware para validar dados com Joi
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      throw new ValidationError(messages);
    }

    // Substitui req.body pelos dados validados
    req.body = value;
    next();
  };
};

module.exports = validateRequest;
