require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/playeras-ia',
  JWT_SECRET: process.env.JWT_SECRET || 'tu_jwt_secret_muy_seguro',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  MIDJOURNEY_API_KEY: process.env.MIDJOURNEY_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development'
};
