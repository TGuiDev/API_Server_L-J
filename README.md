# 🍽️ API Server L&J

API RESTful completa para plataforma de delivery de restaurante, com **70+ endpoints**, autenticação JWT, IA preditiva e gerenciamento de pedidos.

## 🚀 Quick Start

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Edite .env com suas configurações
```

### 3. Iniciar Servidor
```bash
npm run dev      # Desenvolvimento (com reload)
npm start        # Produção
```

Servidor em `http://localhost:5000`

## 📚 Documentação Completa

**Toda a documentação está em [`docs/`](./docs/)**

| Documento | Descrição |
|-----------|-----------|
| [**INICIAR.md**](./docs/INICIAR.md) | Setup completo + troubleshooting |
| [**AUTENTICACAO.md**](./docs/AUTENTICACAO.md) | JWT, Bearer Token, login/registro |
| [**ROUTES.md**](./docs/ROUTES.md) | Todos os 70+ endpoints |
| [**SCHEMAS.md**](./docs/SCHEMAS.md) | Estrutura de dados (7 modelos) |
| [**IA_SETUP.md**](./docs/IA_SETUP.md) | Configuração Ollama + Gemini |
| [**CURL_EJEMPLOS.md**](./docs/CURL_EJEMPLOS.md) | Exemplos prontos para testar |
| [**NAVEGACAO.md**](./docs/NAVEGACAO.md) | Como encontrar tudo |
| [**INDICES.md**](./docs/INDICES.md) | Índice completo |

## 📋 Stack

- **Node.js** + **Express.js 4.18.2**
- **MongoDB** + **Mongoose 7.0.0**
- **JWT** (jsonwebtoken 9.0.0)
- **Joi** (validação 17.9.2)
- **IA**: Ollama (local) + Google Gemini (fallback)
- **Dev**: Nodemon

## ✨ Funcionalidades

- ✅ **70+ endpoints** REST completos
- ✅ **Autenticação JWT** + Bearer Token
- ✅ **Gestão de usuários, produtos, pedidos**
- ✅ **Sistema de avaliações** e reviews
- ✅ **Pagamentos** (Pix, Cartão)
- ✅ **IA Preditiva** (sentimento, recomendações, fraude, churn)
- ✅ **Validação automática** + tratamento de erros centralizado

## 📁 Estrutura

```
├── ai/              # Serviços de IA (Ollama, Gemini)
├── config/          # Configurações (DB, JWT, erros)
├── controllers/     # Lógica de negócio (9 arquivos)
├── middleware/      # Auth, validação, erros
├── models/          # MongoDB schemas (7 modelos)
├── routes/          # Endpoints (10 arquivos)
├── docs/            # Documentação completa
└── server.js        # Entrada da aplicação
```

## 📞 Precisa de Ajuda?

1. **Primeiros passos?** → [INICIAR.md](./docs/INICIAR.md)
2. **Como fazer login?** → [AUTENTICACAO.md](./docs/AUTENTICACAO.md)
3. **Quais endpoints existem?** → [ROUTES.md](./docs/ROUTES.md)
4. **Exemplos prontos?** → [CURL_EJEMPLOS.md](./docs/CURL_EJEMPLOS.md)
5. **Procurando algo?** → [NAVEGACAO.md](./docs/NAVEGACAO.md)

---

**Versão**: 1.0.0 | **Status**: ✅ Completo | **Última atualização**: Março 2026
