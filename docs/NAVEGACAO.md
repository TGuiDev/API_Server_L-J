# 🗺️ MAPA DE NAVEGAÇÃO DA API L&J

## 📍 Comece aqui!

```
👉 Novo no projeto?
   ↓
   1. Leia: RESUMO.md (visão geral 3 min)
   2. Leia: INICIAR.md (setup completo)
   3. Acesse: ROUTES.md (todos endpoints)
   ↓
   Pronto para testar?
   ↓
   Copie exemplos de: CURL_EXEMPLOS.md
```

---

## 📂 Estrutura de Arquivos em docs/

```
docs/
├── 📄 RESUMO.md ............................ Executive Summary
├── 📄 INICIAR.md ........................... Guia de instalação├── 📄 AUTENTICACAO.md ..................... JWT, Bearer Token, login├── 📄 CHECKLIST.md ......................... Tudo implementado
├── 📄 ROUTES.md ............................ Lista de endpoints
├── 📄 CURL_EXEMPLOS.md .................... Exemplos cURL
├── 📄 SCHEMAS.md ........................... Descrição modelos
├── 📄 EXEMPLOS_USO.md ..................... Exemplos CRUD
├── 📄 RELACIONAMENTOS.md .................. Diagrama ER
├── 📄 DEPENDENCIAS.md ..................... Stack tecnológico
├── 📄 NAVEGACAO.md ........................ Este arquivo
├── 📄 INDICES.md .......................... Índice geral
├── 📄 SETUP_RESUMO.md ..................... Resumo técnico
└── 📄 IA_SETUP.md ......................... Config Ollama+Gemini
```

---

## 🎯 Onde Encontrar O Que Você Precisa

### 🚀 "Quero começar agora!"
1. **RESUMO.md** - Visão geral em 2 minutos
2. **INICIAR.md** - Passo a passo de instalação
3. **npm install** + **npm run dev**

### 📖 "Preciso de documentação"
- **ROUTES.md** - Todos os 70+ endpoints
- **SCHEMAS.md** - Estrutura do banco de dados
- **RELACIONAMENTOS.md** - Diagramas ER
- **EXEMPLOS_USO.md** - Exemplos CRUD

### 🧪 "Quero testar os endpoints"
- **CURL_EXEMPLOS.md** - Copie e execute
- Abra **Postman** ou **Insomnia**
- Use exemplos do arquivo para fazer requisições

