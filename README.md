# opencode-modo-money

Modo de grana para OpenCode: `moneymaker` (primary) + 3 coords + 8 workers, comandos `/ganhar` e `/ganhar-diario`, template `PLANO-GANHO.md`, docs com disclaimer e fontes oficiais, evals de compliance.

> Conteudo educacional. Nao e recomendacao de investimento. Ha risco de perda, inclusive total. Sem promessa de lucro.

Exportado do modo orquestrador (missao moneymaker, `coord-qualidade: LIBERADO` pendente — ver gate).

## Conteudo

```
agents/           moneymaker, coord-mercado, coord-negocios, coord-risco + 8 workers
commands/         ganhar.md (/ganhar) + ganhar-diario.md (/ganhar-diario)
templates/        PLANO-GANHO.md (8 secoes)
docs/dinheiro/    README + disclaimer + fontes-mercado + exemplo-renda-extra/
evals/            money.md (14 evals de comportamento)
```

## Instalacao

```powershell
# na sua config ativa do OpenCode (faca backup antes)
Copy-Item -Recurse agents\, commands\, templates\, docs\, evals\ "$env:USERPROFILE\.config\opencode\"
```

> Dependencia opcional: o `moneymaker` pode acionar `coord-pesquisa` (web-researcher) quando faltar fonte oficial — esse coord vive no repo `opencode-orquestrador`. Sem ele, o modo funciona com a regra `nao confirmado`.

## Uso

- `/ganhar <objetivo> [capital] [horas/semana] [risco]` — plano 30/60/90 dias (risco `baixo|medio|alto`, default `medio`).
- `/ganhar-diario <objetivo>` — rotina diaria (3 tendencias + 1 acao + risco do dia).

## Regras duras do modo

- Sem promessa de lucro, sem recomendacao personalizada (so educacao + matriz; o usuario decide).
- Cotacao sempre com data+fonte; sem fonte oficial = `nao confirmado`. Preco cripto = referencia operacional, nunca oficial.
- Todo doc em `docs/dinheiro/` linka o `disclaimer.md`. Sem disclaimer, doc incompleto.
- Nenhum segredo no repo (`.env` fora do git, chaves de leitura so via env). Nunca CPF/saldo/chave real.
- Nunca piramide, insider ou bypass de paywall/ToS. Oferta suspeita = alerta + denuncia CVM.

## Licenca

MIT — ver `LICENSE`.
