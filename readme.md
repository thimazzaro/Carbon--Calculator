# Calculadora de Emissão de CO₂

Aplicação web estática (HTML/CSS/JS puro) para comparar emissões de carbono entre diferentes meios de transporte em rotas brasileiras.

## Estrutura de arquivos

```
carbon-calc/
├── index.html          # Markup e ponto de entrada
├── css/
│   └── style.css       # Design system verde, responsivo
└── js/
    ├── config.js       # Fatores de emissão por transporte
    ├── routes-data.js  # ~120 cidades brasileiras com coordenadas + busca
    ├── calculator.js   # Lógica pura: distâncias, emissões, comparativos
    ├── ui.js           # Autocomplete, renderização de cards e resultados
    └── app.js          # Estado, eventos, orquestração
```

## Como usar

Abra `index.html` diretamente no navegador — sem build, sem servidor.

## Funcionalidades

- **Busca de cidades** com autocomplete (≈120 municípios brasileiros) e suporte a acentos/abreviações de estado
- **Distância manual** como alternativa à busca de cidades
- **Cálculo de distância** via fórmula de Haversine × fator rodoviário (1,35)
- **Seleção de transporte**: Bicicleta, Carro, Ônibus, Caminhão, ou "Comparar todos"
- **Comparativo visual** com barras proporcionais à emissão máxima
- Badge **"🌱 Menor emissão"** destacando o meio mais limpo

## Meios de transporte e fatores

| Transporte | Fator (kg CO₂e/km) | Base |
|------------|-------------------|------|
| 🚲 Bicicleta | 0 | por pessoa |
| 🚌 Ônibus    | 0,089 | por passageiro · rodoviário |
| 🚗 Carro     | 0,192 | gasolina · 1 passageiro |
| 🚛 Caminhão  | 0,620 | frete · por veículo carregado |

## Fontes dos fatores de emissão

- IPCC AR6 (2021)
- EPA GHG Equivalencies Calculator
- DEFRA UK GHG Conversion Factors 2023
- Inventário Nacional de Emissões (MCTI/Brasil)

---

Desenvolvido por Thiago Mazzaro e Claude
