import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Home = () => {
  return (
    <>
      <Head>
        <title>Proyecto Playeras IA - Homepage</title>
        <meta name="description" content="Diseña playeras únicas con inteligencia artificial" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          margin: 0;
          color: white;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Bienvenido a Proyecto Playeras IA
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-2xl mx-auto">
            Diseña playeras únicas con el poder de la inteligencia artificial. 
            Crea, personaliza y visualiza tus diseños en tiempo real.
          </p>
          
          <div className="space-y-6">
            <Link href="/design">
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl">
                🎨 Comenzar a Diseñar
              </button>
            </Link>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-2">IA Generativa</h3>
                <p className="text-gray-300">Genera diseños únicos con prompts de texto</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="text-xl font-semibold mb-2">Avatar 3D</h3>
                <p className="text-gray-300">Visualiza tu diseño en un modelo 3D personalizable</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-4xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold mb-2">Compra Fácil</h3>
                <p className="text-gray-300">Ordena tu playera personalizada directamente</p>
              </div>
            </div>
            
                <div className="flex items-center space-x-6 text-sm font-medium text-gray-300">
                  <Link href="/gallery" className="text-gray-300 hover:text-white mx-4 transition-colors">
                    Ver Galería
                  </Link>
                  <Link href="/battles" className="text-gray-300 hover:text-white mx-4 transition-colors">
                    Duelos Épicos
                  </Link>
                  <Link href="/faq" className="text-gray-300 hover:text-white mx-4 transition-colors">
                    FAQ
                  </Link>
                </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
