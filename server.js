import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRouter from './routes/auth.route.js'
import balanceRouter from './routes/balance.route.js'
import { connectDB } from './database/db.js'

connectDB()
const app = express()

const whitelist = [
  'http://localhost:8080',
  'https://touni-cl-web.onrender.com',
  'https://www.tudominio.com'
]

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      console.log(origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    console.log(`${req.method.padEnd(10, ' ')} ${req.headers.origin.padEnd(50, ' ')} ${req.originalUrl.padEnd(30, ' ')} - ${res.statusCode} - ${res.message || ''} (${Date.now() - start}ms)`)
  })
  next()
})

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// Rutas
app.use('/api/auth', authRouter)
app.use('/api/balance', balanceRouter)

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Algo salió mal' })
})

// Iniciar servidor
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
