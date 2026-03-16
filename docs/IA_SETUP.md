# 🤖 Guia de Configuração - IA Preditiva (Ollama + Gemini)

## Visão Geral

A API L&J inclui um sistema híbrido de inteligência artificial que combina:

- **🏠 Ollama** (Primário): Executado localmente, sem limites de tokens, privado
- **☁️ Gemini** (Fallback): Google Gemini API, para quando Ollama não está disponível

## 🚀 Instalação - Ollama (Local)

### Pré-requisitos
- Windows 10+, macOS, ou Linux
- 8GB RAM mínimo recomendado

### Passo 1: Download e Instalação

1. Acesse [ollama.ai](https://ollama.ai/)
2. Clique em "Download"
3. Selecione seu SO e execute o instalador
4. Ollama será iniciado automaticamente

### Passo 2: Instalar um Modelo

Abra o terminal e execute:

```bash
# Instalar Mistral (recomendado, balanceado)
ollama pull mistral

# OU outros modelos:
ollama pull llama2          # Mais preciso, mais lento
ollama pull neural-chat     # Rápido, bom para chat
ollama pull phi             # Muito leve, bom para edge
```

### Passo 3: Verificar Conexão

```bash
# Testar se Ollama está rodando
curl http://localhost:11434/api/tags

# Resposta esperada (JSON com modelos instalados):
# {"models":[{"name":"mistral:latest",...}]}
```

### Passo 4: Configure no .env

```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

## ☁️ Configuração - Google Gemini (Fallback)

### Passo 1: Obter Chave API

1. Acesse [ai.google.dev](https://ai.google.dev/)
2. Clique em "Get API Key"
3. Selecione seu projeto Google Cloud (ou crie um novo)
4. Copie a chave gerada

### Passo 2: Configure no .env

```env
GEMINI_API_KEY=sua_chave_aqui
```

### Limites (Free Tier)
- 60 requisições por minuto
- Ideal para análises de fraude, dados sensíveis
- Fallback quando Ollama indisponível

## 📊 Endpoints de IA Disponíveis

### 1. Análise de Sentimento
```bash
POST /api/ai/sentimento
Content-Type: application/json

{
  "texto": "O prato estava delicioso, mas o atendimento demorou!"
}

Response:
{
  "success": true,
  "data": {
    "sentimento": "positivo",
    "score": 0.75,
    "confianca": 92,
    "motivo": "Elogios superam críticas",
    "origem": "Ollama"
  }
}
```

### 2. Recomendações Personalizadas
```bash
POST /api/ai/recomendacoes/:usuarioId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "produtoId": "507f1f77bcf86cd799439011",
      "motivo": "Compatível com seu histórico de compras",
      "score": 88,
      "origem": "Ollama"
    },
    ...
  ]
}
```

### 3. Detecção de Fraude
```bash
POST /api/ai/fraude
Authorization: Bearer <token>
Content-Type: application/json

{
  "usuarioId": "507f1f77bcf86cd799439011",
  "valor": 500.00
}

Response:
{
  "success": true,
  "data": {
    "suspeita": false,
    "risco": "baixo",
    "motivo": "Valor dentro do padrão histórico",
    "confianca": 95,
    "origem": "Ollama"
  }
}
```

### 4. Segmentação de Cliente
```bash
GET /api/ai/segmentacao/:usuarioId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "segmento": "fiel",
    "riskChurn": 15,
    "descricao": "Cliente regular com bom ticket médio",
    "acoes": [
      "Enviar programa VIP",
      "Oferecer desconto exclusivo",
      "Convite para eventos"
    ],
    "origem": "Ollama"
  }
}
```

### 5. Previsão de Churn
```bash
GET /api/ai/churn/:usuarioId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "riskChurn": 45,
    "motivo": "Últimas compras há 90 dias",
    "acoes": [
      "Enviar cupom de desconto",
      "Oferecer novo prato",
      "Contato personalizado"
    ],
    "origem": "Gemini"
  }
}
```

### 6. Previsão de Demanda
```bash
GET /api/ai/demanda?dias=7&categoria=sobremesas
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "demandalevel": "alta",
    "estimativaPedidos": 150,
    "diasPico": ["quinta", "sexta", "sábado"],
    "motivo": "Histórico semanal mostra picos de fim de semana",
    "origem": "Ollama"
  }
}
```

### 7. Status dos Serviços IA
```bash
GET /api/ai/status

