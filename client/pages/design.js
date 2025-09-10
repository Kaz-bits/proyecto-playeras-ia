import React, { useEffect, useState } from 'react';
import Head from 'next/head';

const Design = () => {
  const [currentDesign, setCurrentDesign] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiProvider, setAiProvider] = useState('gemini');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedPalette, setSelectedPalette] = useState('vibrant');
  const [avatarConfig, setAvatarConfig] = useState({
    bodyType: 'athletic',
    skinTone: '#e6a788',
    hairStyle: 'short',
    gender: 'male',
    shirtColor: '#4F46E5',
    shirtSize: 'M'
  });

  const generateDesign = async () => {
    const prompt = document.getElementById('prompt').value;
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // Simulación de llamada a API de IA
    try {
      const requestData = {
        prompt: prompt,
        style: selectedStyle,
        palette: selectedPalette,
        provider: aiProvider
      };
      
      // TODO: Implementar llamada real a API
      setTimeout(() => {
        const newImages = [
          { id: Date.now(), url: `https://placehold.co/300x300/4F46E5/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 20))}`, prompt },
          { id: Date.now() + 1, url: `https://placehold.co/300x300/7C3AED/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 20))}`, prompt }
        ];
        setGeneratedImages(prev => [...newImages, ...prev]);
        setIsGenerating(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating design:', error);
      setIsGenerating(false);
    }
  };

  const updateAvatarConfig = (key, value) => {
    setAvatarConfig(prev => ({ ...prev, [key]: value }));
  };

  const addToCart = () => {
    const cartItem = {
      design: currentDesign,
      avatarConfig,
      price: calculatePrice(),
      timestamp: Date.now()
    };
    
    // TODO: Implementar lógica de carrito
    console.log('Adding to cart:', cartItem);
    alert(`Diseño agregado al carrito - Total: $${calculatePrice()}`);
  };

  const calculatePrice = () => {
    const aiCost = aiProvider === 'midjourney' ? 2.50 : 1.80; // Costo por uso de IA
    const shirtCost = 15.99; // Costo base de playera
    const shippingCost = 5.99; // Costo de envío
    return (aiCost + shirtCost + shippingCost).toFixed(2);
  };
  useEffect(() => {
    // Esta función se ejecutará después de que el componente se monte
    const initThreeJS = async () => {
      if (typeof window !== 'undefined') {
        // Importación dinámica de Three.js para evitar problemas de SSR
        const THREE = await import('three');
        
        const container = document.getElementById('canvas-container');
        if (!container) return;

        // --- 1. Configuración de la Escena ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1F2937);

        // --- 2. Configuración de la Cámara ---
        const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 1.5, 4);

        // --- 3. Configuración del Renderer ---
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // --- 4. Iluminación ---
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        // --- 5. Crear un Avatar Simple (Placeholder) ---
        // Cuerpo
        const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.8, 1.5, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xE0A158 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.75;
        scene.add(body);

        // Cabeza
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({ color: 0xE0A158 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2;
        scene.add(head);

        // Playera
        const shirtGeometry = new THREE.CylinderGeometry(0.65, 0.85, 1.6, 8);
        const shirtMaterial = new THREE.MeshPhongMaterial({ color: 0x4F46E5 });
        const shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
        shirt.position.y = 0.8;
        scene.add(shirt);

        // Suelo
        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x1F2937 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.5;
        scene.add(floor);

        // --- 6. Función de Animación ---
        function animate() {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        }

        animate();

        // Cleanup function
        return () => {
          if (container && renderer.domElement) {
            container.removeChild(renderer.domElement);
          }
          renderer.dispose();
        };
      }
    };

    initThreeJS();

    // Lógica para botones de opción
    const optionButtons = document.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
      const handleClick = () => {
        const parent = button.closest('.grid');
        if (parent) {
          parent.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('active'));
        }
        button.classList.add('active');
      };
      button.addEventListener('click', handleClick);
    });

    // Cleanup event listeners
    return () => {
      optionButtons.forEach(button => {
        button.removeEventListener('click', () => {});
      });
    };
  }, []);

  return (
    <>
      <Head>
        <title>Estudio de Diseño de Playeras con IA</title>
        <meta name="description" content="Crea diseños únicos con nuestro estudio de diseño IA" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #111827;
          color: #F9FAFB;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1F2937;
        }
        ::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
        .control-panel-section {
          background-color: #1F2937;
          border-radius: 0.75rem;
          padding: 1rem;
          border: 1px solid #374151;
        }
        .btn-primary {
          background-color: #4F46E5;
          color: white;
          font-weight: 600;
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
          transition: background-color 0.2s ease-in-out;
        }
        .btn-primary:hover {
          background-color: #4338CA;
        }
        .option-button {
          border: 2px solid #374151;
          transition: all 0.2s ease-in-out;
        }
        .option-button.active, .option-button:hover {
          border-color: #4F46E5;
          background-color: #3730A3;
        }
        #canvas-container canvas {
          display: block;
          width: 100%;
          height: 100%;
        }
      `}</style>

      <div className="antialiased">
        <div className="flex flex-col h-screen">
          {/* Header */}
          <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <svg className="h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                  <span className="ml-3 text-2xl font-bold">ImagiTee</span>
                </div>
                <div className="flex items-center space-x-6 text-sm font-medium text-gray-300">
                  <a href="#" className="hover:text-indigo-400 transition-colors">Galería</a>
                  <a href="#" className="hover:text-indigo-400 transition-colors">Duelos</a>
                  <a href="#" className="hover:text-indigo-400 transition-colors">FAQ</a>
                  <button className="relative">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content: Paneles de Diseño */}
          <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden">
            {/* Panel Izquierdo: Controles de IA */}
            <aside className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto">
              <div className="control-panel-section space-y-4">
                <h2 className="text-lg font-semibold">🤖 Generador de IA</h2>
                <textarea 
                  id="prompt" 
                  className="w-full h-24 bg-gray-900 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none" 
                  placeholder="Ej: Un astronauta surfeando en un océano de nebulosas, estilo synthwave..."
                />
                
                {/* Selección de Motor de IA */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Motor de IA:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setAiProvider('gemini')}
                      className={`p-2 rounded-md text-sm transition ${aiProvider === 'gemini' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                      🔷 Gemini ($1.80)
                    </button>
                    <button 
                      onClick={() => setAiProvider('midjourney')}
                      className={`p-2 rounded-md text-sm transition ${aiProvider === 'midjourney' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                      🎨 Midjourney ($2.50)
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={generateDesign}
                  disabled={isGenerating}
                  className={`btn-primary w-full flex items-center justify-center ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Generando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.5 7.5L4.5 4.5L2 10L7.5 12L10 17.5L15.5 22L18 13.5L13.5 11L9.5 7.5Z"/>
                        <path d="M22 2L18 6"/>
                      </svg>
                      Generar Diseño
                    </>
                  )}
                </button>
              </div>
              
              {/* Controles Avanzados */}
              <div className="control-panel-section space-y-3">
                <h3 className="text-md font-semibold">🎨 Estilo Artístico</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-center">
                  {[
                    { key: 'realistic', label: 'Realista' },
                    { key: 'anime', label: 'Anime' },
                    { key: 'watercolor', label: 'Acuarela' },
                    { key: 'popart', label: 'Pop-Art' },
                    { key: 'cyberpunk', label: 'Cyberpunk' },
                    { key: 'vintage', label: 'Vintage' }
                  ].map(style => (
                    <button 
                      key={style.key}
                      onClick={() => setSelectedStyle(style.key)}
                      className={`option-button p-2 rounded-md transition ${selectedStyle === style.key ? 'active' : ''}`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-panel-section space-y-3">
                <h3 className="text-md font-semibold">🌈 Paleta de Colores</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-center">
                  {[
                    { key: 'vibrant', label: 'Vibrante' },
                    { key: 'pastel', label: 'Pastel' },
                    { key: 'monochrome', label: 'Monocromático' },
                    { key: 'neon', label: 'Neón' }
                  ].map(palette => (
                    <button 
                      key={palette.key}
                      onClick={() => setSelectedPalette(palette.key)}
                      className={`option-button p-2 rounded-md transition ${selectedPalette === palette.key ? 'active' : ''}`}
                    >
                      {palette.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-panel-section space-y-3">
                <h3 className="text-md font-semibold">📁 Imagen de Referencia</h3>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    id="reference-upload"
                  />
                  <label htmlFor="reference-upload" className="cursor-pointer">
                    <div className="text-gray-400">
                      <svg className="mx-auto h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm">Subir referencia</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="control-panel-section space-y-3">
                <h3 className="text-md font-semibold">🖼️ Diseños Generados</h3>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {generatedImages.map(image => (
                    <img 
                      key={image.id}
                      src={image.url} 
                      alt={`Diseño: ${image.prompt}`}
                      onClick={() => setCurrentDesign(image)}
                      className={`rounded-md cursor-pointer border-2 transition ${currentDesign?.id === image.id ? 'border-indigo-500' : 'border-transparent hover:border-indigo-500'}`}
                    />
                  ))}
                </div>
              </div>
            </aside>

            {/* Panel Central: Visualizador 3D */}
            <div className="lg:col-span-6 bg-gray-900 rounded-lg flex flex-col items-center justify-center border border-gray-700 relative overflow-hidden">
              <div id="canvas-container" className="w-full h-full">
                {/* El canvas de Three.js se insertará aquí */}
              </div>
              <div className="absolute bottom-4 bg-gray-800/50 backdrop-blur-sm p-2 rounded-full flex space-x-2">
                <button className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-indigo-600 transition" title="Zoom In">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-indigo-600 transition" title="Zoom Out">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-indigo-600 transition" title="Reset Camera">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 2v6h6"/>
                    <path d="M21 12A9 9 0 0 0 6 5.3L3 8"/>
                    <path d="M21 22v-6h-6"/>
                    <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Panel Derecho: Personalización del Avatar */}
            <aside className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto">
              <div className="control-panel-section space-y-4">
                <h2 className="text-lg font-semibold">👤 Personaliza tu Avatar</h2>
                <div className="text-sm text-gray-400">
                  Precio total: <span className="text-white font-bold">${calculatePrice()}</span>
                </div>
              </div>
              
              <div className="control-panel-section space-y-3">
                <h3 className="text-md font-semibold">⚡ Tipo de Cuerpo</h3>
                <div className="grid grid-cols-3 gap-2 text-sm text-center">
                  {[
                    { key: 'slim', label: 'Delgado', icon: '🪶' },
                    { key: 'athletic', label: 'Atlético', icon: '💪' },
                    { key: 'robust', label: 'Robusto', icon: '🏋️' }
                  ].map(type => (
                    <button 
                      key={type.key}
                      onClick={() => updateAvatarConfig('bodyType', type.key)}
                      className={`option-button p-2 rounded-md transition ${avatarConfig.bodyType === type.key ? 'active' : ''}`}
                    >
                      <div>{type.icon}</div>
                      <div>{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-panel-section space-y-3">
                <h3 className="text-md font-semibold">👫 Género</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-center">
                  {[
                    { key: 'male', label: 'Masculino', icon: '👨' },
                    { key: 'female', label: 'Femenino', icon: '👩' }
                  ].map(gender => (
                    <button 
                      key={gender.key}
                      onClick={() => updateAvatarConfig('gender', gender.key)}
                      className={`option-button p-2 rounded-md transition ${avatarConfig.gender === gender.key ? 'active' : ''}`}
                    >
                      <div>{gender.icon}</div>
                      <div>{gender.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-panel-section space-y-3">
                <h3 className="text-md font-semibold">🎨 Tono de Piel</h3>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { color: '#f9d4b8', name: 'Claro' },
                    { color: '#e6a788', name: 'Medio' },
                    { color: '#d08c6d', name: 'Bronceado' },
                    { color: '#a05e46', name: 'Oscuro' },
                    { color: '#5c3836', name: 'Profundo' }
                  ].map((skin, index) => (
                    <button 
                      key={index}
                      onClick={() => updateAvatarConfig('skinTone', skin.color)}
                      className={`w-8 h-8 rounded-full border-2 transition ${avatarConfig.skinTone === skin.color ? 'border-indigo-500 scale-110' : 'border-gray-600 hover:border-indigo-400'}`}
                      style={{ backgroundColor: skin.color }}
                      title={skin.name}
                    />
                  ))}
                </div>
              </div>

              <div className="control-panel-section space-y-3">
                <h3 className="text-md font-semibold">💇 Peinado</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-center">
                  {[
                    { key: 'short', label: 'Corto', icon: '✂️' },
                    { key: 'long', label: 'Largo', icon: '🌊' },
                    { key: 'curly', label: 'Rizado', icon: '🌀' },
                    { key: 'tied', label: 'Recogido', icon: '🎀' },
                    { key: 'bald', label: 'Calvo', icon: '🥚' },
                    { key: 'ponytail', label: 'Cola', icon: '🐴' }
                  ].map(hair => (
                    <button 
                      key={hair.key}
                      onClick={() => updateAvatarConfig('hairStyle', hair.key)}
                      className={`option-button p-2 rounded-md transition ${avatarConfig.hairStyle === hair.key ? 'active' : ''}`}
                    >
                      <div>{hair.icon}</div>
                      <div>{hair.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-panel-section space-y-3">
                <h3 className="text-md font-semibold">📏 Talla de Playera</h3>
                <div className="grid grid-cols-3 gap-2 text-sm text-center">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button 
                      key={size}
                      onClick={() => updateAvatarConfig('shirtSize', size)}
                      className={`option-button p-2 rounded-md transition ${avatarConfig.shirtSize === size ? 'active' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-panel-section space-y-3">
                <h3 className="text-md font-semibold">🎨 Color de Playera</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { color: '#FFFFFF', name: 'Blanco' },
                    { color: '#000000', name: 'Negro' },
                    { color: '#4F46E5', name: 'Índigo' },
                    { color: '#EF4444', name: 'Rojo' },
                    { color: '#10B981', name: 'Verde' },
                    { color: '#F59E0B', name: 'Amarillo' },
                    { color: '#8B5CF6', name: 'Morado' },
                    { color: '#EC4899', name: 'Rosa' },
                    { color: '#6B7280', name: 'Gris' },
                    { color: '#DC2626', name: 'Rojo Oscuro' },
                    { color: '#059669', name: 'Verde Oscuro' },
                    { color: '#1E40AF', name: 'Azul' }
                  ].map((shirt, index) => (
                    <button 
                      key={index}
                      onClick={() => updateAvatarConfig('shirtColor', shirt.color)}
                      className={`w-8 h-8 rounded-full border-2 transition ${avatarConfig.shirtColor === shirt.color ? 'border-indigo-500 scale-110' : 'border-gray-600 hover:border-indigo-400'}`}
                      style={{ backgroundColor: shirt.color }}
                      title={shirt.name}
                    />
                  ))}
                </div>
              </div>

              <div className="control-panel-section space-y-3">
                <h3 className="text-md font-semibold">💰 Desglose de Precio</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>IA ({aiProvider}):</span>
                    <span>${aiProvider === 'midjourney' ? '2.50' : '1.80'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Playera:</span>
                    <span>$15.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span>$5.99</span>
                  </div>
                  <hr className="border-gray-600" />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${calculatePrice()}</span>
                  </div>
                </div>
              </div>

              <div className="control-panel-section">
                <button 
                  onClick={addToCart}
                  disabled={!currentDesign}
                  className={`btn-primary w-full flex items-center justify-center ${!currentDesign ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  🛒 Agregar al Carrito
                </button>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </>
  );
};

export default Design;

