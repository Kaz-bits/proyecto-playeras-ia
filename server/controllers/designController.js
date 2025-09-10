const Design = require('../models/Design');
const { moderateContent } = require('../utils/contentModeration');
const { generateWithGemini, generateWithMidjourney } = require('../utils/aiProviders');

// Generar diseño con IA
const generateDesign = async (req, res) => {
  try {
    const { prompt, style, palette, provider, userId } = req.body;

    // Validar entrada
    if (!prompt || !provider) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompt y proveedor de IA son requeridos' 
      });
    }

    // Moderar contenido del prompt
    const moderationResult = await moderateContent(prompt);
    if (!moderationResult.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: `Contenido no permitido: ${moderationResult.reason}`,
        flaggedContent: moderationResult.flaggedTerms
      });
    }

    // Generar imagen con IA
    let generatedImage;
    let cost;

    try {
      if (provider === 'gemini') {
        generatedImage = await generateWithGemini(prompt, { style, palette });
        cost = 1.80;
      } else if (provider === 'midjourney') {
        generatedImage = await generateWithMidjourney(prompt, { style, palette });
        cost = 2.50;
      } else {
        return res.status(400).json({ 
          success: false, 
          message: 'Proveedor de IA no válido' 
        });
      }
    } catch (aiError) {
      console.error('Error generando imagen:', aiError);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al generar la imagen con IA',
        error: aiError.message
      });
    }

    // Guardar diseño en la base de datos
    const design = new Design({
      prompt,
      style,
      palette,
      provider,
      imageUrl: generatedImage.url,
      cost,
      userId,
      moderationStatus: 'approved',
      generatedAt: new Date()
    });

    await design.save();

    res.status(201).json({
      success: true,
      message: 'Diseño generado exitosamente',
      design: {
        id: design._id,
        imageUrl: design.imageUrl,
        prompt: design.prompt,
        cost: design.cost,
        provider: design.provider
      }
    });

  } catch (error) {
    console.error('Error en generateDesign:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener diseños del usuario
const getUserDesigns = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const designs = await Design.find({ 
      userId,
      moderationStatus: 'approved' 
    })
    .sort({ generatedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const total = await Design.countDocuments({ 
      userId,
      moderationStatus: 'approved' 
    });

    res.json({
      success: true,
      designs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error en getUserDesigns:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener diseños' 
    });
  }
};

// Obtener diseños públicos (galería)
const getPublicDesigns = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      filter = 'trending',
      search = '',
      tags = ''
    } = req.query;

    // Construir query de búsqueda
    let query = { 
      moderationStatus: 'approved',
      isPublic: true 
    };

    if (search) {
      query.$or = [
        { prompt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Configurar ordenamiento
    let sortOptions = {};
    switch (filter) {
      case 'trending':
        sortOptions = { likes: -1, views: -1 };
        break;
      case 'recent':
        sortOptions = { generatedAt: -1 };
        break;
      case 'popular':
        sortOptions = { views: -1 };
        break;
      default:
        sortOptions = { generatedAt: -1 };
    }

    const designs = await Design.find(query)
      .populate('userId', 'username avatar')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Design.countDocuments(query);

    res.json({
      success: true,
      designs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error en getPublicDesigns:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener diseños públicos' 
    });
  }
};

// Dar like a un diseño
const likeDesign = async (req, res) => {
  try {
    const { designId } = req.params;
    const { userId } = req.body;

    const design = await Design.findById(designId);
    if (!design) {
      return res.status(404).json({ 
        success: false, 
        message: 'Diseño no encontrado' 
      });
    }

    // Verificar si ya le dio like
    const alreadyLiked = design.likedBy.includes(userId);
    
    if (alreadyLiked) {
      // Quitar like
      design.likedBy.pull(userId);
      design.likes = Math.max(0, design.likes - 1);
    } else {
      // Agregar like
      design.likedBy.push(userId);
      design.likes += 1;
    }

    await design.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      totalLikes: design.likes
    });

  } catch (error) {
    console.error('Error en likeDesign:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al procesar like' 
    });
  }
};

// Incrementar visualizaciones
const incrementViews = async (req, res) => {
  try {
    const { designId } = req.params;

    await Design.findByIdAndUpdate(
      designId,
      { $inc: { views: 1 } },
      { new: true }
    );

    res.json({ success: true });

  } catch (error) {
    console.error('Error en incrementViews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al incrementar visualizaciones' 
    });
  }
};

// Reportar diseño
const reportDesign = async (req, res) => {
  try {
    const { designId } = req.params;
    const { reason, description, reportedBy } = req.body;

    const design = await Design.findById(designId);
    if (!design) {
      return res.status(404).json({ 
        success: false, 
        message: 'Diseño no encontrado' 
      });
    }

    // Agregar reporte
    design.reports.push({
      reason,
      description,
      reportedBy,
      reportedAt: new Date()
    });

    // Si hay muchos reportes, marcar para revisión
    if (design.reports.length >= 3) {
      design.moderationStatus = 'under_review';
    }

    await design.save();

    res.json({
      success: true,
      message: 'Reporte enviado exitosamente'
    });

  } catch (error) {
    console.error('Error en reportDesign:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar reporte' 
    });
  }
};

// Guardar diseño
const saveDesign = async (req, res) => {
  try {
    const { designId, isPublic } = req.body;
    const userId = req.userId;
    
    const design = await Design.findOneAndUpdate(
      { _id: designId, userId },
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
const deleteDesign = async (req, res) => {
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

module.exports = {
  generateDesign,
  getUserDesigns,
  getPublicDesigns,
  likeDesign,
  incrementViews,
  reportDesign,
  saveDesign,
  deleteDesign
};
