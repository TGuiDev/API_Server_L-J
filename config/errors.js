// Classe para erros de validação
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// Classe para erros de não encontrado
class NotFoundError extends Error {
  constructor(message = 'Recurso não encontrado') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

// Classe para erros de autorização
class UnauthorizedError extends Error {
  constructor(message = 'Não autorizado') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

// Classe para erros de conflito (ex: email já existe)
class ConflictError extends Error {
  constructor(message = 'Conflito nos dados fornecidos') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
};
