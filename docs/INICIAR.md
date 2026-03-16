# 🚀 GUIA DE INICIALIZAÇÃO - API L&J

## 📦 Pré-requisitos

- **Node.js**: v14+ (recomendado v18+)
- **npm**: v6+
- **MongoDB**: Local ou MongoDB Atlas (nuvem)

---

## 🔧 Instalação e Configuração

### 1️⃣ Passo 1: Clonar/Navegar até o Projeto
```bash
cd f:\Unifeob\2ano\02_Terça-PI\API_Server_L&J
```

### 2️⃣ Passo 2: Instalar Dependências
```bash
npm install
```

**O que será instalado:**
- `express` - Framework web
- `mongoose` - ODM para MongoDB
- `jsonwebtoken` - Geração de tokens JWT
- `bcryptjs` - Hash de senhas
- `joi` - Validação de dados
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Variáveis de ambiente
- `nodemon` - Auto-reload em desenvolvimento

### 3️⃣ Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# .env
MONGODB_URI=mongodb://localhost:27017/api_lj
# ou para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/api_lj

JWT_SECRET=sua_chave_super_secreta_aqui_123456
JWT_EXPIRATION=7d
PORT=5000
NODE_ENV=development
```

**Exemplo com MongoDB Atlas:**
```bash
# Acesse: https://www.mongodb.com/cloud/atlas
# Crie um cluster gratuito
# Copie a string de conexão (connection string)

MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/api_lj?retryWrites=true&w=majority
```

### 4️⃣ Passo 4: Iniciar o Servidor

**Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

**Saída esperada:**
```
✅ Servidor iniciando...
✅ Conectando ao MongoDB...
✅ Conexão com MongoDB estabelecida com sucesso
✅ Servidor rodando em http://localhost:5000
```

---

## 🧪 Testando a API

### ✅ Teste 1: Health Check
```bash
curl http://localhost:5000/api/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Health check OK",
  "timestamp": "2025-03-16T10:30:45.123Z"
}
```

### ✅ Teste 2: Registrar Usuário
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Test User",
    "email": "test@example.com",
    "senha": "senha123",
    "senhaConfirm": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "usuario": {
      "_id": "645abc123def456789000001",
      "nome": "Test User",
      "email": "test@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### ✅ Teste 3: Fazer Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "senha": "senha123"
  }'
```

### ✅ Teste 4: Acessar Perfil (com token)
```bash
# Copie o token da resposta anterior
TOKEN="seu_token_aqui"

curl -X GET http://localhost:5000/api/auth/perfil \
  -H "Authorization: Bearer $TOKEN"
```

### ✅ Teste 5: Obter Configuração da Loja
```bash
curl http://localhost:5000/api/config-loja
```

### ✅ Teste 6: Ver Rodízio de Hoje
```bash
curl http://localhost:5000/api/config-loja/rodizio/hoje
```

---

## 📱 Usando Insomnia ou Postman

### Opção 1: Importar Collection

1. Abra **Insomnia** ou **Postman**
2. Clique em **Import**
3. Copie e cole o JSON abaixo:

```json
{
  "name": "API L&J",
  "request": {
    "method": "GET",
    "url": "http://localhost:5000/api"
  }
}
```

### Opção 2: Adicionar Requests Manualmente

**Exemplo de request em Insomnia:**

1. **GET /api/config-loja**
   - URL: `http://localhost:5000/api/config-loja`
   - Method: GET
   - No auth needed

2. **POST /api/auth/login**
   - URL: `http://localhost:5000/api/auth/login`
   - Method: POST
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "senha": "senha123"
   }
   ```

3. **GET /api/auth/perfil** (Protegido)
   - URL: `http://localhost:5000/api/auth/perfil`
   - Method: GET
   - Headers:
     - `Authorization: Bearer seu_token_aqui`

---

## 🗄️ Estrutura de Diretórios

