import React, { useState, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber';
import { OrbitControls, Center, Environment, ContactShadows, Decal, useTexture, Html, PerspectiveCamera } from '@react-three/drei';
import { HexColorPicker } from 'react-colorful';
import { Upload, Palette, Type, Sparkles, Download, ShoppingCart, Brush, Shirt, Save, Share2, ChevronLeft, ChevronRight, Loader2, Camera, RotateCw, ZoomIn, ZoomOut, Move, User } from 'lucide-react';

// Modelo 3D de la Playera
const TShirtModel = ({ color, design, textConfig, shirtStyle }) => {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  
  // Simular diferentes estilos de playera con geometría
  const getShirtGeometry = () => {
    const scale = shirtStyle.includes('long') ? [1, 1.2, 1] : [1, 1, 1];
    const position = shirtStyle.includes('vneck') ? [0, -0.1, 0] : [0, 0, 0];
    return { scale, position };
  };

  const { scale, position } = getShirtGeometry();
  
  // Textura del diseño si existe
  const texture = design ? useLoader(THREE.TextureLoader, design) : null;
  
  useFrame((state, delta) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group scale={scale} position={position}>
      <Center>
        <mesh
          ref={meshRef}
          castShadow
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <boxGeometry args={[3, 4, 0.5]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
          
          {/* Diseño aplicado como decal */}
          {texture && (
            <Decal
              position={[0, 0.5, 0.26]}
              rotation={[0, 0, 0]}
              scale={[2, 2, 1]}
            >
              <meshBasicMaterial map={texture} transparent />
            </Decal>
          )}
          
          {/* Texto 3D */}
          {textConfig.text && (
            <Html
              position={[0, -0.5, 0.26]}
              center
              distanceFactor={10}
              style={{
                color: textConfig.color,
                fontSize: `${textConfig.size}px`,
                fontFamily: textConfig.font,
                fontWeight: 'bold',
                userSelect: 'none',
              }}
            >
              {textConfig.text}
            </Html>
          )}
        </mesh>
        
        {/* Mangas */}
        {!shirtStyle.includes('tank') && (
          <>
            <mesh position={[-2, 0.5, 0]} rotation={[0, 0, -0.5]} castShadow>
              <boxGeometry args={[1.5, shirtStyle.includes('long') ? 2.5 : 1, 0.5]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
            <mesh position={[2, 0.5, 0]} rotation={[0, 0, 0.5]} castShadow>
              <boxGeometry args={[1.5, shirtStyle.includes('long') ? 2.5 : 1, 0.5]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
          </>
        )}
      </Center>
    </group>
  );
};

// Avatar Realista 3D
const RealisticAvatar = ({ wearing, shirtColor, shirtStyle, gender, skinTone, bodyType }) => {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Escala del cuerpo basada en el tipo
  const bodyScale = bodyType === 'slim' ? [0.9, 1, 0.9] : 
                    bodyType === 'athletic' ? [1.1, 1, 1] : [1, 1, 1];

  return (
    <group ref={meshRef} scale={bodyScale}>
      <Center>
        {/* Cabeza */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial color={skinTone} roughness={0.5} />
        </mesh>
        
        {/* Cuerpo */}
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1, 3, 32]} />
          <meshStandardMaterial color={wearing ? shirtColor : skinTone} roughness={0.5} />
        </mesh>
        
        {/* Brazos */}
        <mesh position={[-1.5, 1.5, 0]} rotation={[0, 0, -0.3]} castShadow>
          <cylinderGeometry args={[0.3, 0.25, 2.5, 16]} />
          <meshStandardMaterial color={skinTone} roughness={0.5} />
        </mesh>
        <mesh position={[1.5, 1.5, 0]} rotation={[0, 0, 0.3]} castShadow>
          <cylinderGeometry args={[0.3, 0.25, 2.5, 16]} />
          <meshStandardMaterial color={skinTone} roughness={0.5} />
        </mesh>
        
        {/* Piernas */}
        <mesh position={[-0.5, -2, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.35, 3, 16]} />
          <meshStandardMaterial color="#2a3f5f" roughness={0.7} />
        </mesh>
        <mesh position={[0.5, -2, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.35, 3, 16]} />
          <meshStandardMaterial color="#2a3f5f" roughness={0.7} />
        </mesh>
        
        {/* Playera si está usando */}
        {wearing && (
          <group position={[0, 1, 0.6]} scale={[0.4, 0.4, 0.4]}>
            <TShirtModel color={shirtColor} design={null} textConfig={{}} shirtStyle={shirtStyle} />
          </group>
        )}
      </Center>
    </group>
  );
};

// Panel de Herramientas de Dibujo
const DrawingTools = ({ onDraw, onText, onClear }) => {
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef();

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (onDraw && canvasRef.current) {
      onDraw(canvasRef.current.toDataURL());
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Brush className="w-5 h-5" />
        Herramientas de Dibujo
      </h3>
      
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="border border-gray-300 rounded-lg mb-3 cursor-crosshair bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Tamaño:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(e.target.value)}
            className="flex-1"
          />
          <span className="text-sm">{brushSize}px</span>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Color:</label>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            className="w-12 h-8 rounded cursor-pointer"
          />
        </div>
        
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            onClear && onClear();
          }}
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

// Componente Principal
const TShirtDesigner = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [shirtColor, setShirtColor] = useState('#ffffff');
  const [uploadedDesign, setUploadedDesign] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [textConfig, setTextConfig] = useState({
    text: '',
    color: '#000000',
    size: 24,
    font: 'Arial'
  });
  const [shirtStyle, setShirtStyle] = useState('regular');
  const [viewMode, setViewMode] = useState('shirt'); // 'shirt' o 'avatar'
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [avatarConfig, setAvatarConfig] = useState({
    gender: 'male',
    skinTone: '#f5deb3',
    bodyType: 'regular',
    wearing: true
  });
  
  const fileInputRef = useRef();

  // Estilos de playera disponibles
  const shirtStyles = [
    { id: 'regular', name: 'Regular', icon: '👕' },
    { id: 'vneck', name: 'Cuello V', icon: '🔻' },
    { id: 'long', name: 'Manga Larga', icon: '🦾' },
    { id: 'tank', name: 'Sin Mangas', icon: '💪' },
    { id: 'polo', name: 'Polo', icon: '🎾' }
  ];

  // Colores predefinidos
  const presetColors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#808080', '#ff6b6b'
  ];

  // Tallas disponibles
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  // Manejar carga de archivo
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedDesign(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generar diseño con IA (simulado)
  const generateAIDesign = async () => {
    if (!aiPrompt) return;
    
    setIsGeneratingAI(true);
    // Simular llamada a API
    setTimeout(() => {
      // Aquí iría la integración real con Gemini/Midjourney
      const mockDesign = `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
          <rect width="200" height="200" fill="hsl(${Math.random() * 360}, 70%, 50%)"/>
          <text x="100" y="100" text-anchor="middle" fill="white" font-size="20">
            ${aiPrompt}
          </text>
        </svg>
      `)}`;
      setUploadedDesign(mockDesign);
      setIsGeneratingAI(false);
    }, 2000);
  };

  // Guardar diseño
  const saveDesign = () => {
    const newDesign = {
      id: Date.now(),
      color: shirtColor,
      design: uploadedDesign,
      text: textConfig,
      style: shirtStyle,
      timestamp: new Date().toISOString()
    };
    setSavedDesigns([...savedDesigns, newDesign]);
    // Aquí iría la integración con Firebase
  };

  // Compartir diseño
  const shareDesign = () => {
    // Implementar compartir en redes sociales o generar link
    alert('Función de compartir - Link copiado al portapapeles');
  };

  // Agregar al carrito
  const addToCart = () => {
    // Implementar lógica de e-commerce
    alert('Añadido al carrito - Redirigiendo a checkout...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shirt className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">T-Shirt Designer Pro</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={saveDesign}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
            <button
              onClick={shareDesign}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
            <button
              onClick={addToCart}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Comprar - $29.99
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Vista 3D */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-4">
              {/* Controles de Vista */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('shirt')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      viewMode === 'shirt' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Shirt className="w-4 h-4 inline mr-2" />
                    Playera
                  </button>
                  <button
                    onClick={() => setViewMode('avatar')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      viewMode === 'avatar' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Avatar
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Vista 3D */}
              <div className="h-[500px] bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg">
                <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
                  <Suspense fallback={
                    <Html center>
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </Html>
                  }>
                    <ambientLight intensity={0.5} />
                    <directionalLight
                      position={[10, 10, 5]}
                      intensity={1}
                      castShadow
                      shadow-mapSize-width={1024}
                      shadow-mapSize-height={1024}
                    />
                    
                    {viewMode === 'shirt' ? (
                      <TShirtModel
                        color={shirtColor}
                        design={uploadedDesign}
                        textConfig={textConfig}
                        shirtStyle={shirtStyle}
                      />
                    ) : (
                      <RealisticAvatar
                        wearing={avatarConfig.wearing}
                        shirtColor={shirtColor}
                        shirtStyle={shirtStyle}
                        gender={avatarConfig.gender}
                        skinTone={avatarConfig.skinTone}
                        bodyType={avatarConfig.bodyType}
                      />
                    )}
                    
                    <OrbitControls
                      enablePan={true}
                      enableZoom={true}
                      enableRotate={true}
                      minDistance={5}
                      maxDistance={20}
                    />
                    <Environment preset="city" />
                    <ContactShadows
                      position={[0, -4, 0]}
                      opacity={0.5}
                      scale={10}
                      blur={2}
                    />
                  </Suspense>
                </Canvas>
              </div>
              
              {/* Selector de Estilos */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Estilo de Playera</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {shirtStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setShirtStyle(style.id)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
                        shirtStyle === style.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{style.icon}</span>
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Controles */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('design')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'design'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Palette className="w-4 h-4 inline mr-1" />
                  Diseño
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'ai'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  IA
                </button>
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'text'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Type className="w-4 h-4 inline mr-1" />
                  Texto
                </button>
              </div>

              {/* Contenido de las Tabs */}
              {activeTab === 'design' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color de Playera
                    </label>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {presetColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setShirtColor(color)}
                          className={`w-10 h-10 rounded-lg border-2 ${
                            shirtColor === color ? 'border-indigo-600' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <HexColorPicker
                      color={shirtColor}
                      onChange={setShirtColor}
                      style={{ width: '100%', height: '150px' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subir Diseño
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors"
                    >
                      <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click para subir imagen
                      </span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Talla
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {sizes.map(size => (
                        <button
                          key={size}
                          className="py-2 border border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-sm font-medium"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe tu diseño
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="4"
                      placeholder="Ej: Un dragón japonés con flores de cerezo..."
                    />
                  </div>
                  
                  <button
                    onClick={generateAIDesign}
                    disabled={!aiPrompt || isGeneratingAI}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingAI ? (
                      <>
                        <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        Generar con IA
                      </>
                    )}
                  </button>
                  
                  <div className="text-xs text-gray-500">
                    Powered by Gemini & Midjourney API
                  </div>
                </div>
              )}

              {activeTab === 'text' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto
                    </label>
                    <input
                      type="text"
                      value={textConfig.text}
                      onChange={(e) => setTextConfig({...textConfig, text: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Escribe tu texto aquí"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color del Texto
                    </label>
                    <input
                      type="color"
                      value={textConfig.color}
                      onChange={(e) => setTextConfig({...textConfig, color: e.target.value})}
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamaño: {textConfig.size}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={textConfig.size}
                      onChange={(e) => setTextConfig({...textConfig, size: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuente
                    </label>
                    <select
                      value={textConfig.font}
                      onChange={(e) => setTextConfig({...textConfig, font: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Comic Sans MS">Comic Sans MS</option>
                      <option value="Impact">Impact</option>
                      <option value="Trebuchet MS">Trebuchet MS</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Panel de Avatar (solo visible en modo avatar) */}
            {viewMode === 'avatar' && (
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personalizar Avatar
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Género
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAvatarConfig({...avatarConfig, gender: 'male'})}
                        className={`py-2 rounded-lg border-2 transition-colors ${
                          avatarConfig.gender === 'male' 
                            ? 'border-indigo-600 bg-indigo-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        Masculino
                      </button>
                      <button
                        onClick={() => setAvatarConfig({...avatarConfig, gender: 'female'})}
                        className={`py-2 rounded-lg border-2 transition-colors ${
                          avatarConfig.gender === 'female' 
                            ? 'border-indigo-600 bg-indigo-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        Femenino
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tono de Piel
                    </label>
                    <div className="flex gap-2">
                      {['#ffdbac', '#f5deb3', '#e0ac69', '#c68642', '#8d5524'].map(tone => (
                        <button
                          key={tone}
                          onClick={() => setAvatarConfig({...avatarConfig, skinTone: tone})}
                          className={`w-10 h-10 rounded-full border-2 ${
                            avatarConfig.skinTone === tone ? 'border-indigo-600' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: tone }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Cuerpo
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setAvatarConfig({...avatarConfig, bodyType: 'slim'})}
                        className={`py-2 rounded-lg border-2 transition-colors text-sm ${
                          avatarConfig.bodyType === 'slim' 
                            ? 'border-indigo-600 bg-indigo-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        Delgado
                      </button>
                      <button
                        onClick={() => setAvatarConfig({...avatarConfig, bodyType: 'regular'})}
                        className={`py-2 rounded-lg border-2 transition-colors text-sm ${
                          avatarConfig.bodyType === 'regular' 
                            ? 'border-indigo-600 bg-indigo-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        Regular
                      </button>
                      <button
                        onClick={() => setAvatarConfig({...avatarConfig, bodyType: 'athletic'})}
                        className={`py-2 rounded-lg border-2 transition-colors text-sm ${
                          avatarConfig.bodyType === 'athletic' 
                            ? 'border-indigo-600 bg-indigo-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        Atlético
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Usando playera</span>
                    <button
                      onClick={() => setAvatarConfig({...avatarConfig, wearing: !avatarConfig.wearing})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        avatarConfig.wearing ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        avatarConfig.wearing ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Panel de Herramientas de Dibujo */}
            <DrawingTools
              onDraw={(drawing) => setUploadedDesign(drawing)}
              onClear={() => setUploadedDesign(null)}
            />
          </div>
        </div>

        {/* Galería de Diseños Guardados */}
        {savedDesigns.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Diseños Guardados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {savedDesigns.map((design) => (
                <div
                  key={design.id}
                  className="bg-white rounded-lg shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    setShirtColor(design.color);
                    setUploadedDesign(design.design);
                    setTextConfig(design.text);
                    setShirtStyle(design.style);
                  }}
                >
                  <div
                    className="h-24 rounded-md mb-2"
                    style={{ backgroundColor: design.color }}
                  />
                  <p className="text-xs text-gray-500">
                    {new Date(design.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información del Producto */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-2">📦 Envío Gratis</h3>
            <p className="text-sm text-gray-600">En pedidos mayores a $50 USD</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-2">🎨 Diseño Único</h3>
            <p className="text-sm text-gray-600">Crea tu propia obra de arte</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-2">✨ Calidad Premium</h3>
            <p className="text-sm text-gray-600">100% algodón de alta calidad</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-3">Sobre Nosotros</h4>
              <p className="text-sm text-gray-400">
                Creamos playeras personalizadas con tecnología de vanguardia y diseños únicos.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Enlaces Rápidos</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">Catálogo</a></li>
                <li><a href="#" className="hover:text-white">Mis Diseños</a></li>
                <li><a href="#" className="hover:text-white">Ayuda</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Soporte</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Guía de Tallas</a></li>
                <li><a href="#" className="hover:text-white">Devoluciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Contacto</h4>
              <p className="text-sm text-gray-400">
                Email: support@tshirtdesigner.com<br />
                Tel: +1 234 567 890
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2025 T-Shirt Designer Pro. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TShirtDesigner;