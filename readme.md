# Calculadora de Emissão de CO₂

Aplicação web estática (HTML/CSS/JS puro) para comparar emissões de carbono entre diferentes meios de transporte em rotas brasileiras e estimar a compensação via créditos de carbono.

## Como usar

Abra `index.html` diretamente no navegador — sem build, sem servidor.

## Funcionalidades

- **Busca de cidades** com autocomplete (≈120 municípios brasileiros), suporte a acentos e siglas de estado
- **Distância manual** como alternativa — sugerida automaticamente quando a cidade não é encontrada na lista
- **Cálculo de distância** via fórmula de Haversine × fator rodoviário (1,35)
- **Seleção de transporte**: Bicicleta, Carro, Ônibus, Caminhão ou "Comparar todos"
- **Comparativo visual** com barras proporcionais e badge 🌱 no meio menos poluente
- **Créditos de carbono**: créditos necessários para compensar a emissão, custo estimado em R$ e explicação do mecanismo

## Estrutura de arquivos

```
carbon-calc/
├── index.html          # Markup e ponto de entrada
├── css/
│   └── style.css       # Design system verde, responsivo
├── js/
│   ├── config.js       # Fatores de emissão e configuração de créditos de carbono
│   ├── routes-data.js  # ~120 cidades brasileiras com coordenadas + busca normalizada
│   ├── calculator.js   # Lógica pura: distâncias, emissões, comparativos, créditos
│   ├── ui.js           # Autocomplete, cards de transporte, resultados, créditos
│   └── app.js          # Estado, eventos, orquestração
└── tests/
    ├── test-runner.html # Runner visual (abrir no navegador)
    ├── test-runner.js   # Framework de testes minimalista
    ├── config.test.js   # Testes de integridade do CONFIG
    ├── calculator.test.js # Testes de cálculo e formatação
    └── routes.test.js   # Testes de cidades, busca e Haversine
```

## Meios de transporte e fatores

| Transporte   | Fator (kg CO₂e/km) | Base                          |
|--------------|--------------------|-------------------------------|
| 🚲 Bicicleta | 0                  | por pessoa · emissão zero     |
| 🚌 Ônibus    | 0,089              | por passageiro · rodoviário   |
| 🚗 Carro     | 0,192              | gasolina · 1 passageiro       |
| 🚛 Caminhão  | 0,620              | frete · por veículo carregado |

## Créditos de carbono

| Parâmetro               | Valor                                  |
|-------------------------|----------------------------------------|
| Referência              | 1 crédito = 1 tCO₂e compensada        |
| Preço mínimo estimado   | R$ 30 / tonelada                       |
| Preço máximo estimado   | R$ 100 / tonelada                      |
| Mercado                 | Voluntário brasileiro (SBCE em expansão) |

## Fontes

- IPCC AR6 (2021)
- EPA GHG Equivalencies Calculator
- DEFRA UK GHG Conversion Factors 2023
- Inventário Nacional de Emissões — MCTI/Brasil

## Testes

Abra `tests/test-runner.html` no navegador para executar as ~55 verificações cobrindo cálculos, dataset de cidades, busca com acentos e formatação de valores.

---

Desenvolvido por Thiago Mazzaro e Claude
