const Product = require('../models/Product');
const Category = require('../models/Category');
const { NotFoundError, ValidationError } = require('../config/errors');

// Listar todos os produtos
const listarTodos = async (req, res) => {
  const { categoria, disponivel, dia } = req.query;
  const filtro = { ativo: true };

  if (categoria) {
    filtro.categoria = categoria;
  }

  if (disponivel === 'true') {
    filtro.disponivel = true;
  }

  if (dia) {
    const diasMap = {
      segunda: 'segunda',
      terca: 'terca',
      quarta: 'quarta',
      quinta: 'quinta',
      sexta: 'sexta',
      sabado: 'sabado',
      domingo: 'domingo',
    };
    if (diasMap[dia]) {
      filtro[`diasDisponiveis.${diasMap[dia]}`] = true;
    }
  }

  const produtos = await Product.find(filtro)
    .populate('categoria', 'nome')
    .populate('avaliacoes', '_id nota comentario usuario')
    .sort({ nome: 1 });

  return res.status(200).json({
    success: true,
    total: produtos.length,
    data: produtos,
  });
};

// Buscar produtos (full-text search)
const buscar = async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    throw new ValidationError('Busca deve ter no mínimo 2 caracteres');
  }

  const produtos = await Product.find(
    { $text: { $search: q }, ativo: true },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .populate('categoria', 'nome');

  return res.status(200).json({
    success: true,
    total: produtos.length,
    data: produtos,
  });
};

// Obter produto por ID
const obterPorId = async (req, res) => {
  const produto = await Product.findById(req.params.id)
    .populate('categoria')
    .populate({
      path: 'avaliacoes',
      populate: { path: 'usuario', select: 'nome' },
      options: { limit: 10 },
    });

  if (!produto) {
    throw new NotFoundError('Produto não encontrado');
  }

  return res.status(200).json({
    success: true,
    data: produto,
  });
};

// Criar produto (apenas admin)
const criar = async (req, res) => {
  const {
    nome,
    descricao,
    preco,
    imagem,
    categoria,
    subcategoria,
    ingredientes,
    disponivel,
    estoque,
    diasDisponiveis,
  } = req.body;

  // Verificar se categoria existe
  const cat = await Category.findById(categoria);
  if (!cat) {
    throw new NotFoundError('Categoria não encontrada');
  }

  // Se arquivos foram enviados, coletar paths; caso contrário, usar imagem(s) de URL
  let imagensData = [];
  // Apenas aceitar imagens via upload de arquivos
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    imagensData = req.files.map((f) => f.imagePath);
  } else {
    // Não permitir imagens por URL no body
    throw new ValidationError('Envie de 1 a 5 imagens como arquivos (multipart/form-data)');
  }

  const produto = await Product.create({
    nome,
    descricao,
    preco,
    imagens: imagensData,
    categoria,
    subcategoria,
    ingredientes,
    disponivel,
    estoque,
    diasDisponiveis,
  });

  return res.status(201).json({
    success: true,
    message: 'Produto criado com sucesso',
    data: produto,
  });
};

// Atualizar produto (apenas admin)
const atualizar = async (req, res) => {
  const { id } = req.params;
  const atualizacoes = req.body;

  // Se está atualizando categoria, verificar se existe
  if (atualizacoes.categoria) {
    const cat = await Category.findById(atualizacoes.categoria);
    if (!cat) {
      throw new NotFoundError('Categoria não encontrada');
    }
  }

  // Se arquivo foi enviado, usar path
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    // substituir imagens existentes pelas enviadas
    atualizacoes.imagens = req.files.map((f) => f.imagePath);
  }

  const produto = await Product.findByIdAndUpdate(
    id,
    { ...atualizacoes, atualizadoEm: new Date() },
    { new: true, runValidators: true }
  );

  if (!produto) {
    throw new NotFoundError('Produto não encontrado');
  }

  return res.status(200).json({
    success: true,
    message: 'Produto atualizado com sucesso',
    data: produto,
  });
};

// Deletar produto (apenas admin)
const deletar = async (req, res) => {
  const produto = await Product.findByIdAndDelete(req.params.id);

  if (!produto) {
    throw new NotFoundError('Produto não encontrado');
  }

  return res.status(200).json({
    success: true,
    message: 'Produto deletado com sucesso',
  });
};

// Listar produtos de uma categoria específica
const porCategoria = async (req, res) => {
  const { categoriaId } = req.params;

  const categoria = await Category.findById(categoriaId);
  if (!categoria) {
    throw new NotFoundError('Categoria não encontrada');
  }

  const produtos = await Product.find({
    categoria: categoriaId,
    ativo: true,
  }).sort({ nome: 1 });

  return res.status(200).json({
    success: true,
    categoria: categoria.nome,
    total: produtos.length,
    data: produtos,
  });
};

// Atualizar estoque
const atualizarEstoque = async (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;

  if (typeof quantidade !== 'number') {
    throw new ValidationError('Quantidade deve ser um número');
  }

  const produto = await Product.findByIdAndUpdate(
    id,
    { estoque: quantidade, atualizadoEm: new Date() },
    { new: true }
  );

  if (!produto) {
    throw new NotFoundError('Produto não encontrado');
  }

  return res.status(200).json({
    success: true,
    message: 'Estoque atualizado',
    data: produto,
  });
};

module.exports = {
  listarTodos,
  buscar,
  obterPorId,
  criar,
  atualizar,
  deletar,
  porCategoria,
  atualizarEstoque,
};
