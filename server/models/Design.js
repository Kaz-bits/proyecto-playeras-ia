const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prompt: {
    type: String,
    required: true,
    maxlength: [500, 'El prompt no puede exceder 500 caracteres']
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  style: {
    type: String,
    enum: ['realistic', 'cartoon', 'abstract', 'minimalist', 'vintage', 'modern'],
    default: 'modern'
  },
  colors: [{
    type: String,
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color debe ser un código hexadecimal válido']
  }],
  tags: [{
    type: String,
    maxlength: [20, 'Cada tag no puede exceder 20 caracteres']
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  aiModel: {
    type: String,
    enum: ['gemini', 'midjourney', 'dalle', 'stable-diffusion'],
    default: 'gemini'
  },
  generationSettings: {
    quality: { type: String, enum: ['standard', 'high', 'ultra'], default: 'standard' },
    aspectRatio: { type: String, enum: ['1:1', '4:3', '16:9'], default: '1:1' },
    seed: { type: Number, default: null }
  }
}, {
  timestamps: true
});

// Índices para mejorar búsquedas
designSchema.index({ userId: 1, createdAt: -1 });
designSchema.index({ isPublic: 1, createdAt: -1 });
designSchema.index({ tags: 1 });
designSchema.index({ style: 1 });

module.exports = mongoose.model('Design', designSchema);
