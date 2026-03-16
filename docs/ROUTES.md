# 🛣️ Documentação Completa de Rotas - API L&J

## 📌 Base URL
```
http://localhost:5000/api
```

## 🔑 Autenticação
Todas as rotas protegidas requerem um token JWT no header:
```
Authorization: Bearer seu_token_aqui
```

---

## 🔐 Autenticação (Auth)

### Registrar Novo Usuário
```
POST /api/auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "senhaConfirm": "senha123"
}

Response 201:
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "usuario": { "_id": "...", "nome": "João Silva", "email": "joao@email.com", "role": "user" },
    "token": "eyJ..."
  }
}
```

### Fazer Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "senha123"
}

Response 200:
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "usuario": { ... },
    "token": "eyJ..."
  }
}
```

### Obter Perfil (Protegido)
```
GET /api/auth/perfil
Authorization: Bearer token

Response 200:
{
  "success": true,
  "data": { "_id": "...", "nome": "João", "email": "joao@email.com", ... }
}
```

### Logout (Protegido)
```
POST /api/auth/logout
Authorization: Bearer token

Response 200:
{
  "success": true,
  "message": "Logout realizado com sucesso..."
}
```

---

## 👥 Usuários

### Listar Todos (Admin)
```
GET /api/usuarios
Authorization: Bearer token_admin

Response 200:
{
  "success": true,
  "total": 5,
  "data": [ { ... }, { ... } ]
}
```

### Obter Usuário por ID
```
GET /api/usuarios/:id

Response 200:
{
  "success": true,
  "data": { "_id": "...", "nome": "João", ... }
}
```

### Atualizar Perfil (Protegido)
```
PUT /api/usuarios/perfil/atualizar
Authorization: Bearer token
Content-Type: application/json

{
  "nome": "João Silva Atualizado",
  "telefone": "(11) 98765-4321"
}

Response 200:
{
  "success": true,
  "message": "Perfil atualizado com sucesso",
  "data": { ... }
}
```

### Adicionar Método de Pagamento (Protegido)
```
POST /api/usuarios/pagamento/adicionar
Authorization: Bearer token
Content-Type: application/json

Pix:
{
  "tipo": "pix",
  "chavePixType": "cpf",
  "chavePix": "12345678900"
}

Cartão Crédito:
{
  "tipo": "cartao_credito",
  "tipoCartao": "credito",
  "ultimosDados": "1234",
  "titular": "JOAO SILVA"
}

Response 201:
{
  "success": true,
  "message": "Método de pagamento adicionado",
  "data": { ... }
}
```

### Remover Método de Pagamento (Protegido)
```
DELETE /api/usuarios/pagamento/:metodoPagamentoId
Authorization: Bearer token

Response 200:
{
  "success": true,
  "message": "Método de pagamento removido",
  "data": { ... }
}
```

### Adicionar Produto aos Favoritos (Protegido)
```
POST /api/usuarios/favoritos/:produtoId
Authorization: Bearer token

Response 201:
{
  "success": true,
  "message": "Adicionado aos favoritos",
  "data": { ... }
}
```

### Remover Produto dos Favoritos (Protegido)
```
DELETE /api/usuarios/favoritos/:produtoId
Authorization: Bearer token

Response 200:
{
  "success": true,
  "message": "Removido dos favoritos",
  "data": { ... }
}
```

### Listar Favoritos (Protegido)
```
GET /api/usuarios/favoritos/listar
Authorization: Bearer token

Response 200:
{
  "success": true,
  "total": 3,
  "data": [ { "nome": "Moqueca", "preco": 45.90, ... }, ... ]
}
```

### Deletar Conta (Protegido)
```
DELETE /api/usuarios/deletar-conta
Authorization: Bearer token

Response 200:
{
  "success": true,
  "message": "Conta deletada com sucesso"
}
```

---

## 🍽️ Produtos

### Listar Todos
```
GET /api/produtos
GET /api/produtos?categoria=id
GET /api/produtos?disponivel=true
GET /api/produtos?dia=segunda

Response 200:
{
  "success": true,
  "total": 10,
  "data": [ { ... }, { ... } ]
}
```

### Buscar Produtos
```
GET /api/produtos/buscar?q=moqueca

