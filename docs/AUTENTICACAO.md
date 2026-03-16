# 🔐 Guia Completo de Autenticação

Documento detalhado sobre autenticação JWT, Bearer Token e como usar em todas as requisições.

## 📌 Resumo Rápido

- **Tipo**: JWT (JSON Web Tokens)
- **Método**: Bearer Token no header `Authorization`
- **Expiração**: 7 dias
- **Gerado em**: `/api/auth/register` ou `/api/auth/login`
- **Usado em**: Praticamente todos os endpoints (exceto login/register)

---

## 🔑 Entendendo JWT e Bearer Token

### O que é JWT?
JWT é um token criptografado que identifica o usuário:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9hbyIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSM...
```

### O que é Bearer Token?
É o JWT prefixado com a palavra "Bearer" para usar em requisições:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 Fluxo de Autenticação

```
1. Registrar ou Fazer Login
        ↓
2. Receber Token JWT
        ↓
3. Guardar Token (localStorage, cookie, etc)
        ↓
4. Enviar em Headers de Requisições Protegidas
        ↓
5. API Valida Token e Retorna Dados
```

---

## 📝 Passo a Passo: Registrar Novo Usuário

### Request
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "senha123",
    "senhaConfirm": "senha123"
  }'
```

### Response (Sucesso - 201)
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "usuario": {
      "_id": "507f1f77bcf86cd799439011",
      "nome": "João Silva",
      "email": "joao@email.com",
      "role": "user",
      "ativo": true,
      "dataCriacao": "2026-03-16T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoiam9hb0BlbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTczNjk2MzAwMCwiZXhwIjoxNzM3NTY3ODAwfQ.abc123xyz"
  }
}
```

### Response (Erro - Usuário Já Existe)
```json
{
  "success": false,
  "message": "Usuário com este email já existe",
  "statusCode": 409
}
```

---

## 🔓 Passo a Passo: Fazer Login

### Request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'
```

