// import riotApi from '../services/riotApi.js'

// Obtener información de invocador
export const getInfo = async (req, res) => {
  try {
    const { summonerName, region } = req.params

    // Validación básica
    if (!summonerName || !region) {
      return res.status(400).json({ error: 'Parámetros inválidos' })
    }

    // ... resto del código
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
      details: error.response?.data || null
    })
  }
}