Response 200:
{
  "success": true,
  "total": 2,
  "data": [ { ... } ]
}
```

### Obter Produto por ID
```
GET /api/produtos/:id

Response 200:
{
  "success": true,
  "data": {
    "_id": "...",
    "nome": "Moqueca Baiana",
    "descricao": "...",
    "preco": 45.90,
    "imagem": "url",
    "ingredientes": [ { "nome": "Peixe", "quantidade": "500g" }, ... ],
    "estoque": 20,
    "diasDisponiveis": { "segunda": true, "terca": true, ... },
    "avaliacoes": [ ... ],
    "mediaAvaliacoes": 4.5,
    "totalAvaliacoes": 10
  }
}
```

### Listar Produtos de uma Categoria
```
GET /api/produtos/categoria/:categoriaId

Response 200:
{
  "success": true,
  "categoria": "Pratos Principais",
  "total": 5,
  "data": [ { ... } ]
}
```

### Criar Produto (Admin)
```
POST /api/produtos
Authorization: Bearer token_admin
Content-Type: application/json

{
  "nome": "Moqueca Baiana",
  "descricao": "Moqueca de peixe com leite de coco e azeite de dendê",
  "preco": 45.90,
  "imagem": "url-imagem",
  "categoria": "categoria-id",
  "subcategoria": "Peixes",
  "ingredientes": [
    { "nome": "Peixe branco", "quantidade": "500g" },
    { "nome": "Leite de coco", "quantidade": "200ml" }
  ],
  "disponivel": true,
  "estoque": 20,
  "diasDisponiveis": {
    "segunda": true,
    "terca": true,
    "quarta": true,
    "quinta": true,
    "sexta": true,
    "sabado": false,
    "domingo": false
  }
}

Response 201:
{
  "success": true,
  "message": "Produto criado com sucesso",
  "data": { ... }
}
```

### Atualizar Produto (Admin)
```
PUT /api/produtos/:id
Authorization: Bearer token_admin
Content-Type: application/json

{
  "nome": "Novo Nome",
  "preco": 50.00,
  "estoque": 15
}

Response 200:
{
  "success": true,
  "message": "Produto atualizado com sucesso",
  "data": { ... }
}
```

### Atualizar Estoque (Admin)
```
PATCH /api/produtos/:id/estoque
Authorization: Bearer token_admin
Content-Type: application/json

{
  "quantidade": 30
}

Response 200:
{
  "success": true,
  "message": "Estoque atualizado",
  "data": { ... }
}
```

### Deletar Produto (Admin)
```
DELETE /api/produtos/:id
Authorization: Bearer token_admin

Response 200:
{
  "success": true,
  "message": "Produto deletado com sucesso"
}
```

---

## 📂 Categorias

### Listar Todas
```
GET /api/categorias

Response 200:
{
  "success": true,
  "total": 5,
  "data": [
    {
      "_id": "...",
      "nome": "Pratos Principais",
      "descricao": "...",
      "subcategorias": [
        { "nome": "Carnes", "descricao": "..." },
        { "nome": "Peixes", "descricao": "..." }
      ]
    },
    ...
  ]
}
```

### Obter Categoria por ID
```
GET /api/categorias/:id

Response 200:
{
  "success": true,
  "data": {
    "_id": "...",
    "nome": "Pratos Principais",
    "descricao": "...",
    "subcategorias": [ ... ],
    "totalProdutos": 15
  }
}
```

### Criar Categoria (Admin)
```
POST /api/categorias
Authorization: Bearer token_admin
Content-Type: application/json

{
  "nome": "Bebidas",
  "descricao": "Bebidas quentes e frias",
  "icone": "url-icone",
  "subcategorias": [
    { "nome": "Sucos", "descricao": "..." },
    { "nome": "Refrigerantes", "descricao": "..." }
  ]
}

Response 201:
{
  "success": true,
  "message": "Categoria criada com sucesso",
  "data": { ... }
}
```

### Atualizar Categoria (Admin)
```
PUT /api/categorias/:id
Authorization: Bearer token_admin
Content-Type: application/json

