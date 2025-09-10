import React from 'react';
import Head from 'next/head';

const Home = () => {
  return (
    <>
      <Head>
        <title>Proyecto Playeras IA - Homepage</title>
        <meta name="description" content="Diseña playeras únicas con inteligencia artificial" />
      </Head>
      <div className="homepage">
        <h1>Bienvenido a Proyecto Playeras IA</h1>
        <p>Diseña playeras únicas con el poder de la inteligencia artificial</p>
      </div>
    </>
  );
};

export default Home;
