import React from 'react';
import Head from 'next/head';

const Cart = () => {
  return (
    <>
      <Head>
        <title>Carrito de Compras - Proyecto Playeras IA</title>
        <meta name="description" content="Revisa tus diseños y procede al checkout" />
      </Head>
      <div className="cart">
        <h1>Carrito de Compras</h1>
        <p>Revisa tus diseños antes de proceder al checkout</p>
        {/* Aquí irá el carrito de compras */}
      </div>
    </>
  );
};

export default Cart;
