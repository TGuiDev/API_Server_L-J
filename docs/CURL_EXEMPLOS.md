# 🧪 Exemplos Práticos de Testes - cURL

## 📌 Configuração Inicial

```bash
# Defina a URL base
BASE_URL="http://localhost:5000/api"

# Após login, salve o token
TOKEN="seu_token_aqui"

# Use assim:
curl -H "Authorization: Bearer $TOKEN" $BASE_URL/seu-endpoint
```

---

## 🔐 AUTENTICAÇÃO

### Registrar Novo Usuário
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "senha123",
    "senhaConfirm": "senha123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123"
  }'

# Copie o token da resposta
```

### Obter Perfil
```bash
curl -X GET http://localhost:5000/api/auth/perfil \
  -H "Authorization: Bearer seu_token"
```

### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer seu_token"
```

---

## 👥 USUÁRIOS

### Listar Todos (Admin)
```bash
curl -X GET http://localhost:5000/api/usuarios \
  -H "Authorization: Bearer token_admin"
```

### Obter Usuário por ID
```bash
curl -X GET http://localhost:5000/api/usuarios/id_do_usuario \
  -H "Authorization: Bearer seu_token"
```

### Atualizar Perfil
```bash
curl -X PUT http://localhost:5000/api/usuarios/perfil/atualizar \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva Atualizado",
    "telefone": "(11) 98765-4321"
  }'
```

### Adicionar Método de Pagamento (Pix)
```bash
curl -X POST http://localhost:5000/api/usuarios/pagamento/adicionar \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "pix",
    "chavePixType": "cpf",
    "chavePix": "12345678900"
  }'
```

### Adicionar Método de Pagamento (Cartão Crédito)
```bash
curl -X POST http://localhost:5000/api/usuarios/pagamento/adicionar \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "cartao_credito",
    "tipoCartao": "credito",
    "ultimosDados": "1234",
    "titular": "JOAO SILVA"
  }'
```

### Adicionar aos Favoritos
```bash
curl -X POST http://localhost:5000/api/usuarios/favoritos/id_do_produto \
  -H "Authorization: Bearer seu_token"
```

### Remover dos Favoritos
```bash
curl -X DELETE http://localhost:5000/api/usuarios/favoritos/id_do_produto \
  -H "Authorization: Bearer seu_token"
```

### Listar Favoritos
```bash
curl -X GET http://localhost:5000/api/usuarios/favoritos/listar \
  -H "Authorization: Bearer seu_token"
```

### Deletar Conta
```bash
curl -X DELETE http://localhost:5000/api/usuarios/deletar-conta \
  -H "Authorization: Bearer seu_token"
```

---

## 🍽️ PRODUTOS

### Listar Todos
```bash
curl -X GET "http://localhost:5000/api/produtos"
```

### Listar com Filtros
```bash
# Por categoria
curl -X GET "http://localhost:5000/api/produtos?categoria=id_categoria"

# Disponíveis
curl -X GET "http://localhost:5000/api/produtos?disponivel=true"

# Por dia da semana
curl -X GET "http://localhost:5000/api/produtos?dia=segunda"
```

### Buscar Produtos
```bash
curl -X GET "http://localhost:5000/api/produtos/buscar?q=moqueca"
```

### Obter Produto por ID
```bash
curl -X GET http://localhost:5000/api/produtos/id_do_produto
```

### Listar Produtos (Admin)
```bash
curl -X GET http://localhost:5000/api/produtos/categoria/id_categoria \
  -H "Authorization: Bearer token_admin"
```

### Criar Produto (Admin)
```bash
curl -X POST http://localhost:5000/api/produtos \
  -H "Authorization: Bearer token_admin" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Moqueca Baiana",
    "descricao": "Peixe com leite de coco e azeite de dendê",
    "preco": 45.90,
    "imagem": "http://exemplo.com/imagem.jpg",
    "categoria": "id_categoria",
    "subcategoria": "Peixes",
    "ingredientes": [
      {"nome": "Peixe branco", "quantidade": "500g"},
      {"nome": "Leite de coco", "quantidade": "200ml"}
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
  }'
```

### Atualizar Produto (Admin)
```bash
curl -X PUT http://localhost:5000/api/produtos/id_do_produto \
  -H "Authorization: Bearer token_admin" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Novo Nome",
    "preco": 50.00,
    "estoque": 15
  }'
```

### Atualizar Estoque (Admin)
```bash
curl -X PATCH http://localhost:5000/api/produtos/id_do_produto/estoque \
  -H "Authorization: Bearer token_admin" \
  -H "Content-Type: application/json" \
  -d '{
    "quantidade": 30
  }'
```

