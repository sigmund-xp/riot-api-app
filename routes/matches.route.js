import { Router } from 'express'
import { detailMatch, historial } from '../controllers/matches.controller.js'

const router = Router()

router.get('/details/:matchId', detailMatch)
router.get('/:puuid', historial)

export default router
