# opencode-modo-money

Modo de grana para OpenCode: `moneymaker` (primary) + 3 coords + 8 workers + `trends-research`, comandos `/ganhar`, `/ganhar-diario`, `/ganhar-trends`, template `PLANO-GANHO.md`, docs com disclaimer e fontes oficiais, evals de compliance, **coleta diária automatizada de tendências (Fase 10)**.

> Conteúdo educacional. Não é recomendação de investimento. Há risco de perda, inclusive total. Sem promessa de lucro.

Exportado do modo orquestrador (missão moneymaker, `coord-qualidade: LIBERADO` pendente — ver gate).

## Conteúdo

```
agents/           moneymaker, coord-mercado, coord-negocios, coord-risco + 8 workers + trends-research
commands/         ganhar.md (/ganhar) + ganhar-diario.md (/ganhar-diario) + ganhar-trends.md (/ganhar-trends)
templates/        PLANO-GANHO.md (8 seções) + TREND-SCHEMA.md (Zod TrendOportunidade)
docs/dinheiro/    README + disclaimer + fontes-mercado + fontes-trends + trends-cache/ + exemplo-renda-extra/
evals/            money.md (19 evals: 14 base + 5 trends)
scripts/          fetch-trends.mjs (coleta diária 7 fontes) + validate.mjs (expandido)
.github/workflows/trends.yml (daily cron 06:00 UTC)
```

## Instalação

```powershell
# na sua config ativa do OpenCode (faça backup antes)
Copy-Item -Recurse agents, commands, templates, docs, evals, scripts, .github "$env:USERPROFILE.configopencode"
Copy-Item opencode.jsonc "$env:USERPROFILE.configopencode"
```

> Dependência opcional: o `moneymaker` pode acionar `coord-pesquisa` (web-researcher) quando faltar fonte oficial — esse coord vive no repo `opencode-orquestrador`. Sem ele, o modo funciona com a regra `não confirmado`.

## Uso

- `/ganhar <objetivo> [capital] [horas/semana] [risco]` — plano 30/60/90 dias (risco `baixo|medio|alto`, default `medio`).
- `/ganhar-diario <objetivo>` — rotina diária (3 tendências + 1 ação + risco do dia).
- `/ganhar-trends <objetivo> [capital] [horas/semana] [risco]` — plano orientado a trends virais/comportamento (cache `trends-cache/YYYY-MM-DD.json`).

## Comandos de infra (Trends)

```bash
# Coleta manual de tendências (7 fontes: TikTok, Google Trends, TSE, YouTube, Meta, SEBRAE, IBGE/BCB)
npm run fetch-trends

# Validação completa (inclui cheques trends: cache fresco, schema, fontes, evals)
npm run validate
```

## CI/CD (GitHub Actions)

- `.github/workflows/trends.yml`: daily cron 06:00 UTC → `fetch-trends` + `validate` + commit automático `chore(trends): atualiza cache YYYY-MM-DD` se houver mudanças.
- Secrets necessários (opcionais): `TIKTOK_CREATIVE_CENTER_KEY`, `META_ACCESS_TOKEN`.

## Variáveis de ambiente (.env)

Copie `.env.example` → `.env` e preencha (opcional para trends):
- `TIKTOK_CREATIVE_CENTER_KEY` — TikTok Creative Center API (hashtags virais completas)
- `META_ACCESS_TOKEN` — Meta Graph API (tópicos Facebook/Instagram)
- `ANONYMIZED_TELEMETRY=false` — desabilita telemetria OpenCode

Sem chaves, `fetch-trends` roda com fallback vazio + aviso no log (Google Trends, TSE, YouTube, SEBRAE, IBGE/BCB funcionam sem chave).

## Regras duras do modo

- Sem promessa de lucro, sem recomendação personalizada (só educação + matriz; o usuário decide).
- Cotação sempre com data+fonte; sem fonte oficial = `não confirmado`. Preço cripto = referência operacional, nunca oficial.
- Todo doc em `docs/dinheiro/` linka o `disclaimer.md`. Sem disclaimer, doc incompleto.
- Nenhum segredo no repo (`.env` fora do git, chaves só via env). Nunca CPF/saldo/chave real.
- Nunca pirâmide, insider ou bypass de paywall/ToS. Oferta suspeita = alerta + denúncia CVM.
- **Trends**: cache diário versionado, schema `TrendOportunidade` válido, `base_legal` obrigatório para categoria `eleitoral`.

## Licença

MIT — ver `LICENSE`.