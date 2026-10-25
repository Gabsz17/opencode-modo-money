# Dinheiro — como usar

> Conteudo educacional. Nao e recomendacao de investimento. Ha risco de perda. Leia o [Aviso educacional — disclaimer](disclaimer.md) antes de usar. Sem promessa de lucro.

## Inicio rapido

1. Rode `/ganhar <objetivo> [capital] [horas/semana] [risco]` (risco `baixo|medio|alto`, default `medio`).
2. O moneymaker cria `docs/dinheiro/<objetivo>/PLANO-GANHO.md` a partir de `templates/PLANO-GANHO.md` e delega aos coords.
3. Rode `/ganhar-diario <objetivo>` todo dia util para 1 acao + risco do dia.
4. Rode `/ganhar-trends <objetivo> [capital] [horas/semana] [risco] [fonte]` para matriz de trends do dia (score 0-100 educacional + saturacao).

## Estrutura por objetivo

| Arquivo | O que guarda | Quem atualiza |
|---------|--------------|---------------|
| `PLANO-GANHO.md` | metas, matriz de decisao, plano 30/60/90 dias | moneymaker |
| `trends.md` | matriz trends do dia (score 0-100, saturacao, fonte) | moneymaker via coord-mercado/tendencia-pesquisa |
| `fontes-trends.md` | fontes validas de trends (TikTok Creative Center, Google Trends, YouTube Trending, Meta Ads Library, TSE) | coord-mercado |
| `progresso.md` | estado atual, metricas com data e fonte | moneymaker |
| `oportunidades.md` | oportunidades com pros, contras e riscos | moneymaker |

## Regras do modo

- Afirmacao de mercado sem fonte oficial = `nao confirmado`.
- Fontes validas mercado: ver [Fontes de mercado — BCB, CVM, B3](fontes-mercado.md).
- Fontes validas trends: ver [Fontes de trends — TikTok, Google, YouTube, Meta, TSE](fontes-trends.md).
- Cache trends JSON (24h) — score 0-100 educacional, saturacao alta/media/baixa, sem promessa de viralizacao.
- Nenhum segredo no repo (`.env` fora do git, chaves so via env).
- Cotacao ou dado sempre com data e fonte.

## Sua primeira sessao

1. O moneymaker le seu objetivo, capital, horas e risco declarado e registra o ponto de partida no plano.
2. Cada sessao tem 1 acao com criterio de parada — quando cumprir, pare (o resto fica para a proxima).
3. Seu progresso fica em **`progresso.md`**: onde parou, metricas, proxima acao. Sem fonte = `nao confirmado`.

## Como usar trends

1. Rode `/ganhar-trends <objetivo> [fonte:tiktok|google|youtube|meta|tse|all]` — default `all`.
2. O `moneymaker` delega a `coord-mercado` -> `tendencia-pesquisa` que consulta fontes oficiais (TikTok Creative Center, Google Trends, YouTube Trending, Meta Ads Library, TSE dados abertos).
3. Resultado em `docs/dinheiro/<objetivo>/trends.md`: matriz com **score 0-100 educacional** (volume + velocidade + aderencia ao objetivo), **saturacao** (alta|media|baixa), **fonte + data**.
4. `progresso.md` ganha linha: "Tendencia do dia: <topico> (score XX, fonte YYY, data) | Acao trends: <acao educacional> | Risco trends: <saturacao/viés>".
5. `oportunidades.md` ganha linhas `TrendOportunidade` com score, pros/contras/risco trends, fonte, status `validar`|`nao confirmado`.
6. Sem fonte oficial = `nao confirmado`. Score nao garante resultado — apenas educacao comparativa.