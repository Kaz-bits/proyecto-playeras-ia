import React from 'react';
import Head from 'next/head';
import AIControls from '../components/designer/AIControls';
import AvatarCustomizer from '../components/designer/AvatarCustomizer';
import Scene from '../components/3d/Scene';

const Design = () => {
  return (
    <>
      <Head>
        <title>Estudio de Diseño - Proyecto Playeras IA</title>
        <meta name="description" content="Crea diseños únicos con nuestro estudio de diseño IA" />
      </Head>
      <div className="design-studio">
        <h1>Estudio de Diseño</h1>
        <div className="design-layout">
          <div className="controls-panel">
            <AIControls />
            <AvatarCustomizer />
          </div>
          <div className="preview-panel">
            <Scene />
          </div>
        </div>
      </div>
    </>
  );
};

export default Design;
