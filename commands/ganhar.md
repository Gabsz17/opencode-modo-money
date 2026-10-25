# /ganhar — inicia plano de ganho com o moneymaker

> Conteudo educacional. Nao e recomendacao de investimento. Ha risco de perda. Ver [Aviso educacional — disclaimer](../docs/dinheiro/disclaimer.md). Sem promessa de lucro.

Invoque o agent `moneymaker` com o objetivo e os parametros abaixo. Ele cria o plano em `docs/dinheiro/<objetivo>/PLANO-GANHO.md` a partir de `templates/PLANO-GANHO.md` e delega aos coords de mercado, negocios e risco (e ao `coord-pesquisa` quando faltar fonte oficial).

Uso: `/ganhar <objetivo> [capital] [horas/semana] [risco]` — risco `baixo|medio|alto` (default `medio`).

Objetivo: <descreva o objetivo financeiro, ex. renda-extra-2k>
Capital: <faixa inicial: ate-1k|1k-5k|5k-20k|20k+ — default nao-informado>
Horas por semana: <horas disponiveis, ex. 6 — default nao-informado>
Risco: <baixo|medio|alto — default medio>
