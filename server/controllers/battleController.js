const Design = require('../models/Design');
const Battle = require('../models/Battle');
const User = require('../models/User');

/**
 * Crear una nueva batalla de diseños
 */
const createBattle = async (req, res) => {
  try {
    const { design1Id, design2Id, title, description, duration = 24 } = req.body;
    const createdBy = req.userId;

    // Verificar que los diseños existen y son públicos
    const design1 = await Design.findOne({ 
      _id: design1Id, 
      isPublic: true, 
      moderationStatus: 'approved' 
    });
    
    const design2 = await Design.findOne({ 
      _id: design2Id, 
      isPublic: true, 
      moderationStatus: 'approved' 
    });

    if (!design1 || !design2) {
      return res.status(404).json({
        success: false,
        message: 'Uno o ambos diseños no encontrados o no son públicos'
      });
    }

    // Verificar que no sean el mismo diseño
    if (design1Id === design2Id) {
      return res.status(400).json({
        success: false,
        message: 'No se puede crear una batalla con el mismo diseño'
      });
    }

    // Calcular fecha de finalización
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + duration);

    // Crear nueva batalla
    const battle = new Battle({
      title: title || `${design1.title} vs ${design2.title}`,
      description,
      design1: design1Id,
      design2: design2Id,
      createdBy,
      endDate,
      status: 'active'
    });

    await battle.save();

    // Poblar los datos para la respuesta
    await battle.populate([
      { path: 'design1', select: 'title imageUrl userId prompt' },
      { path: 'design2', select: 'title imageUrl userId prompt' },
      { path: 'createdBy', select: 'username avatar' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Batalla creada exitosamente',
      battle
    });

  } catch (error) {
    console.error('Error creando batalla:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la batalla',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtener batallas activas
 */
const getActiveBattles = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'votes' } = req.query;

    // Configurar ordenamiento
    let sortOptions = {};
    switch (sortBy) {
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'ending_soon':
        sortOptions = { endDate: 1 };
        break;
      case 'votes':
      default:
        sortOptions = { totalVotes: -1 };
        break;
    }

    const battles = await Battle.find({ 
      status: 'active',
      endDate: { $gt: new Date() }
    })
    .populate([
      { path: 'design1', select: 'title imageUrl userId prompt' },
      { path: 'design2', select: 'title imageUrl userId prompt' },
      { path: 'createdBy', select: 'username avatar' }
    ])
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const total = await Battle.countDocuments({ 
      status: 'active',
      endDate: { $gt: new Date() }
    });

    res.json({
      success: true,
      battles,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error obteniendo batallas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener batallas'
    });
  }
};

/**
 * Obtener una batalla específica
 */
const getBattleById = async (req, res) => {
  try {
    const { battleId } = req.params;

    const battle = await Battle.findById(battleId)
      .populate([
        { 
          path: 'design1', 
          select: 'title imageUrl userId prompt style palette',
          populate: { path: 'userId', select: 'username avatar' }
        },
        { 
          path: 'design2', 
          select: 'title imageUrl userId prompt style palette',
          populate: { path: 'userId', select: 'username avatar' }
        },
        { path: 'createdBy', select: 'username avatar' }
      ]);

    if (!battle) {
      return res.status(404).json({
        success: false,
        message: 'Batalla no encontrada'
      });
    }

    res.json({
      success: true,
      battle
    });

  } catch (error) {
    console.error('Error obteniendo batalla:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la batalla'
    });
  }
};

/**
 * Votar en una batalla
 */
