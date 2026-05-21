/**
 * app.js
 * State management and event wiring.
 */

(function () {
  const state = {
    mode: "cities",          // "cities" | "manual"
    originCity:  null,
    destCity:    null,
    manualKm:    null,
    transport:   null,       // transport key or "all"
  };

  /* ── Element refs ── */
  const tabCities        = document.getElementById("tab-cities");
  const tabManual        = document.getElementById("tab-manual");
  const panelCities      = document.getElementById("panel-cities");
  const panelManual      = document.getElementById("panel-manual");
  const manualKmInput    = document.getElementById("manual-km");
  const cityDistBadge    = document.getElementById("city-distance-badge");
  const cityError        = document.getElementById("city-error");
  const transportGrid    = document.getElementById("transport-grid");
  const calcBtn          = document.getElementById("calc-btn");
  const resultsSection   = document.getElementById("results-section");
  const resultsContent   = document.getElementById("results-content");
  const creditsSection   = document.getElementById("credits-section");
  const creditsContent   = document.getElementById("credits-content");

  /* ── Autocomplete ── */
  const originAC = UI.makeAutocomplete(
    "origin-input", "origin-dropdown",
    city => { state.originCity = city; onCityChange(); },
    ()   => { state.originCity = null; onCityChange(); },
    ()   => switchMode("manual")
  );
  const destAC = UI.makeAutocomplete(
    "dest-input", "dest-dropdown",
    city => { state.destCity = city; onCityChange(); },
    ()   => { state.destCity = null; onCityChange(); },
    ()   => switchMode("manual")
  );

  /* ── Transport cards ── */
  renderTransportCards();
  transportGrid.addEventListener("click", e => {
    const card = e.target.closest(".transport-card");
    if (!card) return;
    const key = card.dataset.key;
    state.transport = state.transport === key ? null : key;
    renderTransportCards();
    updateCalcBtn();
  });

  /* ── Tab switching ── */
  tabCities.addEventListener("click", () => switchMode("cities"));
  tabManual.addEventListener("click",  () => switchMode("manual"));

  /* ── Manual km ── */
  manualKmInput.addEventListener("input", () => {
    state.manualKm = parseInt(manualKmInput.value) || null;
    updateCalcBtn();
  });

  /* ── Calculate ── */
  calcBtn.addEventListener("click", calculate);

  /* ── Functions ── */

  function switchMode(mode) {
    state.mode = mode;
    tabCities.classList.toggle("active", mode === "cities");
    tabManual.classList.toggle("active", mode === "manual");
    panelCities.hidden = mode !== "cities";
    panelManual.hidden = mode !== "manual";
    resultsSection.hidden = true;
    creditsSection.hidden = true;
    updateCalcBtn();
  }

  function onCityChange() {
    cityError.hidden = true;
    cityDistBadge.hidden = true;
    const { originCity, destCity } = state;
    if (originCity && destCity) {
      if (originCity.name === destCity.name && originCity.state === destCity.state) {
        cityError.textContent = "Origem e destino devem ser cidades diferentes.";
        cityError.hidden = false;
      } else {
        const km = Calculator.roadDistance(originCity, destCity);
        cityDistBadge.textContent = `📏 Distância estimada: ${km.toLocaleString("pt-BR")} km`;
        cityDistBadge.hidden = false;
      }
    }
    updateCalcBtn();
  }

  function getDistanceKm() {
    if (state.mode === "cities") {
      const { originCity, destCity } = state;
      if (!originCity || !destCity) return null;
      if (originCity.name === destCity.name && originCity.state === destCity.state) return null;
      return Calculator.roadDistance(originCity, destCity);
    }
    return (state.manualKm && state.manualKm > 0) ? state.manualKm : null;
  }

  function updateCalcBtn() {
    const km = getDistanceKm();
    calcBtn.disabled = !(km && km > 0 && state.transport);
  }

  function calculate() {
    const km = getDistanceKm();
    if (!km || !state.transport) return;

    let originLabel, destLabel;
    if (state.mode === "cities") {
      originLabel = `${state.originCity.name}, ${state.originCity.state}`;
      destLabel   = `${state.destCity.name}, ${state.destCity.state}`;
    } else {
      originLabel = "Origem";
      destLabel   = "Destino";
    }

    UI.renderResults(resultsContent, km, originLabel, destLabel, state.transport);
    resultsSection.hidden = false;

    const refKey     = state.transport === "all" ? "carro" : state.transport;
    const refTransport = CONFIG.transports.find(t => t.key === refKey);
    const co2kg      = Calculator.computeEmission(refKey, km);
    const label      = state.transport === "all"
      ? `${refTransport.icon} ${refTransport.label} (referência)`
      : `${refTransport.icon} ${refTransport.label}`;
    UI.renderCredits(creditsContent, co2kg, label);
    creditsSection.hidden = false;

    setTimeout(() => resultsSection.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function renderTransportCards() {
    UI.renderTransportCards(transportGrid, state.transport);
  }
})();
