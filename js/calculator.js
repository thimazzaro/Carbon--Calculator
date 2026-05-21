/**
 * calculator.js
 * Pure calculation logic — no DOM access.
 */

const Calculator = (() => {

  function computeEmission(transportKey, km) {
    const t = CONFIG.transports.find(t => t.key === transportKey);
    return t ? t.factor * km : 0;
  }

  function compareAll(km) {
    return CONFIG.transports
      .map(t => ({ transport: t, co2kg: t.factor * km }))
      .sort((a, b) => a.co2kg - b.co2kg);
  }

  function formatCO2(kg) {
    if (kg === 0) return "0 g CO₂e";
    if (kg < 1)    return (kg * 1000).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) + " g CO₂e";
    if (kg >= 1000) return (kg / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " t CO₂e";
    return kg.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " kg CO₂e";
  }

  function computeCredits(co2kg) {
    const tonnes = co2kg / 1000;
    const { pricePerTonneMin, pricePerTonneMax } = CONFIG.credits;
    return {
      tonnes,
      credits: tonnes,
      costMin: tonnes * pricePerTonneMin,
      costMax: tonnes * pricePerTonneMax,
    };
  }

  function roadDistance(origin, destination) {
    const straight = haversineKm(origin.lat, origin.lng, destination.lat, destination.lng);
    return Math.round(straight * CONFIG.roadFactor);
  }

  return { computeEmission, compareAll, formatCO2, roadDistance, computeCredits };
})();
