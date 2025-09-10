const Design = require('../models/Design');
// Aquí importarías las APIs de IA (Gemini, Midjourney, etc.)

// Generar diseño con IA
exports.generateDesign = async (req, res) => {
  try {
    const { prompt, style, colors } = req.body;
    const userId = req.userId;

    // Aquí iría la lógica para llamar a las APIs de IA
    // Por ejemplo: Gemini para generar la descripción, Midjourney para la imagen

    // Simulación de respuesta de IA
    const aiResponse = {
      imageUrl: 'https://example.com/generated-design.jpg',
      description: `Diseño generado basado en: ${prompt}`,
      style: style,
      colors: colors
    };

    // Crear nuevo diseño en la base de datos
    const design = new Design({
      userId,
      prompt,
      imageUrl: aiResponse.imageUrl,
      description: aiResponse.description,
      style,
      colors,
      isPublic: false
    });

    await design.save();

    res.json({
      message: 'Diseño generado exitosamente',
      design
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generando diseño', error: error.message });
  }
};

// Obtener diseños del usuario
exports.getUserDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo diseños', error: error.message });
  }
};

// Guardar diseño
exports.saveDesign = async (req, res) => {
  try {
    const { designId, isPublic } = req.body;
    
    const design = await Design.findOneAndUpdate(
      { _id: designId, userId: req.userId },
      { isPublic },
      { new: true }
    );

    if (!design) {
      return res.status(404).json({ message: 'Diseño no encontrado' });
    }

    res.json({ message: 'Diseño guardado exitosamente', design });
  } catch (error) {
    res.status(500).json({ message: 'Error guardando diseño', error: error.message });
  }
};

// Eliminar diseño
exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!design) {
      return res.status(404).json({ message: 'Diseño no encontrado' });
    }

    res.json({ message: 'Diseño eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando diseño', error: error.message });
  }
};
