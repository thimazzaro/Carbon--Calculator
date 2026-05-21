/**
 * config.test.js
 * Testa a integridade da estrutura de CONFIG.
 */

describe("CONFIG — estrutura", () => {
  it("deve ter exatamente 4 meios de transporte", () => {
    expect(CONFIG.transports).toHaveLength(4);
  });

  it("todos os transportes possuem os campos obrigatórios", () => {
    CONFIG.transports.forEach(t => {
      if (!t.key)   throw new Error(`Transporte sem key: ${JSON.stringify(t)}`);
      if (!t.label) throw new Error(`Transporte sem label: ${t.key}`);
      if (!t.icon)  throw new Error(`Transporte sem icon: ${t.key}`);
      if (typeof t.factor !== "number") throw new Error(`Fator inválido em: ${t.key}`);
      if (!t.color) throw new Error(`Transporte sem color: ${t.key}`);
    });
  });

  it("todos os keys são únicos", () => {
    const keys = CONFIG.transports.map(t => t.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("todos os fatores de emissão são não-negativos", () => {
    CONFIG.transports.forEach(t => {
      expect(t.factor).toBeGreaterThanOrEqual(0);
    });
  });

  it("roadFactor é maior que 1 (distância rodoviária > linha reta)", () => {
    expect(CONFIG.roadFactor).toBeGreaterThan(1);
  });
});

describe("CONFIG — fatores relativos", () => {
  it("bicicleta tem fator zero", () => {
    const bike = CONFIG.transports.find(t => t.key === "bicicleta");
    expect(bike.factor).toBe(0);
  });

  it("ônibus emite menos que carro", () => {
    const onibus   = CONFIG.transports.find(t => t.key === "onibus");
    const carro    = CONFIG.transports.find(t => t.key === "carro");
    expect(onibus.factor).toBeLessThan(carro.factor);
  });

  it("caminhão emite mais que carro", () => {
    const caminhao = CONFIG.transports.find(t => t.key === "caminhao");
    const carro    = CONFIG.transports.find(t => t.key === "carro");
    expect(caminhao.factor).toBeGreaterThan(carro.factor);
  });

  it("ordem de emissão: bicicleta < ônibus < carro < caminhão", () => {
    const get = key => CONFIG.transports.find(t => t.key === key).factor;
    const bike = get("bicicleta"), bus = get("onibus"),
          car  = get("carro"),  truck = get("caminhao");
    if (!(bike < bus && bus < car && car < truck))
      throw new Error(`Ordem inválida: ${bike} < ${bus} < ${car} < ${truck}`);
  });
});