### Response (Sucesso - 200)
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "usuario": {
      "_id": "507f1f77bcf86cd799439011",
      "nome": "João Silva",
      "email": "joao@email.com",
      "role": "user",
      "ativo": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Response (Erro - Credenciais Inválidas)
```json
{
  "success": false,
  "message": "Email ou senha incorretos",
  "statusCode": 401
}
```

---

## 🛡️ Como Usar o Token em Requisições

### 1️⃣ Em cURL (Linha de Comando)

```bash
curl -X GET http://localhost:5000/api/auth/perfil \
  -H "Authorization: Bearer seu_token_aqui"
```

**Exemplo completo:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:5000/api/auth/perfil \
  -H "Authorization: Bearer $TOKEN"
```

### 2️⃣ Em JavaScript (Fetch API)

```javascript
const token = localStorage.getItem('token'); // Recuperar do localStorage

fetch('http://localhost:5000/api/auth/perfil', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

### 3️⃣ Em JavaScript (Axios)

```javascript
import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Agora todas as requisições incluem o token automaticamente
api.get('/auth/perfil')
  .then(response => console.log(response.data))
  .catch(error => console.error('Erro:', error));
```

### 4️⃣ Em Postman

1. Obtenha o token fazendo login (veja exemplo acima)
2. Copie o token da resposta
3. Vá em **Authorization** tab
4. Selecione **Bearer Token**
5. Cole o token no campo **Token**
6. Agora todas as requisições incluem o header automaticamente

---

## 📊 Endpoints de Autenticação

### 1. Registrar Novo Usuário
```
POST /api/auth/register
Content-Type: application/json

{
  "nome": "string (obrigatório)",
  "email": "string (obrigatório, único)",
  "senha": "string (obrigatório, mín 6 caracteres)",
  "senhaConfirm": "string (obrigatório, deve ser igual a senha)"
}
```

**Retorna:**
- 201: Usuário criado + token JWT
- 400: Validação falhou
- 409: Email já cadastrado

---

### 2. Fazer Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "string (obrigatório)",
  "senha": "string (obrigatório)"
}
```

**Retorna:**
- 200: Login sucesso + token JWT
- 400: Campos obrigatórios faltando
- 401: Email ou senha incorretos

---

### 3. Obter Perfil do Usuário Logado
```
GET /api/auth/perfil
Authorization: Bearer <token>
```

**Retorna:**
- 200: Dados do usuário autenticado
- 401: Token inválido ou expirado
- 403: Acesso negado

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nome": "João Silva",
    "email": "joao@email.com",
    "phone": "+5511999999999",
    "role": "user",
    "ativo": true,
    "dataCriacao": "2026-03-16T10:30:00Z"
  }
}
```

---

### 4. Fazer Logout
```
POST /api/auth/logout
Authorization: Bearer <token>
```

**Retorna:**
- 200: Logout realizado com sucesso
- 401: Token inválido

---

## 🔑 O que Contém no Token?

Quando decodificado, o JWT contém:

```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "joao@email.com",
  "role": "user",
  "iat": 1736963000,
  "exp": 1737567800
}
```

**Campos:**
- `id`: ID do usuário no banco de dados
- `email`: Email do usuário
- `role`: Tipo de usuário (user, admin, gerente, etc)
- `iat`: Hora de criação (issued at)
- `exp`: Hora de expiração (7 dias depois)

---

## ⚠️ Erros Comuns de Autenticação

### Erro: "Invalid token"
**Causa:** Token expirado ou inválido
**Solução:** Faça login novamente para obter um novo token

```json
{
  "success": false,
  "message": "Token inválido",
  "statusCode": 403
}
```

### Erro: "Authorization header missing"
**Causa:** Esqueceu de enviar o header `Authorization`
**Solução:** Adicione o header corretamente:
```bash
Authorization: Bearer seu_token
```

### Erro: "Bearer token required"
**Causa:** Header `Authorization` sem a palavra "Bearer"
**Solução:** Formato correto é `Bearer token_aqui`, não apenas `token_aqui`

### Erro: "User not found"
**Causa:** Usuário foi deletado ou não existe
**Solução:** Registre um novo usuário ou verifique o email

---

## 🛡️ Proteger Suas Rotas

Se está criando novas rotas que precisam de autenticação:

### Usando o Middleware
```javascript
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');

// Rota protegida - requer token válido
router.get('/dados-pessoais', authenticate, meuController.dados);

// Rota pública - sem autenticação
router.get('/info-publica', meuController.info);

module.exports = router;
```

### Verificar Dados do Usuário na Rota
```javascript
const meuController = {
  dados: async (req, res) => {
    // req.user contém os dados do token
    console.log('Usuário logado:', req.user.id);
    console.log('Email:', req.user.email);
    console.log('Role:', req.user.role);

    return res.json({
      success: true,
      data: {
        usuarioId: req.user.id,
        mensagem: 'Seus dados pessoais aqui'
      }
    });
  }
};
```

---

## 📱 Armazenar Token no Frontend

### Em React (localStorage)
```javascript
// Após fazer login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, senha })
});

const data = await response.json();

// Guardar token
localStorage.setItem('token', data.data.token);

// Para usar depois
const token = localStorage.getItem('token');

// Para logout
localStorage.removeItem('token');
```

### Em React com Context API
```javascript
import { createContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = (novoToken) => {
    localStorage.setItem('token', novoToken);
    setToken(novoToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## 🔄 Fluxo Completão: Do Login até Requisição

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuário clica em Login                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend enviaumailAndPassword para /api/auth/login      │
│    POST http://localhost:5000/api/auth/login               │
│    { "email": "joao@email.com", "senha": "123" }           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. API valida credenciais no banco de dados                 │
│    - Procura by email                                        │
│    - Compara if password hash matches                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. API gera Token JWT (válido por 7 dias)                   │
│    token = jwt.sign({ id, email, role }, SECRET)            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. API retorna 200 + token para Frontend                    │
│    { "token": "eyJhbGciOiJIUzI1NiIs..." }                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Frontend guarda token (localStorage/cookie)              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Frontend quer acessar /api/usuarios                      │
│    GET http://localhost:5000/api/usuarios                  │
│    Headers: { Authorization: "Bearer eyJhbG..." }          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Middleware authMiddleware valida token                   │
│    - Lê header Authorization                                │
│    - Extrai token (remove "Bearer ")                        │
│    - Decodifica jwt.verify(token, SECRET)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Se válido: req.user = { id, email, role }              │
│    Se inválido: retorna 401 Unauthorized                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. Controller processa requisição com req.user             │
│     var usuarios = await Usuario.find()                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 11. API retorna 200 + dados                                 │
│     { "success": true, "data": [...] }                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 12. Frontend recebe dados e atualiza UI                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Boas Práticas

✅ **Faça:**
- Guardar token em localStorage ou cookie seguro
- Enviar token no header `Authorization` de TODAS as requisições autenticadas
- Fazer logout para remover token do cliente
- Renovar token antes de expirar (7 dias)

❌ **Não Faça:**
- Guardar token no local storage de sites públicos
- Enviar token na URL como query parameter
- Copiar/compartilhar seu token
- Confiar cegamente em tokens sem validação no backend

---

## 📞 Suporte

Para dúvidas sobre autenticação:
1. Verifique a seção de **Erros Comuns** acima
2. Consulte [ROUTES.md](./ROUTES.md) para detalhes de cada endpoint
3. Veja exemplos completos em [CURL_EJEMPLOS.md](./CURL_EJEMPLOS.md)

---

**Última atualização:** Março 2026
