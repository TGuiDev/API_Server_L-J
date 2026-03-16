const StoreConfig = require('../models/StoreConfig');
const { NotFoundError } = require('../config/errors');

// Obter configuração da loja
const obter = async (req, res) => {
  let config = await StoreConfig.findOne();

  if (!config) {
    // Se não existe, criar com valores padrão
    config = await StoreConfig.create({
      nomeLoja: 'Minha Loja',
    });
  }

  return res.status(200).json({
    success: true,
    data: config,
  });
};

// Atualizar configuração da loja (apenas admin)
const atualizar = async (req, res) => {
  const atualizacoes = req.body;

  let config = await StoreConfig.findOne();

  if (!config) {
    config = await StoreConfig.create(atualizacoes);
  } else {
    Object.assign(config, atualizacoes);
    config.atualizadoEm = new Date();
    await config.save();
  }

  return res.status(200).json({
    success: true,
    message: 'Configurações da loja atualizadas',
    data: config,
  });
};

// Atualizar horário de funcionamento
const atualizarHorario = async (req, res) => {
  const { dia, aberto, abertura, fechamento } = req.body;

  let config = await StoreConfig.findOne();

  if (!config) {
    throw new NotFoundError('Configuração da loja não encontrada');
  }

  if (!config.operacoes[dia]) {
    throw new ValidationError('Dia da semana inválido');
  }

  config.operacoes[dia] = {
    aberto,
    abertura,
    fechamento,
  };

  config.atualizadoEm = new Date();
  await config.save();

  return res.status(200).json({
    success: true,
    message: `Horário de ${dia} atualizado`,
    data: config,
  });
};

// Atualizar rodízio
const atualizarRodizio = async (req, res) => {
  const { dia, produtos } = req.body;

  let config = await StoreConfig.findOne();

  if (!config) {
    throw new NotFoundError('Configuração da loja não encontrada');
  }

  config.rodizio.diasRodizio[dia] = produtos;
  config.atualizadoEm = new Date();
  await config.save();

  return res.status(200).json({
    success: true,
    message: `Rodízio de ${dia} atualizado`,
    data: config,
  });
};

// Listar rodízio do dia
const getRodizioHoje = async (req, res) => {
  const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  const hoje = dias[new Date().getDay()];

  const config = await StoreConfig.findOne();

  if (!config) {
    throw new NotFoundError('Configuração da loja não encontrada');
  }

  const rodizioHoje = config.rodizio.diasRodizio[hoje]
    ? config.rodizio.diasRodizio[hoje]
    : [];

  return res.status(200).json({
    success: true,
    dia: hoje,
    produtosDisponiveis: rodizioHoje,
  });
};

// Verificar se loja está aberta agora
const estaAbertoAgora = async (req, res) => {
  const config = await StoreConfig.findOne();

  if (!config) {
    throw new NotFoundError('Configuração da loja não encontrada');
  }

  const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
  const hoje = dias[new Date().getDay()];
  const agora = new Date();
  const horaAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(
    agora.getMinutes()
  ).padStart(2, '0')}`;

  const operacaoHoje = config.operacoes[hoje];

  if (!operacaoHoje.aberto) {
    return res.status(200).json({
      success: true,
      aberto: false,
      mensagem: 'Loja fechada neste dia',
      proximosDias: config.operacoes,
    });
  }

  const estaAberta =
    horaAtual >= operacaoHoje.abertura && horaAtual <= operacaoHoje.fechamento;

  return res.status(200).json({
    success: true,
    aberto: estaAberta,
    dia: hoje,
    horarioAtual: horaAtual,
    abertura: operacaoHoje.abertura,
    fechamento: operacaoHoje.fechamento,
  });
};

module.exports = {
  obter,
  atualizar,
  atualizarHorario,
  atualizarRodizio,
  getRodizioHoje,
  estaAbertoAgora,
};
