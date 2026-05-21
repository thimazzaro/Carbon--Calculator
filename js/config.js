/**
 * config.js
 * Transport emission factors (kg CO2e/km) and app settings.
 * Sources: IPCC AR6, EPA GHG Equivalencies, DEFRA 2023.
 */

const CONFIG = {
  roadFactor: 1.35, // applied to straight-line distance to estimate road km

  transports: [
    {
      key: "bicicleta",
      label: "Bicicleta",
      icon: "🚲",
      color: "#16a34a",
      colorLight: "#dcfce7",
      factor: 0,
      note: "por pessoa · emissão zero"
    },
    {
      key: "carro",
      label: "Carro",
      icon: "🚗",
      color: "#d97706",
      colorLight: "#fef9c3",
      factor: 0.192,
      note: "gasolina · 1 passageiro"
    },
    {
      key: "onibus",
      label: "Ônibus",
      icon: "🚌",
      color: "#2563eb",
      colorLight: "#eff6ff",
      factor: 0.089,
      note: "rodoviário · por passageiro"
    },
    {
      key: "caminhao",
      label: "Caminhão",
      icon: "🚛",
      color: "#dc2626",
      colorLight: "#fff1f2",
      factor: 0.620,
      note: "frete · por veículo"
    }
  ]
};
