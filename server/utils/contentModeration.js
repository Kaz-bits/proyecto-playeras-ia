// Sistema de moderación de contenido

// Palabras y frases prohibidas
const PROHIBITED_TERMS = {
  violence: [
    'violencia', 'matar', 'morir', 'muerte', 'sangre', 'armas', 'pistola', 
    'cuchillo', 'guerra', 'pelea', 'golpear', 'disparar', 'bomba', 'explosión',
    'terrorismo', 'asesino', 'suicidio', 'homicidio', 'agresión', 'atacar'
  ],
  
  inappropriate: [
    'sexual', 'sexo', 'desnudo', 'pornografía', 'erótico', 'prostitución',
    'drogas', 'marihuana', 'cocaína', 'heroína', 'alcohol', 'borracho',
    'gambling', 'apuestas', 'casino', 'póker'
  ],
  
  hateSpeech: [
    'racista', 'nazi', 'fascista', 'supremacista', 'discriminación',
    'homofóbico', 'xenófobo', 'antisemita', 'misógino', 'machista',
    'odio', 'desprecio'
  ],
  
  copyright: [
    'disney', 'marvel', 'dc comics', 'pokemon', 'nintendo', 'sony',
    'coca-cola', 'pepsi', 'mcdonalds', 'nike', 'adidas', 'apple',
    'microsoft', 'google', 'facebook', 'instagram', 'youtube',
    'star wars', 'harry potter', 'batman', 'superman', 'spiderman',
    'mickey mouse', 'pikachu'
  ],
  
  personalInfo: [
    'teléfono', 'celular', 'dirección', 'domicilio', 'email', 'correo',
    'contraseña', 'password', 'cédula', 'pasaporte', 'tarjeta de crédito'
  ]
};

// Patrones de expresiones regulares para detectar contenido problemático
const REGEX_PATTERNS = [
  // Números de teléfono
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  // Emails
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  // URLs
  /(https?:\/\/[^\s]+)/g,
  // Caracteres repetitivos (spam)
  /(.)\1{5,}/g
];

/**
 * Moderar contenido del prompt
 * @param {string} content - Contenido a moderar
 * @returns {Object} - Resultado de la moderación
 */
const moderateContent = async (content) => {
  try {
    if (!content || typeof content !== 'string') {
      return {
        isValid: false,
        reason: 'Contenido vacío o inválido',
        flaggedTerms: []
      };
    }

    const normalizedContent = content.toLowerCase().trim();
    const flaggedTerms = [];
    let category = null;

    // Verificar longitud mínima y máxima
    if (normalizedContent.length < 3) {
      return {
        isValid: false,
        reason: 'El prompt debe tener al menos 3 caracteres',
        flaggedTerms: []
      };
    }

    if (normalizedContent.length > 500) {
      return {
        isValid: false,
        reason: 'El prompt no puede exceder 500 caracteres',
        flaggedTerms: []
      };
    }

    // Verificar palabras prohibidas por categoría
    for (const [categoryName, terms] of Object.entries(PROHIBITED_TERMS)) {
      for (const term of terms) {
        if (normalizedContent.includes(term.toLowerCase())) {
          flaggedTerms.push(term);
          category = categoryName;
        }
      }
    }

    // Verificar patrones de regex
    for (const pattern of REGEX_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        flaggedTerms.push(...matches);
        category = category || 'personalInfo';
      }
    }

    // Si se encontraron términos prohibidos
    if (flaggedTerms.length > 0) {
      return {
        isValid: false,
        reason: getCategoryMessage(category),
        flaggedTerms: [...new Set(flaggedTerms)], // Remover duplicados
        category
      };
    }

    // Verificaciones adicionales de calidad
    const qualityCheck = checkContentQuality(normalizedContent);
    if (!qualityCheck.isValid) {
      return qualityCheck;
    }

    return {
      isValid: true,
      reason: 'Contenido aprobado',
      flaggedTerms: [],
      score: calculateContentScore(normalizedContent)
    };

  } catch (error) {
    console.error('Error en moderación de contenido:', error);
    return {
      isValid: false,
      reason: 'Error en el sistema de moderación',
      flaggedTerms: []
    };
  }
};

/**
 * Verificar calidad del contenido
 * @param {string} content - Contenido normalizado
 * @returns {Object} - Resultado de verificación de calidad
 */
