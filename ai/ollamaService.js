/**
 * Serviço Ollama (Local)
 * Conecta e faz chamadas para modelo local rodando em localhost:11434
 */

const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral'; // mistral, llama2, phi, neural-chat

class OllamaService {
  constructor() {
    this.url = OLLAMA_URL;
    this.model = OLLAMA_MODEL;
    this.disponivel = false;
    this.verificarConexao();
  }

  /**
   * Verificar se Ollama está rodando
   */
  async verificarConexao() {
    try {
      const response = await axios.get(`${this.url}/api/tags`, { timeout: 5000 });
      this.disponivel = response.status === 200;
      console.log('✅ Ollama conectado e pronto');
      return true;
    } catch (error) {
      console.log('⚠️ Ollama não disponível - usando Gemini como fallback');
      this.disponivel = false;
      return false;
    }
  }

  /**
   * Fazer análise com Ollama
   * @param {string} prompt - Prompt para IA
   * @returns {string} Resposta da IA
   */
  async analisar(prompt) {
    if (!this.disponivel) {
      throw new Error('Ollama não está disponível');
    }

    try {
      const response = await axios.post(
        `${this.url}/api/generate`,
        {
          model: this.model,
          prompt: prompt,
          stream: false,
          temperature: 0.7,
          top_k: 40,
          top_p: 0.9
        },
        { timeout: 60000 }
      );

      return response.data.response.trim();
    } catch (error) {
      console.error('❌ Erro Ollama:', error.message);
      throw error;
    }
  }

  /**
   * Analisar sentimento
   */
  async analisarSentimento(texto) {
    const prompt = `Analise o sentimento do texto a seguir e responda APENAS em JSON:
Texto: "${texto}"

Responda em JSON com os campos: sentimento (positivo/neutro/negativo), score (0-1), confianca (0-100), motivo (string).
Exemplo: {"sentimento":"positivo","score":0.8,"confianca":85,"motivo":"Palavras positivas encontradas"}`;

    const resposta = await this.analisar(prompt);
    return JSON.parse(resposta);
  }

  /**
   * Gerar recomendações
   */
  async gerarRecomendacoes(usuario, produtos) {
    const prompt = `Baseado no histórico do usuário, recomende 3 produtos.
Usuário: ${JSON.stringify(usuario, null, 2)}
Produtos disponíveis: ${JSON.stringify(produtos.slice(0, 5), null, 2)}

Responda em JSON com array de recomendações com campos: produtoId, motivo, score (0-100).`;

    const resposta = await this.analisar(prompt);
    return JSON.parse(resposta);
  }

  /**
   * Detectar fraude
   */
  async detectarFraude(transacao, historico) {
    const prompt = `Analize se essa transação é suspeita.
Transação: ${JSON.stringify(transacao, null, 2)}
Histórico recente: ${JSON.stringify(historico.slice(-5), null, 2)}

Responda em JSON com campos: suspeita (true/false), risco (baixo/medio/alto), motivo (string), confianca (0-100).`;

    const resposta = await this.analisar(prompt);
    return JSON.parse(resposta);
  }

  /**
   * Analisar padrão de comportamento
   */
  async analisarComportamento(usuario) {
    const prompt = `Analise o perfil desse cliente.
Usuário: ${JSON.stringify(usuario, null, 2)}

Responda em JSON com campos: segmento (vip/fiel/novo/standard/em_risco), riskChurn (0-100), descricao (string), acoes (array de strings).`;

    const resposta = await this.analisar(prompt);
    return JSON.parse(resposta);
  }

  /**
   * Listar modelos disponíveis
   */
  async listarModelos() {
    try {
      const response = await axios.get(`${this.url}/api/tags`);
      return response.data.models.map(m => ({
        name: m.name,
        tamanho: m.size,
        modificado: m.modified_at
      }));
    } catch (error) {
      throw new Error('Erro ao listar modelos: ' + error.message);
    }
  }
}

module.exports = new OllamaService();
