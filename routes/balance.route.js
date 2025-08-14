import { Router } from 'express'

import { getBalance } from '../controllers/balance.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = Router()

// Obtener Saldo
router.get('/', verifyToken, getBalance)

export default router
