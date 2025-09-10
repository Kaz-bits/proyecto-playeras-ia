const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de autenticación principal
 * Verifica el token JWT y adjunta la información del usuario a req
 */
const auth = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Verificar formato del token
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso inválido'
      });
    }

    // Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_key');
    
    // Buscar usuario en la base de datos
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el usuario está activo (si el campo existe)
    if (user.isActive !== undefined && !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada'
      });
    }

    // Adjuntar información del usuario a la request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role || 'user';

    next();

  } catch (error) {
    console.error('Error en autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error en la autenticación'
    });
  }
};

/**
 * Middleware opcional de autenticación
 * Permite acceso sin token pero adjunta información del usuario si está presente
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      // No hay token, continuar sin autenticación
      req.user = null;
      req.userId = null;
      req.userRole = null;
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      req.userId = null;
      req.userRole = null;
      return next();
    }

    // Intentar verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_key');
    const user = await User.findById(decoded.id).select('-password');
    
    if (user && (user.isActive === undefined || user.isActive)) {
      req.user = user;
      req.userId = user._id;
      req.userRole = user.role || 'user';
    } else {
      req.user = null;
      req.userId = null;
      req.userRole = null;
    }

    next();

  } catch (error) {
    // En caso de error, continuar sin autenticación
    req.user = null;
    req.userId = null;
    req.userRole = null;
    next();
  }
};

/**
 * Middleware para verificar roles de administrador
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticación requerida'
    });
  }

  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Permisos de administrador requeridos'
    });
  }

  next();
};

/**
 * Middleware para verificar roles de moderador o administrador
 */
const requireModerator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticación requerida'
    });
  }

  if (!['admin', 'moderator'].includes(req.userRole)) {
    return res.status(403).json({
      success: false,
      message: 'Permisos de moderador requeridos'
    });
  }

  next();
};

/**
 * Middleware para verificar propiedad de recurso
 * Permite acceso al propietario del recurso o administradores
 */
const requireOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticación requerida'
      });
    }

    // Los administradores pueden acceder a cualquier recurso
    if (req.userRole === 'admin') {
      return next();
    }

    // Verificar propiedad del recurso
    const resourceUserId = req.params.userId || req.body[resourceField] || req.resource?.[resourceField];
    
    if (!resourceUserId || resourceUserId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};

/**
 * Generar token JWT
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || 'tu_jwt_secret_key', 
    { 
      expiresIn: process.env.JWT_EXPIRE || '7d' 
    }
  );
};

/**
 * Middleware para refrescar token automáticamente
 */
const refreshToken = (req, res, next) => {
  if (req.user) {
    const newToken = generateToken(req.userId);
    res.set('X-New-Token', newToken);
  }
  next();
};

// Middleware de compatibilidad (para mantener compatibilidad con código existente)
const protect = auth;

module.exports = {
  auth,
  optionalAuth,
  requireAdmin,
  requireModerator,
  requireOwnership,
  generateToken,
  refreshToken,
  protect // Para compatibilidad
};
