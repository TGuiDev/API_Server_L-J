require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');

// Importar conexão do banco de dados
const { connectDB } = require('./config/database');

// Importar middlewares
const errorHandler = require('./middleware/errorHandler');

// Importar rotas
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentProofRoutes = require('./routes/paymentProofRoutes');
const storeConfigRoutes = require('./routes/storeConfigRoutes');
const aiRoutes = require('./ai/aiRoutes');

// Inicializar Express
const app = express();

// Middleware CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging (opcional)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Conectar ao MongoDB
connectDB();

// ========================
// ROTAS
// ========================

// Rota de saúde (health check)
app.use('/api/health', healthRoutes);

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de usuário
app.use('/api/usuarios', userRoutes);

// Rotas de produtos
app.use('/api/produtos', productRoutes);

// Rotas de categorias
app.use('/api/categorias', categoryRoutes);

// Rotas de pedidos
app.use('/api/pedidos', orderRoutes);

// Rotas de avaliações
app.use('/api/avaliacoes', reviewRoutes);

// Rotas de comprovantes de pagamento
app.use('/api/comprovantes', paymentProofRoutes);

// Rotas de configuração da loja
app.use('/api/config-loja', storeConfigRoutes);

// Rotas de IA (preditiva e análises)
app.use('/api/ai', aiRoutes);

// Rota raiz - Boas-vindas
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bem-vindo à API L&J',
    version: '1.0.0',
    endpoints: {
      autenticacao: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        perfil: 'GET /api/auth/perfil (protegido)',
        logout: 'POST /api/auth/logout (protegido)',
      },
      usuarios: {
        listar: 'GET /api/usuarios',
        obter: 'GET /api/usuarios/:id',
        atualizarPerfil: 'PUT /api/usuarios/perfil/atualizar (protegido)',
        adicionarPagamento: 'POST /api/usuarios/pagamento/adicionar (protegido)',
        removerPagamento: 'DELETE /api/usuarios/pagamento/:id (protegido)',
        favoritos: {
          adicionar: 'POST /api/usuarios/favoritos/:produtoId (protegido)',
          remover: 'DELETE /api/usuarios/favoritos/:produtoId (protegido)',
          listar: 'GET /api/usuarios/favoritos/listar (protegido)',
        },
        deletarConta: 'DELETE /api/usuarios/deletar-conta (protegido)',
      },
      produtos: {
        listar: 'GET /api/produtos',
        buscar: 'GET /api/produtos/buscar?q=termo',
        obter: 'GET /api/produtos/:id',
        porCategoria: 'GET /api/produtos/categoria/:categoriaId',
        criar: 'POST /api/produtos (admin)',
        atualizar: 'PUT /api/produtos/:id (admin)',
        deletar: 'DELETE /api/produtos/:id (admin)',
        atualizarEstoque: 'PATCH /api/produtos/:id/estoque (admin)',
      },
      categorias: {
        listar: 'GET /api/categorias',
        obter: 'GET /api/categorias/:id',
        criar: 'POST /api/categorias (admin)',
        atualizar: 'PUT /api/categorias/:id (admin)',
        deletar: 'DELETE /api/categorias/:id (admin)',
        adicionarSubcategoria: 'POST /api/categorias/:id/subcategorias (admin)',
        removerSubcategoria: 'DELETE /api/categorias/:categoriaId/subcategorias/:subcategoriaId (admin)',
      },
      pedidos: {
        meus: 'GET /api/pedidos/meus-pedidos (protegido)',
        obter: 'GET /api/pedidos/:id (protegido)',
        criar: 'POST /api/pedidos (protegido)',
        cancelar: 'PATCH /api/pedidos/:id/cancelar (protegido)',
        listar: 'GET /api/pedidos (admin)',
        atualizarStatus: 'PATCH /api/pedidos/:id/status (admin)',
        atualizarEntrega: 'PATCH /api/pedidos/:id/entrega (admin)',
      },
      avaliacoes: {
        listarPorProduto: 'GET /api/avaliacoes/produto/:produtoId',
        obter: 'GET /api/avaliacoes/:id',
        criar: 'POST /api/avaliacoes/produto/:produtoId (protegido)',
        atualizar: 'PUT /api/avaliacoes/:id (protegido)',
        deletar: 'DELETE /api/avaliacoes/:id (protegido)',
        marcarUtil: 'POST /api/avaliacoes/:id/util (protegido)',
        marcarNaoUtil: 'POST /api/avaliacoes/:id/nao-util (protegido)',
        aprovar: 'PATCH /api/avaliacoes/:id/aprovar (admin)',
        rejeitar: 'PATCH /api/avaliacoes/:id/rejeitar (admin)',
      },
      comprovantes: {
        meus: 'GET /api/comprovantes/meus-comprovantes (protegido)',
        obter: 'GET /api/comprovantes/:id (protegido)',
        enviarPixComprovante: 'POST /api/comprovantes/pix (protegido)',
        enviarCartaoComprovante: 'POST /api/comprovantes/cartao (protegido)',
        listar: 'GET /api/comprovantes (admin)',
        confirmar: 'PATCH /api/comprovantes/:id/confirmar (admin)',
        rejeitar: 'PATCH /api/comprovantes/:id/rejeitar (admin)',
        reembolsar: 'PATCH /api/comprovantes/:id/reembolsar (admin)',
      },
      configLoja: {
        obter: 'GET /api/config-loja',
        rodizioHoje: 'GET /api/config-loja/rodizio/hoje',
        estaAberto: 'GET /api/config-loja/status/aberto',
        atualizar: 'PUT /api/config-loja (admin)',
        atualizarHorario: 'PATCH /api/config-loja/horario (admin)',
        atualizarRodizio: 'PATCH /api/config-loja/rodizio (admin)',
      },
      ia: {
        analisarSentimento: 'POST /api/ai/sentimento',
        gerarRecomendacoes: 'POST /api/ai/recomendacoes/:usuarioId (protegido)',
        detectarFraude: 'POST /api/ai/fraude (protegido)',
        segmentarCliente: 'GET /api/ai/segmentacao/:usuarioId (protegido)',
        preverChurn: 'GET /api/ai/churn/:usuarioId (protegido)',
        preverDemanda: 'GET /api/ai/demanda (protegido)',
        statusServicos: 'GET /api/ai/status',
      },
      saude: {
        health: 'GET /api/health',
      },
    },
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.path,
  });
});

// ========================
// MIDDLEWARE DE ERRO
// ========================
app.use(errorHandler);

// ========================
// INICIAR SERVIDOR
// ========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`${'='.repeat(50)}\n`);
});
