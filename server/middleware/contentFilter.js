// Middleware para filtrar y moderar prompts enviados a las APIs de IA

const forbiddenWords = [
  'violencia', 'hate', 'odio', 'discriminación', 'sexual', 'desnudo',
  'droga', 'alcohol', 'arma', 'política', 'religión'
];

const forbiddenPatterns = [
  /\b(kill|murder|death)\b/i,
  /\b(nude|naked|sex)\b/i,
  /\b(drug|cocaine|marijuana)\b/i
];

exports.moderatePrompt = (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt es requerido' });
    }

    // Verificar palabras prohibidas
    const hasforbidden = forbiddenWords.some(word => 
      prompt.toLowerCase().includes(word.toLowerCase())
    );

    if (hasforbidden) {
      return res.status(400).json({ 
        message: 'El prompt contiene contenido inapropiado',
        error: 'CONTENT_FILTERED'
      });
    }

    // Verificar patrones prohibidos
    const hasPattern = forbiddenPatterns.some(pattern => 
      pattern.test(prompt)
    );

    if (hasPattern) {
      return res.status(400).json({ 
        message: 'El prompt contiene contenido inapropiado',
        error: 'CONTENT_FILTERED'
      });
    }

    // Si el prompt es muy largo
    if (prompt.length > 500) {
      return res.status(400).json({ 
        message: 'El prompt es demasiado largo (máximo 500 caracteres)',
        error: 'PROMPT_TOO_LONG'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error en filtro de contenido', error: error.message });
  }
};
