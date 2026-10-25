# Fontes de trends — Fase 10 Moneymaker (educacao, sem recomendacao)

> Conteudo educacional. Nao e recomendacao de investimento. Ver [Aviso educacional — disclaimer](disclaimer.md). Sem promessa de lucro.

> Sem promessa de lucro. Sem recomendacao personalizada. Score 0-100 educacional. Saturacao alta|media|baixa. Cache JSON 24h. Acesso base: 2026-10-25.

## Como citar trends

`[Fonte oficial — dado em DD/MM/AAAA HH:mm (acesso 2026-10-25)](URL)` + frescor + saturacao + licenca.

## 1. TikTok — Creative Center (oficial)

| Uso | Fonte | URL | Tipo e frescor | Licenca |
|-----|-------|-----|----------------|---------|
| Hashtags trending BR | TikTok Creative Center | https://ads.tiktok.com/creative-center | JSON diario, top 100 | Termos TikTok |
| Sons trending BR | TikTok Creative Center | https://ads.tiktok.com/creative-center/sounds | JSON diario | Termos TikTok |
| Creators top BR | TikTok Creative Center | https://ads.tiktok.com/creative-center/creators | JSON semanal | Termos TikTok |

Exemplo validado: `TikTok Creative Center — trending hashtags 2026-10-25: #IAparaCriadores 1.2M views (acesso 2026-10-25)`.

## 2. Google — Trends (oficial)

| Uso | Fonte | URL | Tipo e frescor | Licenca |
|-----|-------|-----|----------------|---------|
| Buscas diarias BR | Google Trends Daily | https://trends.google.com/trends/trendingsearches/daily?geo=BR | RSS/JSON diario | Termos Google |
| Buscas tempo real BR | Google Trends Realtime | https://trends.google.com/trends/trendingsearches/realtime?geo=BR | JSON tempo real | Termos Google |
| Topicos relacionados | Google Trends Explore | https://trends.google.com/trends/explore?geo=BR | JSON sob demanda | Termos Google |

Exemplo validado: `Google Trends — BR 2026-10-25: "Micro-SaaS no-code" 340k buscas/dia (acesso 2026-10-25)`.

## 3. YouTube — Trending (oficial)

| Uso | Fonte | URL | Tipo e frescor | Licenca |
|-----|-------|-----|----------------|---------|
| Videos trending BR | YouTube Trending | https://www.youtube.com/feed/trending?gl=BR | HTML/JSON diario | Termos YouTube |
| Categorias (educacao, tech) | YouTube Trending + API | https://developers.google.com/youtube/v3/docs/videos/list | JSON via API (quota) | Termos YouTube API |

Exemplo validado: `YouTube Trending — BR 2026-10-25: "Educacao financeira TikTok" 890k views (acesso 2026-10-25)`.

## 4. Meta — Ads Library (oficial, transparencia)

| Uso | Fonte | URL | Tipo e frescor | Licenca |
|-----|-------|-----|----------------|---------|
| Anuncios ativos BR | Meta Ads Library | https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR | JSON/HTML tempo real | Termos Meta |
| Anuncios por palavra-chave | Meta Ads Library Search | https://www.facebook.com/ads/library/?q=freelancer&country=BR | JSON filtrado | Termos Meta |

Exemplo validado: `Meta Ads Library — BR 2026-10-25: 12k anuncios ativos "freelancer landing page" (acesso 2026-10-25)`.

## 5. TSE — Dados abertos (oficial, sensivel)

| Uso | Fonte | URL | Tipo e frescor | Licenca |
|-----|-------|-----|----------------|---------|
| Candidatos 2026 | TSE Divulgacao | https://divulgacandcontas.tse.jus.br/ | CSV/JSON diario | gov.br |
| Propostas / programas | TSE Dados Abertos | https://dadosabertos.tse.jus.br/ | JSON sob demanda | gov.br |
| Doacoes / gastos | TSE Prestacao de Contas | https://prestacaocontas.tse.jus.br/ | JSON diario | gov.br |

**Regra sensivel**: Eleicoes = topico sensivel. So monitorar, nunca usar como base de oferta. Marcar `nao confirmado` ate validacao juridica. Fonte: TSE oficial.

## 6. X/Twitter — trends24.in (agregador publico)

