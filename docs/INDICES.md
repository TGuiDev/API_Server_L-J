# 📑 ÍNDICE GERAL - API L&J

## 🗂️ Documentação Disponível

### Para Iniciantes

| Arquivo | Tempo | Objetivo |
|---------|-------|----------|
| **RESUMO.md** | 5 min | Visão geral e stack tecnológico |
| **INICIAR.md** | 15 min | Guia passo a passo de instalação |
| **NAVEGACAO.md** | 10 min | Mapa de navegação e estrutura |
| **CHECKLIST.md** | 5 min | Tudo que foi implementado |

### Para Desenvolvimento

| Arquivo | Tempo | Objetivo |
|---------|-------|----------|| **AUTENTICACAO.md** | 15 min | JWT, Bearer Token, login/registro detalhado || **ROUTES.md** | 20 min | Lista completa de 70+ endpoints |
| **SCHEMAS.md** | 15 min | Estrutura de cada modelo (7 schemas) |
| **CURL_EXEMPLOS.md** | 20 min | Exemplos práticos com cURL |
| **RELACIONAMENTOS.md** | 10 min | Diagramas ER e relationships |
| **EXEMPLOS_USO.md** | 15 min | Exemplos CRUD com código |

### Técnico & Referência

| Arquivo | Foco |
|---------|------|
| **DEPENDENCIAS.md** | Stack tecnológico, versões, instalação |
| **SETUP_RESUMO.md** | Resumo técnico de configuração |
| **IA_SETUP.md** | Guia Ollama + Gemini |
| **INDICES.md** | Este arquivo |

---

## 🎯 Fluxos de Leitura Recomendados

### 👨‍💼 Gestor/Stakeholder
```
1. RESUMO.md (5 min)
   └─ Entender o que é a API

2. NAVEGACAO.md → "Fluxo de Pedido Completo" (5 min)
   └─ Entender como funciona

3. ROUTES.md → Diagrama de endpoints (5 min)
   └─ Ver capacidades da API

Total: 15 minutos
```

### 👨‍💻 Desenvolvedor Frontend/Mobile
```
1. RESUMO.md (5 min)
2. INICIAR.md (15 min) - Montar ambiente
3. CURL_EXEMPLOS.md (20 min) - Testar requests
4. ROUTES.md (20 min) - Entender endpoints
5. SCHEMAS.md (15 min) - Estrutura de dados

Total: ~75 minutos + setup
```

### 👨‍💻 Desenvolvedor Backend
```
1. RESUMO.md (5 min)
2. INICIAR.md (15 min) - Setup
3. ROUTES.md (20 min)
4. SCHEMAS.md (15 min)
5. RELACIONAMENTOS.md (10 min)
6. Explorar código:
   - server.js
   - config/*
   - controllers/*
   - models/*
   - routes/*

Total: ~75 minutos + exploração
```

### 🧪 QA/Tester
```
1. RESUMO.md (5 min)
2. INICIAR.md (15 min) - Setup
3. CURL_EXEMPLOS.md (30 min) - Executar testes
4. ROUTES.md (20 min) - Verificar cobertura
5. CHECKLIST.md (5 min) - Validar implementação

Total: ~75 minutos
```

---

## 📚 Pesquisa por Tópico

### Autenticação & Segurança- [x] **AUTENTICACAO.md** - Guia completo (recomendado)- [x] **RESUMO.md** - Como JWT funciona
- [x] **ROUTES.md** - Endpoints de auth
- [x] **CURL_EXEMPLOS.md** - Exemplos JWT
- [x] **INICIAR.md** - Configurar JWT_SECRET
- [x] **config/jwt.js** - Código JWT

