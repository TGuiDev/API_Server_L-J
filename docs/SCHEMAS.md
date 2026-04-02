# 📊 Documentação dos Schemas - L&J API

## 🏗️ Estrutura do Banco de Dados

A API utiliza os seguintes modelos:

### 1. **User** (Usuário)
Armazena informações dos clientes e dados de pagamento.

```
User
├── nome (string) - Nome completo
├── email (string) - Email único
├── telefone (string) - Número de telefone
├── senha (string) - Hash da senha
├── metodosPagamento (array)
│   ├── tipo: 'pix' | 'cartao_credito' | 'cartao_debito'
│   ├── principal (boolean)
│   ├── Para Pix:
│   │   ├── chavePixType: 'cpf' | 'email' | 'telefone' | 'aleatoria'
│   │   └── chavePix (string)
│   └── Para Cartão:
│       ├── tipoCartao: 'credito' | 'debito'
│       ├── ultimosDados (string) - Últimos 4 dígitos
│       ├── titular (string)
│       └── dataSalvo (date)
├── pedidos (array) - Referência a Order
├── favoritos (array) - Referência a Product
├── avaliacoes (array) - Referência a Review
├── comprovante_pagamentos (array) - Referência a PaymentProof
├── role: 'user' | 'admin'
├── ativo (boolean)
└── timestamps (criadoEm, atualizadoEm)
```

### 2. **Product** (Produto)
Informações sobre os produtos/pratos.

```
Product
├── nome (string) - Nome do produto
├── descricao (string) - Descrição detalhada
├── preco (number) - Preço em reais
├── imagens (array[string]) - Lista com 1..5 caminhos/URLs das imagens (servidas via /images/*)
├── categoria (ObjectId) - Referência a Category
├── subcategoria (string) - Nome da subcategoria
├── ingredientes (array)
│   ├── nome (string)
│   └── quantidade (string)
├── disponivel (boolean) - Disponível no rodízio de hoje
├── estoque (number) - Quantidade em estoque
├── diasDisponiveis (object)
│   ├── segunda: boolean
  ├── terca: boolean
  ├── quarta: boolean
  ├── quinta: boolean
  ├── sexta: boolean
  ├── sabado: boolean
  └── domingo: boolean
├── avaliacoes (array) - Referência a Review
├── mediaAvaliacoes (number) - 0 a 5
├── totalAvaliacoes (number)
├── ativo (boolean)
└── timestamps
```

### 3. **Category** (Categoria)
Organiza os produtos em categorias e subcategorias.

```
Category
├── nome (string) - Nome único
├── descricao (string)
├── icone (string) - URL do ícone/imagem
├── subcategorias (array)
│   ├── nome (string)
│   ├── descricao (string)
│   └── icone (string)
├── ativo (boolean)
└── timestamps
```

**Exemplo:**
```json
{
  "nome": "Bebidas",
  "icone": "url-icone",
  "subcategorias": [
    { "nome": "Sucos" },
    { "nome": "Refrigerantes" },
    { "nome": "Bebidas Quentes" }
  ]
}
```

### 4. **Banner** (Banner / Promoção exibida no app)

Os banners exibidos na tela inicial são gerenciados separadamente. Cada banner contém:

```
Banner
├── title (string) - Título opcional (não exibido no app por padrão)
├── imagePath (string) - Caminho do arquivo no servidor (ex: /images/banner-1.png)
├── actionType (string) - 'none' | 'url' | 'produto' | 'categoria' | 'subcategoria' | 'promocao'
├── actionTarget (string) - URL ou id do recurso alvo (dependendo de actionType)
├── active (boolean) - Se o banner está ativo e visível no app
└── timestamps
```

Observações:
- Apenas `imagePath` é mostrada no app; `title` e `actionTarget` são metadados para navegação.
- Para `actionType: 'url'`, `actionTarget` deve conter a URL completa.
- Para tipos como `produto`, `categoria`, `subcategoria` e `promocao`, `actionTarget` deve ser o ID correspondente que será pesquisável no admin.


### 4. **Order** (Pedido)
Histórico de compras com detalhes completos.

```
Order
├── usuario (ObjectId) - Referência a User
├── itens (array) - OrderItem
│   ├── produto (ObjectId)
│   ├── nome (string)
│   ├── preco (number)
│   ├── quantidade (number)
│   ├── subtotal (number)
│   └── observacoes (string)
├── total (number) - Total do pedido
├── metodosPagamento (object)
│   ├── tipo: 'pix' | 'cartao_credito' | 'cartao_debito'
│   └── status: 'pendente' | 'processando' | 'aprovado' | 'recusado'
├── comprovante (ObjectId) - Referência a PaymentProof
├── entrega (object)
│   ├── tipo: 'retirada' | 'entrega'
│   ├── precoEntrega (number)
│   ├── endereco (string)
│   ├── dataPrevista (date)
│   └── dataRealizada (date)
├── status: 'pendente' | 'confirmado' | 'preparando' | 'pronto' | 'entregue' | 'cancelado'
├── observacoes (string)
└── timestamps
```

