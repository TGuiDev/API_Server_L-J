const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// Rota para verificar saúde da API
router.get('/', healthController.getHealth);

module.exports = router;
