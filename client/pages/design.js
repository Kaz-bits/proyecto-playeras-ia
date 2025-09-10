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
  const [viewMode, setViewMode] = useState('front');
  const [isRotating, setIsRotating] = useState(false);
  const [background3D, setBackground3D] = useState('studio');
  const [showOnlyShirt, setShowOnlyShirt] = useState(false); // Toggle para mostrar solo playera o avatar+playera
  const [activePanel, setActivePanel] = useState('generator'); // Para navegación fluida
  
  // Estados para el carrito y diseños
  const [cart, setCart] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);

  // Referencias para el canvas 3D
  const canvas3DRef = useRef(null);

  // Conversión de costos a pesos mexicanos (1 USD = 18 MXN aproximadamente)
  const AI_COSTS_MXN = {
    gemini: 32.40,
    midjourney: 45.00,
    openai: 54.00
  };

  const SHIRT_COSTS_MXN = {
    base: 287.82,
    shipping: 107.82
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
    renderAvatar3D();
  };

  // Función para actualizar configuración de la camiseta 3D
  const updateShirt3D = (key, value) => {
    setShirt3D(prev => ({
      ...prev,
      [key]: value
    }));
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
    if (canvas3DRef.current) {
      const ctx = canvas3DRef.current.getContext('2d');
      ctx.clearRect(0, 0, 400, 500);
      drawSimpleAvatar(ctx);
    }
  };

  // Función para dibujar avatar simplificado
  const drawSimpleAvatar = (ctx) => {
    const centerX = 200;
    const centerY = 250;
    
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
    renderAvatar3D();
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

  // Helper functions
  const addToCart = () => {
    if (!selectedDesign) return;
    
    const newItem = {
      id: Date.now(),
      name: `Playera personalizada - ${selectedDesign.prompt.slice(0, 30)}...`,
      price: 120 + AI_COSTS_MXN[aiProvider],
      size: shirt3D.size,
      material: shirt3D.material,
      design: selectedDesign
    };
    
    setCart([...cart, newItem]);
    alert('¡Diseño agregado al carrito! 🛒');
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const selectDesign = (design) => {
    setSelectedDesign(design);
    setCurrentDesign(design);
    updateShirt3D('design', design);
  };

  const calculateTotalCost = () => {
    const ai = selectedDesign ? AI_COSTS_MXN[aiProvider] : 0;
    const shirt = 120;
    const shipping = 50;
    const total = ai + shirt + shipping;
    
    return { ai, shirt, shipping, total };
  };

  return (
    <>
      <Head>
        <title>Estudio de Diseño con IA - Playeras Personalizadas</title>
        <meta name="description" content="Crea diseños únicos para playeras usando inteligencia artificial" />
      </Head>

      {/* Custom Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #0a0a0f;
          color: #ffffff;
          overflow-x: hidden;
        }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 24px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .glass-button {
          background: rgba(139, 92, 246, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-button:hover {
          background: rgba(139, 92, 246, 0.25);
          border-color: rgba(139, 92, 246, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(139, 92, 246, 0.2);
        }
        
        .holographic-gradient {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 25%,
            #a855f7 50%,
            #ec4899 75%,
            #f59e0b 100%
          );
          background-size: 300% 300%;
          animation: holographicShift 8s ease-in-out infinite;
        }
        
        @keyframes holographicShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .neon-glow {
          box-shadow: 
            0 0 20px rgba(139, 92, 246, 0.3),
            0 0 40px rgba(139, 92, 246, 0.2),
            0 0 80px rgba(139, 92, 246, 0.1);
        }
        
        .toggle-switch {
          position: relative;
          width: 60px;
          height: 30px;
          background: rgba(55, 65, 81, 0.8);
          border-radius: 25px;
          border: 1px solid rgba(139, 92, 246, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .toggle-switch.active {
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
        }
        
        .toggle-slider {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .toggle-switch.active .toggle-slider {
          transform: translateX(30px);
          background: #f8fafc;
        }
        
        .floating-card {
          transform: translateY(0);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .floating-card:hover {
          transform: translateY(-8px);
        }
        
        .ai-pulse {
          animation: aiPulse 2s ease-in-out infinite;
        }
        
        @keyframes aiPulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
          }
          50% { 
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.8);
          }
        }
        
        .tech-grid {
          background-image: 
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .cyber-input {
          background: rgba(17, 24, 39, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          color: #ffffff;
          transition: all 0.3s ease;
        }
        
        .cyber-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
          outline: none;
        }
        
        .dashboard-nav {
          background: rgba(17, 24, 39, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 tech-grid">
        {/* Navigation Dashboard */}
        <nav className="dashboard-nav sticky top-0 z-50 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="holographic-gradient p-3 rounded-2xl">
                <span className="text-2xl font-bold text-white">🎨</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Design Studio</h1>
                <p className="text-purple-300 text-sm">Powered by Advanced Intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {['generator', 'avatar', 'config'].map((panel) => (
                <button
                  key={panel}
                  onClick={() => setActivePanel(panel)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    activePanel === panel
                      ? 'glass-button text-white'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  {panel === 'generator' ? '🤖 Generador' : 
                   panel === 'avatar' ? '👤 Avatar 3D' : 
                   '⚙️ Configuración'}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Dashboard */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
            
            {/* Central Avatar Display - Takes center stage */}
            <div className="col-span-12 lg:col-span-7 relative">
              <div className="glass-panel p-6 h-full floating-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="holographic-gradient p-2 rounded-lg mr-3 text-white">👤</span>
                    Visualizador 3D Central
                  </h2>
                  
                  {/* Toggle para mostrar solo playera o avatar+playera */}
                  <div className="flex items-center space-x-3">
                    <span className="text-purple-300 text-sm">Solo Playera</span>
                    <div 
                      className={`toggle-switch ${!showOnlyShirt ? 'active' : ''}`}
                      onClick={() => setShowOnlyShirt(!showOnlyShirt)}
                    >
                      <div className="toggle-slider"></div>
                    </div>
                    <span className="text-purple-300 text-sm">Avatar + Playera</span>
                  </div>
                </div>

                <div className="relative h-full max-h-[600px]">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden neon-glow">
                    <div className="holographic-gradient absolute inset-0 opacity-20"></div>
                    <div className="relative bg-gray-900/80 backdrop-filter backdrop-blur-xl h-full flex items-center justify-center rounded-2xl">
                      <canvas
                        ref={canvas3DRef}
                        width="500"
                        height="600"
                        className="rounded-xl shadow-2xl"
                        style={{ 
                          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
                          filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))'
                        }}
                      />
                    </div>
                  </div>

                  {/* Floating Controls */}
                  <div className="absolute top-4 left-4 flex space-x-2">
                    {['front', 'back', 'side-left', 'side-right'].map((view) => (
                      <button
                        key={view}
                        onClick={() => changeView(view)}
                        className={`glass-button px-3 py-2 text-sm font-medium transition-all ${
                          viewMode === view
                            ? 'text-white neon-glow'
                            : 'text-purple-300 hover:text-white'
                        }`}
                      >
                        {view === 'front' ? '👤' : view === 'back' ? '🔄' : 
                         view === 'side-left' ? '↩️' : '↪️'}
                      </button>
                    ))}
                  </div>

                  {/* Bottom Floating Controls */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="glass-panel p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={toggleAutoRotate}
                            className={`glass-button px-4 py-2 font-medium transition-all ${
                              isRotating ? 'neon-glow text-red-300' : 'text-purple-300'
                            }`}
                          >
                            {isRotating ? '⏸️ Parar' : '🔄 Rotar'}
                          </button>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateCamera3D({ zoom: Math.max(0.5, camera3D.zoom - 0.1) })}
                            className="glass-button p-2 text-purple-300 hover:text-white"
                          >
                            🔍➖
                          </button>
                          <span className="text-purple-300 font-mono text-sm bg-gray-800/50 px-3 py-1 rounded-lg">
                            {Math.round(camera3D.zoom * 100)}%
                          </span>
                          <button
                            onClick={() => updateCamera3D({ zoom: Math.min(2.0, camera3D.zoom + 0.1) })}
                            className="glass-button p-2 text-purple-300 hover:text-white"
                          >
                            🔍➕
                          </button>
                        </div>

                        <button
                          onClick={resetCamera}
                          className="glass-button px-4 py-2 text-purple-300 hover:text-white font-medium"
                        >
                          🏠 Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Dynamic Panels */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
              
              {/* AI Generator Panel */}
              {activePanel === 'generator' && (
                <div className="glass-panel p-6 floating-card ai-pulse">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <span className="holographic-gradient p-2 rounded-lg mr-3 text-white">🤖</span>
                    Generador AI
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-purple-300 text-sm mb-2 font-medium">
                        Describe tu visión
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Un dragón holográfico con efectos cyber-punk..."
                        className="w-full px-4 py-3 cyber-input resize-none font-mono text-sm"
                        rows="3"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-purple-300 text-sm mb-2 font-medium">
                          Proveedor AI
                        </label>
                        <select
                          value={aiProvider}
                          onChange={(e) => setAiProvider(e.target.value)}
                          className="w-full px-4 py-3 cyber-input font-mono text-sm"
                        >
                          <option value="gemini">🔮 Gemini - $32.40 MXN</option>
                          <option value="midjourney">🎨 Midjourney - $45.00 MXN</option>
                          <option value="openai">🧠 OpenAI - $54.00 MXN</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-purple-300 text-sm mb-2 font-medium">
                            Estilo
                          </label>
                          <select
                            value={selectedStyle}
                            onChange={(e) => setSelectedStyle(e.target.value)}
                            className="w-full px-3 py-2 cyber-input text-sm"
                          >
                            <option value="realistic">Realista</option>
                            <option value="artistic">Artístico</option>
                            <option value="cartoon">Caricatura</option>
                            <option value="minimalist">Minimalista</option>
                            <option value="vintage">Vintage</option>
                            <option value="abstract">Abstracto</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-purple-300 text-sm mb-2 font-medium">
                            Paleta
                          </label>
                          <select
                            value={selectedPalette}
                            onChange={(e) => setSelectedPalette(e.target.value)}
                            className="w-full px-3 py-2 cyber-input text-sm"
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
                    </div>

                    <button
                      onClick={generateDesign}
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full holographic-gradient hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-2xl"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          <span className="font-mono">Generando...</span>
                        </>
                      ) : (
                        <>
                          <span className="mr-2">✨</span>
                          <span className="font-mono">Generar → ${AI_COSTS_MXN[aiProvider]} MXN</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Avatar Configuration Panel */}
              {activePanel === 'avatar' && (
                <div className="glass-panel p-6 floating-card avatar-glow">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <span className="holographic-gradient p-2 rounded-lg mr-3 text-white">👤</span>
                    Configuración Avatar 3D
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-purple-300 text-sm mb-3 font-medium">
                        Tipo de Cuerpo
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {AVATAR_CONFIG.bodyTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => updateAvatar3D('bodyType', type.id)}
                            className={`glass-button p-4 text-center transition-all ${
                              avatar3D.bodyType === type.id
                                ? 'neon-glow text-white'
                                : 'text-purple-300 hover:text-white'
                            }`}
                          >
                            <div className="text-2xl mb-2">{type.icon}</div>
                            <div className="text-sm font-medium">{type.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-purple-300 text-sm mb-3 font-medium">
                        Tono de Piel
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {AVATAR_CONFIG.skinTones.map((tone) => (
                          <button
                            key={tone.id}
                            onClick={() => updateAvatar3D('skinTone', tone.id)}
                            className={`w-12 h-12 rounded-full border-4 transition-all ${
                              avatar3D.skinTone === tone.id
                                ? 'border-purple-400 neon-glow scale-110'
                                : 'border-gray-600 hover:border-purple-300'
                            }`}
                            style={{ backgroundColor: tone.color }}
                            title={tone.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-purple-300 text-sm mb-3 font-medium">
                        Estilo de Cabello
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {AVATAR_CONFIG.hairStyles.map((hair) => (
                          <button
                            key={hair.id}
                            onClick={() => updateAvatar3D('hairStyle', hair.id)}
                            className={`glass-button p-3 text-center transition-all ${
                              avatar3D.hairStyle === hair.id
                                ? 'neon-glow text-white'
                                : 'text-purple-300 hover:text-white'
                            }`}
                          >
                            <div className="text-xl mb-1">{hair.icon}</div>
                            <div className="text-xs font-medium">{hair.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-purple-300 text-sm mb-3 font-medium">
                        Color de Cabello
                      </label>
                      <input
                        type="color"
                        value={avatar3D.hairColor}
                        onChange={(e) => updateAvatar3D('hairColor', e.target.value)}
                        className="w-full h-12 rounded-xl bg-gray-800/50 border border-purple-500/30 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-purple-300 text-sm mb-3 font-medium">
                        Vello Facial
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {AVATAR_CONFIG.facialHair.map((facial) => (
                          <button
                            key={facial.id}
                            onClick={() => updateAvatar3D('facialHair', facial.id)}
                            className={`glass-button p-3 text-center transition-all ${
                              avatar3D.facialHair === facial.id
                                ? 'neon-glow text-white'
                                : 'text-purple-300 hover:text-white'
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
              )}

              {/* Configuration Panel */}
              {activePanel === 'config' && (
                <div className="glass-panel p-6 floating-card">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <span className="holographic-gradient p-2 rounded-lg mr-3 text-white">⚙️</span>
                    Configuración de Playera
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-purple-300 text-sm mb-2 font-medium">
                        Tipo de Playera
                      </label>
                      <select
                        value={shirt3D.type}
                        onChange={(e) => updateShirt3D('type', e.target.value)}
                        className="w-full px-4 py-3 cyber-input"
                      >
                        <option value="crew-neck">Cuello Redondo</option>
                        <option value="v-neck">Cuello V</option>
                        <option value="polo">Polo</option>
                        <option value="tank-top">Tirantes</option>
                        <option value="long-sleeve">Manga Larga</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-purple-300 text-sm mb-2 font-medium">
                        Color Base
                      </label>
                      <input
                        type="color"
                        value={shirt3D.color}
                        onChange={(e) => updateShirt3D('color', e.target.value)}
                        className="w-full h-12 rounded-xl bg-gray-800/50 border border-purple-500/30 cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-purple-300 text-sm mb-2 font-medium">
                          Talla
                        </label>
                        <select
                          value={shirt3D.size}
                          onChange={(e) => updateShirt3D('size', e.target.value)}
                          className="w-full px-3 py-2 cyber-input text-sm"
                        >
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-purple-300 text-sm mb-2 font-medium">
                          Material
                        </label>
                        <select
                          value={shirt3D.material}
                          onChange={(e) => updateShirt3D('material', e.target.value)}
                          className="w-full px-3 py-2 cyber-input text-sm"
                        >
                          <option value="cotton">Algodón</option>
                          <option value="polyester">Poliéster</option>
                          <option value="blend">Mezcla</option>
                        </select>
                      </div>
                    </div>

                    <div className="glass-panel p-4 mt-6">
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                        <span className="text-green-400 mr-2">💰</span>
                        Resumen de Costos
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">Playera Base:</span>
                          <span className="text-white font-mono">$120.00 MXN</span>
                        </div>
                        {selectedDesign && (
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300">Diseño AI:</span>
                            <span className="text-white font-mono">${AI_COSTS_MXN[aiProvider]} MXN</span>
                          </div>
                        )}
                        <div className="border-t border-purple-500/30 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-bold">Total:</span>
                            <span className="text-green-400 font-bold font-mono">
                              ${selectedDesign ? (120 + AI_COSTS_MXN[aiProvider]).toFixed(2) : '120.00'} MXN
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={addToCart}
                        disabled={!selectedDesign}
                        className="w-full mt-4 holographic-gradient hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        🛒 Agregar al Carrito
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Shopping Cart - Fixed Bottom Panel */}
              <div className="glass-panel p-6 floating-card">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <span className="holographic-gradient p-2 rounded-lg mr-3 text-white">🛒</span>
                  Carrito de Compras
                  {cart.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </h3>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-purple-400 text-6xl mb-4">🛒</div>
                    <p className="text-purple-300">Tu carrito está vacío</p>
                    <p className="text-sm text-purple-400 mt-2">Agrega diseños para empezar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-3">
                      {cart.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 glass-button">
                          <div className="w-12 h-12 holographic-gradient rounded-lg flex items-center justify-center">
                            <span className="text-lg text-white">👕</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white">{item.name}</p>
                            <p className="text-sm text-purple-300">{item.size} • {item.material}</p>
                            <p className="text-sm font-medium text-green-400">${item.price} MXN</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-purple-500/30 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-white">Total:</span>
                        <span className="text-xl font-bold text-green-400 font-mono">
                          ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)} MXN
                        </span>
                      </div>
                      
                      <button
                        onClick={() => {
                          alert('¡Compra realizada con éxito! 🎉\nGracias por tu pedido.');
                          setCart([]);
                        }}
                        className="w-full holographic-gradient hover:scale-105 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        💳 Proceder al Pago
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Generated Designs Display */}
              {generatedImages.length > 0 && (
                <div className="glass-panel p-6 floating-card">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <span className="holographic-gradient p-2 rounded-lg mr-3 text-white">🎨</span>
                    Diseños Generados
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                    {generatedImages.map((image) => (
                      <div
                        key={image.id}
                        className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all ${
                          currentDesign?.id === image.id
                            ? 'neon-glow scale-105'
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
                          className="w-full h-32 object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="glass-panel p-2">
                            <p className="text-xs font-medium text-white truncate">
                              {image.prompt}
                            </p>
                            <p className="text-xs text-purple-300">
                              ${image.cost} MXN • {image.provider}
                            </p>
                          </div>
                        </div>
                        {currentDesign?.id === image.id && (
                          <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                            ✓
                          </div>
                        )}
                      </div>
                    ))}
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