```
API_Server_L&J/
├── config/
│   ├── database.js          # Conexão MongoDB
│   └── jwt.js               # Configuração JWT
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── orderController.js
│   ├── reviewController.js
│   ├── paymentProofController.js
│   └── storeConfigController.js
├── middleware/
│   ├── authenticate.js      # JWT validation
│   ├── validateRequest.js   # Joi validation
│   ├── authorize.js         # Role-based access
│   └── errorHandler.js      # Centralized error handling
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Order.js
│   ├── Review.js
│   ├── PaymentProof.js
│   └── StoreConfig.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── orderRoutes.js
│   ├── reviewRoutes.js
│   ├── paymentProofRoutes.js
│   ├── storeConfigRoutes.js
│   └── healthRoutes.js
├── docs/
│   ├── SCHEMAS.md           # Descrição de modelos
│   ├── RELACIONAMENTOS.md   # Diagrama ER
│   ├── EXEMPLOS_USO.md      # Exemplos CRUD
│   ├── ROUTES.md            # Documentação de endpoints
│   └── CURL_EXEMPLOS.md     # Exemplos cURL
├── .env.example             # Template de variáveis
├── .env                     # Variáveis (não commitar!)
├── .gitignore               # Arquivos ignorados
├── package.json             # Dependências
├── package-lock.json        # Lock de versões
├── server.js                # Arquivo principal
└── README.md                # Documentação geral
```

---

## 🔍 Troubleshooting

### ❌ Erro: "Cannot find module 'express'"
```bash
# Solução: Instale as dependências
npm install
```

### ❌ Erro: "ECONNREFUSED" (MongoDB)
```bash
# Verifique se MongoDB está rodando:
# 1. Linux/Mac:
mongod

# 2. Windows (se instalado como serviço):
# A porta padrão é 27017

# 3. Se usar MongoDB Atlas:
# Verifique a string de conexão no .env
# Certifique-se de adicionar seu IP à whitelist
```

### ❌ Erro: "MongooseError: Cannot connect to database"
```bash
# Verifique a MONGODB_URI no .env
# Tente:
MONGODB_URI=mongodb://localhost:27017/api_lj
```

### ❌ Porta 5000 já está em uso
```bash
# Opção 1: Mudar porta no .env
PORT=5001

# Opção 2: Matar processo na porta 5000 (Windows):
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Opção 3: Matar processo na porta 5000 (Mac/Linux):
lsof -i :5000
kill -9 <PID>
```

### ❌ Erro: "ValidationError: Expected JWT_SECRET"
```bash
# Solução: Adicione JWT_SECRET ao .env
JWT_SECRET=sua_chave_secreta_super_longa_aqui_123456
```

---

## 📊 Monitoramento em Desenvolvimento

### Ver Logs Detalhados
```bash
# Already enabled with nodemon
npm run dev

# Veja a saída no terminal:
[nodemon] restarting due to changes...
[nodemon] restarted due to file changes.
✅ Servidor rodando em http://localhost:5000
```

### Testar Múltiplos Endpoints
```bash
# Abra outro terminal na mesma pasta e use:
curl http://localhost:5000/api/config-loja | jq .
```

---

## 🔑 JWT Token - Como Funciona

1. **Usuário faz login**: POST `/auth/login`
2. **Servidor retorna token**: `{ "token": "eyJ..." }`
3. **Cliente armazena token**: localStorage/sessionStorage
4. **Cliente envia em requisições protegidas**:
   ```
   Authorization: Bearer eyJ...
   ```
5. **Servidor valida token**: Se válido, requisição prossegue

**Duração do token:** 7 dias (configurável em `.env`)

---

## 🚀 Próximos Passos

1. **Criar primeiros dados:**
   - Registre um usuário (POST /auth/register)
   - Crie categorias (POST /categorias - Admin)
   - Crie produtos (POST /produtos - Admin)

2. **Testar fluxo completo:**
   - Visualizar produtos (GET /produtos)
   - Criar pedido (POST /pedidos)
   - Submeter comprovante de pagamento (POST /comprovantes/pix)

3. **Implementar no cliente:**
   - React Native (app mobile)
   - React/Vue.js (app web)

4. **Deploy:**
   - Heroku, Railway, Vercel
   - Docker containerization
   - CI/CD pipeline

---

## 📚 Recursos Adicionais

- [Documentação Express.js](https://expressjs.com/)
- [Documentação Mongoose](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Joi Validation](https://joi.dev/)
- [MongoDB Tutorial](https://docs.mongodb.com/manual/)

---

## ✨ Em Caso de Dúvidas

1. Verifique o arquivo `ROUTES.md` para lista de todos endpoints
2. Veja exemplos práticos em `CURL_EXEMPLOS.md`
3. Revise a estrutura de dados em `SCHEMAS.md`
4. Consulte relacionamentos em `RELACIONAMENTOS.md`

---

Pronto para começar! 🎉
