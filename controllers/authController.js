const User = require('../models/User');
const { gerarToken } = require('../config/jwt');
const { ValidationError, ConflictError, UnauthorizedError } = require('../config/errors');

// Registrar novo usuário
const register = async (req, res) => {
  const { nome, email, senha, senhaConfirm } = req.body;

  // Validar se as senhas batem
  if (senha !== senhaConfirm) {
    throw new ValidationError('As senhas não coincidem');
  }

  // Verificar se email já existe
  const usuarioExistente = await User.findOne({ email });
  if (usuarioExistente) {
    throw new ConflictError('Email já cadastrado');
  }

  // Criar novo usuário
  const usuario = await User.create({
    nome,
    email,
    senha,
  });

  // Gerar token
  const token = gerarToken(usuario._id, usuario.email, usuario.role);

  return res.status(201).json({
    success: true,
    message: 'Usuário criado com sucesso',
    data: {
      usuario: usuario.toJSON(),
      token,
    },
  });
};

// Login do usuário
const login = async (req, res) => {
  const { email, senha } = req.body;

  // Validar se email e senha foram fornecidos
  if (!email || !senha) {
    throw new ValidationError('Email e senha são obrigatórios');
  }

  // Buscar usuário com a senha (select('+senha') para incluir a senha oculta)
  const usuario = await User.findOne({ email }).select('+senha');

  if (!usuario) {
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  // Verificar se o usuário está ativo
  if (!usuario.ativo) {
    throw new UnauthorizedError('Sua conta foi desativada');
  }

  // Comparar senhas
  const senhaValida = await usuario.compararSenha(senha);
  if (!senhaValida) {
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  // Gerar token
  const token = gerarToken(usuario._id, usuario.email, usuario.role);

  return res.status(200).json({
    success: true,
    message: 'Login realizado com sucesso',
    data: {
      usuario: usuario.toJSON(),
      token,
    },
  });
};

// Obter perfil do usuário autenticado
const getPerfil = async (req, res) => {
  const usuario = await User.findById(req.user.id);

  if (!usuario) {
    throw new UnauthorizedError('Usuário não encontrado');
  }

  return res.status(200).json({
    success: true,
    data: usuario.toJSON(),
  });
};

// Logout (no frontend: deletar token do localStorage)
const logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logout realizado com sucesso. Exclua o token do seu cliente.',
  });
};

module.exports = {
  register,
  login,
  getPerfil,
  logout,
};
