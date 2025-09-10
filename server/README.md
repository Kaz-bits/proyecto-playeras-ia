# Servidor API - Playeras con IA

API backend para la plataforma de generación de diseños de playeras con inteligencia artificial.

## 🌟 Características Principales

- **Generación de Diseños con IA**: Integración con Gemini y Midjourney
- **Galería Comunitaria**: Sistema de likes, comentarios y compartir
- **Batallas de Diseños**: Competencias en tiempo real entre diseños
- **Sistema de Moderación**: Filtrado automático de contenido inapropiado
- **Autenticación JWT**: Sistema seguro de autenticación y autorización
- **E-commerce**: Gestión de carritos, pagos y órdenes
- **Avatares 3D**: Personalización completa de avatares para preview

## 🛠️ Tecnologías

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** para autenticación
- **Rate Limiting** para seguridad
- **Helmet** para headers de seguridad
- **CORS** configurado
- **Morgan** para logging

## 📁 Estructura del Proyecto

```
server/
├── controllers/          # Lógica de negocio
│   ├── designController.js
│   ├── battleController.js
│   └── authController.js
├── models/              # Modelos de MongoDB
│   ├── Design.js
│   ├── Battle.js
│   └── User.js
├── routes/              # Definición de rutas
│   ├── designs.js
│   ├── battles.js
│   └── auth.js
├── middleware/          # Middlewares personalizados
│   └── auth.js
├── utils/               # Utilidades
│   ├── contentModeration.js
│   └── aiProviders.js
├── config/              # Configuraciones
└── server.js           # Archivo principal
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd proyecto-playeras-ia/server
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/playeras-ia
JWT_SECRET=tu_jwt_secret_muy_seguro
GEMINI_API_KEY=tu_api_key_de_gemini
MIDJOURNEY_API_KEY=tu_api_key_de_midjourney
```

### 4. Iniciar MongoDB
```bash
# Con Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# O instalar MongoDB localmente
```

### 5. Ejecutar el servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📚 API Endpoints

### 🔐 Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil

### 🎨 Diseños
- `POST /api/designs/generate` - Generar diseño con IA
- `GET /api/designs/public` - Obtener diseños públicos
- `GET /api/designs/user/:userId` - Diseños de usuario
- `POST /api/designs/like/:designId` - Dar like
- `POST /api/designs/report/:designId` - Reportar diseño

### ⚔️ Batallas
- `GET /api/battles/active` - Batallas activas
- `POST /api/battles` - Crear batalla
- `POST /api/battles/:battleId/vote` - Votar en batalla
- `GET /api/battles/:battleId` - Detalles de batalla

### 🏥 Sistema
- `GET /api/health` - Estado del servidor
- `GET /` - Información de la API

## 🔧 Configuración de IA

### Gemini AI
1. Obtén tu API key de [Google AI Studio](https://ai.google.dev/)
2. Agrega `GEMINI_API_KEY` a tu archivo `.env`
3. Costo aproximado: $1.80 por generación

### Midjourney
1. Obtén acceso a la API de Midjourney
2. Agrega `MIDJOURNEY_API_KEY` a tu archivo `.env`
3. Costo aproximado: $2.50 por generación

## 🛡️ Sistema de Moderación

El sistema incluye moderación automática que filtra:

- ✅ **Violencia**: Palabras relacionadas con violencia, armas, etc.
- ✅ **Contenido Inapropiado**: Sexual, drogas, apuestas
- ✅ **Discurso de Odio**: Racismo, discriminación
- ✅ **Derechos de Autor**: Marcas registradas, personajes
- ✅ **Información Personal**: Teléfonos, emails, direcciones

## 📊 Rate Limiting

- **Generación de diseños**: 10 por 15 minutos
- **Likes**: 30 por minuto
- **Votos en batallas**: 20 por minuto
- **Reportes**: 5 por hora
- **Global**: 1000 requests por 15 minutos

## 🔒 Seguridad

- Helmet.js para headers de seguridad
- Rate limiting configurable
- Validación de entrada con Mongoose
- Autenticación JWT con expiración
- CORS configurado para dominios específicos
- Moderación de contenido automática

## 🚀 Deployment

### Variables de Entorno Importantes
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/playeras-ia
JWT_SECRET=clave_super_segura_para_produccion
CORS_ORIGIN=https://tu-dominio.com
```

### MongoDB Atlas
1. Crea un cluster en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Obtén la URI de conexión
3. Actualiza `MONGODB_URI` en tu `.env`

### Heroku Deployment
```bash
heroku create tu-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=tu_mongodb_uri
heroku config:set JWT_SECRET=tu_jwt_secret
git push heroku main
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Coverage
npm run test:coverage

# Test de endpoints
npm run test:api
```

## 📝 Logs

Los logs se almacenan en:
- Desarrollo: Console
- Producción: Archivos + servicios externos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- 📧 Email: soporte@tu-dominio.com
- 📚 Documentación: [URL de docs]
- 🐛 Reportar bugs: [GitHub Issues]

## 🎯 Roadmap

- [ ] Integración con más proveedores de IA
- [ ] Sistema de suscripciones
- [ ] API de webhooks
- [ ] Dashboard de administración
- [ ] Métricas y analytics avanzados
- [ ] Notificaciones push
- [ ] Sistema de recompensas
- [ ] Marketplace de diseños
