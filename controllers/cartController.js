const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { NotFoundError, ValidationError } = require('../config/errors');

// Obter carrinho do usuário (cria se não existir)
const obterCarrinho = async (req, res) => {
  let cart = await Cart.findOne({ usuario: req.user.id }).populate('itens.produto');
  if (!cart) {
    cart = await Cart.create({ usuario: req.user.id, itens: [] });
  }
  return res.status(200).json({ success: true, data: cart });
};

// Adicionar ou atualizar item
const adicionarOuAtualizarItem = async (req, res) => {
  const { produtoId, quantidade } = req.body;
  if (!produtoId) throw new ValidationError('produtoId é obrigatório');
  const qty = parseInt(quantidade ?? 1, 10);
  if (isNaN(qty) || qty < 1) throw new ValidationError('quantidade inválida');

  const produto = await Product.findById(produtoId);
  if (!produto) throw new NotFoundError('Produto não encontrado');

  let cart = await Cart.findOne({ usuario: req.user.id });
  if (!cart) cart = await Cart.create({ usuario: req.user.id, itens: [] });

  // procurar item
  const idx = cart.itens.findIndex((it) => it.produto.toString() === produtoId.toString());
  if (idx >= 0) {
    cart.itens[idx].quantidade = qty;
    cart.itens[idx].precoSnapshot = produto.preco;
  } else {
    cart.itens.push({ produto: produto._id, quantidade: qty, precoSnapshot: produto.preco });
  }

  cart.atualizadoEm = new Date();
  await cart.save();
  await cart.populate('itens.produto');
  return res.status(200).json({ success: true, data: cart });
};

// Atualizar quantidade de um item pelo itemId
const atualizarQuantidade = async (req, res) => {
  const { itemId } = req.params;
  const { quantidade } = req.body;
  const qty = parseInt(quantidade ?? 0, 10);
  if (isNaN(qty)) throw new ValidationError('quantidade inválida');

  const cart = await Cart.findOne({ usuario: req.user.id });
  if (!cart) throw new NotFoundError('Carrinho não encontrado');

  const idx = cart.itens.findIndex((it) => it._id.toString() === itemId.toString());
  if (idx === -1) throw new NotFoundError('Item não encontrado no carrinho');

  if (qty <= 0) {
    cart.itens.splice(idx, 1);
  } else {
    cart.itens[idx].quantidade = qty;
  }

  cart.atualizadoEm = new Date();
  await cart.save();
  await cart.populate('itens.produto');
  return res.status(200).json({ success: true, data: cart });
};

// Remover item
const removerItem = async (req, res) => {
  const { itemId } = req.params;
  const cart = await Cart.findOneAndUpdate({ usuario: req.user.id }, { $pull: { itens: { _id: itemId } }, $set: { atualizadoEm: new Date() } }, { new: true }).populate('itens.produto');
  return res.status(200).json({ success: true, data: cart });
};

// Limpar carrinho
const limparCarrinho = async (req, res) => {
  await Cart.findOneAndUpdate({ usuario: req.user.id }, { itens: [], atualizadoEm: new Date() }, { upsert: true });
  return res.status(200).json({ success: true, message: 'Carrinho limpo' });
};

module.exports = {
  obterCarrinho,
  adicionarOuAtualizarItem,
  atualizarQuantidade,
  removerItem,
  limparCarrinho,
};