| Uso | Fonte | URL | Tipo e frescor | Licenca |
|-----|-------|-----|----------------|---------|
| Trends Brasil 24h | trends24.in Brazil | https://trends24.in/brazil/ | HTML timeline 24h | trends24.in Terms |
| Historico (pago) | trends24.in archive | https://archive.trends24.in/ | CSV (assinatura) | trends24.in Terms |

Exemplo validado: `trends24.in Brazil 2026-10-25: #VotacaoAte19Horas 500k tweets (acesso 2026-10-25)`.

## 7. IBGE — SIDRA API (macro oficial)

| Uso | Fonte | URL | Tipo e frescor | Licenca |
|-----|-------|-----|----------------|---------|
| IPCA mensal | IBGE SIDRA tabela 7060 | https://sidra.ibge.gov.br/tabela/7060 | Mensal + series historicas | IBGE Dados Abertos |
| PNAD Continua | IBGE SIDRA tabela 6381 | https://sidra.ibge.gov.br/tabela/6381 | Trimestral | IBGE Dados Abertos |
| Varejo/Servicos | IBGE SIDRA | https://sidra.ibge.gov.br/ | Mensal | IBGE Dados Abertos |

Exemplo validado: `IBGE SIDRA IPCA 2026-10-25: -0.32% ago/2026, 12m 4.22% (acesso 2026-10-25)`.

## 8. Tesouro Direto — Historico (renda fixa oficial)

| Uso | Fonte | URL | Tipo e frescor | Licenca |
|-----|-------|-----|----------------|---------|
| Rentabilidade acumulada | Tesouro Direto | https://www.tesourodireto.com.br/.../rentabilidade-acumulada | Diario (market hours) | Tesouro Direto ToS |
| Historico precos/taxas | Tesouro Direto | https://www.tesourodireto.com.br/.../historico-de-precos-e-taxas | Diario (market hours) | Tesouro Direto ToS |

Exemplo validado: `Tesouro Direto 2026-10-25: Tesouro Selic 2029 rentabilidade 13.75% a.a. (acesso 2026-10-25)`.

## 9. Score 0-100 educacional — formula

`Score = (volume_norm * 0.4) + (velocidade_norm * 0.3) + (aderencia_objetivo * 0.3)`

- volume_norm: 0-1 (log10 views/buscas vs max dia)
- velocidade_norm: 0-1 (delta 24h vs media 7d)
- aderencia_objetivo: 0-1 (match manual trilha plano: freela|template|reserva|conteudo)

**Nao garante viralizacao**. Apenas comparacao educacional entre trends do dia.

## 10. Saturacao — criterio

| Nivel | Definicao | Acao sugerida |
|-------|-----------|---------------|
| alta | >70% creators/topicos ja cobrindo | diferenciar nicho ou aguardar |
| media | 30-70% | entrar com angulo unico |
| baixa | <30% | oportunidade de entrada (first mover educacional) |

## 11. Cache JSON (24h)

- Arquivo: `docs/dinheiro/trends-cache/YYYY-MM-DD.json` (fora do git, `.gitignore` ja cobre)
- Estrutura: `{topicos: [...], scores: {...}, saturacao: {...}, fontes: [...], fetched_at: "ISO8601"}`
- Expiracao: 24h. Refresh forcado via `/ganhar-trends` ou `/ganhar-diario`.
- Sem cache valido = buscar fontes novamente (respeitar rate limits oficiais).

## 12. Regras legais minimas (topicos — buscar juridico antes de publicar)

- CVM analista Res.20/2021: [Resolucao CVM 20](https://conteudo.cvm.gov.br/legislacao/resolucoes/resol020.html) — trend nao e recomendacao.
- CVM audiencia SDM 04/23 (finfluencer pode virar analista; disclaimer sozinho nao descaracteriza): [Edital SDM 04/23](https://conteudo.cvm.gov.br/export/sites/cvm/audiencias_publicas/ap_sdm/anexos/2023/sdm0423_Edital.pdf)
- LGPD (Lei 13.709/2018): [Planalto LGPD](https://planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) — minimizacao, base legal, direitos titular.
- Eleicoes (Lei 9.504/1997 + Res. TSE 23.610/2019): propaganda antecipada, uso de dados sensiveis. [TSE resolucoes 2026](https://www.tse.jus.br/legislacao/resolucoes).
- Disclaimer obrigatorio: `Conteudo educacional, nao e recomendacao personalizada. Sem promessa de lucro. Risco de perda. Fontes oficiais com data.`