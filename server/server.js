const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const config = require('./config');

// Importar rutas
const authRoutes = require('./api/authRoutes');
const designRoutes = require('./api/designRoutes');
const orderRoutes = require('./api/orderRoutes');
const galleryRoutes = require('./api/galleryRoutes');

const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(helmet()); // Seguridad básica
app.use(cors()); // Habilitar CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parsear JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parsear form data

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/gallery', galleryRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error(error.stack);
  
  res.status(error.status || 500).json({
    message: error.message || 'Error interno del servidor',
    ...(config.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Ambiente: ${config.NODE_ENV}`);
  console.log(`📡 API disponible en: http://localhost:${PORT}/api`);
});
