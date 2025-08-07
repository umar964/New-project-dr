const axios = require('axios');

const getLocationByCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        format: "json",
        lat: latitude,
        lon: longitude
      },
      headers: {
        "User-Agent": "Healify",
        "Accept": "application/json"
      }
    });

    const address = response.data.address;
    // console.log("full address",address);
    const shortLocation = `${address.suburb || address.road || address.village  || address.hamlet|| ''},${address.city || address.state || ''}`

    return shortLocation ;

  } catch (err) {
    console.error("❌ Error in getLocationByCoordinates:", err.message);
    return null;
  }
};

module.exports = getLocationByCoordinates;
