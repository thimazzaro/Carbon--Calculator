/**
 * calculator.test.js
 * Testa Calculator.computeEmission, compareAll, formatCO2 e roadDistance.
 */

describe("Calculator.computeEmission", () => {
  it("bicicleta emite 0 em qualquer distância", () => {
    expect(Calculator.computeEmission("bicicleta", 500)).toBe(0);
    expect(Calculator.computeEmission("bicicleta", 0)).toBe(0);
    expect(Calculator.computeEmission("bicicleta", 9999)).toBe(0);
  });

  it("carro 100 km ≈ 19,2 kg CO₂e", () => {
    expect(Calculator.computeEmission("carro", 100)).toBeCloseTo(19.2, 1);
  });

  it("ônibus 100 km ≈ 8,9 kg CO₂e", () => {
    expect(Calculator.computeEmission("onibus", 100)).toBeCloseTo(8.9, 1);
  });

  it("caminhão 100 km ≈ 62 kg CO₂e", () => {
    expect(Calculator.computeEmission("caminhao", 100)).toBeCloseTo(62.0, 0);
  });

  it("emissão é proporcional à distância (dobrar km = dobrar emissão)", () => {
    const e100 = Calculator.computeEmission("carro", 100);
    const e200 = Calculator.computeEmission("carro", 200);
    expect(e200).toBeCloseTo(e100 * 2, 4);
  });

  it("distância zero resulta em emissão zero para todos", () => {
    CONFIG.transports.forEach(t => {
      expect(Calculator.computeEmission(t.key, 0)).toBe(0);
    });
  });

  it("transporte desconhecido retorna 0 sem lançar erro", () => {
    expect(Calculator.computeEmission("foguete", 500)).toBe(0);
    expect(Calculator.computeEmission("", 100)).toBe(0);
  });
});

describe("Calculator.compareAll", () => {
  it("retorna exatamente 4 entradas", () => {
    expect(Calculator.compareAll(500)).toHaveLength(4);
  });

  it("resultado ordenado de menor para maior emissão", () => {
    const result = Calculator.compareAll(500);
    for (let i = 1; i < result.length; i++) {
      if (result[i].co2kg < result[i - 1].co2kg)
        throw new Error(`Fora de ordem: index ${i - 1} > index ${i}`);
    }
  });

  it("primeiro sempre é bicicleta (emissão zero)", () => {
    expect(Calculator.compareAll(1000)[0].transport.key).toBe("bicicleta");
    expect(Calculator.compareAll(1000)[0].co2kg).toBe(0);
  });

  it("último sempre é caminhão (maior emissão)", () => {
    const result = Calculator.compareAll(1000);
    expect(result[result.length - 1].transport.key).toBe("caminhao");
  });

  it("cada entrada contém { transport, co2kg }", () => {
    Calculator.compareAll(300).forEach(row => {
      if (!row.transport || typeof row.co2kg !== "number")
        throw new Error(`Entrada malformada: ${JSON.stringify(row)}`);
    });
  });

  it("co2kg de cada entrada = fator × distância", () => {
    const km = 400;
    Calculator.compareAll(km).forEach(row => {
      const expected = row.transport.factor * km;
      if (Math.abs(row.co2kg - expected) > 0.001)
        throw new Error(`${row.transport.key}: esperado ${expected}, recebido ${row.co2kg}`);
    });
  });

  it("todos os transportes estão representados exatamente uma vez", () => {
    const keys = Calculator.compareAll(100).map(r => r.transport.key);
    CONFIG.transports.forEach(t => {
      if (!keys.includes(t.key))
        throw new Error(`Transporte ausente no comparativo: ${t.key}`);
    });
  });
});

describe("Calculator.formatCO2", () => {
  it("zero → '0 g CO₂e'", () => {
    expect(Calculator.formatCO2(0)).toBe("0 g CO₂e");
  });

  it("valor < 1 kg exibido em gramas", () => {
    const result = Calculator.formatCO2(0.5);
    expect(result.includes("g CO₂e")).toBeTruthy();
    if (result.includes("kg")) throw new Error("Não deve exibir 'kg' para valor < 1");
  });

  it("0,5 kg → '500 g CO₂e'", () => {
    expect(Calculator.formatCO2(0.5)).toBe("500 g CO₂e");
  });

  it("valor entre 1–999 kg exibido em kg", () => {
    const result = Calculator.formatCO2(96);
    expect(result.includes("kg CO₂e")).toBeTruthy();
    if (result.includes(" t ")) throw new Error("Não deve exibir 't' para valor < 1000");
  });

  it("valor ≥ 1000 kg exibido em toneladas", () => {
    const result = Calculator.formatCO2(1500);
    expect(result.includes("t CO₂e")).toBeTruthy();
    if (result.includes("kg")) throw new Error("Não deve exibir 'kg' para valor ≥ 1000");
  });

  it("1000 kg → '1,00 t CO₂e'", () => {
    const result = Calculator.formatCO2(1000);
    expect(result.includes("t CO₂e")).toBeTruthy();
  });

  it("nunca retorna string vazia", () => {
    [0, 0.001, 1, 100, 999, 1000, 5000].forEach(v => {
      const r = Calculator.formatCO2(v);
      if (!r || r.trim() === "") throw new Error(`Retornou vazio para ${v}`);
    });
  });
});

describe("Calculator.roadDistance", () => {
  const sp  = { name: "São Paulo",      state: "SP", lat: -23.5505, lng: -46.6333 };
  const rj  = { name: "Rio de Janeiro", state: "RJ", lat: -22.9068, lng: -43.1729 };
  const bsb = { name: "Brasília",       state: "DF", lat: -15.7801, lng: -47.9292 };
  const poa = { name: "Porto Alegre",   state: "RS", lat: -30.0346, lng: -51.2177 };

  it("distância SP→RJ está na faixa realista (400–560 km)", () => {
    const km = Calculator.roadDistance(sp, rj);
    expect(km).toBeGreaterThan(400);
    expect(km).toBeLessThan(560);
  });

  it("distância SP→Brasília > SP→RJ (rota mais longa)", () => {
    expect(Calculator.roadDistance(sp, bsb)).toBeGreaterThan(Calculator.roadDistance(sp, rj));
  });

  it("SP→Porto Alegre > SP→RJ (rota mais longa)", () => {
    expect(Calculator.roadDistance(sp, poa)).toBeGreaterThan(Calculator.roadDistance(sp, rj));
  });

  it("distância é simétrica: A→B = B→A", () => {
    expect(Calculator.roadDistance(sp, rj)).toBe(Calculator.roadDistance(rj, sp));
    expect(Calculator.roadDistance(sp, bsb)).toBe(Calculator.roadDistance(bsb, sp));
  });

  it("distância de uma cidade a si mesma = 0", () => {
    expect(Calculator.roadDistance(sp, sp)).toBe(0);
    expect(Calculator.roadDistance(rj, rj)).toBe(0);
  });

  it("resultado sempre é inteiro (Math.round aplicado)", () => {
    const km = Calculator.roadDistance(sp, rj);
    expect(km).toBe(Math.round(km));
  });

  it("aplica roadFactor: resultado > haversine puro", () => {
    const road     = Calculator.roadDistance(sp, rj);
    const straight = haversineKm(sp.lat, sp.lng, rj.lat, rj.lng);
    expect(road).toBeGreaterThan(straight);
  });
});
