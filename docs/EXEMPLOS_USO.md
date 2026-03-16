# 💡 Exemplos Práticos de Uso dos Modelos

## 📦 Exemplos de Criação de Documentos

### 1. Registrar um Usuário com Dados de Pagamento

```javascript
const User = require('../models/User');

// Novo usuário
const novoUsuario = await User.create({
  nome: 'João Silva',
  email: 'joao@email.com',
  telefone: '(11) 99999-9999',
  senha: 'senha123', // Será feito hash automaticamente
  metodosPagamento: [
    {
      tipo: 'pix',
      principal: true,
      chavePixType: 'cpf',
      chavePix: '12345678900'
    },
    {
      tipo: 'cartao_credito',
      tipoCartao: 'credito',
      ultimosDados: '1234',
      titular: 'JOAO SILVA'
    }
  ]
});
```

### 2. Criar uma Categoria com Subcategorias

```javascript
const Category = require('../models/Category');

const categoria = await Category.create({
  nome: 'Pratos Principais',
  descricao: 'Pratos quentes e deliciosos',
  icone: 'url-da-imagem',
  subcategorias: [
    {
      nome: 'Carnes',
      descricao: 'Diferentes tipos de carnes'
    },
    {
      nome: 'Peixes',
      descricao: 'Pratos com frutos do mar'
    },
    {
      nome: 'Vegetarianos',
      descricao: 'Opções sem carne'
    }
  ]
});
```

### 3. Criar um Produto

```javascript
const Product = require('../models/Product');
const Category = require('../models/Category');

// Buscar categoria
const categoria = await Category.findOne({ nome: 'Pratos Principais' });

const produto = await Product.create({
  nome: 'Moqueca Baiana',
  descricao: 'Moqueca de peixe com leite de coco e azeite de dendê',
  preco: 45.90,
  imagem: 'url-imagem-moqueca',
  categoria: categoria._id, // ID da categoria
  subcategoria: 'Peixes',
  ingredientes: [
    { nome: 'Peixe branco', quantidade: '500g' },
    { nome: 'Leite de coco', quantidade: '200ml' },
    { nome: 'Azeite de dendê', quantidade: '50ml' },
    { nome: 'Pimentão', quantidade: '1 unidade' }
  ],
  disponivel: true,
  estoque: 20,
  diasDisponiveis: {
    segunda: true,
    terca: true,
    quarta: true,
    quinta: true,
    sexta: true,
    sabado: true,
    domingo: false
  }
});
```

### 4. Criar um Pedido

```javascript
const Order = require('../models/Order');

const novoPedido = await Order.create({
  usuario: usuarioId, // ID do usuário
  itens: [
    {
      produto: produtoId, // ID do produto
      nome: 'Moqueca Baiana',
      preco: 45.90,
      quantidade: 2,
      subtotal: 91.80,
      observacoes: 'Menos picante'
    },
    {
      produto: outroProdutoId,
      nome: 'Arroz com Feijão',
      preco: 12.50,
      quantidade: 2,
      subtotal: 25.00,
      observacoes: ''
    }
  ],
  total: 116.80, // 91.80 + 25.00
  metodosPagamento: {
    tipo: 'pix',
    status: 'pendente'
  },
  entrega: {
    tipo: 'entrega',
    precoEntrega: 10.00,
    endereco: 'Rua das Flores, 123 - São Paulo',
    dataPrevista: new Date(Date.now() + 30 * 60000) // 30 minutos
  },
  observacoes: 'Entrega até às 19:00'
});
```

### 5. Adicionar uma Avaliação ao Produto

```javascript
const Review = require('../models/Review');
const Product = require('../models/Product');

const avaliacao = await Review.create({
  produto: produtoId,
  usuario: usuarioId,
  nota: 5,
  comentario: 'Excelente! A moqueca estava deliciosa e bem temperada. Recomendo!'
});

// Atualizar média de avaliações do produto
const novaMedia = await Review.aggregate([
  { $match: { produto: produtoId } },
  { $group: { _id: null, media: { $avg: '$nota' }, total: { $sum: 1 } } }
]);

await Product.findByIdAndUpdate(produtoId, {
  mediaAvaliacoes: novaMedia[0].media,
  totalAvaliacoes: novaMedia[0].total
});
```

### 6. Registrar um Comprovante de Pagamento

```javascript
const PaymentProof = require('../models/PaymentProof');

const comprovante = await PaymentProof.create({
  usuario: usuarioId,
  pedido: pedidoId,
  tipoPagamento: 'pix',
  valor: 116.80,
  dataTransacao: new Date(),
  pixId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  pixKey: '12345678900', // CPF
  status: 'confirmado',
  comprovante: {
    arquivo: 'url-comprovante.png',
    tipo: 'image'
  }
});

// Atualizar pedido com comprovante
await Order.findByIdAndUpdate(pedidoId, {
  comprovante: comprovante._id,
  'metodosPagamento.status': 'aprovado'
});
```

### 7. Configurar a Loja

