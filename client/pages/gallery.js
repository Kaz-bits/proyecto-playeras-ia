import React from 'react';
import Head from 'next/head';

const Gallery = () => {
  return (
    <>
      <Head>
        <title>Galería de la Comunidad - Proyecto Playeras IA</title>
        <meta name="description" content="Explora diseños increíbles creados por nuestra comunidad" />
      </Head>
      <div className="gallery">
        <h1>Galería de la Comunidad</h1>
        <p>Descubre diseños increíbles creados por otros usuarios</p>
        {/* Aquí irá la galería de diseños */}
      </div>
    </>
  );
};

export default Gallery;
