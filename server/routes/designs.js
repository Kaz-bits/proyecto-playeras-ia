const express = require('express');
const router = express.Router();
const {
  generateDesign,
  getUserDesigns,
  getPublicDesigns,
  likeDesign,
  incrementViews,
  reportDesign,
  saveDesign,
  deleteDesign
} = require('../controllers/designController');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting para generación de diseños
const generateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 generaciones por 15 minutos
  message: {
    success: false,
    message: 'Demasiadas solicitudes de generación. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting para likes
const likeLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // máximo 30 likes por minuto
  message: {
    success: false,
    message: 'Demasiados likes. Intenta de nuevo en un minuto.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting para reportes
const reportLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 reportes por hora
  message: {
    success: false,
    message: 'Demasiados reportes. Intenta de nuevo en una hora.'
  }
});

/**
 * @route   GET /api/designs/public
 * @desc    Obtener diseños públicos con filtros y paginación
 * @access  Public
 * @query   page, limit, filter, search, tags
 */
router.get('/public', getPublicDesigns);

/**
 * @route   POST /api/designs/view/:designId
 * @desc    Incrementar contador de visualizaciones
 * @access  Public
 */
router.post('/view/:designId', incrementViews);

// Middleware de autenticación para rutas protegidas
router.use(auth);

/**
 * @route   POST /api/designs/generate
 * @desc    Generar nuevo diseño con IA
 * @access  Private
 * @body    prompt, style, palette, provider
 */
router.post('/generate', generateLimit, generateDesign);

/**
 * @route   GET /api/designs/user/:userId
 * @desc    Obtener diseños de un usuario específico
 * @access  Private
 * @query   page, limit
 */
router.get('/user/:userId', getUserDesigns);

/**
 * @route   POST /api/designs/like/:designId
 * @desc    Dar o quitar like a un diseño
 * @access  Private
 * @body    userId
 */
router.post('/like/:designId', likeLimit, likeDesign);

/**
 * @route   POST /api/designs/report/:designId
 * @desc    Reportar un diseño inapropiado
 * @access  Private
 * @body    reason, description, reportedBy
 */
router.post('/report/:designId', reportLimit, reportDesign);

/**
 * @route   POST /api/designs/save
 * @desc    Guardar configuración de un diseño
 * @access  Private
 * @body    designId, isPublic
 */
router.post('/save', saveDesign);

/**
 * @route   DELETE /api/designs/:id
 * @desc    Eliminar un diseño del usuario
 * @access  Private
 */
router.delete('/:id', deleteDesign);

module.exports = router;
