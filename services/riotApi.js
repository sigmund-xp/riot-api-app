const axios = require('axios');
const config = require('../config/riot');

class RiotApiService {
  constructor() {
    this.apiKey = process.env.RIOT_API_KEY;
    this.headers = {
      'X-Riot-Token': this.apiKey
    };
  }

  async getSummonerByName(summonerName, region = 'la1') {
    try {
      const regionUrl = config.regions[region];
      const response = await axios.get(
        `${regionUrl}/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRankedData(summonerId, region = 'la1') {
    try {
      const regionUrl = config.regions[region];
      const response = await axios.get(
        `${regionUrl}/lol/league/v4/entries/by-summoner/${summonerId}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatchHistory(puuid, count = 20) {
    try {
      const response = await axios.get(
        `${config.baseURL}/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMatchDetails(matchId) {
    try {
      const response = await axios.get(
        `${config.baseURL}/lol/match/v5/matches/${matchId}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      return {
        status,
        message: data.status?.message || 'Error en la API de Riot',
        code: data.status?.status_code
      };
    }
    return { status: 500, message: 'Error de conexión' };
  }
}

module.exports = new RiotApiService();