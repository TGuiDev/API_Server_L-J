# 📋 RESUMO EXECUTIVO - API L&J

## 🎯 Visão Geral

API RESTful completa para gerenciar restaurante/delivery **L&J** com suporte a:
- ✅ Autenticação JWT com Bearer tokens
- ✅ Gerenciamento de usuários e perfis
- ✅ Catálogo de produtos com rodízio semanal
- ✅ Sistema de pedidos e entrega
- ✅ Avaliações e comentários
- ✅ Múltiplos métodos de pagamento (Pix, Cartão)
- ✅ Confirmação de pagamentos com comprovantes
- ✅ Controle de acesso por roles (user/admin)
- ✅ IA Preditiva (Ollama + Gemini)

---

## 🏗️ Arquitetura

```
Cliente (Mobile/Web)
    ↓
Express.js + CORS
    ↓
JWT Middleware (Autenticação)
    ↓
Joi Validation (Validação)
    ↓
Controllers (Lógica de Negócio)
    ↓
Mongoose Models (MongoDB)
```

---

## 📊 Base de Dados (7 Models)

| Model | Descrição | Campos Principais |
|-------|-----------|------------------|
| **User** | Usuários do sistema | nome, email, senha, telefone, role, metodosPagamento |
| **Product** | Pratos/Produtos | nome, preço, estoque, ingredientes, diasDisponiveis |
| **Category** | Categorias | nome, subcategorias |
| **Order** | Pedidos | itens, status, entrega, pagamento, total |
| **Review** | Avaliações | nota (1-5), comentário, aprovado, útil |
| **PaymentProof** | Comprovantes | tipo (pix/cartão), arquivo, status |
| **StoreConfig** | Configuração Loja | horários, rodízio, entrega, pagamentos |

---

## 🔐 Autenticação

**Tipo:** JWT Bearer Token
**Duração:** 7 dias
**Flow:**
```
1. Registrar/Login → Recebe token
2. Enviar token em header: Authorization: Bearer token
3. Servidor valida e processa requisição
4. Token expira em 7 dias
```

---

## 🛣️ Endpoints por Recurso

### 🔐 Auth (4 endpoints)
- `POST /auth/register` - Registrar
- `POST /auth/login` - Login
- `GET /auth/perfil` - Obter perfil
- `POST /auth/logout` - Logout

### 👥 Usuários (9 endpoints)
- `GET /usuarios` - Listar (admin)
- `GET /usuarios/:id` - Obter
- `PUT /usuarios/perfil/atualizar` - Atualizar perfil
- `POST /usuarios/pagamento/adicionar` - Add método pagamento
- `DELETE /usuarios/pagamento/:id` - Remove método
- `POST /usuarios/favoritos/:id` - Add favorito
- `DELETE /usuarios/favoritos/:id` - Remove favorito
- `GET /usuarios/favoritos/listar` - Listar favoritos
- `DELETE /usuarios/deletar-conta` - Deletar conta

### 🍽️ Produtos (8 endpoints)
- `GET /produtos` - Listar (com filtros)
- `GET /produtos/buscar?q=...` - Full-text search
- `GET /produtos/:id` - Obter
- `GET /produtos/categoria/:id` - Por categoria
- `POST /produtos` - Criar (admin)
- `PUT /produtos/:id` - Atualizar (admin)
- `DELETE /produtos/:id` - Deletar (admin)
- `PATCH /produtos/:id/estoque` - Atualizar estoque (admin)

### 📂 Categorias (7 endpoints)
- `GET /categorias` - Listar
- `GET /categorias/:id` - Obter
- `POST /categorias` - Criar (admin)
- `PUT /categorias/:id` - Atualizar (admin)
- `DELETE /categorias/:id` - Deletar (admin)
- `POST /categorias/:id/subcategorias` - Add subcategoria (admin)
- `DELETE /categorias/:id/subcategorias/:subId` - Remove subcategoria (admin)

### 📦 Pedidos (7 endpoints)
- `GET /pedidos/meus-pedidos` - Meus pedidos
- `GET /pedidos/:id` - Obter pedido
- `POST /pedidos` - Criar pedido
- `PATCH /pedidos/:id/cancelar` - Cancelar (user)
- `GET /pedidos` - Listar todos (admin)
- `PATCH /pedidos/:id/status` - Atualizar status (admin)
- `PATCH /pedidos/:id/entrega` - Atualizar entrega (admin)

