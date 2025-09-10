import React from 'react';
import Head from 'next/head';

const FAQ = () => {
  return (
    <>
      <Head>
        <title>Preguntas Frecuentes - Proyecto Playeras IA</title>
        <meta name="description" content="Encuentra respuestas a las preguntas más comunes" />
      </Head>
      <div className="faq">
        <h1>Preguntas Frecuentes</h1>
        <div className="faq-content">
          {/* Aquí irán las preguntas frecuentes */}
          <h3>¿Cómo funciona la IA para generar diseños?</h3>
          <p>Nuestra IA utiliza modelos avanzados para crear diseños únicos basados en tus descripciones.</p>
        </div>
      </div>
    </>
  );
};

export default FAQ;
