/**
 * routes-data.js
 * Brazilian cities with coordinates + search/distance helpers.
 */

const CITIES = [
  // SP
  { name: "São Paulo",             state: "SP", lat: -23.5505, lng: -46.6333 },
  { name: "Campinas",              state: "SP", lat: -22.9056, lng: -47.0608 },
  { name: "Guarulhos",             state: "SP", lat: -23.4628, lng: -46.5328 },
  { name: "Santos",                state: "SP", lat: -23.9618, lng: -46.3322 },
  { name: "Ribeirão Preto",        state: "SP", lat: -21.1775, lng: -47.8103 },
  { name: "São José dos Campos",   state: "SP", lat: -23.1794, lng: -45.8869 },
  { name: "Sorocaba",              state: "SP", lat: -23.5015, lng: -47.4526 },
  { name: "Bauru",                 state: "SP", lat: -22.3246, lng: -49.0747 },
  { name: "Jundiaí",               state: "SP", lat: -23.1864, lng: -46.8842 },
  { name: "Piracicaba",            state: "SP", lat: -22.7246, lng: -47.6476 },
  { name: "Presidente Prudente",   state: "SP", lat: -22.1256, lng: -51.3886 },
  { name: "São José do Rio Preto", state: "SP", lat: -20.8113, lng: -49.3758 },
  { name: "Taubaté",               state: "SP", lat: -23.0260, lng: -45.5553 },
  { name: "Marília",               state: "SP", lat: -22.2139, lng: -49.9458 },
  { name: "Franca",                state: "SP", lat: -20.5382, lng: -47.4008 },
  { name: "Limeira",               state: "SP", lat: -22.5639, lng: -47.4014 },
  { name: "Americana",             state: "SP", lat: -22.7389, lng: -47.3328 },
  // RJ
  { name: "Rio de Janeiro",        state: "RJ", lat: -22.9068, lng: -43.1729 },
  { name: "Niterói",               state: "RJ", lat: -22.8833, lng: -43.1036 },
  { name: "Nova Iguaçu",           state: "RJ", lat: -22.7594, lng: -43.4511 },
  { name: "Duque de Caxias",       state: "RJ", lat: -22.7858, lng: -43.3117 },
  { name: "Campos dos Goytacazes", state: "RJ", lat: -21.7554, lng: -41.3244 },
  { name: "Petrópolis",            state: "RJ", lat: -22.5050, lng: -43.1789 },
  { name: "Volta Redonda",         state: "RJ", lat: -22.5231, lng: -44.1042 },
  { name: "Cabo Frio",             state: "RJ", lat: -22.8792, lng: -42.0186 },
  { name: "Macaé",                 state: "RJ", lat: -22.3703, lng: -41.7867 },
  { name: "Angra dos Reis",        state: "RJ", lat: -23.0067, lng: -44.3181 },
  // MG
  { name: "Belo Horizonte",        state: "MG", lat: -19.9191, lng: -43.9386 },
  { name: "Uberlândia",            state: "MG", lat: -18.9186, lng: -48.2772 },
  { name: "Contagem",              state: "MG", lat: -19.9317, lng: -44.0536 },
  { name: "Juiz de Fora",          state: "MG", lat: -21.7642, lng: -43.3503 },
  { name: "Betim",                 state: "MG", lat: -19.9675, lng: -44.1989 },
  { name: "Montes Claros",         state: "MG", lat: -16.7286, lng: -43.8619 },
  { name: "Uberaba",               state: "MG", lat: -19.7481, lng: -47.9319 },
  { name: "Governador Valadares",  state: "MG", lat: -18.8511, lng: -41.9494 },
  { name: "Ipatinga",              state: "MG", lat: -19.4686, lng: -42.5361 },
  { name: "Sete Lagoas",           state: "MG", lat: -19.4658, lng: -44.2481 },
  { name: "Divinópolis",           state: "MG", lat: -20.1386, lng: -44.8847 },
  { name: "Patos de Minas",        state: "MG", lat: -18.5789, lng: -46.5178 },
  // BA
  { name: "Salvador",              state: "BA", lat: -12.9714, lng: -38.5014 },
  { name: "Feira de Santana",      state: "BA", lat: -12.2664, lng: -38.9663 },
  { name: "Vitória da Conquista",  state: "BA", lat: -14.8619, lng: -40.8444 },
  { name: "Camaçari",              state: "BA", lat: -12.6992, lng: -38.3239 },
  { name: "Itabuna",               state: "BA", lat: -14.7851, lng: -39.2806 },
  { name: "Ilhéus",                state: "BA", lat: -14.7891, lng: -39.0453 },
  { name: "Juazeiro",              state: "BA", lat: -9.4278,  lng: -40.5019 },
  { name: "Barreiras",             state: "BA", lat: -12.1522, lng: -44.9961 },
  // PR
  { name: "Curitiba",              state: "PR", lat: -25.4284, lng: -49.2733 },
  { name: "Londrina",              state: "PR", lat: -23.3045, lng: -51.1696 },
  { name: "Maringá",               state: "PR", lat: -23.4253, lng: -51.9386 },
  { name: "Ponta Grossa",          state: "PR", lat: -25.0916, lng: -50.1659 },
  { name: "Cascavel",              state: "PR", lat: -24.9558, lng: -53.4553 },
  { name: "Foz do Iguaçu",         state: "PR", lat: -25.5478, lng: -54.5882 },
  { name: "Paranaguá",             state: "PR", lat: -25.5219, lng: -48.5094 },
  { name: "Guarapuava",            state: "PR", lat: -25.3842, lng: -51.4611 },
  // RS
  { name: "Porto Alegre",          state: "RS", lat: -30.0346, lng: -51.2177 },
  { name: "Caxias do Sul",         state: "RS", lat: -29.1681, lng: -51.1794 },
  { name: "Pelotas",               state: "RS", lat: -31.7654, lng: -52.3376 },
  { name: "Canoas",                state: "RS", lat: -29.9178, lng: -51.1839 },
  { name: "Santa Maria",           state: "RS", lat: -29.6842, lng: -53.8069 },
  { name: "Novo Hamburgo",         state: "RS", lat: -29.6783, lng: -51.1308 },
  { name: "Rio Grande",            state: "RS", lat: -32.0350, lng: -52.0986 },
  { name: "Passo Fundo",           state: "RS", lat: -28.2622, lng: -52.4081 },
  // SC
  { name: "Florianópolis",         state: "SC", lat: -27.5954, lng: -48.5480 },
  { name: "Joinville",             state: "SC", lat: -26.3044, lng: -48.8487 },
  { name: "Blumenau",              state: "SC", lat: -26.9194, lng: -49.0661 },
  { name: "Criciúma",              state: "SC", lat: -28.6781, lng: -49.3697 },
  { name: "Chapecó",               state: "SC", lat: -27.1005, lng: -52.6152 },
  { name: "Itajaí",                state: "SC", lat: -26.9078, lng: -48.6619 },
  // GO + DF
  { name: "Goiânia",               state: "GO", lat: -16.6864, lng: -49.2643 },
  { name: "Aparecida de Goiânia",  state: "GO", lat: -16.8231, lng: -49.2439 },
  { name: "Anápolis",              state: "GO", lat: -16.3281, lng: -48.9530 },
  { name: "Rio Verde",             state: "GO", lat: -17.7981, lng: -50.9258 },
  { name: "Brasília",              state: "DF", lat: -15.7801, lng: -47.9292 },
  // PE
  { name: "Recife",                state: "PE", lat: -8.0539,  lng: -34.8811 },
  { name: "Caruaru",               state: "PE", lat: -8.2828,  lng: -35.9753 },
  { name: "Petrolina",             state: "PE", lat: -9.3986,  lng: -40.5003 },
  { name: "Olinda",                state: "PE", lat: -8.0089,  lng: -34.8553 },
  { name: "Jaboatão dos Guararapes", state: "PE", lat: -8.1131, lng: -35.0114 },
  // CE
  { name: "Fortaleza",             state: "CE", lat: -3.7172,  lng: -38.5433 },
  { name: "Juazeiro do Norte",     state: "CE", lat: -7.2131,  lng: -39.3153 },
  { name: "Sobral",                state: "CE", lat: -3.6883,  lng: -40.3494 },
  { name: "Caucaia",               state: "CE", lat: -3.7372,  lng: -38.6539 },
  // AM + PA
  { name: "Manaus",                state: "AM", lat: -3.1019,  lng: -60.0250 },
  { name: "Parintins",             state: "AM", lat: -2.6272,  lng: -56.7361 },
  { name: "Belém",                 state: "PA", lat: -1.4558,  lng: -48.5044 },
  { name: "Santarém",              state: "PA", lat: -2.4468,  lng: -54.7083 },
  { name: "Marabá",                state: "PA", lat: -5.3686,  lng: -49.1178 },
  // MA + PI
  { name: "São Luís",              state: "MA", lat: -2.5364,  lng: -44.3080 },
  { name: "Imperatriz",            state: "MA", lat: -5.5267,  lng: -47.4906 },
  { name: "Teresina",              state: "PI", lat: -5.0892,  lng: -42.8019 },
  { name: "Parnaíba",              state: "PI", lat: -2.9067,  lng: -41.7772 },
  // RN + PB + AL + SE
  { name: "Natal",                 state: "RN", lat: -5.7945,  lng: -35.2110 },
  { name: "Mossoró",               state: "RN", lat: -5.1878,  lng: -37.3442 },
  { name: "João Pessoa",           state: "PB", lat: -7.1195,  lng: -34.8450 },
  { name: "Campina Grande",        state: "PB", lat: -7.2300,  lng: -35.8817 },
  { name: "Maceió",                state: "AL", lat: -9.6658,  lng: -35.7350 },
  { name: "Arapiraca",             state: "AL", lat: -9.7528,  lng: -36.6614 },
  { name: "Aracaju",               state: "SE", lat: -10.9472, lng: -37.0731 },
  // RO + AC + RR + AP
  { name: "Porto Velho",           state: "RO", lat: -8.7612,  lng: -63.9004 },
  { name: "Ji-Paraná",             state: "RO", lat: -10.8849, lng: -61.9464 },
  { name: "Rio Branco",            state: "AC", lat: -9.9781,  lng: -67.8108 },
  { name: "Boa Vista",             state: "RR", lat: 2.8235,   lng: -60.6758 },
  { name: "Macapá",                state: "AP", lat: 0.0349,   lng: -51.0694 },
  // TO + MT + MS
  { name: "Palmas",                state: "TO", lat: -10.1689, lng: -48.3317 },
  { name: "Araguaína",             state: "TO", lat: -7.1922,  lng: -48.2044 },
  { name: "Cuiabá",                state: "MT", lat: -15.5989, lng: -56.0978 },
  { name: "Rondonópolis",          state: "MT", lat: -16.4703, lng: -54.6361 },
  { name: "Campo Grande",          state: "MS", lat: -20.4428, lng: -54.6461 },
  { name: "Dourados",              state: "MS", lat: -22.2211, lng: -54.8053 },
  { name: "Corumbá",               state: "MS", lat: -19.0083, lng: -57.6508 },
  // ES
  { name: "Vitória",               state: "ES", lat: -20.3155, lng: -40.3128 },
  { name: "Vila Velha",            state: "ES", lat: -20.3297, lng: -40.2920 },
  { name: "Serra",                 state: "ES", lat: -20.1283, lng: -40.3069 },
  { name: "Cariacica",             state: "ES", lat: -20.2633, lng: -40.4183 },
];

function normalize(str) {
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function searchCities(query) {
  const q = normalize(query);
  return CITIES
    .filter(c => normalize(c.name).includes(q) || normalize(c.state) === q)
    .sort((a, b) => {
      const an = normalize(a.name), bn = normalize(b.name);
      const aStarts = an.startsWith(q), bStarts = bn.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return an.localeCompare(bn);
    });
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
