#!/usr/bin/env node
// scripts/gen-report.mjs — Gera relatório mensal do objetivo
// Uso: node scripts/gen-report.mjs <objetivo> [YYYY-MM]

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OBJ = process.argv[2];
const PERIOD = process.argv[3] || new Date().toISOString().slice(0, 7); // YYYY-MM

if (!OBJ) {
  console.error("Uso: node scripts/gen-report.mjs <objetivo> [YYYY-MM]");
  process.exit(1);
}

const OBJ_DIR = join(ROOT, "docs/dinheiro", OBJ);
if (!existsSync(OBJ_DIR)) {
  console.error(`Objetivo nao encontrado: ${OBJ_DIR}`);
  process.exit(1);
}

function readIfExists(p) { return existsSync(p) ? readFileSync(p, "utf8") : ""; }
function countLines(t) { return t.split("\n").filter(l => l.trim()).length; }

const plano = readIfExists(join(OBJ_DIR, "PLANO-GANHO.md"));
const progresso = readIfExists(join(OBJ_DIR, "progresso.md"));
const oportunidades = readIfExists(join(OBJ_DIR, "oportunidades.md"));
const trends = readIfExists(join(OBJ_DIR, "trends.md"));

const metricas = (progresso.match(/\| \d{4}-\d{2}-\d{2} \|/g) || []).length;
const opsTotal = (oportunidades.match(/\| \d{4}-\d{2}-\d{2} \|/g) || []).length;
const trendsCount = (trends.match(/\| \d+\s*\|/g) || []).length;

const report = `# Relatório Mensal — ${OBJ} (${PERIOD})

> Conteudo educacional. Nao e recomendacao de investimento. Ha risco de perda. Ver [disclaimer](../disclaimer.md).

## Resumo Executivo
- **Objetivo**: ${plano.match(/Objetivo.*?:(.*?)\n/)?.[1]?.trim() || "nao informado"}
- **Periodo**: ${PERIOD}
- **Metricas registradas**: ${metricas}
- **Oportunidades avaliadas**: ${opsTotal}
- **Trends capturados**: ${trendsCount}
- **Status geral**: ${plano.includes("validar") ? "em validacao" : "planejado"}

## Evolucao do Plano
\`\`\`markdown
${plano.slice(0, 500)}...
\`\`\`

## Metricas do Periodo
\`\`\`markdown
${progresso.slice(-300)}
\`\`\`

## Oportunidades (Top 5)
\`\`\`markdown
${oportunidades.slice(0, 400)}...
\`\`\`

## Trends do Periodo
\`\`\`markdown
${trends.slice(0, 400)}...
\`\`\`

## Acoes Recomendadas Proximo Mes
1. Validar oportunidades com status "validar" (fonte + data)
2. Atualizar cache trends se vencido (>24h): \`npm run fetch-trends\`
3. Revisar stop-loss e diversificacao (secao 5 do PLANO-GANHO)
4. Checar compliance eleitoral se houver trends categoria "eleitoral"
5. Rodar \`npm run validate\` antes de commit

## Alertas
${trends.includes("saturacao alta") ? "- ⚠️ Saturacao alta detectada em trend — diferenciar nicho ou aguardar" : "- Nenhum alerta critico"}
${oportunidades.includes("eleitoral") && !oportunidades.includes("base_legal") ? "- ⚠️ Trend eleitoral sem base_legal — marcar nao confirmado" : ""}

---
*Gerado automaticamente por \`gen-report.mjs\` em ${new Date().toISOString()}*
`;

const OUT = join(OBJ_DIR, `relatorio-${PERIOD}.md`);
writeFileSync(OUT, report, "utf-8");
console.log(`Relatorio gerado: ${OUT}`);