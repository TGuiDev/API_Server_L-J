const errorHandler = (err, req, res, next) => {
  // Define status code padrão
  const statusCode = err.statusCode || 500;

  // Log do erro em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.error('Erro:', err);
  }

  // Resposta do erro
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};

module.exports = errorHandler;
