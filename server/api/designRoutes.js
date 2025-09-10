const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController');
const authMiddleware = require('../middleware/authMiddleware');
const contentFilter = require('../middleware/contentFilter');

// Ruta para generar diseño con IA
router.post('/generate', 
  authMiddleware.verifyToken, 
  contentFilter.moderatePrompt, 
  designController.generateDesign
);

// Ruta para obtener diseños del usuario
router.get('/user-designs', authMiddleware.verifyToken, designController.getUserDesigns);

// Ruta para guardar diseño
router.post('/save', authMiddleware.verifyToken, designController.saveDesign);

// Ruta para eliminar diseño
router.delete('/:id', authMiddleware.verifyToken, designController.deleteDesign);

module.exports = router;