Response:
{
  "success": true,
  "data": {
    "ollama": {
      "disponivel": true
    },
    "gemini": {
      "disponivel": true
    }
  }
}
```

## 🔄 Fluxo de Fallback

```
┌─────────────────────────────┐
│   Requisição para IA        │
└──────────────┬──────────────┘
               │
               ▼
        ┌─────────────┐
        │   Ollama    │
        │  (local)    │
        └─────┬───────┘
              │
          ┌───┴───┐
          │       │
         OK    ERRO
          │       │
          ▼       ▼
        Return ┌──────────────┐
               │   Gemini     │
               │  (fallback)  │
               └──────┬───────┘
                      │
                      ▼
                    Return
```

## 🛠️ Troubleshooting

### Ollama não responde
```bash
# Verificar se está rodando
curl http://localhost:11434/api/tags

# Se falhar, reinicie Ollama:
# Windows: Procure "Ollama" no menu Iniciar e abra
# macOS: Command + Space, digite "Ollama" e abra
# Linux: ollama serve (no terminal)
```

### Gemini API dá erro 401
```
Erro: "API key not valid"

Solução:
1. Verifique se a chave está corretamente no .env
2. Valide em https://ai.google.dev/
3. Regenere a chave se necessário
```

### Resposta não é JSON
```javascript
// Se receber HTML (erro 404), verifique:
// 1. URL do Ollama: http://localhost:11434
// 2. Modelo instalado: ollama pull mistral
// 3. Serviço rodando: curl http://localhost:11434
```

### Timeout na resposta
```bash
# Aumentar timeout no aiControler.js se necessário
# Ou usar Gemini (mais rápido para algumas análises)

# Verificar carga do Ollama:
# Windows Task Manager > Performance
# Esperar que Ollama processe requisições anteriores
```

## 📈 Casos de Uso

### Para Admin
- Dashboard de demanda prevista
- Alertas de churn de clientes VIP
- Análise de modelos de fraude
- Segmentação automática de clientes

### Para Clientes
- Recomendações personalizadas
- Análise de seus reviews
- Previsão de disponibilidade de pratos

### Para Marketing
- Identificar oportunidades de retenção
- Segmentos para campanhas direcionadas
- Análise de sentimento em reviews

## 🔒 Segurança

### Ollama (Local)
✅ Nenhum dado enviado para servidores externos
✅ Privacidade total dos usuários
❌ Limitado à qualidade do modelo local

### Gemini (Fallback)
⚠️ Google processa seus dados (verifique TOS)
✅ Qualidade Superior
❌ Limitado a 60 req/min (free)

## 📊 Monitoramento

### Ver logs de IA
```bash
# Terminal do servidor
# Procure por:
# ✅ Ollama não disponível, usando Gemini...
# ✅ Origem: Ollama / Origem: Gemini
```

### Métricas Recomendadas
- Taxa de sucesso por serviço (Ollama vs Gemini)
- Tempo médio de resposta
- Modelos com mais erros
- Custo de API do Gemini

## 🚀 Próximas Melhorias

- [ ] Cache de análises frequentes
- [ ] Tunagem de prompts por categoria
- [ ] API de configuração de modelos
- [ ] Dashboard de análises IA
- [ ] Métricas de acurácia
- [ ] Suporte a múltiplos modelos Ollama

## 📞 Suporte

Problemas? Consulte:
- [Ollama Docs](https://github.com/jmorganca/ollama)
- [Gemini Docs](https://ai.google.dev/docs)
- Logs da API: `console.log` no server.js

---

**Última atualização**: 2024
**Versão IA**: 1.0.0 (Ollama + Gemini Hybrid)
