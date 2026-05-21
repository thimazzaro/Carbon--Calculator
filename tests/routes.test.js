/**
 * routes.test.js
 * Testa o dataset de cidades, normalize, searchCities e haversineKm.
 */

describe("normalize", () => {
  it("converte para minúsculas", () => {
    expect(normalize("SÃO PAULO")).toBe("sao paulo");
  });

  it("remove acentos agudos e graves", () => {
    expect(normalize("Brasília")).toBe("brasilia");
    expect(normalize("Fortaléza")).toBe("fortaleza"); // acento hipotético
  });

  it("remove cedilha e til", () => {
    expect(normalize("São Paulo")).toBe("sao paulo");
    expect(normalize("Conceição")).toBe("conceicao");
  });

  it("remove espaços no início e fim", () => {
    expect(normalize("  rio  ")).toBe("rio");
  });

  it("retorna string vazia para entrada vazia", () => {
    expect(normalize("")).toBe("");
  });

  it("não altera letras sem acento", () => {
    expect(normalize("Manaus")).toBe("manaus");
  });
});

describe("searchCities — busca por nome", () => {
  it("encontra São Paulo por 'sao paulo' (sem acento)", () => {
    const found = searchCities("sao paulo").some(c => c.name === "São Paulo" && c.state === "SP");
    expect(found).toBeTruthy();
  });

  it("encontra São Paulo por 'São Paulo' (com acento)", () => {
    const found = searchCities("São Paulo").some(c => c.name === "São Paulo");
    expect(found).toBeTruthy();
  });

  it("encontra Rio de Janeiro por 'rio'", () => {
    const found = searchCities("rio").some(c => c.name === "Rio de Janeiro");
    expect(found).toBeTruthy();
  });

  it("encontra Florianópolis por 'floriano' (sem ó)", () => {
    const found = searchCities("floriano").some(c => c.name === "Florianópolis");
    expect(found).toBeTruthy();
  });

  it("encontra Fortaleza por 'fort'", () => {
    const found = searchCities("fort").some(c => c.name === "Fortaleza");
    expect(found).toBeTruthy();
  });

  it("resultados são case-insensitive: 'CAMPINAS' = 'campinas'", () => {
    const upper = searchCities("CAMPINAS").length;
    const lower = searchCities("campinas").length;
    expect(upper).toBe(lower);
  });

  it("retorna array vazio para query sem match", () => {
    expect(searchCities("zzzzxxx")).toHaveLength(0);
  });

  it("resultados com prefixo exato aparecem antes de matches parciais", () => {
    const results = searchCities("bel");
    // Belém deve aparecer antes de Ribeirão (que tem 'bel' no meio)
    const belemIdx   = results.findIndex(c => c.name === "Belém");
    const ribeirao   = results.findIndex(c => c.name === "Ribeirão Preto");
    if (belemIdx !== -1 && ribeirao !== -1) {
      expect(belemIdx).toBeLessThan(ribeirao);
    }
  });
});

describe("searchCities — busca por UF", () => {
  it("encontra cidades de SP pela sigla 'SP'", () => {
    const results = searchCities("SP");
    expect(results.length).toBeGreaterThan(0);
    const allSP = results.every(c => c.state === "SP");
    expect(allSP).toBeTruthy();
  });

  it("encontra Brasília pela sigla 'DF'", () => {
    const found = searchCities("DF").some(c => c.name === "Brasília");
    expect(found).toBeTruthy();
  });
});

