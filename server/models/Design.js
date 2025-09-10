const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  // Información básica del diseño
  title: {
    type: String,
    maxlength: 100,
    default: function() {
      return `Diseño ${Date.now()}`;
    }
  },
  
  description: {
    type: String,
    maxlength: 500
  },

  // Prompt y configuración de IA
  prompt: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },

  style: {
    type: String,
    enum: ['realistic', 'artistic', 'cartoon', 'minimalist', 'vintage', 'modern', 'abstract'],
    default: 'artistic'
  },

  palette: {
    type: String,
    enum: ['vibrant', 'pastel', 'monochrome', 'warm', 'cool', 'earth', 'neon'],
    default: 'vibrant'
  },

  // Proveedor de IA utilizado
  provider: {
    type: String,
    enum: ['gemini', 'midjourney', 'openai'],
    required: true,
    default: 'gemini'
  },

  // URLs de imágenes
  imageUrl: {
    type: String,
    required: true
  },

  thumbnailUrl: {
    type: String
  },

  // Información del usuario
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Configuración de privacidad
  isPublic: {
    type: Boolean,
    default: false
  },

  featured: {
    type: Boolean,
    default: false
  },

  // Tags para categorización
  tags: [{
    type: String,
    maxlength: 30,
    lowercase: true,
    trim: true
  }],

  // Categoría del diseño
  category: {
    type: String,
    enum: ['abstract', 'animals', 'nature', 'technology', 'sports', 'music', 'art', 'text', 'gaming', 'other'],
    default: 'other'
  },

  // Métricas de engagement
  views: {
    type: Number,
    default: 0,
    min: 0
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

  downloads: {
    type: Number,
    default: 0,
    min: 0
  },

  // Sistema de moderación
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'approved' // Para desarrollo, cambiar a 'pending' en producción
  },

  moderationReason: {
    type: String,
    maxlength: 200
  },

  moderatedAt: {
    type: Date
  },

  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Sistema de reportes
  reports: [{
    reason: {
      type: String,
      enum: ['inappropriate', 'copyright', 'spam', 'violence', 'hate_speech', 'other'],
      required: true
    },
    description: {
      type: String,
      maxlength: 300
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending'
    }
  }],

  // Información de costos
  cost: {
    type: Number,
    required: true,
    min: 0,
    default: 1.80
  },

  currency: {
    type: String,
    default: 'USD'
  },

  // Información técnica
  resolution: {
    width: { type: Number, default: 1024 },
    height: { type: Number, default: 1024 }
  },

  fileSize: {
    type: Number, // en bytes
    min: 0
  },

  format: {
    type: String,
    enum: ['png', 'jpg', 'jpeg', 'webp', 'svg'],
    default: 'png'
  },

  // Metadatos de generación
  generationParams: {
    temperature: { type: Number, min: 0, max: 2 },
    steps: { type: Number, min: 1, max: 100 },
    seed: { type: String },
    model: { type: String },
    version: { type: String }
  },

  // Configuración de avatar (si aplica)
  avatarConfig: {
    bodyType: {
      type: String,
      enum: ['slim', 'regular', 'athletic', 'plus']
    },
    skinTone: {
      type: String,
      enum: ['light', 'medium-light', 'medium', 'medium-dark', 'dark']
    },
    hairStyle: {
      type: String,
      enum: ['short', 'medium', 'long', 'curly', 'straight', 'bald']
    },
    pose: {
      type: String,
      enum: ['front', 'side', 'back', 'three-quarter']
    }
  },

  // Configuración de la camiseta
  shirtConfig: {
    type: {
      type: String,
      enum: ['crew-neck', 'v-neck', 'polo', 'tank-top', 'long-sleeve'],
      default: 'crew-neck'
    },
    color: {
      type: String,
      default: '#ffffff'
    },
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      default: 'M'
    },
    material: {
      type: String,
      enum: ['cotton', 'polyester', 'blend'],
      default: 'cotton'
    }
  },

  // Colores para compatibilidad
  colors: [{
    type: String,
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color debe ser un código hexadecimal válido']
  }],

  // Configuración original para compatibilidad
  aiModel: {
    type: String,
    enum: ['gemini', 'midjourney', 'dalle', 'stable-diffusion'],
    default: 'gemini'
  },

  generationSettings: {
    quality: { type: String, enum: ['standard', 'high', 'ultra'], default: 'standard' },
    aspectRatio: { type: String, enum: ['1:1', '4:3', '16:9'], default: '1:1' },
    seed: { type: Number, default: null }
  },

  // Estado de procesamiento
  processingStatus: {
    type: String,
    enum: ['queued', 'processing', 'completed', 'failed'],
    default: 'completed' // Para desarrollo
  },

  processingProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 100 // Para desarrollo
  },

  // Información de error (si falla la generación)
  errorMessage: {
    type: String,
    maxlength: 500
  },

  // Timestamps
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar rendimiento
designSchema.index({ userId: 1, createdAt: -1 });
designSchema.index({ isPublic: 1, moderationStatus: 1 });
designSchema.index({ tags: 1 });
designSchema.index({ category: 1 });
designSchema.index({ likes: -1 });
designSchema.index({ views: -1 });
designSchema.index({ generatedAt: -1 });
designSchema.index({ 'reports.status': 1 });
designSchema.index({ style: 1 });