### Estrutura de Dados
- [x] **SCHEMAS.md** - Cada modelo detalhado
- [x] **RELACIONAMENTOS.md** - Como conectam
- [x] **EXEMPLOS_USO.md** - Queries MongoDB
- [x] **models/** - Código Mongoose

### Endpoints & APIs
- [x] **ROUTES.md** - Lista completa (70+)
- [x] **CURL_EXEMPLOS.md** - Exemplos
- [x] **EXEMPLOS_USO.md** - Request/Response
- [x] **routes/** - Código das rotas

### Instalação & Setup
- [x] **INICIAR.md** - Passo a passo completo
- [x] **DEPENDENCIAS.md** - Versões e instalação
- [x] **SETUP_RESUMO.md** - Resumo técnico
- [x] **package.json** - Dependências

### Lógica de Negócio
- [x] **RESUMO.md** - Visão geral
- [x] **NAVEGACAO.md** - Fluxos
- [x] **EXEMPLOS_USO.md** - Casos de uso
- [x] **controllers/** - Código

### IA & Análises
- [x] **IA_SETUP.md** - Configuração completa
- [x] **ROUTES.md** - Endpoints IA
- [x] **CURL_EXEMPLOS.md** - Exemplos IA
- [x] **ai/** - Código

### Solução de Problemas
- [x] **INICIAR.md** - Troubleshooting section
- [x] **NAVEGACAO.md** - Onde encontrar
- [x] **RESUMO.md** - Próximas melhorias

---

## 🔍 Busca Rápida por Funcionalidade

### Features de Usuário
- Autenticação: **ROUTES.md** → Auth section
- Perfil: **ROUTES.md** → Usuários section
- Favoritos: **ROUTES.md** → Usuários → POST/DELETE favoritos
- Pagamento: **ROUTES.md** → Usuários → Métodos pagamento

### Features de Produto
- Listar: **CURL_EXEMPLOS.md** → GET /produtos
- Buscar: **ROUTES.md** → Produtos → buscar endpoint
- Categorias: **ROUTES.md** → Categorias section
- Rodízio: **ROUTES.md** → Config Loja → rodizio

### Features de Pedido
- Criar: **CURL_EXEMPLOS.md** → POST /pedidos
- Status: **ROUTES.md** → Pedidos → Atualizar Status
- Entrega: **ROUTES.md** → Pedidos → Atualizar Entrega
- Cancelar: **CURL_EXEMPLOS.md** → PATCH /cancelar

### Features de Avaliação
- Criar: **CURL_EXEMPLOS.md** → POST /avaliacoes
- Aprovação: **ROUTES.md** → Avaliações → Aprovar/Rejeitar
- Utilidade: **ROUTES.md** → Avaliações → Marcar útil

### Features de Pagamento
- Pix: **CURL_EXEMPLOS.md** → POST /comprovantes/pix
- Cartão: **CURL_EXEMPLOS.md** → POST /comprovantes/cartao
- Confirmação: **ROUTES.md** → Comprovantes → Confirmar

### Features de IA
- Sentimento: **IA_SETUP.md** → Análise Sentimento
- Recomendações: **IA_SETUP.md** → Recomendações
- Fraude: **IA_SETUP.md** → Detecção Fraude
- Churn: **IA_SETUP.md** → Previsão Churn
- Demanda: **IA_SETUP.md** → Previsão Demanda

---

## 📊 Índice de Arquivos

### 📁 /docs/
```
RESUMO.md ..................... Resumo executivo
INICIAR.md .................... Guia de instalaçãoAUTENTICACAO.md ............... JWT, Bearer Token (guia completo)CHECKLIST.md .................. Checklist de implementação
NAVEGACAO.md .................. Mapa de navegação
ROUTES.md ..................... Todos os 70+ endpoints
CURL_EXEMPLOS.md .............. Exemplos com cURL
SCHEMAS.md .................... 7 modelos de dados
EXEMPLOS_USO.md ............... Exemplos CRUD
RELACIONAMENTOS.md ............ Diagramas ER
DEPENDENCIAS.md ............... Stack tecnológico
SETUP_RESUMO.md ............... Resumo técnico
IA_SETUP.md ................... Guia Ollama + Gemini
INDICES.md .................... Este arquivo
```

### 📁 Raiz
```
README.md ..................... Visão geral minimalista
package.json .................. Dependências
.env.example .................. Template de variáveis
.gitignore .................... Arquivos ignorados
```

### 📁 config/
```
database.js ................... Conexão MongoDB
jwt.js ........................ Geração de tokens
errors.js ..................... Classes de erro
```

### 📁 middleware/
```
authMiddleware.js ............. Validar JWT
authorize.js .................. Verificar roles
validateRequest.js ............ Validação Joi
errorHandler.js ............... Tratamento de erros
```

### 📁 models/
```
User.js ....................... Usuários
Product.js .................... Produtos
Category.js ................... Categorias
Order.js ...................... Pedidos
Review.js ..................... Avaliações
PaymentProof.js ............... Comprovantes
StoreConfig.js ................ Config da loja
```

### 📁 controllers/
```
authController.js ............. Auth (4 funções)
userController.js ............. Usuários (9 funções)
productController.js .......... Produtos (8 funções)
categoryController.js ......... Categorias (7 funções)
orderController.js ............ Pedidos (7 funções)
reviewController.js ........... Avaliações (9 funções)
paymentProofController.js ..... Comprovantes (8 funções)
storeConfigController.js ...... Config (6 funções)
aiController.js ............... IA (7 funções)
```

### 📁 routes/
```
authRoutes.js ................. 4 endpoints
userRoutes.js ................. 9 endpoints
productRoutes.js .............. 8 endpoints
categoryRoutes.js ............. 7 endpoints
orderRoutes.js ................ 7 endpoints
reviewRoutes.js ............... 9 endpoints
paymentProofRoutes.js ......... 8 endpoints
storeConfigRoutes.js .......... 6 endpoints
aiRoutes.js ................... 7 endpoints
healthRoutes.js ............... 1 endpoint
```

### 📁 ai/
```
ollamaService.js .............. Integração Ollama
geminiService.js .............. Integração Gemini
aiController.js ............... Lógica IA
aiRoutes.js ................... Endpoints IA
```

---

## 🎯 Guia por Situação

### ❓ "Por onde começo?"
1. Leia: **RESUMO.md**
2. Execute: **INICIAR.md**
3. Teste: **CURL_EXEMPLOS.md**

### 🔧 "Como fazer X?"
1. Procure em: **NAVEGACAO.md** → "Onde encontrar"
2. Detalhes em: **ROUTES.md**
3. Exemplo em: **CURL_EXEMPLOS.md**

### 🐛 "Algo não funciona"
1. Verifique: **INICIAR.md** → Troubleshooting
2. Confirme setup: **DEPENDENCIAS.md**
3. Verifique logs: Terminal do servidor

### 📖 "Preciso aprender"
- Estrutura: **SCHEMAS.md**
- Relações: **RELACIONAMENTOS.md**
- Fluxos: **NAVEGACAO.md** → Fluxos
- Código completo: Arquivos em `controllers/`, `models/`, `routes/`

### 👥 "Quero usar a API no cliente"
1. Entender fluxo: **NAVEGACAO.md** → Fluxo Autenticação
2. Ver endpoints: **ROUTES.md**
3. Copiar exemplos: **CURL_EXEMPLOS.md**
4. Entender dados: **SCHEMAS.md**

### 🚀 "Quero fazer deploy"
1. Preparar: **INICIAR.md** → Setup inicial
2. Configurar: **DEPENDENCIAS.md**
3. Testar: **CURL_EXEMPLOS.md**
4. Documentação: Está pronta em **ROUTES.md**

### 🤖 "Preciso configurar IA"
1. Leia: **IA_SETUP.md** completo
2. Instale: Ollama from ollama.ai
3. Configure: .env com OLLAMA_URL e GEMINI_API_KEY
4. Teste: Endpoints em ROUTES.md → IA section

---

## 📞 Referência Rápida

### Endpoints por Recurso
| Recurso | Arquivo | Seção |
|---------|---------|-------|
| Auth | ROUTES.md | Auth (4) |
| Usuários | ROUTES.md | Usuários (9) |
| Produtos | ROUTES.md | Produtos (8) |
| Categorias | ROUTES.md | Categorias (7) |
| Pedidos | ROUTES.md | Pedidos (7) |
| Avaliações | ROUTES.md | Avaliações (9) |
| Comprovantes | ROUTES.md | Comprovantes (8) |
| Config Loja | ROUTES.md | Config (6) |
| IA | ROUTES.md | IA (7) |

### Modelos de Dados
| Modelo | Arquivo | Descrição |
|--------|---------|-----------|
| User | SCHEMAS.md | Usuários, pagamentos, favoritos |
| Product | SCHEMAS.md | Pratos, ingredientes, estoque |
| Category | SCHEMAS.md | Categorias e subcategorias |
| Order | SCHEMAS.md | Pedidos, itens, entrega |
| Review | SCHEMAS.md | Avaliações, ratings, utilidade |
| PaymentProof | SCHEMAS.md | Comprovantes Pix/Cartão |
| StoreConfig | SCHEMAS.md | Configuração da loja |

---

## 📊 Estatísticas

- **Total de documentos**: 13 arquivos
- **Total de endpoints**: 70+
- **Total de modelos**: 7
- **Total de controllers**: 9
- **Total de rotas**: 10 conjuntos
- **Linhas de código**: ~5000+
- **Cobertura**: 100% (toda funcionalidade documentada)

---

**API Completa e Documentada!** 📚