describe("CITIES — integridade do dataset", () => {
  it("tem pelo menos 100 cidades cadastradas", () => {
    expect(CITIES.length).toBeGreaterThan(100);
  });

  it("todas as cidades têm name, state, lat, lng", () => {
    CITIES.forEach(c => {
      if (!c.name)                        throw new Error(`Sem name: ${JSON.stringify(c)}`);
      if (!c.state || c.state.length > 2) throw new Error(`State inválido em: ${c.name}`);
      if (typeof c.lat !== "number")      throw new Error(`lat inválida em: ${c.name}`);
      if (typeof c.lng !== "number")      throw new Error(`lng inválida em: ${c.name}`);
    });
  });

  it("coordenadas dentro dos limites geográficos do Brasil", () => {
    // Brasil: lat [-34, 5.5] | lng [-74, -28]
    CITIES.forEach(c => {
      if (c.lat < -34 || c.lat > 5.5)
        throw new Error(`Latitude fora do Brasil em ${c.name}: ${c.lat}`);
      if (c.lng < -74 || c.lng > -28)
        throw new Error(`Longitude fora do Brasil em ${c.name}: ${c.lng}`);
    });
  });

  it("nenhuma cidade duplicada (mesmo nome + estado)", () => {
    const keys = CITIES.map(c => `${c.name}|${c.state}`);
    const unique = new Set(keys);
    if (unique.size !== CITIES.length) {
      const dups = keys.filter((k, i) => keys.indexOf(k) !== i);
      throw new Error(`Duplicatas encontradas: ${dups.join(", ")}`);
    }
  });

  it("capitais estaduais estão no dataset", () => {
    const capitais = [
      "Brasília", "São Paulo", "Rio de Janeiro", "Belo Horizonte",
      "Salvador", "Fortaleza", "Manaus", "Belém", "Recife",
      "Porto Alegre", "Curitiba", "Goiânia", "Florianópolis",
      "Vitória", "Campo Grande", "Cuiabá", "Palmas",
      "Porto Velho", "Rio Branco", "Boa Vista", "Macapá",
      "Maceió", "Aracaju", "Natal", "João Pessoa", "Teresina", "São Luís"
    ];
    capitais.forEach(capital => {
      if (!CITIES.some(c => c.name === capital))
        throw new Error(`Capital ausente: ${capital}`);
    });
  });

  it("todos os 26 estados + DF possuem ao menos uma cidade", () => {
    const states = new Set(CITIES.map(c => c.state));
    const expected = ["AC","AL","AM","AP","BA","CE","DF","ES","GO",
                      "MA","MG","MS","MT","PA","PB","PE","PI","PR",
                      "RJ","RN","RO","RR","RS","SC","SE","SP","TO"];
    expected.forEach(uf => {
      if (!states.has(uf)) throw new Error(`Estado sem cidades: ${uf}`);
    });
  });
});

describe("haversineKm", () => {
  it("distância de ponto a si mesmo = 0", () => {
    expect(haversineKm(-23.5, -46.6, -23.5, -46.6)).toBe(0);
    expect(haversineKm(0, 0, 0, 0)).toBe(0);
  });

  it("SP → RJ linha reta ≈ 357 km (±25 km)", () => {
    const d = haversineKm(-23.5505, -46.6333, -22.9068, -43.1729);
    expect(d).toBeGreaterThan(332);
    expect(d).toBeLessThan(382);
  });

  it("é simétrica: A→B = B→A", () => {
    const d1 = haversineKm(-23.5505, -46.6333, -22.9068, -43.1729);
    const d2 = haversineKm(-22.9068, -43.1729, -23.5505, -46.6333);
    expect(Math.abs(d1 - d2)).toBeLessThan(0.001);
  });

  it("retorna sempre valor positivo", () => {
    expect(haversineKm(-10, -50, 5, -40)).toBeGreaterThan(0);
    expect(haversineKm(2.8, -60.7, -3.1, -60.0)).toBeGreaterThan(0);
  });

  it("cidades mais distantes têm d > cidades próximas", () => {
    // SP→Manaus deve ser maior que SP→RJ
    const spRj  = haversineKm(-23.5505, -46.6333, -22.9068, -43.1729);
    const spMao = haversineKm(-23.5505, -46.6333, -3.1019,  -60.0250);
    expect(spMao).toBeGreaterThan(spRj);
  });

  it("Manaus (AM) → Boa Vista (RR) ≈ 650 km (±80 km)", () => {
    const d = haversineKm(-3.1019, -60.0250, 2.8235, -60.6758);
    expect(d).toBeGreaterThan(570);
    expect(d).toBeLessThan(730);
  });
});
