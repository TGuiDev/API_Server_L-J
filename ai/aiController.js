/**
 * Controller de IA
 * Orquestra análises usando Ollama (primário) + Gemini (fallback)
 */

const ollamaService = require('./ollamaService');
const geminiService = require('./geminiService');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');

class AIController {
  /**
   * Analisar sentimento de avaliações
   */
  static async analisarSentimento(req, res) {
    try {
      const { texto } = req.body;

      if (!texto || texto.trim().length === 0) {
        return res.status(400).json({
          success: false,
          erro: { name: 'ValidationError', statusCode: 400, message: 'Texto não pode estar vazio' }
        });
      }

      let resultado;
      try {
        // Tentar com Ollama primeiro
        resultado = await ollamaService.analisarSentimento(texto);
        resultado.origem = 'Ollama';
      } catch (ollamaErr) {
        console.log('⚠️ Ollama não disponível, usando Gemini...');
        // Fallback para Gemini
        resultado = await geminiService.analisarSentimento(texto);
        resultado.origem = 'Gemini';
      }

      return res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        erro: { name: error.name || 'Error', statusCode: 500, message: error.message }
      });
    }
  }

  /**
   * Gerar recomendações personalizadas
   */
  static async gerarRecomendacoes(req, res) {
    try {
      const { usuarioId } = req.params;

      // Buscar usuário e histórico
      const usuario = await User.findById(usuarioId).populate('favoritos');
      if (!usuario) {
        return res.status(404).json({
          success: false,
          erro: { name: 'NotFound', statusCode: 404, message: 'Usuário não encontrado' }
        });
      }

      // Buscar produtos
      const produtos = await Product.find({ ativo: true }).limit(20);

      let recomendacoes;
      try {
        recomendacoes = await ollamaService.gerarRecomendacoes(usuario.toObject(), produtos);
        recomendacoes.origem = 'Ollama';
      } catch (ollamaErr) {
        console.log('⚠️ Ollama não disponível, usando Gemini...');
        recomendacoes = await geminiService.gerarRecomendacoes(usuario.toObject(), produtos);
        recomendacoes.origem = 'Gemini';
      }

      return res.json({
        success: true,
        data: recomendacoes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        erro: { name: error.name || 'Error', statusCode: 500, message: error.message }
      });
    }
  }

  /**
   * Detectar fraude em transação
   */
  static async detectarFraude(req, res) {
    try {
      const { usuarioId, valor } = req.body;

      if (!usuarioId || !valor) {
        return res.status(400).json({
          success: false,
          erro: { name: 'ValidationError', statusCode: 400, message: 'usuarioId e valor são obrigatórios' }
        });
      }

      // Buscar histórico de transações
      const historico = await Order.find({ usuario: usuarioId })
        .sort({ criadoEm: -1 })
        .limit(10);

      const transacao = { usuarioId, valor, data: new Date() };

      let analise;
      try {
        analise = await ollamaService.detectarFraude(transacao, historico);
        analise.origem = 'Ollama';
      } catch (ollamaErr) {
        console.log('⚠️ Ollama não disponível, usando Gemini...');
        analise = await geminiService.detectarFraude(transacao, historico);
        analise.origem = 'Gemini';
      }

      return res.json({
        success: true,
        data: analise
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        erro: { name: error.name || 'Error', statusCode: 500, message: error.message }
      });
    }
  }

  /**
   * Segmentar cliente
   */
  static async segmentarCliente(req, res) {
    try {
      const { usuarioId } = req.params;

      const usuario = await User.findById(usuarioId).populate({
        path: 'historicoPedidos',
        model: 'Order'
      });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          erro: { name: 'NotFound', statusCode: 404, message: 'Usuário não encontrado' }
        });
      }

      let segmentacao;
      try {
        segmentacao = await ollamaService.analisarComportamento(usuario.toObject());
        segmentacao.origem = 'Ollama';
      } catch (ollamaErr) {
        console.log('⚠️ Ollama não disponível, usando Gemini...');
        segmentacao = await geminiService.analisarComportamento(usuario.toObject());
        segmentacao.origem = 'Gemini';
      }

      return res.json({
        success: true,
        data: segmentacao
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        erro: { name: error.name || 'Error', statusCode: 500, message: error.message }
      });
    }
  }

  /**
   * Prever churn
   */
  static async preverChurn(req, res) {
    try {
      const { usuarioId } = req.params;

      const usuario = await User.findById(usuarioId).populate('historicoPedidos');
      if (!usuario) {
        return res.status(404).json({
          success: false,
          erro: { name: 'NotFound', statusCode: 404, message: 'Usuário não encontrado' }
        });
      }

      let predicao;
      try {
        const resultado = await ollamaService.analisarComportamento(usuario.toObject());
        predicao = {
          riskChurn: resultado.riskChurn || 0,
          motivo: resultado.descricao || 'Análise indisponível',
          acoes: resultado.acoes || []
        };
        predicao.origem = 'Ollama';
      } catch (ollamaErr) {
        console.log('⚠️ Ollama não disponível, usando Gemini...');
        const resultado = await geminiService.analisarComportamento(usuario.toObject());
        predicao = {
          riskChurn: resultado.riskChurn || 0,
          motivo: resultado.descricao || 'Análise indisponível',
          acoes: resultado.acoes || []
        };
        predicao.origem = 'Gemini';
      }

      return res.json({
        success: true,
        data: predicao
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        erro: { name: error.name || 'Error', statusCode: 500, message: error.message }
      });
    }
  }

  /**
   * Prever demanda
   */
  static async preverDemanda(req, res) {
    try {
      const { dias = 7, categoria } = req.query;

      // Buscar histórico de pedidos
      const filtro = {};
      if (categoria) filtro.categoriaIds = categoria;

      const pedidosRecentes = await Order.find({ criadoEm: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })
        .populate('itens.produto');

      if (pedidosRecentes.length === 0) {
        return res.json({
          success: true,
          data: {
            aviso: 'Dados insuficientes para análise',
            pedidosAnalisados: 0
          }
        });
      }

      // Preparar dados para IA
      const dados = {
        periodoAnalise: '30 dias',
        totalPedidos: pedidosRecentes.length,
        pedidosAmostra: pedidosRecentes.slice(0, 5).map(p => ({
          total: p.total,
          itensCount: p.itens.length,
          data: p.criadoEm
        }))
      };

      let previsao;
      try {
        const prompt = `Baseado nos últimos 30 dias de pedidos, preveja demanda para ${dias} dias.
Dados: ${JSON.stringify(dados, null, 2)}

Responda em JSON com: demandalevel (baixa/media/alta), estimativaPedidos (número), diasPico (array de dias), motivo (string).`;

        const resposta = await ollamaService.analisar(prompt);
        previsao = JSON.parse(resposta.match(/\{[\s\S]*\}/) ? resposta.match(/\{[\s\S]*\}/)[0] : '{}');
        previsao.origem = 'Ollama';
      } catch (ollamaErr) {
        console.log('⚠️ Ollama não disponível, usando Gemini...');
        const prompt = `Baseado nos últimos 30 dias de pedidos, preveja demanda para ${dias} dias.
Dados: ${JSON.stringify(dados, null, 2)}

Responda em JSON com: demandalevel (baixa/media/alta), estimativaPedidos (número), diasPico (array de dias), motivo (string).`;

        const resposta = await geminiService.analisar(prompt);
        previsao = JSON.parse(resposta.match(/\{[\s\S]*\}/) ? resposta.match(/\{[\s\S]*\}/)[0] : '{}');
        previsao.origem = 'Gemini';
      }

      return res.json({
        success: true,
        data: previsao
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        erro: { name: error.name || 'Error', statusCode: 500, message: error.message }
      });
    }
  }

  /**
   * Status de disponibilidade dos serviços AI
   */
  static async statusServicos(req, res) {
    try {
      const status = {
        ollama: {
          disponivel: await ollamaService.verificarConexao().then(() => true).catch(() => false)
        },
        gemini: {
          disponivel: geminiService.disponivel
        }
      };

      return res.json({
        success: true,
        data: status
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        erro: { name: error.name || 'Error', statusCode: 500, message: error.message }
      });
    }
  }
}

module.exports = AIController;
