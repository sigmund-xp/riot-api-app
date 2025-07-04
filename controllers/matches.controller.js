import RiotApiService from '../services/riotApi.js'

// Obtener detalles de una partida específica
export const detailMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const matchData = await riotApi.getMatchDetails(matchId);
    
    res.json(matchData);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

// Obtener historial de partidas
export const historial = async (req, res) => {
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
}