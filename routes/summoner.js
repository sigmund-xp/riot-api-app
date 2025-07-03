const express = require('express');
const router = express.Router();
const riotApi = require('../services/riotApi');

// Obtener información de invocador
router.get('/:region/:summonerName', async (req, res) => {
  try {
    const { summonerName, region } = req.params;
    
    // Obtener datos básicos del summoner
    const summonerData = await riotApi.getSummonerByName(summonerName, region);
    
    // Obtener datos de ranked
    const rankedData = await riotApi.getRankedData(summonerData.id, region);
    
    res.json({
      summoner: summonerData,
      ranked: rankedData
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

module.exports = router;