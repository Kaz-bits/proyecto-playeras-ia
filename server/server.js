const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // límite cada 15 minutos
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Configuración de CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://tu-dominio.com' // Cambiar por tu dominio en producción
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Conectar a MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/playeras-ia';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB conectado exitosamente');
    
    // Configurar índices importantes
    await createIndexes();
    
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Crear índices importantes para optimización
const createIndexes = async () => {
  try {
    // Verificar si los modelos existen antes de crear índices
    if (mongoose.models.Design) {
      await mongoose.models.Design.createIndexes();
      console.log('📄 Índices de Design creados');
    }
    
    if (mongoose.models.Battle) {
      await mongoose.models.Battle.createIndexes();
      console.log('⚔️ Índices de Battle creados');
    }
    
  } catch (error) {
    console.error('Error creando índices:', error);
  }
};

// Conectar a la base de datos
connectDB();

// Rutas de la API
try {
  app.use('/api/auth', require('./routes/auth'));
} catch (error) {
  console.log('⚠️ Rutas de auth no disponibles');
}

try {
  app.use('/api/designs', require('./routes/designs'));
} catch (error) {
  console.log('⚠️ Rutas de designs no disponibles');
}

try {
  app.use('/api/battles', require('./routes/battles'));
} catch (error) {
  console.log('⚠️ Rutas de battles no disponibles');
}

try {
  app.use('/api/users', require('./routes/users'));
} catch (error) {
  console.log('⚠️ Rutas de users no disponibles');
}

// Rutas existentes (compatibilidad)
try {
  app.use('/api/auth', require('./api/authRoutes'));
} catch (error) {
  console.log('ℹ️ Rutas legacy de auth no encontradas');
}

try {
  app.use('/api/designs', require('./api/designRoutes'));
} catch (error) {
  console.log('ℹ️ Rutas legacy de designs no encontradas');
}

try {
  app.use('/api/orders', require('./api/orderRoutes'));
} catch (error) {
  console.log('ℹ️ Rutas legacy de orders no encontradas');
}

try {
  app.use('/api/gallery', require('./api/galleryRoutes'));
} catch (error) {
  console.log('ℹ️ Rutas legacy de gallery no encontradas');
}

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '2.0.0'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '🎨 API de Playeras con IA',
    version: '2.0.0',
    features: [
      'Generación de diseños con IA (Gemini & Midjourney)',
      'Galería comunitaria con likes y comentarios',
      'Batallas de diseños en tiempo real',
      'Sistema de moderación avanzado',
      'Avatares personalizables en 3D',
      'E-commerce integrado',
      'Sistema de reportes y seguridad'
    ],
    endpoints: {
      auth: '/api/auth',
      designs: '/api/designs',
      battles: '/api/battles',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  
  // Error de validación de Mongoose
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }
  
  // Error de duplicado de Mongoose
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} ya existe`
    });
  }
  
  // Error de cast de Mongoose (ID inválido)
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID de recurso inválido'
    });
  }
  
  // Error de JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
  
  // Error de rate limiting
  if (error.status === 429) {
    return res.status(429).json({
      success: false,
      message: 'Demasiadas solicitudes'
    });
  }
  
  // Error genérico del servidor
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Configurar puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`
🚀 Servidor iniciado exitosamente
📍 Puerto: ${PORT}
🌍 Entorno: ${process.env.NODE_ENV || 'development'}
🔗 URL: http://localhost:${PORT}
📚 Documentación: http://localhost:${PORT}/api

🎨 Características activas:
   ✅ Generación de diseños con IA
   ✅ Galería comunitaria
   ✅ Batallas de diseños
   ✅ Sistema de moderación
   ✅ Autenticación JWT
   ✅ Rate limiting
   ✅ CORS configurado
   ✅ Seguridad con Helmet
  `);
});

// Manejar cierre graceful
process.on('SIGTERM', () => {
  console.log('💤 Recibida señal SIGTERM, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado exitosamente');
    mongoose.connection.close(false, () => {
      console.log('✅ Conexión MongoDB cerrada');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('� Recibida señal SIGINT, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado exitosamente');
    mongoose.connection.close(false, () => {
      console.log('✅ Conexión MongoDB cerrada');
      process.exit(0);
    });
  });
});

module.exports = app;