const checkContentQuality = (content) => {
  // Verificar que no sea solo espacios o caracteres especiales
  if (!/[a-záéíóúñü]/i.test(content)) {
    return {
      isValid: false,
      reason: 'El prompt debe contener al menos una palabra válida',
      flaggedTerms: []
    };
  }

  // Verificar que no sea solo números
  if (/^\d+$/.test(content.replace(/\s/g, ''))) {
    return {
      isValid: false,
      reason: 'El prompt no puede contener solo números',
      flaggedTerms: []
    };
  }

  // Verificar spam de caracteres
  if (/(.)\1{4,}/.test(content)) {
    return {
      isValid: false,
      reason: 'No se permiten caracteres repetitivos excesivos',
      flaggedTerms: []
    };
  }

  return { isValid: true };
};

/**
 * Calcular puntuación de calidad del contenido
 * @param {string} content - Contenido normalizado
 * @returns {number} - Puntuación de 0 a 100
 */
const calculateContentScore = (content) => {
  let score = 50; // Puntuación base

  // Puntos por longitud apropiada
  if (content.length >= 10 && content.length <= 100) {
    score += 20;
  } else if (content.length >= 5 && content.length <= 200) {
    score += 10;
  }

  // Puntos por palabras descriptivas
  const descriptiveWords = [
    'colorido', 'brillante', 'abstracto', 'geométrico', 'artístico',
    'moderno', 'vintage', 'minimalista', 'elegante', 'creativo',
    'original', 'único', 'hermoso', 'estilizado', 'decorativo'
  ];

  const wordsFound = descriptiveWords.filter(word => 
    content.includes(word.toLowerCase())
  ).length;

  score += wordsFound * 5;

  // Penalización por palabras vagas
  const vagueWords = ['cosa', 'algo', 'esto', 'eso'];
  const vagueWordsFound = vagueWords.filter(word => 
    content.includes(word.toLowerCase())
  ).length;

  score -= vagueWordsFound * 5;

  return Math.max(0, Math.min(100, score));
};

/**
 * Obtener mensaje de categoría prohibida
 * @param {string} category - Categoría de contenido prohibido
 * @returns {string} - Mensaje explicativo
 */
const getCategoryMessage = (category) => {
  const messages = {
    violence: 'No se permite contenido que incite a la violencia o represente actos violentos',
    inappropriate: 'No se permite contenido sexual, relacionado con drogas o actividades ilegales',
    hateSpeech: 'No se permite contenido que promueva odio, discriminación o discurso de odio',
    copyright: 'No se permite usar marcas registradas, personajes con derechos de autor o contenido protegido',
    personalInfo: 'No se permite incluir información personal como teléfonos, emails o direcciones'
  };

  return messages[category] || 'Contenido no permitido según nuestras políticas';
};

/**
 * Moderar imagen generada (para implementación futura con APIs de moderación visual)
 * @param {string} imageUrl - URL de la imagen a moderar
 * @returns {Object} - Resultado de moderación visual
 */
const moderateImage = async (imageUrl) => {
  // Placeholder para moderación visual
  // En el futuro se puede integrar con APIs como Google Vision API, AWS Rekognition, etc.
  
  try {
    // Simulación de moderación visual
    return {
      isValid: true,
      reason: 'Imagen aprobada',
      confidence: 95,
      labels: []
    };
  } catch (error) {
    console.error('Error en moderación de imagen:', error);
    return {
      isValid: false,
      reason: 'Error en moderación visual',
      confidence: 0,
      labels: []
    };
  }
};

/**
 * Reportar contenido problemático
 * @param {string} contentId - ID del contenido reportado
 * @param {string} reason - Razón del reporte
 * @param {string} userId - ID del usuario que reporta
 * @returns {Object} - Resultado del reporte
 */
const reportContent = async (contentId, reason, userId) => {
  try {
    // Lógica para procesar reportes de usuarios
    // Esto se integraría con la base de datos para guardar reportes
    
    return {
      success: true,
      message: 'Reporte enviado exitosamente',
      reportId: generateReportId()
    };
  } catch (error) {
    console.error('Error procesando reporte:', error);
    return {
      success: false,
      message: 'Error al procesar el reporte'
    };
  }
};

/**
 * Generar ID único para reportes
 * @returns {string} - ID único
 */
const generateReportId = () => {
  return 'RPT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Obtener estadísticas de moderación
 * @returns {Object} - Estadísticas del sistema
 */
const getModerationStats = () => {
  return {
    totalTermsBlocked: Object.values(PROHIBITED_TERMS).flat().length,
    categoriesMonitored: Object.keys(PROHIBITED_TERMS).length,
    patternsChecked: REGEX_PATTERNS.length,
    lastUpdated: new Date().toISOString()
  };
};

module.exports = {
  moderateContent,
  moderateImage,
  reportContent,
  getModerationStats,
  PROHIBITED_TERMS
};
