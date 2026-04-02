const { ValidationError } = require('../config/errors');

// Tenta converter strings JSON em objetos/arrays para bodies multipart/form-data
const parseJsonFields = (body) => {
  const parsed = { ...body };

  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
          (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          parsed[key] = JSON.parse(trimmed);
        } catch (e) {
          /* manter valor original se não for JSON válido */
        }
      }
    }
  }

  return parsed;
};

// Middleware para validar dados com Joi
const validateRequest = (schema) => {
  return (req, res, next) => {
    const normalizedBody = parseJsonFields(req.body);
    const { error, value } = schema.validate(normalizedBody, {
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
