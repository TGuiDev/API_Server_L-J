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

// Solicitar redefinição de senha
const requestPasswordReset = async (req, res) => {
  const { emailOrPhone } = req.body;

  if (!emailOrPhone) {
    throw new ValidationError('Email ou telefone é obrigatório');
  }

  // Buscar usuário por email ou telefone
  const usuario = await User.findOne({
    $or: [
      { email: emailOrPhone.toLowerCase() },
      { telefone: emailOrPhone },
    ],
  });

  if (!usuario) {
    // Por segurança, não informamos se o usuário existe ou não
    return res.status(200).json({
      success: true,
      message: 'Se o email ou telefone estiver cadastrado, você receberá um código de redefinição',
    });
  }

  // Gerar código de reset
  const codigoReset = usuario.gerarCodigoReset();
  await usuario.save();

  // TODO: Aqui você pode enviar o código via email ou SMS
  // Por enquanto, logging para desenvolvimento
  console.log(`Código de reset para ${emailOrPhone}: ${codigoReset}`);

  return res.status(200).json({
    success: true,
    message: 'Código de redefinição enviado. Verifique seu email ou SMS.',
    // Remover antes de ir para produção:
    // _dev_code: codigoReset,
  });
};

// Verificar código de reset
const verifyResetCode = async (req, res) => {
  const { emailOrPhone, code } = req.body;

  if (!emailOrPhone || !code) {
    throw new ValidationError('Email/telefone e código são obrigatórios');
  }

  // Buscar usuário
  const usuario = await User.findOne({
    $or: [
      { email: emailOrPhone.toLowerCase() },
      { telefone: emailOrPhone },
    ],
  }).select('+codigoReset +expiracaoCodigoReset');

  if (!usuario) {
    throw new ValidationError('Usuário não encontrado');
  }

  // Verificar código
  if (!usuario.codigoReset || !usuario.verificarCodigoReset(code)) {
    throw new ValidationError('Código inválido ou expirado');
  }

  return res.status(200).json({
    success: true,
    message: 'Código verificado com sucesso',
  });
};

// Redefinir senha
const resetPassword = async (req, res) => {
  const { emailOrPhone, code, newPassword, confirmPassword } = req.body;

  if (!emailOrPhone || !code || !newPassword || !confirmPassword) {
    throw new ValidationError('Todos os campos são obrigatórios');
  }

  if (newPassword !== confirmPassword) {
    throw new ValidationError('As senhas não coincidem');
  }

  if (newPassword.length < 6) {
    throw new ValidationError('Senha deve ter pelo menos 6 caracteres');
  }

  // Buscar usuário
  const usuario = await User.findOne({
    $or: [
      { email: emailOrPhone.toLowerCase() },
      { telefone: emailOrPhone },
    ],
  }).select('+codigoReset +expiracaoCodigoReset +senha');

  if (!usuario) {
    throw new ValidationError('Usuário não encontrado');
  }

  // Verificar código
  if (!usuario.codigoReset || !usuario.verificarCodigoReset(code)) {
    throw new ValidationError('Código inválido ou expirado');
  }

  // Atualizar senha
  usuario.senha = newPassword;
  usuario.limparCodigoReset();
  await usuario.save();

  return res.status(200).json({
    success: true,
    message: 'Senha redefinida com sucesso',
  });
};

module.exports = {
  register,
  login,
  getPerfil,
  logout,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
};
