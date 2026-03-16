# 📦 DEPENDÊNCIAS & STACK TECNOLÓGICO

## 🔧 Stack Completo

```
┌─────────────────────────────────────┐
│   CLIENT (Browser/Mobile App)       │
│  React / React Native / Vue.js      │
└──────┬──────────────────────────────┘
       │ HTTP/REST
       ↓
┌─────────────────────────────────────┐
│         EXPRESS.JS 4.18.2           │
│  (Web Framework & Routing)          │
└──────┬──────────────────────────────┘
       │
       ├─ CORS 2.8.5 (Cross-Origin)
       ├─ JSON Parser (Built-in)
       ├─ UUID Generation
       └─ Error Handler
       ↓
┌─────────────────────────────────────┐
│  MIDDLEWARE LAYER                   │
│                                     │
│  ├─ authenticate.js  (JWT Validation)
│  ├─ authorize.js     (Role Check)
│  ├─ validateRequest  (Joi)
│  └─ errorHandler     (Central Error)
└──────┬──────────────────────────────┘
       │
       ├─ JWT TOKEN VALIDATION
       │  ↑
       │  └─ jsonwebtoken 9.0.0
       │  └─ bcryptjs 2.4.3
       │
       ├─ INPUT VALIDATION
       │  ↑
       │  └─ joi 17.9.2
       │
       └─ ERROR HANDLING
          ↑
          └─ express-async-errors 3.1.1
       ↓
┌─────────────────────────────────────┐
│  CONTROLLERS (Business Logic)       │
│                                     │
│  ├─ authController                  │
│  ├─ userController                  │
│  ├─ productController               │
│  ├─ categoryController              │
│  ├─ orderController                 │
│  ├─ reviewController                │
│  ├─ paymentProofController          │
│  ├─ storeConfigController           │
│  └─ aiController                    │
└──────┬──────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│   MONGOOSE 7.0.0 (ODM)              │
│  (Object Data Modeling)             │
└──────┬──────────────────────────────┘
       │
       ├─ Ollama (Local) ...................│
       │  (AI Models)                     │
       │                                  │
       └─ Google Gemini API (Fallback) ...│
          (Cloud AI)                      │
       ↓ Driver
┌─────────────────────────────────────┐
│   MongoDB                           │
│  (NoSQL Database)                   │
│                                     │
│  Collections:                       │
│  ├─ users                           │
│  ├─ products                        │
│  ├─ categories                      │
│  ├─ orders                          │
│  ├─ reviews                         │
│  ├─ paymentproofs                   │
│  └─ storeconfigs                    │
└─────────────────────────────────────┘
```

---

## 📚 Dependências Principais

### Framework & Server
```json
{
  "express": "4.18.2"              // Web framework
}
```
**Função:** Roteamento HTTP, middleware, servidor

---

### Database & ODM
```json
{
  "mongoose": "7.0.0"              // Object Data Modeling
}
```
**Função:** Conexão MongoDB, schemas, validação de dados

---

### Authentication & Security
```json
{
  "jsonwebtoken": "9.0.0",         // JWT tokens
  "bcryptjs": "2.4.3"              // Password hashing
}
```
**Função:**
- JWT: Gera e valida tokens de autenticação
- Bcryptjs: Hash seguro de senhas (10 rounds de salt)

---

### Input Validation
```json
{
  "joi": "17.9.2"                  // Schema validation
}
```
**Função:** Validação de requests com schemas Joi
- Tipos obrigatórios
- Limites de tamanho
- Padrões (email, URL, etc)
- Enums (valores permitidos)

---

### CORS & Utilities
```json
{
  "cors": "2.8.5"                  // Cross-Origin Resource Sharing
}
```
**Função:** Permitir requisições de diferentes domínios (para cliente web/mobile)

---

### Error Handling
```json
{
  "express-async-errors": "3.1.1"  // Async error handler
}
```
**Função:** Captura erros em funções async sem try/catch explícito

---

### Configuration
```json
{
  "dotenv": "16.0.3"               // Environment variables
}
```
**Função:** Carrega variáveis de `.env` (MongoDB URI, JWT_SECRET, etc)

---

### AI Integration
```json
{
  "axios": "^1.x.x",               // HTTP client for Ollama API
  "@google/generative-ai": "^x.x.x" // Google Gemini API
}
```
**Função:**
- Axios: Comunicação com servidor Ollama local
- Google Generative AI: Fallback Gemini API

---

### Development Only
```json
{
  "nodemon": "2.0.22"              // Auto-reload server
}
```
**Função:** Reinicia servidor automaticamente ao detectar mudanças

---

## 📋 package.json Completo

```json
{
  "name": "api-lj",
  "version": "1.0.0",
  "description": "API RESTful para Restaurant L&J",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "restaurant",
    "api",
    "mongodb",
    "express",
    "jwt"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@google/generative-ai": "^0.x.x",
    "axios": "^1.x.x",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "joi": "^17.9.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

---

## 🔌 Como Instalar Tudo

```bash
# 1. Clonar o projeto
git clone <url-do-repositorio>
cd API_Server_L&J

# 2. Instalar todas as dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com seus valores (MongoDB URI, JWT Secret, etc)

# 4. Instalar Ollama (opcional, para IA local)
# Windows/Mac/Linux: https://ollama.ai/download
# Depois: ollama pull mistral

# 5. Iniciar servidor
npm run dev  # desenvolvimento
npm start    # produção
```

---

## 📊 Versões Recomendadas

| Pacote | Versão | Motivo |
|--------|--------|--------|
| Node.js | 18+ | LTS, performance, suporte |
| npm | 8+ | Gerenciamento de deps melhorado |
| MongoDB | 4.4+ | Compatível com Mongoose 7 |
| Express | 4.18.2 | Última estável |
| Mongoose | 7.0.0 | Schema validation melhorado |

---

## 🔒 Segurança das Versões

Todas as dependências selecionadas:
- ✅ São amplamente usadas em produção
- ✅ Têm suporte e manutenção ativa
- ✅ Sem vulnerabilidades conhecidas (no momento)
- ✅ Compatíveis entre si

---

## 📈 Tamanho e Performance

| Pacote | Tamanho |
|--------|---------|
| express | ~50 KB |
| mongoose | ~900 KB |
| joi | ~200 KB |
| jsonwebtoken | ~300 KB |
| bcryptjs | ~100 KB |
| **Total approx** | **~3-4 MB** |

---

## ✅ Verificar Instalação

```bash
# Verificar se tudo foi instalado
npm list

# Começar a usar
npm run dev
# Acesse http://localhost:5000/api
```

---

## 🆘 Problemas Comuns

### npm ERR! code ERESOLVE
```bash
# Se tiver conflito de versões, use:
npm install --legacy-peer-deps
```

### node_modules corrompido
```bash
# Deletar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Porta 5000 em uso
```bash
# Usar outra porta
PORT=5001 npm run dev
```

---

**Stack pronto para produção!** 🚀
