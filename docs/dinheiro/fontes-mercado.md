# Fontes de mercado — Fase 9 Moneymaker (educacao, sem recomendacao)

> Conteudo educacional. Nao e recomendacao de investimento. Ver [Aviso educacional — disclaimer](disclaimer.md). Sem promessa de lucro.

> Sem promessa de lucro. Sem recomendacao personalizada. Sem insider/piramide/bypass paywall-ToS. Cotacao sempre com data+fonte. Sem fonte = nao confirmado. Oficiais prevalecem (BCB, CVM, B3, Tesouro, gov.br/SEBRAE, IBGE, Receita, ANPD/Planalto). Acesso base: 2026-10-12.

## Como citar

`[Fonte oficial — dado em DD/MM/AAAA HH:mm (acesso 2026-10-12)](URL)` + frescor + licenca.

## 1. Renda fixa — cotacao vs fundamento

| Uso | Fonte | URL | Tipo e frescor | Licenca |
|-----|-------|-----|----------------|---------|
| Cotacao Selic/CDI/IPCA | BCB SGS API 432/11/12/433/4389/4391 | https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados?formato=json | JSON diario/mensal | ODbL BCB |
| Decisao juros | BCB Selic + Copom 16/09/2026 13,75% | https://www.bcb.gov.br/controleinflacao/taxaselic | Evento ~45d | gov.br |
| Cotacao TD | Tesouro Direto rendimento (09/10/2026 18h00) | https://www.tesourodireto.com.br/produtos/dados-sobre-titulos/rendimento-dos-titulos | Intraday pregao | Termos TD/B3 |
| Fundamento divida | Tesouro Transparente RMD ago/2026 | https://www.tesourotransparente.gov.br/publicacoes/relatorio-mensal-da-divida-rmd/2026/8 | Mensal | gov.br |

Exemplo validado: `BCB-SGS 432 em 01-11/10/2026: 13.75% a.a. (acesso 2026-10-12)`.

## 2. Acoes e FIIs

| Uso | Fonte | URL | Nota |
|-----|-------|-----|------|
| Cotacao delay 15min | B3 Cotacoes | https://www.b3.com.br/pt_br/market-data-e-indices/servicos-de-dados/market-data/cotacoes | `delay 15min` obrigatorio na citacao |
| Cadastro | B3 FIIs listados | https://www.b3.com.br/pt_br/produtos-e-servicos/negociacao/renda-variavel/fundos-de-investimentos/fii/fiis-listados/ | lista |
| Fundamento | CVM Dados Abertos (22 conj. FI/FII/FIAGRO/CDA) | https://dados.cvm.gov.br/dataset?groups=fundos-de-investimento | ODbL, diario/mensal |
| Verificacao | CVM Consulta + gov.br/investidor | https://www.gov.br/cvm/pt-br/assuntos/regulados/consultas-por-participante/fundos-de-investimento | cadastral |

## 3. Cripto — so regra + fiscal, preco = operacional

- BCB Res. 517/519/520/521 vigor 02/02/2026, reporte cambio desde 03/11/2026, prudencial 2027: [BCB estabelece regras para cripto — B3](https://borainvestir.b3.com.br/noticias/banco-central-estabelece-regras-para-o-mercado-de-criptoativos) + [ANBIMA: framework cripto](https://international.anbima.com.br/news/brazil-s-central-bank-unveils-new-regulatory-framework-for-cryptoassets) + [Agencia Brasil: BC endurece regras](https://agenciabrasil.ebc.com.br/economia/noticia/2026-07/bc-endurece-regras-para-empresas-de-ativos-virtuais-no-brasil)
- Receita DeCripto IN 2291/2025 vigor 01/07/2026: [Receita: criptoativos](https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/criptoativos)
- Lei 14.478/2022 + Dec. 11.563/2023 definem BCB regulador.

## 4. Freela, infoproduto e ecommerce

- MEI regras (R$81k/ano, 1 empregado): [gov.br: condicoes MEI](https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei/o-que-e-ser-um-mei/verifique-se-voce-atende-as-condicoes-para-ser-mei-1) + [MEI digital](https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/meu-mei-digital)
- SEBRAE + dados PME: [Portal SEBRAE](https://sebrae.com.br/sites/portalsebrae) + [Grandes numeros pequenos negocios](https://agenciasebrae.com.br/dados/confira-os-grandes-numeros-dos-pequenos-negocios-no-brasil/)

## 5. Tendencias

- IBGE IPCA (-0,32% ago/2026, 12m 4,22%): [IBGE IPCA](https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9256-ipca.html) + [IBGE indicadores](https://www.ibge.gov.br/en/indicators)
- BCB Focus semanal (expectativa, nao realizado): [Focus 02/10/2026](https://www.bcb.gov.br/content/focus/focus/R20261002.pdf)
- ANBIMA Finfluence (comportamento, nao fundamento): [Financial influencers](https://international.anbima.com.br/reports/financial-influencers)

## 6. Regras legais minimas (topicos — buscar juridico antes de publicar)

- CVM analista Res.20/2021: [Resolucao CVM 20](https://conteudo.cvm.gov.br/legislacao/resolucoes/resol020.html) + [APIMEC](https://www.gov.br/cvm/pt-br/assuntos/regulados/consultas-por-participante/analistas-de-valores-mobiliarios)
- CVM audiencia SDM 04/23 (finfluencer pode virar analista; disclaimer sozinho nao descaracteriza): [Edital SDM 04/23](https://conteudo.cvm.gov.br/export/sites/cvm/audiencias_publicas/ap_sdm/anexos/2023/sdm0423_Edital.pdf)
- Disclaimer obrigatorio: `Conteudo educacional, nao e recomendacao personalizada. Sem promessa de lucro. Risco de perda. Fontes oficiais com data.`
- LGPD (Lei 13.709/2018): [Planalto LGPD](https://planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) + [Guias ANPD](https://www.gov.br/int/pt-br/acesso-a-informacao/lgpd/guias) — minimizacao, base legal, direitos titular, nunca publicar dado pessoal financeiro.

## Criterio cotacao vs fundamento vs tendencia vs legal

Cotacao = SGS/TD/B3-delay; Fundamento = CVM/RMD; Tendencia = IBGE/Focus/SEBRAE/Finfluence; Legal = Planalto > BCB/CVM/Receita/ANPD > SEBRAE/gov.br > ANBIMA/B3-operacional.
