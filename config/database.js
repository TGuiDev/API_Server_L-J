const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-lj';

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ MongoDB conectado com sucesso');
  } catch (error) {
    console.error('✗ Erro ao conectar MongoDB:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ Desconectado do MongoDB');
  } catch (error) {
    console.error('✗ Erro ao desconectar:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
