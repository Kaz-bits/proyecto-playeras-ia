const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

// Ruta para obtener diseños públicos de la galería
router.get('/public-designs', galleryController.getPublicDesigns);

// Ruta para obtener diseños destacados
router.get('/featured', galleryController.getFeaturedDesigns);

// Ruta para buscar diseños en la galería
router.get('/search', galleryController.searchDesigns);

module.exports = router;
