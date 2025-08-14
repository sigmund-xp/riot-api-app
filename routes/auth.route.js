import { Router } from 'express'

import { register, login, refreshTokens, logout, registerRiotId, validateRiotId, getCurrentUser } from '../controllers/auth.controller.js'
import { registerValidator, loginValidator } from '../validators/auth.validator.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = Router()

// Registro
router.post('/register', registerValidator, register)
// Login
router.post('/login', loginValidator, login)
// Refresh Token
router.post('/refresh-token', refreshTokens)
// Register Id Riot
router.post('/register-riot', verifyToken, registerRiotId)
// Validate Id Riot
router.post('/validate-riot', verifyToken, validateRiotId)
// Logout
router.post('/logout', verifyToken, logout)
// Obtener usuario actual
router.get('/me', verifyToken, getCurrentUser)

export default router
