const axios = require('axios');

const API_KEY = '39e3d97d4f2476c106080b76551b82db'; // replace with your actual OpenWeather API key
 
async function checkRainStatus(lat,lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await axios.get(url);
    

    const weather = response.data.weather;
    const isRaining = weather.some(w => w.main.toLowerCase().includes('rain'));

    return isRaining;
  } catch (err) {
    console.error("Weather API error:", err.message);
    return false; // fallback if API fails
  }
}

module.exports = checkRainStatus;
