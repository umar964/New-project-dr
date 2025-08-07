const checkRainStatus = require('../utils/checkRainStatus');
function isPeakHour() {
  const hour = new Date().getHours();
  return (hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21); // lunch/dinner peak hours
}

async function calculateDeliveryCharge(distanceKm,lat,lon) {
    
  const baseCharge = 20;
  const perKmCharge = 8;
  const extraDistance = distanceKm > 2 ? distanceKm - 2 : 0;
  const distanceCharge = extraDistance * perKmCharge;

  let total = baseCharge + distanceCharge;

  if (isPeakHour()) {
    total *= 1.5; // peak hour multiplier
  }

  const isRaining = await checkRainStatus(lat,lon);
  
  if (isRaining) {
    total *= 1.3; // rain multiplier
  }

  return Math.ceil(total);
}

module.exports = calculateDeliveryCharge;