const voteBattle = async (req, res) => {
  try {
    const { battleId } = req.params;
    const { designChoice } = req.body; // 'design1' o 'design2'
    const userId = req.userId;

    // Validar choice
    if (!['design1', 'design2'].includes(designChoice)) {
      return res.status(400).json({
        success: false,
        message: 'Opción de voto inválida'
      });
    }

    const battle = await Battle.findById(battleId);
    
    if (!battle) {
      return res.status(404).json({
        success: false,
        message: 'Batalla no encontrada'
      });
    }

    // Verificar que la batalla esté activa
    if (battle.status !== 'active' || battle.endDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Esta batalla ya no está activa'
      });
    }

    // Verificar si ya votó
    const existingVote = battle.votes.find(vote => 
      vote.userId.toString() === userId.toString()
    );

    if (existingVote) {
      // Cambiar voto existente
      if (existingVote.choice === designChoice) {
        return res.status(400).json({
          success: false,
          message: 'Ya votaste por este diseño'
        });
      }

      // Actualizar voto
      existingVote.choice = designChoice;
      existingVote.votedAt = new Date();
    } else {
      // Agregar nuevo voto
      battle.votes.push({
        userId,
        choice: designChoice,
        votedAt: new Date()
      });
    }

    // Recalcular contadores
    battle.design1Votes = battle.votes.filter(vote => vote.choice === 'design1').length;
    battle.design2Votes = battle.votes.filter(vote => vote.choice === 'design2').length;
    battle.totalVotes = battle.votes.length;

    await battle.save();

    res.json({
      success: true,
      message: 'Voto registrado exitosamente',
      battle: {
        id: battle._id,
        design1Votes: battle.design1Votes,
        design2Votes: battle.design2Votes,
        totalVotes: battle.totalVotes,
        userVote: designChoice
      }
    });

  } catch (error) {
    console.error('Error registrando voto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar el voto'
    });
  }
};

/**
 * Obtener batallas finalizadas
 */
const getCompletedBattles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const battles = await Battle.find({ 
      status: 'completed'
    })
    .populate([
      { path: 'design1', select: 'title imageUrl userId' },
      { path: 'design2', select: 'title imageUrl userId' },
      { path: 'createdBy', select: 'username avatar' }
    ])
    .sort({ endDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const total = await Battle.countDocuments({ status: 'completed' });

    res.json({
      success: true,
      battles,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error obteniendo batallas completadas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener batallas completadas'
    });
  }
};

/**
 * Finalizar batallas expiradas (función administrativa)
 */
const finalizeBattles = async (req, res) => {
  try {
    const now = new Date();
    
    const expiredBattles = await Battle.find({
      status: 'active',
      endDate: { $lte: now }
    });

    let updatedCount = 0;

    for (const battle of expiredBattles) {
      // Determinar ganador
      let winner = null;
      if (battle.design1Votes > battle.design2Votes) {
        winner = 'design1';
      } else if (battle.design2Votes > battle.design1Votes) {
        winner = 'design2';
      }
      // Si hay empate, winner queda null

      battle.status = 'completed';
      battle.winner = winner;
      battle.completedAt = now;

      await battle.save();
      updatedCount++;
    }

    res.json({
      success: true,
      message: `${updatedCount} batallas finalizadas`,
      updatedCount
    });

  } catch (error) {
    console.error('Error finalizando batallas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al finalizar batallas'
    });
  }
};

/**
 * Obtener estadísticas de batallas
 */
const getBattleStats = async (req, res) => {
  try {
    const stats = await Battle.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalVotes: { $sum: '$totalVotes' }
        }
      }
    ]);

    const totalBattles = await Battle.countDocuments();
    const activeBattles = await Battle.countDocuments({ 
      status: 'active',
      endDate: { $gt: new Date() }
    });

    res.json({
      success: true,
      stats: {
        total: totalBattles,
        active: activeBattles,
        byStatus: stats,
        totalVotes: stats.reduce((sum, stat) => sum + stat.totalVotes, 0)
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    });
  }
};

/**
 * Obtener el historial de votos del usuario
 */
const getUserVoteHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const battles = await Battle.find({
      'votes.userId': userId
    })
    .populate([
      { path: 'design1', select: 'title imageUrl' },
      { path: 'design2', select: 'title imageUrl' }
    ])
    .sort({ 'votes.votedAt': -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    // Agregar información del voto del usuario a cada batalla
    const battlesWithVotes = battles.map(battle => {
      const userVote = battle.votes.find(vote => 
        vote.userId.toString() === userId.toString()
      );
      
      return {
        ...battle.toObject(),
        userVote: userVote ? userVote.choice : null,
        votedAt: userVote ? userVote.votedAt : null
      };
    });

    res.json({
      success: true,
      battles: battlesWithVotes,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(battles.length / limit),
        total: battles.length
      }
    });

  } catch (error) {
    console.error('Error obteniendo historial de votos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial de votos'
    });
  }
};

module.exports = {
  createBattle,
  getActiveBattles,
  getBattleById,
  voteBattle,
  getCompletedBattles,
  finalizeBattles,
  getBattleStats,
  getUserVoteHistory
};
