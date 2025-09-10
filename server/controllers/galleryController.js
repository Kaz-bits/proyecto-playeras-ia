const Design = require('../models/Design');

// Obtener diseños públicos para la galería
exports.getPublicDesigns = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const designs = await Design.find({ isPublic: true })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Design.countDocuments({ isPublic: true });

    res.json({
      designs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo diseños públicos', error: error.message });
  }
};

// Obtener diseños destacados
exports.getFeaturedDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ 
      isPublic: true,
      featured: true 
    })
    .populate('userId', 'name')
    .sort({ createdAt: -1 })
    .limit(6);

    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo diseños destacados', error: error.message });
  }
};

// Buscar diseños en la galería
exports.searchDesigns = async (req, res) => {
  try {
    const { query, page = 1, limit = 12 } = req.query;
    
    const searchQuery = {
      isPublic: true,
      $or: [
        { description: { $regex: query, $options: 'i' } },
        { prompt: { $regex: query, $options: 'i' } },
        { style: { $regex: query, $options: 'i' } }
      ]
    };

    const designs = await Design.find(searchQuery)
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Design.countDocuments(searchQuery);

    res.json({
      designs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      query
    });
  } catch (error) {
    res.status(500).json({ message: 'Error buscando diseños', error: error.message });
  }
};
