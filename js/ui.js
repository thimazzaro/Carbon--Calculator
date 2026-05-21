/**
 * ui.js
 * DOM rendering helpers — called by app.js.
 */

const UI = (() => {

  /* ── Autocomplete factory ── */
  function makeAutocomplete(inputId, dropdownId, onSelect, onClear, onNotFound) {
    const input    = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    let selected   = null;
    let _cities    = [];

    input.addEventListener("input", () => {
      selected = null;
      onClear?.();
      const q = input.value.trim();
      if (q.length < 1) { close(); return; }
      _cities = searchCities(q).slice(0, 8);
      if (!_cities.length) {
        if (q.length >= 2) {
          dropdown.innerHTML = `
            <li class="ac-not-found" data-action="manual">
              <span class="ac-nf-text">Cidade não encontrada na lista</span>
              <span class="ac-nf-action">✏️ Inserir distância manualmente</span>
            </li>`;
          dropdown.classList.add("open");
        } else {
          close();
        }
        return;
      }
      dropdown.innerHTML = _cities.map((c, i) =>
        `<li data-i="${i}">${escapeHtml(c.name)}, <strong>${c.state}</strong></li>`
      ).join("");
      dropdown.classList.add("open");
    });

    dropdown.addEventListener("mousedown", e => {
      const li = e.target.closest("li");
      if (!li) return;
      if (li.dataset.action === "manual") {
        close();
        onNotFound?.();
        return;
      }
      if (li.dataset.i !== undefined) pick(_cities[+li.dataset.i]);
    });

    input.addEventListener("blur", () => setTimeout(close, 160));

    input.addEventListener("keydown", e => {
      if (!dropdown.classList.contains("open")) return;
      const items = [...dropdown.querySelectorAll("li")];
      const cur   = items.findIndex(li => li.classList.contains("focused"));
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = cur < items.length - 1 ? cur + 1 : 0;
        items.forEach(li => li.classList.remove("focused"));
        items[next].classList.add("focused");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = cur > 0 ? cur - 1 : items.length - 1;
        items.forEach(li => li.classList.remove("focused"));
        items[prev].classList.add("focused");
      } else if (e.key === "Enter") {
        const focused = dropdown.querySelector(".focused");
        if (focused) { e.preventDefault(); pick(_cities[+focused.dataset.i]); }
      } else if (e.key === "Escape") {
        close();
      }
    });

    function pick(city) {
      selected    = city;
      input.value = `${city.name}, ${city.state}`;
      input.classList.remove("input-error");
      close();
      onSelect(city);
    }

    function close() { dropdown.classList.remove("open"); }

    function reset() {
      selected    = null;
      input.value = "";
      input.classList.remove("input-error");
      close();
    }

    return { getSelected: () => selected, reset };
  }

  /* ── Transport cards (HTML only; events wired in app.js) ── */
  function renderTransportCards(container, selectedKey) {
    const options = [
      ...CONFIG.transports,
      { key: "all", label: "Comparar todos", icon: "📊", color: "#6b7280", colorLight: "#f3f4f6", note: "ver todos os meios" }
    ];
    container.innerHTML = options.map(t => {
      const sel = t.key === selectedKey;
      const style = sel ? `style="border-color:${t.color};background:${t.colorLight}"` : "";
      return `
        <button class="transport-card${sel ? " selected" : ""}" data-key="${t.key}" ${style}>
          <span class="tc-icon">${t.icon}</span>
          <span class="tc-label">${t.label}</span>
          <span class="tc-note">${t.note}</span>
        </button>`;
    }).join("");
  }

  /* ── Results rendering ── */
  function renderResults(container, km, originLabel, destLabel, selectedKey) {
    const comparison = Calculator.compareAll(km);
    const maxCo2     = comparison[comparison.length - 1].co2kg;
    const chosen     = CONFIG.transports.find(t => t.key === selectedKey);
    const chosenRow  = comparison.find(r => r.transport.key === selectedKey);

    let html = `
      <div class="result-route-info">
        <span class="route-from-to">${escapeHtml(originLabel)} → ${escapeHtml(destLabel)}</span>
        <span class="route-km-badge">${km.toLocaleString("pt-BR")} km · estimativa rodoviária</span>
      </div>`;

    if (selectedKey !== "all" && chosen && chosenRow) {
      html += `
        <div class="chosen-card" style="border-color:${chosen.color};background:${chosen.colorLight}">
          <span class="chosen-icon">${chosen.icon}</span>
          <div class="chosen-info">
            <span class="chosen-label">Sua escolha: ${chosen.label}</span>
            <span class="chosen-value" style="color:${chosen.color}">${Calculator.formatCO2(chosenRow.co2kg)}</span>
            <span class="chosen-note">${chosen.note}</span>
          </div>
        </div>`;
    }

    html += `<div class="comparison"><h3>Comparativo</h3><div class="comp-list">`;

    comparison.forEach((row, idx) => {
      const { transport: t, co2kg } = row;
      const pct      = maxCo2 > 0 ? (co2kg / maxCo2 * 100) : 0;
      const isChosen = selectedKey !== "all" && t.key === selectedKey;
      const isLowest = idx === 0;

      const lowestBadge = isLowest
        ? `<span class="badge badge-green">🌱 Menor emissão</span>`
        : "";
      const chosenBadge = isChosen
        ? `<span class="badge badge-chosen" style="background:${t.color}18;color:${t.color}">sua escolha</span>`
        : "";

      const bar = co2kg === 0
        ? `<span class="comp-zero-pill">zero emissão</span>`
        : `<div class="comp-bar" style="width:${Math.max(pct, 1.5)}%;background:${t.color}"></div>`;

      html += `
        <div class="comp-row${isChosen ? " comp-row-chosen" : ""}">
          <div class="comp-label">${t.icon} ${t.label}</div>
          <div class="comp-bar-wrap">${bar}</div>
          <div class="comp-value" style="color:${t.color}">${Calculator.formatCO2(co2kg)}</div>
          <div class="comp-badges">${lowestBadge}${chosenBadge}</div>
        </div>`;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  /* ── Carbon credits rendering ── */
  function renderCredits(container, co2kg, transportLabel) {
    if (co2kg === 0) {
      container.innerHTML = `
        <div class="credits-zero">
          <div class="credits-zero-icon">🎉</div>
          <div class="credits-zero-title">Emissão zero!</div>
          <p class="credits-zero-text">
            Sua viagem de <strong>${escapeHtml(transportLabel)}</strong> não gerou emissões de carbono.
            Nenhuma compensação necessária.
          </p>
        </div>
        <div class="credits-explanation">
          <h3>O que são créditos de carbono?</h3>
          <p>${escapeHtml(CONFIG.credits.explanation)}</p>
        </div>`;
      return;
    }

    const { tonnes, costMin, costMax } = Calculator.computeCredits(co2kg);
    const fmtCredits = tonnes < 0.001
      ? "< 0,001"
      : tonnes.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    const fmtBRL = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    container.innerHTML = `
      <p class="credits-subtitle">
        Para compensar a emissão de <strong>${Calculator.formatCO2(co2kg)}</strong>
        ${transportLabel ? `com <strong>${escapeHtml(transportLabel)}</strong>` : ""}:
      </p>

      <div class="credits-metrics">
        <div class="credits-metric credits-metric-primary">
          <span class="cm-value">${fmtCredits}</span>
          <span class="cm-label">crédito${tonnes !== 1 ? "s" : ""} de carbono</span>
          <span class="cm-sub">${tonnes.toLocaleString("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4 })} tCO₂e</span>
        </div>
        <div class="credits-metric credits-metric-cost">
          <span class="cm-value">${fmtBRL(costMin)} – ${fmtBRL(costMax)}</span>
          <span class="cm-label">custo estimado</span>
          <span class="cm-sub">mercado voluntário brasileiro</span>
        </div>
      </div>

      <div class="credits-explanation">
        <h3>O que são créditos de carbono?</h3>
        <p>${escapeHtml(CONFIG.credits.explanation)}</p>
      </div>

      <div class="credits-action">
        <button class="btn btn-buy-credits" disabled>
          🌿 Comprar Créditos de Carbono
        </button>
        <p class="credits-action-note">Em breve: acesso direto a projetos certificados no Brasil</p>
      </div>`;
  }

  /* ── Helpers ── */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  return { makeAutocomplete, renderTransportCards, renderResults, renderCredits };
})();