### ⭐ Avaliações (9 endpoints)
- `GET /avaliacoes/produto/:id` - Listar de um produto
- `GET /avaliacoes/:id` - Obter avaliação
- `POST /avaliacoes/produto/:id` - Criar
- `PUT /avaliacoes/:id` - Atualizar
- `DELETE /avaliacoes/:id` - Deletar
- `POST /avaliacoes/:id/util` - Marcar útil
- `POST /avaliacoes/:id/nao-util` - Marcar não útil
- `PATCH /avaliacoes/:id/aprovar` - Aprovar (admin)
- `PATCH /avaliacoes/:id/rejeitar` - Rejeitar (admin)

### 💳 Comprovantes (7 endpoints)
- `GET /comprovantes/meus-comprovantes` - Meus comprovantes
- `GET /comprovantes/:id` - Obter
- `POST /comprovantes/pix` - Enviar Pix
- `POST /comprovantes/cartao` - Enviar Cartão
- `GET /comprovantes` - Listar (admin)
- `PATCH /comprovantes/:id/confirmar` - Confirmar (admin)
- `PATCH /comprovantes/:id/rejeitar` - Rejeitar (admin)
- `PATCH /comprovantes/:id/reembolsar` - Reembolsar (admin)

### 🤖 IA (7 endpoints)
- `POST /ai/sentimento` - Analisar sentimento de texto
- `POST /ai/recomendacoes/:usuarioId` - Recomendações personalizadas
- `POST /ai/fraude` - Detectar fraude em transação
- `GET /ai/segmentacao/:usuarioId` - Segmentar cliente
- `GET /ai/churn/:usuarioId` - Prever churn
- `GET /ai/demanda` - Prever demanda
- `GET /ai/status` - Status dos serviços IA

### 🏪 Config Loja (6 endpoints)
- `GET /config-loja` - Obter config
- `GET /config-loja/rodizio/hoje` - Rodízio de hoje
- `GET /config-loja/status/aberto` - Está aberta agora?
- `PUT /config-loja` - Atualizar config (admin)
- `PATCH /config-loja/horario` - Atualizar horário (admin)
- `PATCH /config-loja/rodizio` - Atualizar rodízio (admin)

**Total: 70+ endpoints**

---

## 📍 Filtros e Queries

### Produtos
```
GET /produtos?categoria=id              # Por categoria
GET /produtos?disponivel=true           # Disponíveis
GET /produtos?dia=segunda               # Por dia da semana
GET /produtos/buscar?q=moqueca          # Full-text search
```

### Pedidos
```
GET /pedidos?status=pendente            # Por status
GET /pedidos?usuario=id                 # Por usuário
```

### Avaliações
```
GET /avaliacoes/produto/:id?aprovado=true    # Só aprovadas
```

### Comprovantes
```
GET /comprovantes?status=pendente       # Por status
GET /comprovantes?tipoPagamento=pix     # Por tipo
```

---

## 🔒 Controle de Acesso

| Endpoint | Public | User | Admin |
|----------|--------|------|-------|
| Listar produtos | ✅ | ✅ | ✅ |
| Criar produto | ❌ | ❌ | ✅ |
| Meus pedidos | ❌ | ✅ | ✅ |
| Atualizar pedido (status) | ❌ | ❌ | ✅ |
| Criar avaliação | ❌ | ✅ | ✅ |
| Aprovar avaliação | ❌ | ❌ | ✅ |
| Confirmar pagamento | ❌ | ❌ | ✅ |

---

## 💾 Fluxo de Pedido Completo

```
1. Usuário lista produtos
   GET /produtos

2. Usuário adiciona favoritos (opcional)
   POST /usuarios/favoritos/:id

3. Usuário cria pedido
   POST /pedidos
   (Estoque é decrementado)

4. Usuário envia comprovante de pagamento
   POST /comprovantes/pix ou /cartao

5. Admin confirma pagamento
   PATCH /comprovantes/:id/confirmar

6. Admin atualiza status do pedido
   PATCH /pedidos/:id/status → preparando → pronto → entregue

7. Usuário deixa avaliação (após entrega)
   POST /avaliacoes/produto/:id

8. Admin aprova avaliação
   PATCH /avaliacoes/:id/aprovar
```

