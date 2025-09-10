const mongoose = require('mongoose');

const battleSchema = new mongoose.Schema({
  // Información básica de la batalla
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },

  description: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Diseños en competencia
  design1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    required: true
  },

  design2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design',
    required: true
  },

  // Usuario que creó la batalla
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Estado de la batalla
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'paused'],
    default: 'active'
  },

  // Fechas importantes
  startDate: {
    type: Date,
    default: Date.now
  },

  endDate: {
    type: Date,
    required: true
  },

  completedAt: {
    type: Date
  },

  // Sistema de votación
  votes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    choice: {
      type: String,
      enum: ['design1', 'design2'],
      required: true
    },
    votedAt: {
      type: Date,
      default: Date.now
    },
    ipAddress: {
      type: String
    }
  }],

  // Contadores de votos (para optimización)
  design1Votes: {
    type: Number,
    default: 0,
    min: 0
  },

  design2Votes: {
    type: Number,
    default: 0,
    min: 0
  },

  totalVotes: {
    type: Number,
    default: 0,
    min: 0
  },

  // Resultado de la batalla
  winner: {
    type: String,
    enum: ['design1', 'design2', null],
    default: null
  },

  // Configuración de la batalla
  settings: {
    allowVoteChange: {
      type: Boolean,
      default: true
    },
    requireLogin: {
      type: Boolean,
      default: true
    },
    maxVotesPerUser: {
      type: Number,
      default: 1
    },
    showResultsBeforeEnd: {
      type: Boolean,
      default: true
    }
  },

  // Categoría de la batalla
  category: {
    type: String,
    enum: ['design_duel', 'style_clash', 'color_battle', 'theme_contest', 'random_match'],
    default: 'design_duel'
  },

  // Tags para búsqueda
  tags: [{
    type: String,
    maxlength: 30,
    lowercase: true,
    trim: true
  }],

  // Métricas de engagement
  views: {
    type: Number,
    default: 0,
    min: 0
  },

  shares: {
    type: Number,
    default: 0,
    min: 0
  },

  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: 300,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isModerated: {
      type: Boolean,
      default: false
    }
  }],

  // Sistema de premios (para implementación futura)
  prizes: {
    enabled: {
      type: Boolean,
      default: false
    },
    winnerReward: {
      type: Number,
      default: 0
    },
    participantReward: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'points'
    }
  },

  // Moderación
  moderationStatus: {
    type: String,
    enum: ['approved', 'pending', 'rejected', 'under_review'],
    default: 'approved'
  },

  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  moderatedAt: {
    type: Date
  },

  // Reportes
  reports: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      enum: ['inappropriate', 'spam', 'unfair', 'offensive', 'other'],
      required: true
    },
    description: {
      type: String,
      maxlength: 300
    },
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Metadatos adicionales
  metadata: {
    featured: {
      type: Boolean,
      default: false
    },
    trending: {
      type: Boolean,
      default: false
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    estimatedDuration: {
      type: Number, // en horas
      default: 24
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimización
battleSchema.index({ status: 1, endDate: 1 });
battleSchema.index({ createdBy: 1, createdAt: -1 });
battleSchema.index({ 'votes.userId': 1 });
battleSchema.index({ design1: 1 });
battleSchema.index({ design2: 1 });
battleSchema.index({ totalVotes: -1 });
battleSchema.index({ views: -1 });
battleSchema.index({ category: 1 });
battleSchema.index({ tags: 1 });
battleSchema.index({ 'metadata.featured': 1 });
battleSchema.index({ 'metadata.trending': 1 });

// Campos virtuales
battleSchema.virtual('isActive').get(function() {
  return this.status === 'active' && this.endDate > new Date();
});

battleSchema.virtual('timeRemaining').get(function() {
  if (this.status !== 'active') return 0;
  const now = new Date();
  const remaining = this.endDate.getTime() - now.getTime();
  return Math.max(0, remaining);
});

battleSchema.virtual('duration').get(function() {
  return this.endDate.getTime() - this.startDate.getTime();
});

battleSchema.virtual('design1Percentage').get(function() {
  if (this.totalVotes === 0) return 0;
  return Math.round((this.design1Votes / this.totalVotes) * 100);
});

battleSchema.virtual('design2Percentage').get(function() {
  if (this.totalVotes === 0) return 0;
  return Math.round((this.design2Votes / this.totalVotes) * 100);
});

battleSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

battleSchema.virtual('reportCount').get(function() {
  return this.reports ? this.reports.length : 0;
});

// Middleware pre-save
battleSchema.pre('save', function(next) {
  // Validar que los diseños sean diferentes
  if (this.design1.toString() === this.design2.toString()) {
    const error = new Error('Los diseños en batalla deben ser diferentes');
    return next(error);
  }

  // Validar fechas
  if (this.endDate <= this.startDate) {
    const error = new Error('La fecha de finalización debe ser posterior a la de inicio');
    return next(error);
  }

  // Actualizar estado si la batalla expiró
  if (this.status === 'active' && this.endDate <= new Date()) {
    this.status = 'completed';
    this.completedAt = new Date();
    
    // Determinar ganador
    if (this.design1Votes > this.design2Votes) {
      this.winner = 'design1';
    } else if (this.design2Votes > this.design1Votes) {
      this.winner = 'design2';
    }
    // Si hay empate, winner queda null
  }

  next();
});

// Middleware post-save
battleSchema.post('save', function(doc) {
  // Aquí se pueden agregar acciones como notificaciones, analytics, etc.
  if (doc.status === 'completed' && !doc.wasCompleted) {
    console.log(`Batalla ${doc._id} finalizada. Ganador: ${doc.winner || 'Empate'}`);
    doc.wasCompleted = true;
  }
});

// Métodos estáticos
battleSchema.statics.findActive = function(limit = 10) {
  return this.find({ 
    status: 'active',
    endDate: { $gt: new Date() }
  })
  .populate([
    { path: 'design1', select: 'title imageUrl prompt' },
    { path: 'design2', select: 'title imageUrl prompt' },
    { path: 'createdBy', select: 'username avatar' }
  ])
  .sort({ totalVotes: -1 })
  .limit(limit);
};

battleSchema.statics.findFeatured = function(limit = 5) {
  return this.find({ 
    status: 'active',
    'metadata.featured': true,
    endDate: { $gt: new Date() }
  })
  .populate([
    { path: 'design1', select: 'title imageUrl prompt' },
    { path: 'design2', select: 'title imageUrl prompt' }
  ])
  .sort({ totalVotes: -1 })
  .limit(limit);
};

battleSchema.statics.findTrending = function(hours = 24, limit = 10) {
  const dateLimit = new Date();
  dateLimit.setHours(dateLimit.getHours() - hours);
  
  return this.find({
    status: 'active',
    createdAt: { $gte: dateLimit },
    endDate: { $gt: new Date() }
  })
  .populate([
    { path: 'design1', select: 'title imageUrl prompt' },
    { path: 'design2', select: 'title imageUrl prompt' }
  ])
  .sort({ totalVotes: -1, views: -1 })
  .limit(limit);
};

battleSchema.statics.findEndingSoon = function(hours = 6, limit = 10) {
  const now = new Date();
  const endLimit = new Date();
  endLimit.setHours(endLimit.getHours() + hours);
  
  return this.find({
    status: 'active',
    endDate: { $gt: now, $lte: endLimit }
  })
  .populate([
    { path: 'design1', select: 'title imageUrl prompt' },
    { path: 'design2', select: 'title imageUrl prompt' }
  ])
  .sort({ endDate: 1 })
  .limit(limit);
};

// Métodos de instancia
battleSchema.methods.addVote = function(userId, choice) {
  // Verificar si ya votó
  const existingVoteIndex = this.votes.findIndex(vote => 
    vote.userId.toString() === userId.toString()
  );

  if (existingVoteIndex > -1) {
    if (!this.settings.allowVoteChange) {
      throw new Error('No se permite cambiar el voto');
    }
    
    // Actualizar voto existente
    const oldChoice = this.votes[existingVoteIndex].choice;
    this.votes[existingVoteIndex].choice = choice;
    this.votes[existingVoteIndex].votedAt = new Date();
    
    // Actualizar contadores
    if (oldChoice === 'design1') this.design1Votes--;
    else this.design2Votes--;
    
  } else {
    // Agregar nuevo voto
    this.votes.push({
      userId,
      choice,
      votedAt: new Date()
    });
  }

  // Actualizar contadores
  if (choice === 'design1') this.design1Votes++;
  else this.design2Votes++;
  
  this.totalVotes = this.votes.length;
  
  return this.save();
};

battleSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

battleSchema.methods.addComment = function(userId, text) {
  this.comments.push({
    userId,
    text,
    createdAt: new Date()
  });
  
  return this.save();
};

battleSchema.methods.getTimeRemaining = function() {
  if (this.status !== 'active') return 0;
  const now = new Date();
  return Math.max(0, this.endDate.getTime() - now.getTime());
};

battleSchema.methods.getUserVote = function(userId) {
  const vote = this.votes.find(vote => 
    vote.userId.toString() === userId.toString()
  );
  
  return vote ? vote.choice : null;
};

module.exports = mongoose.model('Battle', battleSchema);
