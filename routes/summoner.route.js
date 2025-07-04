import { Router } from 'express'
import { getInfo } from '../controllers/summoner.controller.js'

const router = Router()

// Ruta con validación explícita de parámetros
router.get('/:region/:summonerName', getInfo)

export default router
