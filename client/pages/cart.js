import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo para el carrito
  const mockCartItems = [
    {
      id: 1,
      designTitle: "Astronauta Synthwave",
      designImage: "https://placehold.co/200x200/4F46E5/FFFFFF?text=Astronauta",
      avatarConfig: {
        bodyType: "athletic",
        gender: "male",
        skinTone: "#e6a788",
        shirtSize: "L",
        shirtColor: "#4F46E5"
      },
      aiProvider: "midjourney",
      prices: {
        ai: 2.50,
        shirt: 15.99,
        shipping: 5.99
      },
      quantity: 1,
      addedAt: "2024-03-15"
    },
    {
      id: 2,
      designTitle: "Dragón Cyberpunk",
      designImage: "https://placehold.co/200x200/7C3AED/FFFFFF?text=Dragon",
      avatarConfig: {
        bodyType: "slim",
        gender: "female",
        skinTone: "#d08c6d",
        shirtSize: "M",
        shirtColor: "#000000"
      },
      aiProvider: "gemini",
      prices: {
        ai: 1.80,
        shirt: 15.99,
        shipping: 5.99
      },
      quantity: 2,
      addedAt: "2024-03-14"
    }
  ];

  useEffect(() => {
    // Simular carga desde localStorage o API
    setTimeout(() => {
      setCartItems(mockCartItems);
      setLoading(false);
    }, 500);
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const applyPromoCode = () => {
    const validCodes = {
      'FIRST20': 0.20,
      'STUDENT10': 0.10,
      'WELCOME15': 0.15
    };
    
    if (validCodes[promoCode.toUpperCase()]) {
      setDiscount(validCodes[promoCode.toUpperCase()]);
      alert(`¡Código aplicado! ${validCodes[promoCode.toUpperCase()] * 100}% de descuento`);
    } else {
      alert('Código promocional no válido');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = (item.prices.ai + item.prices.shirt + item.prices.shipping) * item.quantity;
      return total + itemTotal;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = subtotal * discount;
    return subtotal - discountAmount;
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) return;
    
    // TODO: Implementar integración con Stripe/PayPal
    alert(`Procesando pago de $${calculateTotal().toFixed(2)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Carrito de Compras - Proyecto Playeras IA</title>
        <meta name="description" content="Revisa tu carrito y completa tu compra" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

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
                <Link href="/faq" className="hover:text-indigo-400 transition-colors">FAQ</Link>
                <Link href="/cart" className="text-indigo-400">Carrito</Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              🛒 Tu Carrito de Compras
            </h1>
            <p className="text-xl text-gray-300">
              Revisa tus diseños personalizados antes de finalizar la compra
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🛒</div>
              <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
              <p className="text-gray-400 mb-8">¡Empieza a crear diseños increíbles!</p>
              <Link href="/design">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition">
                  🎨 Crear Diseño
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lista de productos */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex gap-6">
                      <img
                        src={item.designImage}
                        alt={item.designTitle}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">{item.designTitle}</h3>
                            <p className="text-sm text-gray-400">
                              IA: {item.aiProvider === 'midjourney' ? '🎨 Midjourney' : '🔷 Gemini'}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Cuerpo: </span>
                            <span>{item.avatarConfig.bodyType}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Género: </span>
                            <span>{item.avatarConfig.gender === 'male' ? 'Masculino' : 'Femenino'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Talla: </span>
                            <span>{item.avatarConfig.shirtSize}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-400">Color: </span>
                            <div 
                              className="w-4 h-4 rounded-full ml-2 border border-gray-600"
                              style={{ backgroundColor: item.avatarConfig.shirtColor }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-400">Cantidad:</span>
                            <div className="flex items-center border border-gray-600 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-1 hover:bg-gray-700 transition"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 border-x border-gray-600">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-1 hover:bg-gray-700 transition"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-indigo-400">
                              ${((item.prices.ai + item.prices.shirt + item.prices.shipping) * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-400">
                              IA: ${item.prices.ai} + Playera: ${item.prices.shirt} + Envío: ${item.prices.shipping}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen de compra */}
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-4">
                  <h3 className="text-xl font-semibold mb-6">Resumen de Compra</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Descuento ({(discount * 100).toFixed(0)}%):</span>
                        <span>-${(calculateSubtotal() * discount).toFixed(2)}</span>
                      </div>
                    )}
                    <hr className="border-gray-600" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-indigo-400">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Código Promocional</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Ej: FIRST20"
                          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <button
                          onClick={applyPromoCode}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                        >
                          Aplicar
                        </button>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Códigos válidos: FIRST20, STUDENT10, WELCOME15
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={proceedToCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition"
                  >
                    💳 Proceder al Pago
                  </button>

                  <div className="mt-4 text-xs text-gray-400 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Compra 100% segura</span>
                    </div>
                    <p>Aceptamos tarjetas de crédito, PayPal y más</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Cart;