```javascript
const StoreConfig = require('../models/StoreConfig');

const config = await StoreConfig.create({
  nomeLoja: 'L&J Restaurante',
  descricao: 'Restaurante especializado em comida brasileira',
  logo: 'url-logo',
  banner: 'url-banner',
  email: 'contato@lj.com',
  telefone: '(11) 3000-0000',
  whatsapp: '(11) 99999-9999',
  operacoes: {
    segunda: { aberto: true, abertura: '11:00', fechamento: '23:00' },
    terca: { aberto: true, abertura: '11:00', fechamento: '23:00' },
    quarta: { aberto: true, abertura: '11:00', fechamento: '23:00' },
    quinta: { aberto: true, abertura: '11:00', fechamento: '00:00' },
    sexta: { aberto: true, abertura: '11:00', fechamento: '01:00' },
    sabado: { aberto: true, abertura: '12:00', fechamento: '02:00' },
    domingo: { aberto: true, abertura: '12:00', fechamento: '23:00' }
  },
  rodizio: {
    ativo: true,
    diasRodizio: {
      segunda: ['id-prod-1', 'id-prod-2', 'id-prod-3'],
      terca: ['id-prod-2', 'id-prod-4', 'id-prod-5'],
      // ... outros dias
    }
  },
  entrega: {
    aceita: true,
    raioEntrega: 10,
    precoEntrega: 10.00,
    tempoMedio: 45
  },
  pagamento: {
    pixAtivo: true,
    cartaoAtivo: true,
    dinheiro: false
  }
});
```

## 🔍 Exemplos de Buscas (Queries)

### 1. Buscar Usuário com Todos Seus Dados

```javascript
const user = await User.findById(usuarioId)
  .populate('pedidos')
  .populate('avaliacoes')
  .populate('favoritos')
  .select('-senha'); // Exclui a senha
```

### 2. Buscar Produtos de uma Categoria

```javascript
const produtos = await Product.find({
  categoria: categoryId,
  ativo: true,
  estoque: { $gt: 0 } // Estoque > 0
}).populate('categoria').sort({ nome: 1 });
```

### 3. Buscar Produtos Disponíveis Hoje (Segunda)

```javascript
const hoje = 'segunda'; // Determinar dinamicamente

const produtos = await Product.find({
  ativo: true,
  available: true,
  [`diasDisponiveis.${hoje}`]: true
});
```

### 4. Buscar Produto com Avaliações

```javascript
const produto = await Product.findById(produtoId)
  .populate({
    path: 'avaliacoes',
    populate: { path: 'usuario', select: 'nome' },
    options: { limit: 10, sort: { criadoEm: -1 } }
  });
```

### 5. Buscar Todos os Pedidos de um Usuário

```javascript
const pedidos = await Order.find({ usuario: usuarioId })
  .populate('itens.produto')
  .populate('comprovante')
  .sort({ criadoEm: -1 });
```

### 6. Buscar Pedidos Pendentes de Processamento

```javascript
const pedidosPendentes = await Order.find({
  status: { $in: ['pendente', 'confirmado', 'preparando'] }
})
  .populate('usuario', 'nome telefone')
  .sort({ criadoEm: 1 });
```

### 7. Buscar Comprovantes de um Período

```javascript
const dataInicio = new Date('2025-01-01');
const dataFim = new Date('2025-01-31');

const comprovantes = await PaymentProof.find({
  dataTransacao: { $gte: dataInicio, $lte: dataFim },
  status: 'confirmado'
})
  .populate('usuario', 'nome email')
  .sort({ dataTransacao: -1 });
```

### 8. Buscas com Texto (Full-Text Search)

```javascript
// Buscar produto por nome ou descrição
const resultados = await Product.find({
  $text: { $search: 'moqueca' }
}).select({ score: { $meta: 'textScore' } })
  .sort({ score: { $meta: 'textScore' } });
```

## 📊 Exemplos de Agregações

### 1. Vendas Totais por Dia

```javascript
const vendasPorDia = await Order.aggregate([
  { $match: { status: { $ne: 'cancelado' } } },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$criadoEm' } },
      totalVendas: { $sum: '$total' },
      totalPedidos: { $sum: 1 }
    }
  },
  { $sort: { _id: -1 } }
]);
```

### 2. Produtos Mais Avaliados

```javascript
const topProdutos = await Product.find({ ativo: true })
  .sort({ mediaAvaliacoes: -1, totalAvaliacoes: -1 })
  .limit(10);
```

### 3. Usuários mais Ativos (Mais Compras)

```javascript
const usuariosAtivos = await Order.aggregate([
  { $group: { _id: '$usuario', totalGasto: { $sum: '$total' }, totalPedidos: { $sum: 1 } } },
  { $sort: { totalGasto: -1 } },
  { $limit: 10 },
  { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'usuario' } }
]);
```

### 4. Produtos Mais Vendidos

```javascript
const maisVendidos = await Order.aggregate([
  { $unwind: '$itens' },
  { $group: { _id: '$itens.produto', totalVendido: { $sum: '$itens.quantidade' } } },
  { $sort: { totalVendido: -1 } },
  { $limit: 10 },
  { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'produto' } }
]);
```

## 🎯 Padrões de Uso

### Criar um novo usuário com dados de pagamento
```javascript
const { gerarToken } = require('../config/jwt');
const usuario = await User.create({ ... });
const token = gerarToken(usuario._id, usuario.email, usuario.role);
```

### Atualizar disponibilidade de produtos
```javascript
// Atualizar apenas produtos do rodízio de hoje
const hoje = 'segunda';
await Product.updateMany(
  { [`diasDisponiveis.${hoje}`]: true },
  { disponivel: true }
);
```

### Consultar se a loja está aberta
```javascript
const dia = 'segunda';
const storeConfig = await StoreConfig.findOne({});
const estaAberta = storeConfig.operacoes[dia].aberto;
```