### 🔧 "Preciso entender o código"
1. Comece em **server.js** - Arquivo principal
2. Veja **config/database.js** - Conexão
3. Explore **controllers/** - Lógica
4. Verifique **models/** - Dados
5. Examine **routes/** - Endpoints

### 🚨 "Algo não funciona!"
1. Verifique **INICIAR.md** na seção "Troubleshooting"
2. Confirme **.env** tem MongoDB URI e JWT_SECRET
3. Rode `npm install` novamente
4. Certifique-se que MongoDB está rodando

### 👨‍💻 "Preciso adicionar um novo endpoint"
1. Crie função em um **controller** (ex: products)
2. Crie rota em **routes** (ex: productRoutes.js)
3. Adicione validação com **Joi** na rota
4. Se protegido, use `authenticate` middleware
5. Se admin, use `authorize` middleware

### 💾 "Preciso entender como funciona o banco"
- **SCHEMAS.md** - Campo por campo
- **RELACIONAMENTOS.md** - Como conectam
- **models/** - Código MongoDB/Mongoose
- **EXEMPLOS_USO.md** - Queries práticas

### 🔐 "Preciso de autenticação"
1. Leia **AUTENTICACAO.md** - Guia completo (recomendado)
2. Leia sobre JWT em **RESUMO.md**
3. Veja exemplos em **CURL_EJEMPLOS.md**
4. Use endpoint **POST /api/auth/login**
5. Salve o token retornado
6. Envie em header: `Authorization: Bearer token`

### 🤖 "Preciso de IA/Análises"
1. Leia **IA_SETUP.md** - Configure Ollama + Gemini
2. Veja endpoints em **ROUTES.md** → seção "IA"
3. Teste com **CURL_EXEMPLOS.md** → seção "IA"

---

## 🔄 Fluxo de Arquivos por Requisição

### Exemplo: Criar um Produto

```
1. Cliente envia POST /api/produtos
                    ↓
2. productRoutes.js (define a rota)
                    ↓
3. validateRequest(criarProdutoSchema) (valida dados)
                    ↓
4. authenticate (verifica token)
                    ↓
5. authorize (verifica se é admin)
                    ↓
6. productController.criar() (lógica de negócio)
                    ↓
7. Product.create() (salva no banco)
                    ↓
8. Retorna resposta com novo produto
```

### Arquivo responsável por cada layer:

| Layer | Arquivo |
|-------|---------|
| Requisição | `routes/productRoutes.js` |
| Validação | `middleware/validateRequest.js` + `Joi` schema |
| Autenticação | `middleware/authMiddleware.js` |
| Autorização | `middleware/authorize.js` |
| Lógica | `controllers/productController.js` |
| Dados | `models/Product.js` |
| Erro | `middleware/errorHandler.js` |
| Resposta | `productRoutes.js` |

---

## 🔄 Fluxo de Autenticação

```
1. Usuário registra/login
   → POST /auth/register ou /auth/login

2. Controller valida e cria usuário
   → authController.register() ou .login()

3. JWT gerado
   → config/jwt.js generateToken()

4. Token retornado ao cliente
   → { token: "eyJ..." }

5. Cliente envia token em próximas requisições
   → Authorization: Bearer eyJ...

6. Middleware valida token
   → middleware/authMiddleware.js

7. req.user populated com dados do token
   → Acesso a req.user.id, req.user.email, etc
```

---

## 🔄 Fluxo de Pedido Completo

```
1. Cliente lista produtos
   GET /api/produtos

2. Cliente (opcionalmente) favorita produto
   POST /api/usuarios/favoritos/:id

3. Cliente cria pedido
   POST /api/pedidos
   → Estoque decrementado automaticamente

4. Cliente envia comprovante de pagamento
   POST /api/comprovantes/pix
   ou
   POST /api/comprovantes/cartao

5. Admin confirma pagamento
   PATCH /api/comprovantes/:id/confirmar

6. Admin atualiza status do pedido
   PATCH /api/pedidos/:id/status
   → Status: pendente → confirmado → preparando → pronto → entregue

7. Cliente deixa avaliação (após entrega)
   POST /api/avaliacoes/produto/:id

8. Admin aprova avaliação
   PATCH /api/avaliacoes/:id/aprovar
```

---

## 🤖 Fluxo de Análise IA

```
1. Cliente envia requisição para análise
   POST /api/ai/sentimento
   ou
   GET /api/ai/recomendacoes/:usuarioId

2. aiController entra em ação
   → Tenta conectar a Ollama (local)

3. Se Ollama disponível
   → ollamaService.js processa
   → Retorna resultado local (rápido, privado)

4. Se Ollama indisponível
   → Fallback automático para Gemini
   → geminiService.js processa
   → Retorna resultado Cloud (lento, qualidade)

5. Response inclui "origem": "Ollama" ou "Gemini"
```

---

## ✨ Padrão de Projeto

Todos os endpoints seguem o mesmo padrão:

```
ROTA → VALIDAÇÃO → AUTENTICAÇÃO → AUTORIZAÇÃO → LÓGICA → ERRO HANDLING
```

**Benefício:** Código consistente, fácil de entender e manter

---

## 📊 Índice de Endpoints

### Auth (4)
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/perfil
POST   /api/auth/logout
```

### Usuários (9)
```
GET    /api/usuarios
GET    /api/usuarios/:id
PUT    /api/usuarios/perfil/atualizar
POST   /api/usuarios/pagamento/adicionar
DELETE /api/usuarios/pagamento/:id
POST   /api/usuarios/favoritos/:id
DELETE /api/usuarios/favoritos/:id
GET    /api/usuarios/favoritos/listar
DELETE /api/usuarios/deletar-conta
```

### Produtos (8)
```
GET    /api/produtos
GET    /api/produtos/buscar
GET    /api/produtos/:id
GET    /api/produtos/categoria/:id
POST   /api/produtos
PUT    /api/produtos/:id
DELETE /api/produtos/:id
PATCH  /api/produtos/:id/estoque
```

### Categorias (7)
```
GET    /api/categorias
GET    /api/categorias/:id
POST   /api/categorias
PUT    /api/categorias/:id
DELETE /api/categorias/:id
POST   /api/categorias/:id/subcategorias
DELETE /api/categorias/:id/subcategorias/:subId
```

### Pedidos (7)
```
GET    /api/pedidos/meus-pedidos
GET    /api/pedidos/:id
POST   /api/pedidos
PATCH  /api/pedidos/:id/cancelar
GET    /api/pedidos
PATCH  /api/pedidos/:id/status
PATCH  /api/pedidos/:id/entrega
```

### Avaliações (9)
```
GET    /api/avaliacoes/produto/:id
GET    /api/avaliacoes/:id
POST   /api/avaliacoes/produto/:id
PUT    /api/avaliacoes/:id
DELETE /api/avaliacoes/:id
POST   /api/avaliacoes/:id/util
POST   /api/avaliacoes/:id/nao-util
PATCH  /api/avaliacoes/:id/aprovar
PATCH  /api/avaliacoes/:id/rejeitar
```

### Comprovantes (8)
```
GET    /api/comprovantes/meus-comprovantes
GET    /api/comprovantes/:id
POST   /api/comprovantes/pix
POST   /api/comprovantes/cartao
GET    /api/comprovantes
PATCH  /api/comprovantes/:id/confirmar
PATCH  /api/comprovantes/:id/rejeitar
PATCH  /api/comprovantes/:id/reembolsar
```

### Config Loja (6)
```
GET    /api/config-loja
GET    /api/config-loja/rodizio/hoje
GET    /api/config-loja/status/aberto
PUT    /api/config-loja
PATCH  /api/config-loja/horario
PATCH  /api/config-loja/rodizio
```

### IA (7)
```
POST   /api/ai/sentimento
POST   /api/ai/recomendacoes/:usuarioId
POST   /api/ai/fraude
GET    /api/ai/segmentacao/:usuarioId
GET    /api/ai/churn/:usuarioId
GET    /api/ai/demanda
GET    /api/ai/status
```

---

**Total: 70+ endpoints, todos documentados!** 📚
