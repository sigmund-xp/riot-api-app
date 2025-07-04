import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import matchesRouter from './routes/matches.route.js'
import summonerRouter from './routes/summoner.route.js'

const app = express()

const corsOptions = {
  origin: [process.env.ORIGIN1, process.env.ORIGIN2],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true
}

// Middlewares
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/matches', matchesRouter)
app.use('/api/summoner', summonerRouter)

// Rate limiting básico
const rateLimit = {}
app.use((req, res, next) => {
  const ip = req.ip
  const now = Date.now()

  if (!rateLimit[ip]) {
    rateLimit[ip] = []
  }

  // Limpiar requests antiguos (más de 2 minutos)
  rateLimit[ip] = rateLimit[ip].filter(time => now - time < 120000)

  if (rateLimit[ip].length >= 100) {
    return res.status(429).json({ error: 'Demasiadas peticiones' })
  }

  rateLimit[ip].push(now)
  next()
})

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

const PORT = process.env.PORT || 3000
try {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`)
  })
} catch (error) {
  console.error('Error al iniciar el servidor:', error)
  process.exit(1)
}
