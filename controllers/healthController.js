// Controller de exemplo para verificar a saúde da API
const getHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'API está funcionando corretamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

module.exports = {
  getHealth,
};
