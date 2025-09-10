const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para registrar usuario
router.post('/register', authController.register);

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para cerrar sesión
router.post('/logout', authMiddleware.verifyToken, authController.logout);

// Ruta para obtener perfil del usuario
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);

module.exports = router;
