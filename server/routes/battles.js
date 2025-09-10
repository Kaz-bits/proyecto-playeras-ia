const express = require('express');
const router = express.Router();
const {
  createBattle,
  getActiveBattles,
  getBattleById,
  voteBattle,
  getCompletedBattles,
  finalizeBattles,
  getBattleStats,
  getUserVoteHistory
} = require('../controllers/battleController');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting para votación
const voteLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20, // máximo 20 votos por minuto
  message: {
    success: false,
    message: 'Demasiados votos. Intenta de nuevo en un minuto.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting para creación de batallas
const createBattleLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 batallas por hora
  message: {
    success: false,
    message: 'Demasiadas batallas creadas. Intenta de nuevo en una hora.'
  }
});

/**
 * @route   GET /api/battles/active
 * @desc    Obtener batallas activas
 * @access  Public
 * @query   page, limit, sortBy
 */
router.get('/active', getActiveBattles);

/**
 * @route   GET /api/battles/completed
 * @desc    Obtener batallas completadas
 * @access  Public
 * @query   page, limit
 */
router.get('/completed', getCompletedBattles);

/**
 * @route   GET /api/battles/stats
 * @desc    Obtener estadísticas generales de batallas
 * @access  Public
 */
router.get('/stats', getBattleStats);

/**
 * @route   GET /api/battles/:battleId
 * @desc    Obtener detalles de una batalla específica
 * @access  Public
 */
router.get('/:battleId', getBattleById);

// Middleware de autenticación para rutas protegidas
router.use(auth);

/**
 * @route   POST /api/battles
 * @desc    Crear una nueva batalla entre dos diseños
 * @access  Private
 * @body    design1Id, design2Id, title, description, duration
 */
router.post('/', createBattleLimit, createBattle);

/**
 * @route   POST /api/battles/:battleId/vote
 * @desc    Votar en una batalla
 * @access  Private
 * @body    designChoice ('design1' o 'design2')
 */
router.post('/:battleId/vote', voteLimit, voteBattle);

/**
 * @route   GET /api/battles/user/:userId/votes
 * @desc    Obtener historial de votos de un usuario
 * @access  Private
 * @query   page, limit
 */
router.get('/user/:userId/votes', getUserVoteHistory);

/**
 * @route   POST /api/battles/finalize
 * @desc    Finalizar batallas expiradas (función administrativa)
 * @access  Private (Admin)
 */
router.post('/finalize', finalizeBattles);

module.exports = router;
