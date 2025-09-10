import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

const Design = () => {
  // Estados para el diseño y generación
  const [currentDesign, setCurrentDesign] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiProvider, setAiProvider] = useState('gemini');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedPalette, setSelectedPalette] = useState('vibrant');
  const [prompt, setPrompt] = useState('');
  
  // Estados para el avatar 3D realista
  const [avatar3D, setAvatar3D] = useState({
    bodyType: 'athletic',
    skinTone: 'medium',
    hairStyle: 'short',
    hairColor: '#2D1810',
    eyeColor: '#654321',
    facialHair: 'none',
    gender: 'male',
    height: 'average',
    build: 'athletic'
  });

  // Estados para la camiseta 3D
  const [shirt3D, setShirt3D] = useState({
    type: 'crew-neck',
    color: '#ffffff',
    size: 'M',
    material: 'cotton',
    fit: 'regular',
    design: null,
    designPosition: { x: 0, y: 0 },
    designScale: 1.0
  });

  // Estados para controles de cámara 3D
  const [camera3D, setCamera3D] = useState({
    zoom: 1.0,
    rotation: { x: 0, y: 0, z: 0 },
    position: { x: 0, y: 0, z: 5 },
    target: { x: 0, y: 0, z: 0 }
  });

  // Estados para vista y animaciones
  const [viewMode, setViewMode] = useState('front'); // front, back, side-left, side-right
  const [isRotating, setIsRotating] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  const [lighting, setLighting] = useState('studio');
  const [background3D, setBackground3D] = useState('studio');

  // Referencias para el canvas 3D
  const canvas3DRef = useRef(null);
  const animationRef = useRef(null);

  // Conversión de costos a pesos mexicanos (1 USD = 18 MXN aproximadamente)
  const AI_COSTS_MXN = {
    gemini: 32.40, // $1.80 USD * 18 = $32.40 MXN
    midjourney: 45.00, // $2.50 USD * 18 = $45.00 MXN
    openai: 54.00 // $3.00 USD * 18 = $54.00 MXN
  };

  const SHIRT_COSTS_MXN = {
    base: 287.82, // $15.99 USD * 18 = $287.82 MXN
    shipping: 107.82 // $5.99 USD * 18 = $107.82 MXN
  };

  // Configuraciones del avatar realista
  const AVATAR_CONFIG = {
    bodyTypes: [
      { id: 'slim', name: 'Delgado', icon: '🧍‍♂️' },
      { id: 'regular', name: 'Regular', icon: '🧍' },
      { id: 'athletic', name: 'Atlético', icon: '💪' },
      { id: 'plus', name: 'Grande', icon: '🫃' }
    ],
    
    skinTones: [
      { id: 'light', name: 'Claro', color: '#FDBCB4' },
      { id: 'medium-light', name: 'Medio Claro', color: '#E09B85' },
      { id: 'medium', name: 'Medio', color: '#D08B5B' },
      { id: 'medium-dark', name: 'Medio Oscuro', color: '#C17A4A' },
      { id: 'dark', name: 'Oscuro', color: '#8B4513' }
    ],
    
    hairStyles: [
      { id: 'bald', name: 'Calvo', icon: '👨‍🦲' },
      { id: 'short', name: 'Corto', icon: '👨' },
      { id: 'medium', name: 'Medio', icon: '🧑' },
      { id: 'long', name: 'Largo', icon: '👨‍🦱' },
      { id: 'curly', name: 'Rizado', icon: '👨‍🦲' },
      { id: 'afro', name: 'Afro', icon: '👨‍🦱' }
    ],

    facialHair: [
      { id: 'none', name: 'Sin barba', icon: '👨' },
      { id: 'mustache', name: 'Bigote', icon: '🥸' },
      { id: 'goatee', name: 'Perilla', icon: '🧔' },
      { id: 'full-beard', name: 'Barba completa', icon: '🧔‍♂️' }
    ]
  };

  // Función para generar diseño con IA
  const generateDesign = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    try {
      const requestData = {
        prompt: prompt,
        style: selectedStyle,
        palette: selectedPalette,
        provider: aiProvider,
        avatarConfig: avatar3D,
        shirtConfig: shirt3D
      };
      
      // Simulación de llamada a API con costos en MXN
      setTimeout(() => {
        const cost = AI_COSTS_MXN[aiProvider];
        const newDesign = {
          id: Date.now(),
          url: `https://placehold.co/512x512/${selectedPalette === 'vibrant' ? '4F46E5' : '7C3AED'}/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 30))}`,
          prompt,
          style: selectedStyle,
          palette: selectedPalette,
          provider: aiProvider,
          cost: cost,
          timestamp: new Date().toISOString()
        };
        
        setGeneratedImages(prev => [newDesign, ...prev]);
        setCurrentDesign(newDesign);
        
        // Aplicar el diseño a la camiseta 3D
        updateShirt3D('design', newDesign);
        
        setIsGenerating(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating design:', error);
      setIsGenerating(false);
    }
  };

  // Función para actualizar configuración del avatar 3D
  const updateAvatar3D = (key, value) => {
    setAvatar3D(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Actualizar el avatar en tiempo real
    renderAvatar3D();
  };

  // Función para actualizar configuración de la camiseta 3D
  const updateShirt3D = (key, value) => {
    setShirt3D(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Actualizar la camiseta en tiempo real
    renderShirt3D();
  };

  // Función para controlar la cámara 3D
  const updateCamera3D = (updates) => {
    setCamera3D(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Función para cambiar vista del avatar
  const changeView = (view) => {
    setViewMode(view);
    
    const viewPositions = {
      front: { x: 0, y: 0, z: 0 },
      back: { x: 0, y: 180, z: 0 },
      'side-left': { x: 0, y: -90, z: 0 },
      'side-right': { x: 0, y: 90, z: 0 }
    };
    
    updateCamera3D({
      rotation: viewPositions[view]
    });
  };

  // Función para rotar automáticamente
  const toggleAutoRotate = () => {
    setIsRotating(!isRotating);
  };

  // Función para resetear la cámara
  const resetCamera = () => {
    setCamera3D({
      zoom: 1.0,
      rotation: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: 0, z: 5 },
      target: { x: 0, y: 0, z: 0 }
    });
    setViewMode('front');
  };

  // Renderizado del avatar 3D (simulado)
  const renderAvatar3D = () => {
    // Esta función simula el renderizado 3D
    // En una implementación real usarías Three.js o similar
    if (canvas3DRef.current) {
      const ctx = canvas3DRef.current.getContext('2d');
      
      // Limpiar canvas
      ctx.clearRect(0, 0, 400, 500);
      
      // Dibujar avatar simplificado (placeholder para 3D real)
      drawSimpleAvatar(ctx);
    }
  };

  // Función para dibujar avatar simplificado
  const drawSimpleAvatar = (ctx) => {
    const centerX = 200;
    const centerY = 250;
    
    // Color de piel basado en selección
    const skinColors = {
      light: '#FDBCB4',
      'medium-light': '#E09B85',
      medium: '#D08B5B',
      'medium-dark': '#C17A4A',
      dark: '#8B4513'
    };
    
    const skinColor = skinColors[avatar3D.skinTone];
    
    // Dibujar cabeza
    ctx.beginPath();
    ctx.arc(centerX, centerY - 150, 60, 0, 2 * Math.PI);
    ctx.fillStyle = skinColor;
    ctx.fill();
    
    // Dibujar cabello
    if (avatar3D.hairStyle !== 'bald') {
      ctx.beginPath();
      ctx.arc(centerX, centerY - 180, 65, 0, Math.PI, true);
      ctx.fillStyle = avatar3D.hairColor;
      ctx.fill();
    }
    
    // Dibujar cuerpo
    const bodyWidths = {
      slim: 40,
      regular: 50,
      athletic: 60,
      plus: 70
    };
    
    const bodyWidth = bodyWidths[avatar3D.bodyType];
    
    ctx.beginPath();
    ctx.rect(centerX - bodyWidth, centerY - 80, bodyWidth * 2, 120);
    ctx.fillStyle = shirt3D.color;
    ctx.fill();
    
    // Dibujar diseño en la camiseta
    if (currentDesign) {
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Diseño IA', centerX, centerY - 20);
    }
    
    // Dibujar brazos
    ctx.beginPath();
    ctx.rect(centerX - bodyWidth - 15, centerY - 60, 15, 80);
    ctx.rect(centerX + bodyWidth, centerY - 60, 15, 80);
    ctx.fillStyle = skinColor;
    ctx.fill();
    
    // Dibujar piernas
    ctx.beginPath();
    ctx.rect(centerX - 25, centerY + 40, 20, 100);
    ctx.rect(centerX + 5, centerY + 40, 20, 100);
    ctx.fillStyle = '#2C5530';
    ctx.fill();
  };

  // Renderizado de la camiseta 3D
  const renderShirt3D = () => {
    // Actualizar la visualización de la camiseta
    renderAvatar3D();
  };

  // Calcular costo total
  const calculateTotalCost = () => {
    const aiCost = AI_COSTS_MXN[aiProvider];
    const shirtCost = SHIRT_COSTS_MXN.base;
    const shippingCost = SHIRT_COSTS_MXN.shipping;
    
    return {
      ai: aiCost,
      shirt: shirtCost,
      shipping: shippingCost,
      total: aiCost + shirtCost + shippingCost
    };
  };

  // Efectos para inicialización
  useEffect(() => {
    renderAvatar3D();
  }, [avatar3D, shirt3D, viewMode, camera3D]);

  // Efecto para auto-rotación
  useEffect(() => {
    if (isRotating) {
      const interval = setInterval(() => {
        updateCamera3D({
          rotation: {
            ...camera3D.rotation,
            y: (camera3D.rotation.y + 2) % 360
          }
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isRotating, camera3D.rotation]);

  return (
    <>
      <Head>
        <title>Estudio de Diseño con IA - Playeras Personalizadas</title>
        <meta name="description" content="Crea diseños únicos para playeras usando inteligencia artificial" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header del Estudio */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎨 Estudio de Diseño con IA
            </h1>
            <p className="text-xl text-gray-600">
              Crea diseños únicos con inteligencia artificial y visualízalos en tiempo real
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panel de Diseño */}
            <div className="lg:col-span-2 space-y-6">
              {/* Generador de Diseños */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-purple-100 p-2 rounded-lg mr-3">🤖</span>
                  Generador con IA
                </h2>

                {/* Input del Prompt */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe tu diseño
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ej: Un dragón místico con colores vibrantes, estilo artístico japonés..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows="3"
                  />
                </div>

                {/* Configuración de IA */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Proveedor de IA */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proveedor de IA
                    </label>
                    <select
                      value={aiProvider}
                      onChange={(e) => setAiProvider(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="gemini">Gemini - $32.40 MXN</option>
                      <option value="midjourney">Midjourney - $45.00 MXN</option>
                      <option value="openai">OpenAI - $54.00 MXN</option>
                    </select>
                  </div>

                  {/* Estilo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estilo
                    </label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="realistic">Realista</option>
                      <option value="artistic">Artístico</option>
                      <option value="cartoon">Caricatura</option>
                      <option value="minimalist">Minimalista</option>
                      <option value="vintage">Vintage</option>
                      <option value="abstract">Abstracto</option>
                    </select>
                  </div>

                  {/* Paleta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paleta de Colores
                    </label>
                    <select
                      value={selectedPalette}
                      onChange={(e) => setSelectedPalette(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="vibrant">Vibrante</option>
                      <option value="pastel">Pastel</option>
                      <option value="monochrome">Monocromático</option>
                      <option value="warm">Cálidos</option>
                      <option value="cool">Fríos</option>
                      <option value="earth">Tierra</option>
                      <option value="neon">Neón</option>
                    </select>
                  </div>
                </div>

                {/* Botón Generar */}
                <button
                  onClick={generateDesign}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Generando diseño...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✨</span>
                      Generar Diseño - ${AI_COSTS_MXN[aiProvider]} MXN
                    </>
                  )}
                </button>
              </div>

              {/* Visor 3D del Avatar */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-3">👤</span>
                  Visor 3D del Avatar
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Canvas 3D */}
                  <div className="relative">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 min-h-[500px] flex items-center justify-center">
                      <canvas
                        ref={canvas3DRef}
                        width="400"
                        height="500"
                        className="rounded-lg shadow-inner"
                        style={{ background: background3D === 'studio' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa' }}
                      />
                    </div>

                    {/* Controles de Vista */}
                    <div className="absolute top-4 left-4 flex space-x-2">
                      {['front', 'back', 'side-left', 'side-right'].map((view) => (
                        <button
                          key={view}
                          onClick={() => changeView(view)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            viewMode === view
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/80 text-gray-700 hover:bg-white'
                          }`}
                        >
                          {view === 'front' ? '👤' : view === 'back' ? '🔄' : 
                           view === 'side-left' ? '↩️' : '↪️'}
                        </button>
                      ))}
                    </div>

                    {/* Controles de Cámara */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={toggleAutoRotate}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isRotating
                              ? 'bg-red-500 text-white'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          {isRotating ? '⏸️ Parar' : '🔄 Rotar'}
                        </button>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCamera3D({ zoom: Math.max(0.5, camera3D.zoom - 0.1) })}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                          >
                            🔍➖
                          </button>
                          <span className="text-sm font-medium">{Math.round(camera3D.zoom * 100)}%</span>
                          <button
                            onClick={() => updateCamera3D({ zoom: Math.min(2.0, camera3D.zoom + 0.1) })}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                          >
                            🔍➕
                          </button>
                        </div>

                        <button
                          onClick={resetCamera}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          🏠 Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Configuración del Avatar */}
                  <div className="space-y-4">
                    {/* Tipo de Cuerpo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tipo de Cuerpo
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {AVATAR_CONFIG.bodyTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => updateAvatar3D('bodyType', type.id)}
                            className={`p-3 rounded-lg border text-center transition-all ${
                              avatar3D.bodyType === type.id
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-2xl mb-1">{type.icon}</div>
                            <div className="text-sm font-medium">{type.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tono de Piel */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tono de Piel
                      </label>
                      <div className="flex space-x-2">
                        {AVATAR_CONFIG.skinTones.map((tone) => (
                          <button
                            key={tone.id}
                            onClick={() => updateAvatar3D('skinTone', tone.id)}
                            className={`w-12 h-12 rounded-full border-4 transition-all ${
                              avatar3D.skinTone === tone.id
                                ? 'border-purple-500 scale-110'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={{ backgroundColor: tone.color }}
                            title={tone.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Estilo de Cabello */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Estilo de Cabello
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {AVATAR_CONFIG.hairStyles.map((hair) => (
                          <button
                            key={hair.id}
                            onClick={() => updateAvatar3D('hairStyle', hair.id)}
                            className={`p-2 rounded-lg border text-center transition-all ${
                              avatar3D.hairStyle === hair.id
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-xl mb-1">{hair.icon}</div>
                            <div className="text-xs font-medium">{hair.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color de Cabello */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Color de Cabello
                      </label>
                      <input
                        type="color"
                        value={avatar3D.hairColor}
                        onChange={(e) => updateAvatar3D('hairColor', e.target.value)}
                        className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                    </div>

                    {/* Vello Facial */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Vello Facial
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {AVATAR_CONFIG.facialHair.map((facial) => (
                          <button
                            key={facial.id}
                            onClick={() => updateAvatar3D('facialHair', facial.id)}
                            className={`p-2 rounded-lg border text-center transition-all ${
                              avatar3D.facialHair === facial.id
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-xl mb-1">{facial.icon}</div>
                            <div className="text-xs font-medium">{facial.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuración de la Camiseta */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-green-100 p-2 rounded-lg mr-3">👕</span>
                  Configuración de la Camiseta
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Tipo de Camiseta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo
                    </label>
                    <select
                      value={shirt3D.type}
                      onChange={(e) => updateShirt3D('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="crew-neck">Cuello Redondo</option>
                      <option value="v-neck">Cuello V</option>
                      <option value="polo">Polo</option>
                      <option value="tank-top">Tirantes</option>
                      <option value="long-sleeve">Manga Larga</option>
                    </select>
                  </div>

                  {/* Color de la Camiseta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      value={shirt3D.color}
                      onChange={(e) => updateShirt3D('color', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
                    />
                  </div>

                  {/* Talla */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Talla
                    </label>
                    <select
                      value={shirt3D.size}
                      onChange={(e) => updateShirt3D('size', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>

                  {/* Material */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material
                    </label>
                    <select
                      value={shirt3D.material}
                      onChange={(e) => updateShirt3D('material', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="cotton">Algodón</option>
                      <option value="polyester">Poliéster</option>
                      <option value="blend">Mezcla</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Historial de Diseños */}
              {generatedImages.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="bg-yellow-100 p-2 rounded-lg mr-3">🎨</span>
                    Diseños Generados
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {generatedImages.map((image) => (
                      <div
                        key={image.id}
                        className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all ${
                          currentDesign?.id === image.id
                            ? 'ring-4 ring-purple-500 scale-105'
                            : 'hover:scale-105'
                        }`}
                        onClick={() => {
                          setCurrentDesign(image);
                          updateShirt3D('design', image);
                        }}
                      >
                        <img
                          src={image.url}
                          alt={`Diseño: ${image.prompt}`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-white/90 rounded-lg p-2">
                            <p className="text-xs font-medium text-gray-800 truncate">
                              {image.prompt}
                            </p>
                            <p className="text-xs text-gray-600">
                              ${image.cost} MXN • {image.provider}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Panel Lateral */}
            <div className="space-y-6">
              {/* Resumen de Costos */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-green-100 p-2 rounded-lg mr-3">💰</span>
                  Resumen de Costos
                </h3>
                
                {(() => {
                  const costs = calculateTotalCost();
                  return (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Generación IA ({aiProvider}):</span>
                        <span className="font-semibold">${costs.ai} MXN</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Camiseta base:</span>
                        <span className="font-semibold">${costs.shirt} MXN</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Envío:</span>
                        <span className="font-semibold">${costs.shipping} MXN</span>
                      </div>
                      <hr className="my-3" />
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-gray-900">Total:</span>
                        <span className="font-bold text-purple-600">${costs.total} MXN</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Acciones */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-3">⚡</span>
                  Acciones
                </h3>
                
                <div className="space-y-3">
                  <button
                    disabled={!currentDesign}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
                  >
                    <span className="mr-2">💾</span>
                    Guardar Diseño
                  </button>
                  
                  <button
                    disabled={!currentDesign}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
                  >
                    <span className="mr-2">📤</span>
                    Compartir
                  </button>
                  
                  <button
                    disabled={!currentDesign}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
                  >
                    <span className="mr-2">🛒</span>
                    Agregar al Carrito
                  </button>
                </div>
              </div>

              {/* Información del Diseño Actual */}
              {currentDesign && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-orange-100 p-2 rounded-lg mr-3">ℹ️</span>
                    Diseño Actual
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Prompt:</label>
                      <p className="text-gray-900">{currentDesign.prompt}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Estilo:</label>
                      <p className="text-gray-900 capitalize">{currentDesign.style}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Paleta:</label>
                      <p className="text-gray-900 capitalize">{currentDesign.palette}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Proveedor:</label>
                      <p className="text-gray-900 capitalize">{currentDesign.provider}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Costo:</label>
                      <p className="text-gray-900 font-semibold">${currentDesign.cost} MXN</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Design;