### Deletar Produto (Admin)
```bash
curl -X DELETE http://localhost:5000/api/produtos/id_do_produto \
  -H "Authorization: Bearer token_admin"
```

---

## 📂 CATEGORIAS

### Listar Todas
```bash
curl -X GET http://localhost:5000/api/categorias
```

### Obter Categoria por ID
```bash
curl -X GET http://localhost:5000/api/categorias/id_da_categoria
```

### Criar Categoria (Admin)
```bash
curl -X POST http://localhost:5000/api/categorias \
  -H "Authorization: Bearer token_admin" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Bebidas",
    "descricao": "Bebidas quentes e frias",
    "subcategorias": [
      {"nome": "Sucos", "descricao": "Sucos naturais"},
      {"nome": "Refrigerantes", "descricao": "Refrigerantes variados"}
    ]
  }'
```

### Atualizar Categoria (Admin)
```bash
curl -X PUT http://localhost:5000/api/categorias/id_da_categoria \
  -H "Authorization: Bearer token_admin" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Bebidas Especiais",
    "descricao": "Bebidas artesanais"
  }'
```

### Adicionar Subcategoria (Admin)
```bash
curl -X POST http://localhost:5000/api/categorias/id_da_categoria/subcategorias \
  -H "Authorization: Bearer token_admin" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Bebidas Quentes",
    "descricao": "Café, chá, chocolate"
  }'
```

### Remover Subcategoria (Admin)
```bash
curl -X DELETE http://localhost:5000/api/categorias/id_categoria/subcategorias/id_subcategoria \
  -H "Authorization: Bearer token_admin"
```

### Deletar Categoria (Admin)
```bash
curl -X DELETE http://localhost:5000/api/categorias/id_da_categoria \
  -H "Authorization: Bearer token_admin"
```

---

## 📦 PEDIDOS

### Meus Pedidos
```bash
curl -X GET http://localhost:5000/api/pedidos/meus-pedidos \
  -H "Authorization: Bearer seu_token"
```

### Obter Pedido Específico
```bash
curl -X GET http://localhost:5000/api/pedidos/id_do_pedido \
  -H "Authorization: Bearer seu_token"
```

### Criar Pedido
```bash
curl -X POST http://localhost:5000/api/pedidos \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "itens": [
      {
        "produto": "id_produto_1",
        "quantidade": 2,
        "observacoes": "menos picante"
      },
      {
        "produto": "id_produto_2",
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
  }'
```

### Cancelar Pedido
```bash
curl -X PATCH http://localhost:5000/api/pedidos/id_do_pedido/cancelar \
  -H "Authorization: Bearer seu_token"
```

### Listar Todos os Pedidos (Admin)
```bash
curl -X GET http://localhost:5000/api/pedidos \
  -H "Authorization: Bearer token_admin"

# Com filtros
curl -X GET "http://localhost:5000/api/pedidos?status=pendente" \
  -H "Authorization: Bearer token_admin"
```

### Atualizar Status (Admin)
```bash
curl -X PATCH http://localhost:5000/api/pedidos/id_do_pedido/status \
  -H "Authorization: Bearer token_admin" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "preparando"
  }'
```

### Atualizar Entrega (Admin)
```bash
curl -X PATCH http://localhost:5000/api/pedidos/id_do_pedido/entrega \
  -H "Authorization: Bearer token_admin" \
  -H "Content-Type: application/json" \
  -d '{
    "dataPrevista": "2025-03-17T19:00:00Z",
    "dataRealizada": "2025-03-17T18:30:00Z"
  }'
```

---

## ⭐ AVALIAÇÕES

### Listar Avaliações de um Produto
```bash
curl -X GET "http://localhost:5000/api/avaliacoes/produto/id_do_produto"

# Apenas aprovadas
curl -X GET "http://localhost:5000/api/avaliacoes/produto/id_do_produto?aprovado=true"
```

### Obter Avaliação
```bash
curl -X GET http://localhost:5000/api/avaliacoes/id_avaliacao
```

### Criar Avaliação
```bash
curl -X POST http://localhost:5000/api/avaliacoes/produto/id_do_produto \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "nota": 5,
    "comentario": "O melhor prato que já comi! Recomendo muito."
  }'
```

### Atualizar Avaliação
```bash
curl -X PUT http://localhost:5000/api/avaliacoes/id_avaliacao \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "nota": 4,
    "comentario": "Bom, mas poderia melhorar..."
  }'
```

### Deletar Avaliação
```bash
curl -X DELETE http://localhost:5000/api/avaliacoes/id_avaliacao \
  -H "Authorization: Bearer seu_token"
```

### Marcar como Útil
```bash
curl -X POST http://localhost:5000/api/avaliacoes/id_avaliacao/util \
  -H "Authorization: Bearer seu_token"
```

