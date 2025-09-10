const Order = require('../models/Order');
const Design = require('../models/Design');

// Crear nueva orden
exports.createOrder = async (req, res) => {
  try {
    const { designId, size, quantity, shippingAddress } = req.body;
    const userId = req.userId;

    // Verificar que el diseño existe y pertenece al usuario
    const design = await Design.findOne({ _id: designId, userId });
    if (!design) {
      return res.status(404).json({ message: 'Diseño no encontrado' });
    }

    // Calcular precio (esto podría ser más complejo)
    const pricePerUnit = 25.99; // Precio base
    const totalPrice = pricePerUnit * quantity;

    const order = new Order({
      userId,
      designId,
      size,
      quantity,
      totalPrice,
      shippingAddress,
      status: 'pending'
    });

    await order.save();

    res.status(201).json({
      message: 'Orden creada exitosamente',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creando orden', error: error.message });
  }
};

// Obtener órdenes del usuario
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('designId')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo órdenes', error: error.message });
  }
};

// Obtener detalles de una orden
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('designId');

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo orden', error: error.message });
  }
};

// Actualizar estado de orden
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json({ message: 'Estado de orden actualizado', order });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando orden', error: error.message });
  }
};
