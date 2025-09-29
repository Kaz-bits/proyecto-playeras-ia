import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Gallery.module.css';

const Gallery = () => {
  const [designs, setDesigns] = useState([]);
  const [filter, setFilter] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo para la galería (sin cambios en la lógica)
  const mockDesigns = [
    {
      id: 1,
      title: "Astronauta Synthwave",
      author: "DesignMaster2024",
      likes: 342,
      views: 1250,
      tags: ["synthwave", "astronauta", "neon"],
      image: "https://placehold.co/400x400/4F46E5/FFFFFF?text=Astronauta+Synthwave",
      price: "$24.99",
      aiProvider: "midjourney",
      createdAt: "2024-03-15"
    },
    {
      id: 2,
      title: "Dragón Cyberpunk",
      author: "CyberArtist",
      likes: 289,
      views: 987,
      tags: ["dragon", "cyberpunk", "neon"],
      image: "https://placehold.co/400x400/7C3AED/FFFFFF?text=Dragon+Cyber",
      price: "$22.49",
      aiProvider: "gemini",
      createdAt: "2024-03-14"
    },
    {
      id: 3,
      title: "Bosque Místico",
      author: "NatureVibes",
      likes: 156,
      views: 654,
      tags: ["naturaleza", "mistico", "bosque"],
      image: "https://placehold.co/400x400/10B981/FFFFFF?text=Bosque+Mistico",
      price: "$21.80",
      aiProvider: "gemini",
      createdAt: "2024-03-13"
    },
    {
      id: 4,
      title: "Samurai Futurista",
      author: "TokyoDesigner",
      likes: 445,
      views: 1876,
      tags: ["samurai", "futurista", "anime"],
      image: "https://placehold.co/400x400/EF4444/FFFFFF?text=Samurai+Future",
      price: "$26.50",
      aiProvider: "midjourney",
      createdAt: "2024-03-12"
    },
    {
      id: 5,
      title: "Océano de Nebulosas",
      author: "CosmicCreator",
      likes: 198,
      views: 743,
      tags: ["espacio", "nebulosa", "oceano"],
      image: "https://placehold.co/400x400/3B82F6/FFFFFF?text=Nebulosa+Ocean",
      price: "$23.99",
      aiProvider: "gemini",
      createdAt: "2024-03-11"
    },
    {
      id: 6,
      title: "Gato Pixel Art",
      author: "RetroGamer",
      likes: 267,
      views: 892,
      tags: ["pixel", "gato", "retro"],
      image: "https://placehold.co/400x400/F59E0B/FFFFFF?text=Pixel+Cat",
      price: "$19.99",
      aiProvider: "gemini",
      createdAt: "2024-03-10"
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setDesigns(mockDesigns);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  }).sort((a, b) => {
    switch (filter) {
      case 'trending':
        return b.likes - a.likes;
      case 'recent':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'popular':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const handleLike = (designId) => {
    setDesigns(prev => prev.map(design => 
      design.id === designId 
        ? { ...design, likes: design.likes + 1 }
        : design
    ));
  };

  return (
    <>
      <Head>
        <title>Galería de la Comunidad - Proyecto Playeras IA</title>
        <meta name="description" content="Explora diseños únicos creados por nuestra comunidad" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* ELIMINADO: script de Tailwind CDN */}
        {/* ELIMINADO: Links de Google Fonts - ahora están en _document.js */}
      </Head>
      
      {/* ELIMINADO: style jsx global - ahora usa módulos CSS o clases de Tailwind */}

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center">
                <svg className="h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                <span className="ml-3 text-2xl font-bold text-white">ImagiTee</span>
              </Link>
              <nav className="flex items-center space-x-6 text-sm font-medium text-gray-300">
                <Link href="/designer" className="hover:text-indigo-400 transition-colors">
                  Diseñar
                </Link>
                <Link href="/gallery" className="text-indigo-400">
                  Galería
                </Link>
                <Link href="/faq" className="hover:text-indigo-400 transition-colors">
                  FAQ
                </Link>
                <Link href="/cart" className="relative hover:text-indigo-400 transition-colors">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Título y descripción */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              🎨 Galería de la Comunidad
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Descubre diseños únicos creados por nuestra increíble comunidad de artistas digitales
            </p>
          </div>

          {/* Controles de filtro y búsqueda */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar diseños, etiquetas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2">
              {[
                { key: 'trending', label: '🔥 Trending', icon: '🔥' },
                { key: 'recent', label: '🆕 Recientes', icon: '🆕' },
                { key: 'popular', label: '⭐ Populares', icon: '⭐' }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === filterOption.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de diseños */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDesigns.map(design => (
                <div key={design.id} className={`${styles.designCard} bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:transform hover:translate-y-[-5px] hover:shadow-2xl transition-all duration-300`}>
                  <div className="relative">
                    <img
                      src={design.image}
                      alt={design.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white">
                      {design.aiProvider === 'midjourney' ? '🎨 MJ' : '🔷 GM'}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-white">{design.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">por {design.author}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {design.tags.map(tag => (
                        <span key={tag} className="bg-gray-700 text-xs px-2 py-1 rounded-full text-gray-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <button 
                          onClick={() => handleLike(design.id)}
                          className="flex items-center space-x-1 hover:text-red-400 transition"
                        >
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{design.likes}</span>
                        </button>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{design.views}</span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-indigo-400">
                        {design.price}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <Link href={`/designer?template=${design.id}`} className="flex-1">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition text-sm">
                          🎨 Personalizar
                        </button>
                      </Link>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition text-sm">
                        🛒
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredDesigns.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-white">No se encontraron diseños</h3>
              <p className="text-gray-400">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Gallery;