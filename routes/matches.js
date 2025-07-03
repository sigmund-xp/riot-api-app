const express = require('express');
const router = express.Router();
const riotApi = require('../services/riotApi');

// Obtener historial de partidas
router.get('/:puuid', async (req, res) => {
  try {
    const { puuid } = req.params;
    const { count = 10 } = req.query;
    
    const matchIds = await riotApi.getMatchHistory(puuid, count);
    
    // Obtener detalles de las partidas
    const matchPromises = matchIds.map(id => riotApi.getMatchDetails(id));
    const matches = await Promise.all(matchPromises);
    
    res.json({
      totalMatches: matchIds.length,
      matches
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Obtener detalles de una partida específica
router.get('/details/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const matchData = await riotApi.getMatchDetails(matchId);
    
    res.json(matchData);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

module.exports = router;