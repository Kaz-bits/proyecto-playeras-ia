import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Battles = () => {
  const [currentBattle, setCurrentBattle] = useState(null);
  const [userVotes, setUserVotes] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo para los duelos
  const mockBattles = [
    {
      id: 1,
      title: "🔥 Batalla Épica: Cyberpunk vs Steampunk",
      description: "¿Qué estilo domina el futuro?",
      design1: {
        id: 'design_1',
        title: "Samurai Cyberpunk",
        author: "CyberNinja2024",
        image: "https://placehold.co/400x400/4F46E5/FFFFFF?text=Cyber+Samurai",
        votes: 342,
        tags: ["cyberpunk", "samurai", "neon"]
      },
      design2: {
        id: 'design_2',
        title: "Inventor Steampunk",
        author: "VictorianMaker",
        image: "https://placehold.co/400x400/8B5A2B/FFFFFF?text=Steam+Inventor",
        votes: 289,
        tags: ["steampunk", "inventor", "vintage"]
      },
      timeLeft: 72, // horas
      status: "active"
    },
    {
      id: 2,
      title: "🌟 Duelo Cósmico: Galaxias vs Nebulosas",
      description: "El espacio nunca fue tan hermoso",
      design1: {
        id: 'design_3',
        title: "Espiral Galáctica",
        author: "CosmicArtist",
        image: "https://placehold.co/400x400/7C3AED/FFFFFF?text=Galaxy+Spiral",
        votes: 156,
        tags: ["galaxia", "espiral", "cosmos"]
      },
      design2: {
        id: 'design_4',
        title: "Nebulosa de Águila",
        author: "StarPainter",
        image: "https://placehold.co/400x400/3B82F6/FFFFFF?text=Eagle+Nebula",
        votes: 198,
        tags: ["nebulosa", "aguila", "estrellas"]
      },
      timeLeft: 45,
      status: "active"
    },
    {
      id: 3,
      title: "🎨 Clash Artístico: Anime vs Realismo",
      description: "Dos mundos, un ganador",
      design1: {
        id: 'design_5',
        title: "Guerrera Anime",
        author: "OtakuDesigner",
        image: "https://placehold.co/400x400/EF4444/FFFFFF?text=Anime+Warrior",
        votes: 445,
        tags: ["anime", "guerrera", "manga"]
      },
      design2: {
        id: 'design_6',
        title: "Retrato Fotorrealista",
        author: "RealistMaster",
        image: "https://placehold.co/400x400/10B981/FFFFFF?text=Photo+Real",
        votes: 387,
        tags: ["realismo", "retrato", "fotografia"]
      },
      timeLeft: 12,
      status: "ending_soon"
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setCurrentBattle(mockBattles[0]);
      setLoading(false);
    }, 1000);
  }, []);

  const vote = (battleId, designId) => {
    if (userVotes.has(battleId)) {
      alert('Ya has votado en esta batalla');
      return;
    }

    setUserVotes(prev => new Set([...prev, battleId]));
    
    // Actualizar votos (simulado)
    setCurrentBattle(prev => {
      if (prev.id === battleId) {
        const updated = { ...prev };
        if (updated.design1.id === designId) {
          updated.design1.votes += 1;
        } else {
          updated.design2.votes += 1;
        }
        return updated;
      }
      return prev;
    });

    alert('¡Voto registrado! Gracias por participar 🗳️');
  };

  const getTimeLeftText = (hours) => {
    if (hours < 24) {
      return `${hours}h restantes`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h restantes`;
  };

  const getWinnerPercentage = (design1Votes, design2Votes) => {
    const total = design1Votes + design2Votes;
    if (total === 0) return { design1: 50, design2: 50 };
    return {
      design1: Math.round((design1Votes / total) * 100),
      design2: Math.round((design2Votes / total) * 100)
    };
  };

  return (
    <>
      <Head>
        <title>Duelos de Diseño - Proyecto Playeras IA</title>
        <meta name="description" content="Participa en épicas batallas de diseño y vota por tu favorito" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #111827;
          color: #F9FAFB;
        }
        .battle-card {
          transition: all 0.3s ease;
        }
        .battle-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }
        .vote-button {
          transition: all 0.3s ease;
        }
        .vote-button:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(79, 70, 229, 0.4);
        }
        .percentage-bar {
          transition: width 0.5s ease;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
          50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.8); }
        }
        .ending-soon {
          animation: pulse-glow 2s infinite;
        }
      `}</style>

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
                <span className="ml-3 text-2xl font-bold">ImagiTee</span>
              </Link>
              <nav className="flex items-center space-x-6 text-sm font-medium text-gray-300">
                <Link href="/design" className="hover:text-indigo-400 transition-colors">Diseñar</Link>
                <Link href="/gallery" className="hover:text-indigo-400 transition-colors">Galería</Link>
                <Link href="/battles" className="text-indigo-400">Duelos</Link>
                <Link href="/faq" className="hover:text-indigo-400 transition-colors">FAQ</Link>
                <Link href="/cart" className="hover:text-indigo-400 transition-colors">🛒</Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              ⚔️ Duelos de Diseño
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              ¡Las batallas más épicas del arte digital! Vota por tu diseño favorito y ayuda a decidir quién se corona como el maestro del diseño.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {/* Batalla Principal */}
              {currentBattle && (
                <div className={`bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 mb-12 border-2 ${currentBattle.status === 'ending_soon' ? 'border-red-500 ending-soon' : 'border-gray-700'}`}>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">{currentBattle.title}</h2>
                    <p className="text-gray-300 mb-4">{currentBattle.description}</p>
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${currentBattle.status === 'ending_soon' ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'}`}>
                      ⏰ {getTimeLeftText(currentBattle.timeLeft)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Diseño 1 */}
                    <div className="text-center">
                      <div className="battle-card bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <img
                          src={currentBattle.design1.image}
                          alt={currentBattle.design1.title}
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">{currentBattle.design1.title}</h3>
                        <p className="text-gray-400 mb-3">por {currentBattle.design1.author}</p>
                        
                        <div className="flex flex-wrap gap-1 justify-center mb-4">
                          {currentBattle.design1.tags.map(tag => (
                            <span key={tag} className="bg-gray-700 text-xs px-2 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="text-2xl font-bold text-indigo-400 mb-4">
                          {currentBattle.design1.votes} votos
                        </div>

                        <button
                          onClick={() => vote(currentBattle.id, currentBattle.design1.id)}
                          disabled={userVotes.has(currentBattle.id)}
                          className={`vote-button w-full py-3 px-6 rounded-lg font-bold transition ${
                            userVotes.has(currentBattle.id)
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          {userVotes.has(currentBattle.id) ? '✅ Votado' : '🗳️ Votar por este'}
                        </button>
                      </div>
                    </div>

                    {/* VS */}
                    <div className="text-center lg:order-none order-first">
                      <div className="bg-gradient-to-r from-red-500 to-purple-600 text-white text-4xl font-bold py-4 px-8 rounded-full inline-block shadow-2xl">
                        VS
                      </div>
                      
                      {/* Barra de porcentajes */}
                      <div className="mt-6 space-y-2">
                        {(() => {
                          const percentages = getWinnerPercentage(currentBattle.design1.votes, currentBattle.design2.votes);
                          return (
                            <>
                              <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                                <div 
                                  className="percentage-bar bg-indigo-500 h-full"
                                  style={{ width: `${percentages.design1}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>{percentages.design1}%</span>
                                <span>{percentages.design2}%</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Diseño 2 */}
                    <div className="text-center">
                      <div className="battle-card bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <img
                          src={currentBattle.design2.image}
                          alt={currentBattle.design2.title}
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">{currentBattle.design2.title}</h3>
                        <p className="text-gray-400 mb-3">por {currentBattle.design2.author}</p>
                        
                        <div className="flex flex-wrap gap-1 justify-center mb-4">
                          {currentBattle.design2.tags.map(tag => (
                            <span key={tag} className="bg-gray-700 text-xs px-2 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="text-2xl font-bold text-purple-400 mb-4">
                          {currentBattle.design2.votes} votos
                        </div>

                        <button
                          onClick={() => vote(currentBattle.id, currentBattle.design2.id)}
                          disabled={userVotes.has(currentBattle.id)}
                          className={`vote-button w-full py-3 px-6 rounded-lg font-bold transition ${
                            userVotes.has(currentBattle.id)
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          {userVotes.has(currentBattle.id) ? '✅ Votado' : '🗳️ Votar por este'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de Batallas */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-6 text-center">🔥 Todas las Batallas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockBattles.map(battle => (
                    <div 
                      key={battle.id} 
                      className={`battle-card bg-gray-800 rounded-lg p-6 border cursor-pointer ${
                        battle.status === 'ending_soon' ? 'border-red-500' : 'border-gray-700'
                      }`}
                      onClick={() => setCurrentBattle(battle)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold">{battle.title}</h3>
                        <div className={`px-2 py-1 rounded text-xs ${
                          battle.status === 'ending_soon' ? 'bg-red-600' : 'bg-indigo-600'
                        }`}>
                          {getTimeLeftText(battle.timeLeft)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <img 
                          src={battle.design1.image} 
                          alt={battle.design1.title}
                          className="w-full h-24 object-cover rounded"
                        />
                        <img 
                          src={battle.design2.image} 
                          alt={battle.design2.title}
                          className="w-full h-24 object-cover rounded"
                        />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-2">
                          {battle.design1.votes + battle.design2.votes} votos totales
                        </div>
                        <button className="text-indigo-400 hover:text-indigo-300 transition">
                          Ver batalla →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-4">¿Tienes un diseño épico?</h2>
                <p className="text-gray-300 mb-6">
                  ¡Únete a la batalla! Crea tu propio diseño y desafía a otros artistas
                </p>
                <Link href="/design">
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition">
                    🎨 Crear mi Diseño
                  </button>
                </Link>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default Battles;