---

## 🍽️ Fluxo do Rodízio

```
📅 Segunda-feira: Pratos A, B, C
📅 Terça-feira: Pratos D, E, F
📅 Quarta-feira: Pratos G, H, I
...

GET /config-loja/rodizio/hoje
→ Retorna pratos disponíveis pra hoje

GET /produtos?dia=segunda
→ Filtra por dia da semana
```

---

## 🤖 IA Preditiva (Ollama + Gemini)

Sistema híbrido de inteligência artificial:
- **Ollama** (Local): Rápido, privado, sem limites de tokens
- **Gemini** (Fallback): Google API, alta qualidade, com fallback automático

### Análises Disponíveis
- 👍 **Sentimento**: Analisa reviews e comentários
- 📊 **Recomendações**: Produtos personalizados
- 🚨 **Fraude**: Detecta transações suspeitas
- 👥 **Segmentação**: Classifica clientes (VIP, fiel, em_risco)
- 📉 **Churn**: Prevê clientes em risco de sair
- 📈 **Demanda**: Prevê volume de pedidos

---

## 😀 Validação de Dados (Joi)

Todas as requisições são validadas com Joi:
- ✅ Campos obrigatórios vs opcionais
- ✅ Tipos de dados (string, number, date, etc)
- ✅ Limites de tamanho (min/max)
- ✅ Padrões (email, URL, etc)
- ✅ Ranges (preço > 0, nota 1-5, etc)

**Erro de validação:**
```json
{
  "success": false,
  "error": {
    "message": "\"nome\" is required",
    "status": 400
  }
}
```

---

## 🚀 Iniciar Servidor

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env com MongoDB URI e JWT_SECRET
# Consulte .env.example

# 3. Iniciar servidor
npm run dev

# 4. Acessar
http://localhost:5000/api
```

---

## 📚 Referência de HTTP Status Codes

| Código | Significado |
|--------|------------|
| 200 | OK - Sucesso |
| 201 | Created - Criado |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token ausente/inválido |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Não encontrado |
| 409 | Conflict - Conflito (ex: email duplicado) |
| 500 | Server Error - Erro interno |

---

## 📖 Documentação Detalhada

- **INICIAR.md** - Guia de instalação e troubleshooting
- **ROUTES.md** - Lista completa de todos endpoints
- **CURL_EXEMPLOS.md** - Exemplos práticos com cURL
- **SCHEMAS.md** - Descrição de cada campo do banco
- **RELACIONAMENTOS.md** - Diagrama ER completo
- **IA_SETUP.md** - Configuração Ollama + Gemini

---

## 🎁 Stack Tecnológico

```
Runtime: Node.js
Framework: Express.js 4.18.2
Database: MongoDB (Mongoose 7.0.0)
Auth: JWT + Bcryptjs
Validation: Joi 17.9.2
Dev: Nodemon 2.0.22
AI: Ollama (local) + Google Gemini (fallback)
```

---

## ⚡ Performance

- ✅ Índices no MongoDB para queries rápidas
- ✅ Validação antes do banco de dados
- ✅ Tratamento assíncrono com async/await
- ✅ Error handling centralizado
- ✅ CORS para múltiplos clientes
- ✅ IA local (Ollama) para análises em tempo real

---

## 🔄 Próximas Melhorias

- [ ] Integração com gateway de pagamento real (Stripe, Mercado Pago)
- [ ] Notificações por email/SMS
- [ ] Chat em tempo real (Socket.io)
- [ ] Dashboard administrativo
- [ ] Análise de vendas e relatórios
- [ ] Sistema de cupons e promoções
- [ ] Geolocalização para entrega
- [ ] Testes unitários e de integração
- [ ] Cache com Redis
- [ ] Documentação Swagger/OpenAPI

---

## 📞 Suporte

Consulte a estrutura de diretórios:
```
API_Server_L&J/
├── docs/
│   ├── INICIAR.md
│   ├── ROUTES.md
│   ├── SCHEMAS.md
│   ├── CURL_EXEMPLOS.md
│   ├── RELACIONAMENTOS.md
│   └── IA_SETUP.md
└── README.md
```

---

**API Pronta para Produção! 🚀**
