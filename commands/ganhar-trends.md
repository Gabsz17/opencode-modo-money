# /ganhar-trends — tendências do dia para o plano

> Conteudo educacional. Nao e recomendacao de investimento. Ha risco de perda. Ver [Aviso educacional — disclaimer](../docs/dinheiro/disclaimer.md). Sem promessa de lucro.

Invoca o agent `moneymaker` que delega a `coord-mercado` -> `tendencia-pesquisa` + coords existentes.

Cria/atualiza `docs/dinheiro/<objetivo>/trends.md` (matriz trends do dia + score + saturacao).
Atualiza `progresso.md` (tendencia do dia + acao trends + risco trends).
Atualiza `oportunidades.md` (linhas `TrendOportunidade` com score).

Uso: `/ganhar-trends <objetivo> [capital] [horas/semana] [risco] [fonte:tiktok|google|youtube|meta|tse|all]` — risco `baixo|medio|alto` (default `medio`), fonte default `all`.

Objetivo: <descreva o objetivo financeiro, ex. renda-extra-2k>
Capital: <faixa inicial: ate-1k|1k-5k|5k-20k|20k+ — default nao-informado>
Horas por semana: <horas disponiveis, ex. 6 — default nao-informado>
Risco: <baixo|medio|alto — default medio>
Fonte: <tiktok|google|youtube|meta|tse|all — default all>