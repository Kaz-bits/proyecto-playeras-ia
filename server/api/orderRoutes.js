const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para crear una nueva orden
router.post('/create', authMiddleware.verifyToken, orderController.createOrder);

// Ruta para obtener órdenes del usuario
router.get('/user-orders', authMiddleware.verifyToken, orderController.getUserOrders);

// Ruta para obtener detalles de una orden específica
router.get('/:id', authMiddleware.verifyToken, orderController.getOrderDetails);

// Ruta para actualizar estado de orden
router.patch('/:id/status', authMiddleware.verifyToken, orderController.updateOrderStatus);

module.exports = router;
