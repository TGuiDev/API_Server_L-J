# 📐 Diagrama de Relacionamentos - L&J API

## Diagrama ER (Entity-Relationship)

```mermaid
erDiagram
    USER ||--o{ ORDER : faz
    USER ||--o{ REVIEW : escreve
    USER ||--o{ PAYMENT_PROOF : cria
    USER ||--o{ PRODUCT : favorita

    PRODUCT ||--o{ REVIEW : recebe
    PRODUCT }o--|| CATEGORY : "pertence a"

    CATEGORY ||--o{ PRODUCT : "contém"
    CATEGORY ||--o{ CATEGORY : "tem subcategorias"

    ORDER ||--o{ PAYMENT_PROOF : "relacionado a"
    ORDER ||--o{ ORDER_ITEM : "contém"
    ORDER_ITEM }o--|| PRODUCT : "referencia"

    USER {
        ObjectId _id
        string nome
        string email
        string telefone
        string senha
        array metodosPagamento
        array pedidos
        array favoritos
        array avaliacoes
        string role
        boolean ativo
        datetime criadoEm
        datetime atualizadoEm
    }

    PRODUCT {
        ObjectId _id
        string nome
        string descricao
        number preco
        string imagem
        ObjectId categoria
        string subcategoria
        array ingredientes
        boolean disponivel
        number estoque
        object diasDisponiveis
        array avaliacoes
        number mediaAvaliacoes
        number totalAvaliacoes
        boolean ativo
        datetime criadoEm
        datetime atualizadoEm
    }

    CATEGORY {
        ObjectId _id
        string nome
        string descricao
        string icone
        array subcategorias
        boolean ativo
        datetime criadoEm
        datetime atualizadoEm
    }

    ORDER {
        ObjectId _id
        ObjectId usuario
        array itens
        number total
        object metodosPagamento
        ObjectId comprovante
        object entrega
        string status
        string observacoes
        datetime criadoEm
        datetime atualizadoEm
    }

    ORDER_ITEM {
        ObjectId produto
        string nome
        number preco
        number quantidade
        number subtotal
        string observacoes
    }

    REVIEW {
        ObjectId _id
        ObjectId produto
        ObjectId usuario
        number nota
        string comentario
        object util
        boolean aprovado
        datetime criadoEm
        datetime atualizadoEm
    }

    PAYMENT_PROOF {
        ObjectId _id
        ObjectId usuario
        ObjectId pedido
        string tipoPagamento
        number valor
        datetime dataTransacao
        string pixId
        string pixKey
        string ultimosDados
        object comprovante
        string status
        datetime confirmadoEm
    }

    STORE_CONFIG {
        ObjectId _id
        string nomeLoja
        string descricao
        string logo
        string banner
        string email
        string telefone
        string whatsapp
        object operacoes
        object rodizio
        object entrega
        object pagamento
        number taxaPlatafoma
        boolean ativo
        datetime criadoEm
        datetime atualizadoEm
    }
```

## Fluxo de Dados

### Fluxo de Compra

```mermaid
graph TD
    A["👤 Usuário"] -->|Login| B["🔐 Autenticação"]
    B -->|Token JWT| C["📦 Busca Produtos"]
    C -->|Seleciona itens| D["🛒 Carrinho"]
    D -->|Finaliza compra| E["📝 Criar Order"]
    E -->|Seleciona pagamento| F["💳 Método Pagamento"]
    F -->|Processa| G["✅ PaymentProof"]
    G -->|Confirma| H["🔔 Pedido Confirmado"]
    H -->|Tracking| I["📦 Status Pedido"]
```

### Fluxo de Avaliação

```mermaid
graph TD
    A["👤 Usuário"] -->|Recebe| B["📦 Pedido"]
    B -->|Após entrega| C["⭐ Escreve Review"]
    C -->|Avalia produto| D["Review criada"]
    D -->|Atualiza| E["📊 Média Avaliações"]
    E -->|Afeta| F["🏆 Ranking Produto"]
```

### Fluxo do Rodízio

```mermaid
graph TD
    A["🏪 Admin"] -->|Configura| B["StoreConfig"]
    B -->|Define rodízio| C["Dias + Produtos"]
    C -->|Sistema verifica| D["Que dia é hoje?"]
    D -->|Filtra| E["Produtos disponíveis"]
    E -->|Mostra no app| F["App/Web"]
```

## Estrutura de Coleções

```
Database: api-lj
├── users (Usuários)
│   └── Índices: _id, email (unique)
├── products (Produtos)
│   └── Índices: _id, categoria, nome_descricao (text search)
├── categories (Categorias)
│   └── Índices: _id, nome (unique)
├── orders (Pedidos)
│   └── Índices: _id, usuario, status, criadoEm
├── reviews (Avaliações)
│   └── Índices: _id, produto, usuario (unique combo)
├── payment_proofs (Comprovantes)
│   └── Índices: _id, usuario, pedido, status
└── store_configs (Configurações)
    └── Índices: _id
```

## Relacionamentos Principais

### 1. Uma para Muitos (1:N)

```
Category --1:N--> Product
  1 categoria pode ter N produtos

User --1:N--> Order
  1 usuário pode fazer N pedidos

User --1:N--> Review
  1 usuário pode fazer N avaliações

Product --1:N--> Review
  1 produto pode receber N avaliações

Order --1:N--> OrderItem
  1 pedido contém N itens
```

### 2. Muitos para Muitos (N:N)

```
User --N:N--> Product (via favoritos)
  1 usuário pode favoritar N produtos
  1 produto pode ser favoritado por N usuários
```

### 3. Referências (Foreign Keys)

```
Order.usuario -> User._id
Order.comprovante -> PaymentProof._id
Order.itens[].produto -> Product._id

Product.categoria -> Category._id
Product.avaliacoes[] -> Review._id

Review.produto -> Product._id
Review.usuario -> User._id

PaymentProof.usuario -> User._id
PaymentProof.pedido -> Order._id

User.pedidos[] -> Order._id
User.avaliacoes[] -> Review._id
User.favoritos[] -> Product._id
```

## Tipos de Dados Usados

| Tipo | Exemplo | Uso |
|------|---------|-----|
| String | "João Silva", "joao@email.com" | Texto |
| Number | 45.90, 20, 5 | Preços, quantidades, notas |
| Boolean | true, false | Status, disponibilidade |
| Date | new Date() | Timestamps, datas de entrega |
| ObjectId | "507f1f77bcf86cd799439011" | Referências entre coleções |
| Array | [...] | Múltiplas ocorrências |
| Object | { tipo: 'pix', ... } | Dados estruturados |

## Índices para Performance

```javascript
// User
User.index({ email: 1 }, { unique: true })

// Product
Product.index({ nome: 'text', descricao: 'text' })
Product.index({ categoria: 1 })

// Order
Order.index({ usuario: 1, criadoEm: -1 })
Order.index({ status: 1 })

// Review
Review.index({ produto: 1, usuario: 1 }, { unique: true })

// PaymentProof
PaymentProof.index({ usuario: 1, criadoEm: -1 })
PaymentProof.index({ status: 1 })

// Category
Category.index({ nome: 1 }, { unique: true })
```
