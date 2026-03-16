/**
 * Serviço Gemini (Fallback)
 * Usa Google Gemini API como fallback quando Ollama não está disponível
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.disponivel = !!this.apiKey;
    this.client = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
    this.model = 'gemini-pro';

    if (this.disponivel) {
      console.log('✅ Gemini API configurada como fallback');
    } else {
      console.log('⚠️ Gemini API não configurada (sem GEMINI_API_KEY)');
    }
  }

  /**
   * Fazer análise com Gemini
   * @param {string} prompt - Prompt para IA
   * @returns {string} Resposta da IA
   */
  async analisar(prompt) {
    if (!this.disponivel) {
      throw new Error('Gemini API não está configurada');
    }

    try {
      const model = this.client.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('❌ Erro Gemini:', error.message);
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
    try {
      // Tentar extrair JSON da resposta
      const jsonMatch = resposta.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { erro: resposta };
    } catch (e) {
      return { erro: 'Erro ao parsear JSON', resposta };
    }
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
    try {
      const jsonMatch = resposta.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { erro: resposta };
    } catch (e) {
      return { erro: 'Erro ao parsear JSON', resposta };
    }
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
    try {
      const jsonMatch = resposta.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { erro: resposta };
    } catch (e) {
      return { erro: 'Erro ao parsear JSON', resposta };
    }
  }

  /**
   * Analisar padrão de comportamento
   */
  async analisarComportamento(usuario) {
    const prompt = `Analise o perfil desse cliente.
Usuário: ${JSON.stringify(usuario, null, 2)}

Responda em JSON com campos: segmento (vip/fiel/novo/standard/em_risco), riskChurn (0-100), descricao (string), acoes (array de strings).`;

    const resposta = await this.analisar(prompt);
    try {
      const jsonMatch = resposta.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { erro: resposta };
    } catch (e) {
      return { erro: 'Erro ao parsear JSON', resposta };
    }
  }
}

module.exports = new GeminiService();
