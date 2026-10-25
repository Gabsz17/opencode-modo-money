# Dinheiro — como usar

> Conteudo educacional. Nao e recomendacao de investimento. Ha risco de perda. Leia o [Aviso educacional — disclaimer](disclaimer.md) antes de usar. Sem promessa de lucro.

## Inicio rapido

1. Rode `/ganhar <objetivo> [capital] [horas/semana] [risco]` (risco `baixo|medio|alto`, default `medio`).
2. O moneymaker cria `docs/dinheiro/<objetivo>/PLANO-GANHO.md` a partir de `templates/PLANO-GANHO.md` e delega aos coords.
3. Rode `/ganhar-diario <objetivo>` todo dia util para 1 acao + risco do dia.

## Estrutura por objetivo

| Arquivo | O que guarda | Quem atualiza |
|---------|--------------|---------------|
| `PLANO-GANHO.md` | metas, matriz de decisao, plano 30/60/90 dias | moneymaker |
| `progresso.md` | estado atual, metricas com data e fonte | moneymaker |
| `oportunidades.md` | oportunidades com pros, contras e riscos | moneymaker |

## Regras do modo

- Afirmacao de mercado sem fonte oficial = `nao confirmado`.
- Fontes validas: ver [Fontes de mercado — BCB, CVM, B3](fontes-mercado.md).
- Nenhum segredo no repo (`.env` fora do git, chaves so via env).
- Cotacao ou dado sempre com data e fonte.

## Sua primeira sessao

1. O moneymaker le seu objetivo, capital, horas e risco declarado e registra o ponto de partida no plano.
2. Cada sessao tem 1 acao com criterio de parada — quando cumprir, pare (o resto fica para a proxima).
3. Seu progresso fica em **`progresso.md`**: onde parou, metricas, proxima acao. Sem fonte = `nao confirmado`.