{
  "nome": "Novo Nome",
  "descricao": "Nova descrição"
}

Response 200:
{
  "success": true,
  "message": "Categoria atualizada com sucesso",
  "data": { ... }
}
```

### Adicionar Subcategoria (Admin)
```
POST /api/categorias/:id/subcategorias
Authorization: Bearer token_admin
Content-Type: application/json

{
  "nome": "Bebidas Quentes",
  "descricao": "Café, chá, chocolate",
  "icone": "url"
}

Response 201:
{
  "success": true,
  "message": "Subcategoria adicionada",
  "data": { ... }
}
```

### Remover Subcategoria (Admin)
```
DELETE /api/categorias/:categoriaId/subcategorias/:subcategoriaId
Authorization: Bearer token_admin

Response 200:
{
  "success": true,
  "message": "Subcategoria removida",
  "data": { ... }
}
```

### Deletar Categoria (Admin)
```
DELETE /api/categorias/:id
Authorization: Bearer token_admin

Response 200:
{
  "success": true,
  "message": "Categoria deletada com sucesso"
}
```

---

## 📦 Pedidos

### Meus Pedidos (Protegido)
```
GET /api/pedidos/meus-pedidos
Authorization: Bearer token

Response 200:
{
  "success": true,
  "total": 5,
  "data": [
    {
      "_id": "...",
      "usuario": "...",
      "itens": [ ... ],
      "total": 150.00,
      "status": "entregue",
      "entrega": { "tipo": "entrega", "endereco": "..." },
      "criadoEm": "2025-03-16T..."
    },
    ...
  ]
}
```

### Obter Pedido (Protegido)
```
GET /api/pedidos/:id
Authorization: Bearer token

Response 200:
{
  "success": true,
  "data": { ... }
}
```

### Criar Pedido (Protegido)
```
POST /api/pedidos
Authorization: Bearer token
Content-Type: application/json

{
  "itens": [
    {
      "produto": "produto-id-1",
      "quantidade": 2,
      "observacoes": "menos picante"
    },
    {
      "produto": "produto-id-2",
      "quantidade": 1,
      "observacoes": ""
    }
  ],
  "metodosPagamento": {
    "tipo": "pix"
  },
  "entrega": {
    "tipo": "entrega",
    "precoEntrega": 10.00,
    "endereco": "Rua das Flores, 123, São Paulo, SP"
  },
  "observacoes": "entrega até 19:00"
}

Response 201:
{
  "success": true,
  "message": "Pedido criado com sucesso",
  "data": { ... }
}
```

### Cancelar Pedido (Protegido)
```
PATCH /api/pedidos/:id/cancelar
Authorization: Bearer token

Response 200:
{
  "success": true,
  "message": "Pedido cancelado com sucesso",
  "data": { "status": "cancelado", ... }
}
```

### Listar Todos os Pedidos (Admin)
```
GET /api/pedidos
GET /api/pedidos?status=pendente
GET /api/pedidos?usuario=usuario-id
Authorization: Bearer token_admin

Response 200:
{
  "success": true,
  "total": 20,
  "data": [ { ... } ]
}
```

### Atualizar Status (Admin)
```
PATCH /api/pedidos/:id/status
Authorization: Bearer token_admin
Content-Type: application/json

{
  "status": "preparando"
}

Valores válidos: pendente, confirmado, preparando, pronto, entregue, cancelado

Response 200:
{
  "success": true,
  "message": "Status atualizado",
  "data": { ... }
}
```

### Atualizar Entrega (Admin)
```
PATCH /api/pedidos/:id/entrega
Authorization: Bearer token_admin
Content-Type: application/json

{
  "dataPrevista": "2025-03-17T19:00:00Z",
  "dataRealizada": "2025-03-17T18:30:00Z"
}

Response 200:
{
  "success": true,
  "message": "Entrega atualizada",
  "data": { ... }
}
```

---

## ⭐ Avaliações

### Listar Avaliações de um Produto
```
GET /api/avaliacoes/produto/:produtoId
GET /api/avaliacoes/produto/:produtoId?aprovado=true