// Campos virtuales
designSchema.virtual('likeCount').get(function() {
  return this.likedBy ? this.likedBy.length : 0;
});

designSchema.virtual('reportCount').get(function() {
  return this.reports ? this.reports.length : 0;
});

designSchema.virtual('isReported').get(function() {
  return this.reports && this.reports.length > 0;
});

designSchema.virtual('engagementScore').get(function() {
  // Calcular puntuación de engagement basada en likes, views y downloads
  const likesWeight = 3;
  const viewsWeight = 1;
  const downloadsWeight = 5;
  
  return (this.likes * likesWeight) + (this.views * viewsWeight) + (this.downloads * downloadsWeight);
});

// Middleware pre-save
designSchema.pre('save', function(next) {
  // Generar thumbnail URL si no existe
  if (this.imageUrl && !this.thumbnailUrl) {
    this.thumbnailUrl = this.imageUrl.replace(/\.(jpg|jpeg|png)$/i, '_thumb.$1');
  }
  
  // Sincronizar provider con aiModel para compatibilidad
  if (this.provider && !this.aiModel) {
    this.aiModel = this.provider;
  } else if (this.aiModel && !this.provider) {
    this.provider = this.aiModel;
  }
  
  next();
});

// Métodos estáticos
designSchema.statics.findPopular = function(limit = 10) {
  return this.find({ 
    isPublic: true, 
    moderationStatus: 'approved' 
  })
  .sort({ likes: -1, views: -1 })
  .limit(limit)
  .populate('userId', 'username avatar');
};

designSchema.statics.findTrending = function(days = 7, limit = 10) {
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);
  
  return this.find({
    isPublic: true,
    moderationStatus: 'approved',
    createdAt: { $gte: dateLimit }
  })
  .sort({ likes: -1, views: -1 })
  .limit(limit)
  .populate('userId', 'username avatar');
};

designSchema.statics.findByCategory = function(category, limit = 12) {
  return this.find({
    category,
    isPublic: true,
    moderationStatus: 'approved'
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('userId', 'username avatar');
};

// Métodos de instancia
designSchema.methods.toggleLike = function(userId) {
  const index = this.likedBy.indexOf(userId);
  
  if (index > -1) {
    // Quitar like
    this.likedBy.splice(index, 1);
    this.likes = Math.max(0, this.likes - 1);
  } else {
    // Agregar like
    this.likedBy.push(userId);
    this.likes += 1;
  }
  
  return this.save();
};

designSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

designSchema.methods.addReport = function(reportData) {
  this.reports.push(reportData);
  
  // Si hay muchos reportes, marcar para revisión
  if (this.reports.length >= 3) {
    this.moderationStatus = 'under_review';
  }
  
  return this.save();
};

module.exports = mongoose.model('Design', designSchema);
