const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criar diretório de images se não existir
const uploadDir = path.join(__dirname, '../db/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de storage em disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único: timestamp + extensão original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// Validação de tipos de arquivo
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de arquivo não permitido. Use: ${allowedMimes.join(', ')}`), false);
  }
};

// Configuração do multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Middleware para processar caminho da imagem
const processImagePath = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    // Salvar apenas o nome do arquivo (será servido via /images/:filename)
    req.file.imagePath = `/images/${req.file.filename}`;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao processar imagem',
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  processImagePath,
  uploadDir,
};