### Marcar como Não Útil
```bash
curl -X POST http://localhost:5000/api/avaliacoes/id_avaliacao/nao-util \
  -H "Authorization: Bearer seu_token"
```

### Aprovar Avaliação (Admin)
```bash
curl -X PATCH http://localhost:5000/api/avaliacoes/id_avaliacao/aprovar \
  -H "Authorization: Bearer token_admin"
```

### Rejeitar Avaliação (Admin)
```bash
curl -X PATCH http://localhost:5000/api/avaliacoes/id_avaliacao/rejeitar \
  -H "Authorization: Bearer token_admin"
```

---

## 💳 COMPROVANTES DE PAGAMENTO

### Meus Comprovantes
```bash
curl -X GET http://localhost:5000/api/comprovantes/meus-comprovantes \
  -H "Authorization: Bearer seu_token"
```

### Obter Comprovante
```bash
curl -X GET http://localhost:5000/api/comprovantes/id_comprovante \
  -H "Authorization: Bearer seu_token"
```

### Enviar Comprovante Pix
```bash
curl -X POST http://localhost:5000/api/comprovantes/pix \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "pedidoId": "id_do_pedido",
    "valor": 150.00,
    "pixId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "pixKey": "12345678900",
    "qrCode": "http://exemplo.com/qrcode.png",
    "arquivo": "http://exemplo.com/comprovante.png",
    "tipo": "image"
  }'
```

### Enviar Comprovante Cartão
```bash
curl -X POST http://localhost:5000/api/comprovantes/cartao \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "pedidoId": "id_do_pedido",
    "valor": 150.00,
    "ultimosDados": "1234",
    "transactionId": "trans-123456",
    "arquivo": "http://exemplo.com/comprovante.pdf",
    "tipo": "pdf"
  }'
```

### Listar Comprovantes (Admin)
```bash
curl -X GET http://localhost:5000/api/comprovantes \
  -H "Authorization: Bearer token_admin"

# Com filtros
curl -X GET "http://localhost:5000/api/comprovantes?status=pendente" \
  -H "Authorization: Bearer token_admin"
```

### Confirmar Pagamento (Admin)
```bash
curl -X PATCH http://localhost:5000/api/comprovantes/id_comprovante/confirmar \
  -H "Authorization: Bearer token_admin"
```

### Rejeitar Pagamento (Admin)
```bash
curl -X PATCH http://localhost:5000/api/comprovantes/id_comprovante/rejeitar \
  -H "Authorization: Bearer token_admin" \
  -H "Content-Type: application/json" \
  -d '{
    "motivo": "Dados incorretos"
  }'
```

### Reembolsar (Admin)
```bash
curl -X PATCH http://localhost:5000/api/comprovantes/id_comprovante/reembolsar \
  -H "Authorization: Bearer token_admin"
```

---

## 🏪 CONFIGURAÇÃO DA LOJA

### Obter Configuração
```bash
curl -X GET http://localhost:5000/api/config-loja
```

### Rodízio de Hoje
```bash
curl -X GET http://localhost:5000/api/config-loja/rodizio/hoje
```

### Verificar se Está Aberta Agora
```bash
curl -X GET http://localhost:5000/api/config-loja/status/aberto
```

### Atualizar Configurações (Admin)
```bash
curl -X PUT http://localhost:5000/api/config-loja \
  -H "Authorization: Bearer token_admin" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### Atualizar Horário (Admin)
```bash
curl -X PATCH http://localhost:5000/api/config-loja/horario \
  -H "Authorization: Bearer token_admin" \
  -H "Content-Type: application/json" \
  -d '{
    "dia": "segunda",
    "aberto": true,
    "abertura": "11:00",
    "fechamento": "23:30"
  }'
```

### Atualizar Rodízio (Admin)
```bash
curl -X PATCH http://localhost:5000/api/config-loja/rodizio \
  -H "Authorization: Bearer token_admin" \
  -H "Content-Type: application/json" \
  -d '{
    "dia": "segunda",
    "produtos": ["id_produto_1", "id_produto_2", "id_produto_3"]
  }'
```

---

## 💡 DICAS ÚTEIS

### Salvar Token em Variável
```bash
# Login e extrair token (requer jq)
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","senha":"senha123"}' | jq -r '.data.token')

echo $TOKEN

# Use depois
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/auth/perfil
```

### Testar com Pretty Print
```bash
curl -X GET http://localhost:5000/api/produtos | jq '.'
```

### Contar Resultados
```bash
curl -s http://localhost:5000/api/produtos | jq '.total'
```

### Verificar Status HTTP
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/config-loja
```
