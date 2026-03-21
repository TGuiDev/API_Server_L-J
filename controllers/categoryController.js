const Category = require('../models/Category');
const Product = require('../models/Product');
const { NotFoundError, ValidationError } = require('../config/errors');

// Listar todas as categorias
const listarTodas = async (req, res) => {
  const categorias = await Category.find({ ativo: true }).sort({ nome: 1 });

  return res.status(200).json({
    success: true,
    total: categorias.length,
    data: categorias,
  });
};

// Obter categoria por ID
const obterPorId = async (req, res) => {
  const categoria = await Category.findById(req.params.id);

  if (!categoria) {
    throw new NotFoundError('Categoria não encontrada');
  }

  // Contar produtos da categoria
  const totalProdutos = await Product.countDocuments({ categoria: req.params.id, ativo: true });

  return res.status(200).json({
    success: true,
    data: {
      ...categoria.toObject(),
      totalProdutos,
    },
  });
};

// Criar categoria (apenas admin)
const criar = async (req, res) => {
  const { nome, descricao, icone, subcategorias } = req.body;

  // Verificar se categoria com mesmo nome já existe
  const existe = await Category.findOne({ nome: nome.toLowerCase() });
  if (existe) {
    throw new ConflictError('Categoria com este nome já existe');
  }

  // Se arquivo foi enviado, usar path; caso contrário, usar icone de URL
  let iconeData = icone;
  if (req.file) {
    iconeData = req.file.imagePath; // /images/filename
  }

  const categoria = await Category.create({
    nome,
    descricao,
    icone: iconeData,
    subcategorias: subcategorias || [],
  });

  return res.status(201).json({
    success: true,
    message: 'Categoria criada com sucesso',
    data: categoria,
  });
};

// Atualizar categoria (apenas admin)
const atualizar = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, icone, subcategorias } = req.body;

  // Se está mudando o nome, verificar se novo nome já existe
  if (nome) {
    const existe = await Category.findOne({
      nome: nome.toLowerCase(),
      _id: { $ne: id },
    });
    if (existe) {
      throw new ConflictError('Categoria com este nome já existe');
    }
  }

  // Se arquivo foi enviado, usar path; caso contrário, usar icone fornecido
  let iconeAtualizado = icone;
  if (req.file) {
    iconeAtualizado = req.file.imagePath; // /images/filename
  }

  const categoria = await Category.findByIdAndUpdate(
    id,
    {
      nome,
      descricao,
      icone: iconeAtualizado,
      subcategorias,
      atualizadoEm: new Date(),
    },
    { new: true, runValidators: true }
  );

  if (!categoria) {
    throw new NotFoundError('Categoria não encontrada');
  }

  return res.status(200).json({
    success: true,
    message: 'Categoria atualizada com sucesso',
    data: categoria,
  });
};

// Deletar categoria (apenas admin)
const deletar = async (req, res) => {
  const { id } = req.params;

  // Verificar se tem produtos nesta categoria
  const produtosCount = await Product.countDocuments({ categoria: id });
  if (produtosCount > 0) {
    throw new ValidationError(
      `Não é possível deletar categoria com ${produtosCount} produto(s). Mova-os primeiro.`
    );
  }

  const categoria = await Category.findByIdAndDelete(id);

  if (!categoria) {
    throw new NotFoundError('Categoria não encontrada');
  }

  return res.status(200).json({
    success: true,
    message: 'Categoria deletada com sucesso',
  });
};

// Adicionar subcategoria
const adicionarSubcategoria = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, icone } = req.body;

  const categoria = await Category.findById(id);

  if (!categoria) {
    throw new NotFoundError('Categoria não encontrada');
  }

  // Verificar se subcategoria já existe
  const jaExiste = categoria.subcategorias.some(
    (sub) => sub.nome.toLowerCase() === nome.toLowerCase()
  );

  if (jaExiste) {
    throw new ConflictError('Subcategoria com este nome já existe nesta categoria');
  }

  categoria.subcategorias.push({
    nome,
    descricao,
    icone,
  });

  await categoria.save();

  return res.status(201).json({
    success: true,
    message: 'Subcategoria adicionada',
    data: categoria,
  });
};

// Remover subcategoria
const removerSubcategoria = async (req, res) => {
  const { categoriaId, subcategoriaId } = req.params;

  const categoria = await Category.findByIdAndUpdate(
    categoriaId,
    { $pull: { subcategorias: { _id: subcategoriaId } } },
    { new: true }
  );

  if (!categoria) {
    throw new NotFoundError('Categoria não encontrada');
  }

  return res.status(200).json({
    success: true,
    message: 'Subcategoria removida',
    data: categoria,
  });
};

module.exports = {
  listarTodas,
  obterPorId,
  criar,
  atualizar,
  deletar,
  adicionarSubcategoria,
  removerSubcategoria,
};
