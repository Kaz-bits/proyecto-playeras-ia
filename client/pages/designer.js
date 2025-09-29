// IMPORTANTE: Este archivo debe guardarse como designer.js (minúsculas)
// Importa el componente Designer desde la carpeta components

import dynamic from 'next/dynamic';
import Head from 'next/head';

// Importación dinámica para evitar problemas con SSR y Three.js
const DesignerComponent = dynamic(
  () => import('../components/designer/TShirtDesigner'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-white">Cargando diseñador 3D...</p>
        </div>
      </div>
    )
  }
);

export default function DesignerPage() {
  return (
    <>
      <Head>
        <title>Diseñador de Playeras 3D - Proyecto IA</title>
        <meta name="description" content="Diseña tu playera personalizada con IA y visualízala en 3D" />
      </Head>
      <DesignerComponent />
    </>
  );
}