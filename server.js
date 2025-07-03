require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting básico
const rateLimit = {};
app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!rateLimit[ip]) {
    rateLimit[ip] = [];
  }
  
  // Limpiar requests antiguos (más de 2 minutos)
  rateLimit[ip] = rateLimit[ip].filter(time => now - time < 120000);
  
  if (rateLimit[ip].length >= 100) {
    return res.status(429).json({ error: 'Demasiadas peticiones' });
  }
  
  rateLimit[ip].push(now);
  next();
});

// Rutas
const summonerRoutes = require('./routes/summoner');
const matchesRoutes = require('./routes/matches');

app.use('/api/summoner', summonerRoutes);
app.use('/api/matches', matchesRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});