Response 200:
{
  "success": true,
  "total": 5,
  "data": [
    {
      "_id": "...",
      "usuario": { "nome": "João" },
      "nota": 5,
      "comentario": "Excelente!",
      "util": { "sim": 10, "nao": 1 },
      "aprovado": true,
      "criadoEm": "..."
    },
    ...
  ]
}
```

### Obter Avaliação por ID
```
GET /api/avaliacoes/:id

Response 200:
{
  "success": true,
  "data": { ... }
}
```

### Criar Avaliação (Protegido - Produto Comprado)
```
POST /api/avaliacoes/produto/:produtoId
Authorization: Bearer token
Content-Type: application/json

{
  "nota": 5,
  "comentario": "O melhor prato que já comi! Recomendo muito."
}

Response 201:
{
  "success": true,
  "message": "Avaliação criada com sucesso",
  "data": { ... }
}
```

### Atualizar Avaliação (Protegido)
```
PUT /api/avaliacoes/:id
Authorization: Bearer token
Content-Type: application/json

{
  "nota": 4,
  "comentario": "Bom, mas poderia melhorar..."
}

Response 200:
{
  "success": true,
  "message": "Avaliação atualizada com sucesso",
  "data": { ... }
}
```

### Deletar Avaliação (Protegido)
```
DELETE /api/avaliacoes/:id
Authorization: Bearer token

Response 200:
{
  "success": true,
  "message": "Avaliação deletada com sucesso"
}
```

### Marcar como Útil (Protegido)
```
POST /api/avaliacoes/:id/util
Authorization: Bearer token

Response 200:
{
  "success": true,
  "data": { "util": { "sim": 11, "nao": 1 }, ... }
}
```

### Marcar como Não Útil (Protegido)
```
POST /api/avaliacoes/:id/nao-util
Authorization: Bearer token

Response 200:
{
  "success": true,
  "data": { "util": { "sim": 10, "nao": 2 }, ... }
}
```

### Aprovar Avaliação (Admin)
```
PATCH /api/avaliacoes/:id/aprovar
Authorization: Bearer token_admin

Response 200:
{
  "success": true,
  "data": { "aprovado": true, ... }
}
```

### Rejeitar Avaliação (Admin)
```
PATCH /api/avaliacoes/:id/rejeitar
Authorization: Bearer token_admin

Response 200:
{
  "success": true,
  "data": { "aprovado": false, ... }
}
```

---

## 💳 Comprovantes de Pagamento

### Meus Comprovantes (Protegido)
```
GET /api/comprovantes/meus-comprovantes
Authorization: Bearer token

Response 200:
{
  "success": true,
  "total": 3,
  "data": [ { ... } ]
}
```

### Obter Comprovante (Protegido)
```
GET /api/comprovantes/:id
Authorization: Bearer token

Response 200:
{
  "success": true,
  "data": { ... }
}
```

### Enviar Comprovante Pix (Protegido)
```
POST /api/comprovantes/pix
Authorization: Bearer token
Content-Type: application/json

{
  "pedidoId": "pedido-id",
  "valor": 150.00,
  "pixId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "pixKey": "12345678900",
  "qrCode": "url-qr-code",
  "arquivo": "url-comprovante.png",
  "tipo": "image"
}

Response 201:
{
  "success": true,
  "message": "Comprovante Pix enviado. Aguardando confirmação.",
  "data": { "status": "pendente", ... }
}
```

### Enviar Comprovante Cartão (Protegido)
```
POST /api/comprovantes/cartao
Authorization: Bearer token
Content-Type: application/json

{
  "pedidoId": "pedido-id",
  "valor": 150.00,
  "ultimosDados": "1234",
  "transactionId": "trans-123456",
  "arquivo": "url-comprovante.pdf",
  "tipo": "pdf"
}

Response 201:
{
  "success": true,
  "message": "Comprovante de cartão enviado. Aguardando confirmação.",
  "data": { ... }
}
```

### Listar Comprovantes (Admin)
```
GET /api/comprovantes
GET /api/comprovantes?status=pendente
GET /api/comprovantes?tipoPagamento=pix
Authorization: Bearer token_admin