### 5. **Review** (Avaliação/Comentário)
Comentários e avaliações dos produtos.

```
Review
├── produto (ObjectId) - Referência a Product
├── usuario (ObjectId) - Referência a User
├── nota (number) - 1 a 5 estrelas
├── comentario (string) - 10 a 500 caracteres
├── util (object)
│   ├── sim (number) - Quantas pessoas acham útil
│   └── nao (number) - Quantas pessoas acham inútil
├── aprovado (boolean)
└── timestamps
```

### 6. **PaymentProof** (Comprovante de Pagamento)
Registra os comprovantes de pagamento das transações.

```
PaymentProof
├── usuario (ObjectId) - Referência a User
├── pedido (ObjectId) - Referência a Order
├── tipoPagamento: 'pix' | 'cartao_credito' | 'cartao_debito' | 'outro'
├── valor (number)
├── dataTransacao (date)
├── Para Pix:
│   ├── pixId (string) - ID da transação
│   ├── pixKey (string) - Chave Pix usada
│   └── qrCode (string) - URL do QR code
├── Para Cartão:
│   ├── ultimosDados (string)
│   └── tranactionId (string)
├── comprovante (object)
│   ├── arquivo (string) - URL da imagem/PDF
│   └── tipo: 'image' | 'pdf'
├── status: 'pendente' | 'confirmado' | 'recusado' | 'reembolsado'
└── timestamps
```

### 7. **StoreConfig** (Configuração da Loja)
Configurações gerais da loja e rodízio.

```
StoreConfig
├── nomeLoja (string)
├── descricao (string)
├── logo (string) - URL
├── banner (string) - URL
├── Contato:
│   ├── email (string)
│   ├── telefone (string)
│   └── whatsapp (string)
├── operacoes (object) - Dias e horários
│   ├── segunda: { aberto: boolean, abertura: 'HH:MM', fechamento: 'HH:MM' }
│   ├── terca: {...}
│   ├── ... (até domingo)
├── rodizio (object)
│   ├── ativo (boolean)
│   └── diasRodizio (object)
│       ├── segunda: [nomes de produtos]
│       ├── terca: [...]
│       └── ... (até domingo)
├── entrega (object)
│   ├── aceita (boolean)
│   ├── raioEntrega (number) - em km
│   ├── precoEntrega (number)
│   └── tempoMedio (number) - em minutos
├── pagamento (object)
│   ├── pixAtivo (boolean)
│   ├── cartaoAtivo (boolean)
│   └── dinheiro (boolean)
├── taxaPlatafoma (number) - percentual
├── ativo (boolean)
└── timestamps
```

## 🔗 Relacionamentos

```
User
├── tem muitos → Order
├── tem muitos → Review
├── tem muitos → PaymentProof
└── tem muitos → Product (favoritos)

Product
├── pertence a → Category
├── tem muitos → Review
└── tem muitos → Order (através de OrderItem)

Order
├── pertence a → User
├── tem muitos → OrderItem
├── pertence a → PaymentProof
└── referencia muitos → Product

Review
├── pertence a → Product
├── pertence a → User
└── afeta → Product (mediaAvaliacoes)

PaymentProof
├── pertence a → User
└── pertence a → Order

Category
└── contém muitos → Product

StoreConfig
└── configurações globais da loja
```

## 📝 Exemplo de Queries Comuns

### Buscar usuário com seus pedidos
```javascript
const user = await User.findById(userId)
  .populate('pedidos')
  .select('-senha');
```

### Buscar produto com comentários e usuários
```javascript
const product = await Product.findById(productId)
  .populate({
    path: 'avaliacoes',
    populate: { path: 'usuario', select: 'nome' }
  });
```

### Buscar pedidos de um usuário com detalhes
```javascript
const orders = await Order.findOne({ usuario: userId })
  .populate('itens.produto')
  .populate('comprovante');
```

### Buscar produtos de uma categoria
```javascript
const products = await Product.find({ categoria: categoryId, ativo: true });
```

## ✅ Checklist de Informações

- ✅ Nome do usuário
- ✅ Email e telefone
- ✅ Senha (com hash bcrypt)
- ✅ Dados de pagamento (Pix, Cartão Crédito/Débito)
- ✅ Histórico de compra
- ✅ Comprovantes de pagamento
- ✅ Favoritos
- ✅ Comentários/Avaliações
- ✅ Produtos com categoria/subcategoria
- ✅ Imagens dos produtos
- ✅ Disponibilidade por dia (rodízio)
- ✅ Estoque
- ✅ Ingredientes
- ✅ Comentários de produtos
- ✅ Configurações da loja
- ✅ Horários de funcionamento
- ✅ Rodízio semanal