Response 200:
{
  "success": true,
  "total": 10,
  "data": [ { ... } ]
}
```

### Confirmar Pagamento (Admin)
```
PATCH /api/comprovantes/:id/confirmar
Authorization: Bearer token_admin

Response 200:
{
  "success": true,
  "message": "Pagamento confirmado com sucesso",
  "data": { "status": "confirmado", ... }
}
```

### Rejeitar Pagamento (Admin)
```
PATCH /api/comprovantes/:id/rejeitar
Authorization: Bearer token_admin
Content-Type: application/json

{
  "motivo": "Dados incorretos"
}

Response 200:
{
  "success": true,
  "message": "Pagamento recusado",
  "data": { "status": "recusado", ... }
}
```

### Reembolsar (Admin)
```
PATCH /api/comprovantes/:id/reembolsar
Authorization: Bearer token_admin

Response 200:
{
  "success": true,
  "message": "Reembolso processado",
  "data": { "status": "reembolsado", ... }
}
```

---

## 🏪 Configuração da Loja

### Obter Configuração
```
GET /api/config-loja

Response 200:
{
  "success": true,
  "data": {
    "nomeLoja": "L&J Restaurante",
    "email": "contato@lj.com",
    "telefone": "(11) 3000-0000",
    "operacoes": {
      "segunda": { "aberto": true, "abertura": "11:00", "fechamento": "23:00" },
      ...
    },
    "rodizio": { "ativo": true, "diasRodizio": { ... } },
    "entrega": { "aceita": true, "raioEntrega": 10, "precoEntrega": 10.00, ... },
    "pagamento": { "pixAtivo": true, "cartaoAtivo": true, "dinheiro": false }
  }
}
```

### Rodízio de Hoje
```
GET /api/config-loja/rodizio/hoje

Response 200:
{
  "success": true,
  "dia": "segunda",
  "produtosDisponiveis": ["produto-id-1", "produto-id-2", "produto-id-3"]
}
```

### Verificar se Loja Está Aberta Agora
```
GET /api/config-loja/status/aberto

Response 200:
{
  "success": true,
  "aberto": true,
  "dia": "segunda",
  "horarioAtual": "15:30",
  "abertura": "11:00",
  "fechamento": "23:00"
}
```

### Atualizar Configuração (Admin)
```
PUT /api/config-loja
Authorization: Bearer token_admin
Content-Type: application/json

{
  "nomeLoja": "L&J Restaurante",
  "email": "novo@email.com",
  "telefone": "(11) 3000-0000",
  "entrega": {
    "aceita": true,
    "raioEntrega": 15,
    "precoEntrega": 15.00,
    "tempoMedio": 50
  },
  "pagamento": {
    "pixAtivo": true,
    "cartaoAtivo": true,
    "dinheiro": false
  }
}

Response 200:
{
  "success": true,
  "message": "Configurações da loja atualizadas",
  "data": { ... }
}
```

### Atualizar Horário (Admin)
```
PATCH /api/config-loja/horario
Authorization: Bearer token_admin
Content-Type: application/json

{
  "dia": "segunda",
  "aberto": true,
  "abertura": "11:00",
  "fechamento": "23:30"
}

Response 200:
{
  "success": true,
  "message": "Horário de segunda atualizado",
  "data": { ... }
}
```

### Atualizar Rodízio (Admin)
```
PATCH /api/config-loja/rodizio
Authorization: Bearer token_admin
Content-Type: application/json

{
  "dia": "segunda",
  "produtos": ["produto-id-1", "produto-id-2", "produto-id-3"]
}

Response 200:
{
  "success": true,
  "message": "Rodízio de segunda atualizado",
  "data": { ... }
}
```

---

## ✨ Códigos de Status HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token ausente ou inválido |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito (ex: email já existe) |
| 500 | Internal Server Error - Erro do servidor |

---

## 📝 Notas Importantes

1. **Proteção de Rotas**: Rotas marcadas com `(protegido)` requerem um token JWT válido
2. **Admin Only**: Rotas marcadas com `(admin)` requerem role='admin' no token
3. **Validação**: Todos os dados são validados com Joi antes do processamento
4. **Tratamento de Erros**: Todos os erros retornam `success: false` com mensagem descritiva
