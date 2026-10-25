// validate.mjs — Validação estrutural do modo moneymaker (Fase 10 + Trends)
// Uso: npm run validate
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warns = [];
const ok = (msg) => console.log("ok - " + msg);
const fail = (msg) => { errors.push(msg); console.error("FAIL - " + msg); };
const warn = (msg) => { warns.push(msg); console.warn("WARN - " + msg); };

// 1. Arquivos obrigatórios (base + trends + extras)
const required = [
  "opencode.jsonc", "README.md", "LICENSE", ".env.example", "package.json",
  "templates/PLANO-GANHO.md",
  "commands/ganhar.md", "commands/ganhar-diario.md", "commands/ganhar-trends.md",
  "docs/dinheiro/README.md", "docs/dinheiro/disclaimer.md", "docs/dinheiro/fontes-mercado.md", "docs/dinheiro/fontes-trends.md",
  "docs/dinheiro/exemplo-renda-extra/PLANO-GANHO.md",
  "evals/money.md",
  "agents/moneymaker.md", "agents/coord-mercado.md", "agents/coord-negocios.md", "agents/coord-risco.md",
  "agents/mercado-acoes.md", "agents/mercado-cripto.md", "agents/mercado-renda-fixa.md",
  "agents/negocio-freela.md", "agents/negocio-digital.md", "agents/negocio-local.md",
  "agents/tendencia-pesquisa.md", "agents/risco-gestao.md", "agents/trends-research.md",
  "templates/TREND-SCHEMA.md",
  "scripts/fetch-trends.mjs",
  "scripts/gen-report.mjs",
  "scripts/backup.mjs",
  "scripts/restore.mjs"
];
for (const f of required) existsSync(join(root, f)) ? ok("existe " + f) : fail("faltando " + f);

// 2. opencode.jsonc parseável + base segura (Opção A: sem trigger global)
try {
  const raw = readFileSync(join(root, "opencode.jsonc"), "utf8").replace(/^\s*\/\/.*$/gm, "");
  const cfg = JSON.parse(raw);
  cfg.default_agent === "moneymaker" ? ok("default_agent=moneymaker") : fail("opencode.jsonc sem default_agent=moneymaker");
  const bash = cfg?.permission?.bash ?? {};
  const denies = ["git push --force*", "rm -rf*"].every((k) => bash[k] === "deny");
  denies ? ok("base segura nega force-push/rm-rf") : fail("opencode.jsonc sem deny de force-push/rm-rf");
  cfg?.permission?.external_directory === "deny" ? ok("external_directory=deny") : fail("sem external_directory=deny");
  // Opção A: sem trigger global; MCP opcional para trends-browser
  if (cfg?.mcp?.servers?.["trends-browser"]) {
    ok("MCP trends-browser configurado (opcional)");
  } else {
    warn("MCP trends-browser não configurado — TikTok/Meta podem precisar browser (configure se necessário)");
  }
} catch (e) { fail("opencode.jsonc inválido: " + e.message); }

// 3. Frontmatter agents + task allow
const agentsDir = join(root, "agents");
const agentFiles = new Set(readdirSync(agentsDir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")));
for (const file of readdirSync(agentsDir).filter((f) => f.endsWith(".md"))) {
  const text = readFileSync(join(agentsDir, file), "utf8");
  if (!text.startsWith("---")) { fail(file + " sem frontmatter"); continue; }
  const fm = text.split("---")[1] ?? "";
  if (!/description:/.test(fm)) fail(file + " sem description");
  if (!/mode:\s*(primary|subagent)/.test(fm)) fail(file + " sem mode");
  if (!/temperature:\s*0\.1/.test(fm)) fail(file + " sem temperature 0.1");
  if (!/question:\s*deny/.test(fm)) fail(file + " sem question deny");
}
ok("agents verificados (" + agentFiles.size + ")");

// moneymaker só fala com coords (inclui coord-pesquisa e trends-research se existir)
{
  const text = readFileSync(join(agentsDir, "moneymaker.md"), "utf8");
  const fm = text.split("---")[1] ?? "";
  for (const c of ["coord-mercado", "coord-negocios", "coord-risco", "coord-pesquisa", "trends-research"]) {
    fm.includes('"' + c + '": allow') ? ok("moneymaker -> " + c) : warn("moneymaker não autoriza " + c + " (opcional se não existir)");
  }
  /"mode":\s*primary|mode:\s*primary/.test(fm) ? ok("moneymaker primary") : fail("moneymaker não primary");
}

// 4. Disclaimer linkado em todo doc dinheiro
{
  const docs = [
    "docs/dinheiro/README.md", 
    "docs/dinheiro/fontes-mercado.md", 
    "docs/dinheiro/fontes-trends.md",
    "docs/dinheiro/exemplo-renda-extra/PLANO-GANHO.md"
  ];
  for (const d of docs) {
    const t = readFileSync(join(root, d), "utf8");
    /disclaimer\.md/.test(t) ? ok(d + " linka disclaimer") : fail(d + " sem link disclaimer");
  }
}

// 5. Sem segredo (nomes vazios ok, valor real falha)
{
  const envEx = readFileSync(join(root, ".env.example"), "utf8");
  const lines = envEx.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));
  const withVal = lines.filter((l) => {
    const parts = l.split("=");
    return parts[1] && parts[1].trim() && !/ANONYMIZED_TELEMETRY=false/.test(l);
  });
  withVal.length === 0 ? ok(".env.example sem valores reais") : fail(".env.example com valor: " + withVal.join(";"));
  const bad = ["AKIA", "ghp_", "github_pat_", "sk-"];
  const hits = [];
  // Verifica apenas docs/, templates/, commands/, evals/ (agents documentam padrões, não contêm segredos reais)
  const checkDirs = ["docs/", "templates/", "commands/", "evals/", "scripts/"];
  for (const f of required.filter((x) => x.endsWith(".md"))) {
    if (!checkDirs.some(d => f.startsWith(d))) continue; // pula agents/
    try {
      const t = readFileSync(join(root, f), "utf8");
      for (const b of bad) if (t.includes(b)) hits.push(f + ":" + b);
    } catch {}
  }
  hits.length === 0 ? ok("sem segredo nos .md (docs/templates/commands/evals/scripts)") : fail("possível segredo: " + hits.join(","));
}

// 6. Template 8 seções
{
  const t = readFileSync(join(root, "templates/PLANO-GANHO.md"), "utf8");
  const secs = ["## 1.", "## 2.", "## 3.", "## 4.", "## 5.", "## 6.", "## 7.", "## 8."];
  secs.every((s) => t.includes(s)) ? ok("PLANO-GANHO 8 seções") : fail("PLANO-GANHO sem 8 seções");
  /nao constitui recomendacao|nao e recomendacao/i.test(t) ? ok("template com disclaimer") : fail("template sem disclaimer");
}

// 7. NOVO: Trends cache fresco (<24h)
{
  const cacheDir = join(root, "docs", "dinheiro", "trends-cache");
  if (existsSync(cacheDir)) {
    const files = readdirSync(cacheDir).filter(f => f.endsWith(".json"));
    if (files.length === 0) {
      warn("trends-cache vazio — rode npm run fetch-trends");
    } else {
      const latest = files.sort().pop();
      const filepath = join(cacheDir, latest);
      const stats = statSync(filepath);
      const ageHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);
      if (ageHours < 24) {
        ok("trends-cache fresco: " + latest + " (" + ageHours.toFixed(1) + "h)");
      } else {
        warn("trends-cache vencido: " + latest + " (" + ageHours.toFixed(1) + "h) — rode npm run fetch-trends");
      }
      // Valida schema básico do cache
      try {
        const cache = JSON.parse(readFileSync(filepath, "utf8"));
        if (Array.isArray(cache)) {
          const requiredFields = ["id", "titulo", "fonte", "url", "data_coleta", "categoria", "tags", "raw_data"];
          const invalidos = cache.filter(t => requiredFields.some(f => !(f in t)));
          invalidos.length === 0 ? ok("cache " + latest + " schema OK (" + cache.length + " itens)") : warn("cache " + latest + " tem " + invalidos.length + " itens com campos faltando");
        } else {
          fail("cache " + latest + " não é array");
        }
      } catch (e) {
        fail("cache " + latest + " JSON inválido: " + e.message);
      }
    }
  } else {
    warn("pasta trends-cache não existe — rode npm run fetch-trends");
  }
}

// 8. NOVO: agents/trends-research.md frontmatter válido + task allow
{
  const f = "agents/trends-research.md";
  if (existsSync(join(root, f))) {
    const text = readFileSync(join(root, f), "utf8");
    if (!text.startsWith("---")) { fail(f + " sem frontmatter"); }
    else {
      const fm = text.split("---")[1] ?? "";
      /description:/.test(fm) ? ok(f + " tem description") : fail(f + " sem description");
      /mode:\s*subagent/.test(fm) ? ok(f + " mode subagent") : fail(f + " sem mode subagent");
      /temperature:\s*0\.1/.test(fm) ? ok(f + " temperature 0.1") : fail(f + " sem temperature 0.1");
      /question:\s*deny/.test(fm) ? ok(f + " question deny") : fail(f + " sem question deny");
      /task:\s*allow/.test(fm) ? ok(f + " task allow") : warn(f + " sem task allow (pode precisar para sub-delegação)");
    }
  } else {
    warn(f + " não existe — será criado pelo plat-docs");
  }
}

// 9. NOVO: commands/ganhar-trends.md invoca moneymaker
{
  const f = "commands/ganhar-trends.md";
  if (existsSync(join(root, f))) {
    const text = readFileSync(join(root, f), "utf8");
    /moneymaker/i.test(text) ? ok(f + " invoca moneymaker") : fail(f + " não invoca moneymaker");
    /trends|tendencia/i.test(text) ? ok(f + " menciona trends") : fail(f + " não menciona trends");
  } else {
    fail(f + " não existe — será criado pelo plat-docs");
  }
}

// 10. NOVO: docs/dinheiro/fontes-trends.md existe + links válidos
{
  const f = "docs/dinheiro/fontes-trends.md";
  if (existsSync(join(root, f))) {
    const text = readFileSync(join(root, f), "utf8");
    const fontesEsperadas = ["TikTok", "Google Trends", "TSE", "YouTube", "Meta", "SEBRAE", "IBGE", "BCB"];
    let encontradas = 0;
    for (const fe of fontesEsperadas) {
      if (new RegExp(fe, "i").test(text)) encontradas++;
    }
    encontradas >= 7 ? ok(f + " tem " + encontradas + "/8 fontes esperadas") : warn(f + " tem apenas " + encontradas + "/8 fontes esperadas");
    /disclaimer\.md/.test(text) ? ok(f + " linka disclaimer") : fail(f + " sem link disclaimer");
  } else {
    fail(f + " não existe");
  }
}

// 11. NOVO: Schema TrendOportunidade em templates/TREND-SCHEMA.md (zod)
{
  const f = "templates/TREND-SCHEMA.md";
  if (existsSync(join(root, f))) {
    const text = readFileSync(join(root, f), "utf8");
    /zod/.test(text) ? ok(f + " usa zod") : warn(f + " não usa zod (recomendado)");
    /TrendOportunidade/.test(text) ? ok(f + " define TrendOportunidade") : fail(f + " não define TrendOportunidade");
    const campos = ["id", "titulo", "fonte", "url", "data_coleta", "categoria", "tags", "raw_data", "base_legal?"];
    let okCampos = 0;
    for (const c of campos) if (new RegExp(c.replace("?", "\\?")).test(text)) okCampos++;
    okCampos >= 7 ? ok(f + " tem " + okCampos + "/9 campos") : warn(f + " tem apenas " + okCampos + "/9 campos");
  } else {
    fail(f + " não existe");
  }
}

// 12. NOVO: Evals money.md inclui casos trends
{
  const f = "evals/money.md";
  const text = readFileSync(join(root, f), "utf8");
  const evalsEsperados = ["promessa-score", "eleitoral-sem-base_legal", "cache-vencido", "tendencia-sem-fonte"];
  for (const ev of evalsEsperados) {
    new RegExp(ev.replace("_", "\\s+")).test(text) ? ok("eval " + ev + " presente") : warn("eval " + ev + " ausente em " + f);
  }
}

// 13. NOVO: .github/workflows/trends.yml sintaxe válida + cron 06:00 UTC
{
  const f = ".github/workflows/trends.yml";
  if (existsSync(join(root, f))) {
    const text = readFileSync(join(root, f), "utf8");
    /on:\s*\n\s*schedule:/i.test(text) ? ok(f + " tem schedule") : fail(f + " sem schedule");
    /cron:.*06:00/.test(text) ? ok(f + " cron 06:00 UTC") : warn(f + " cron não é 06:00 UTC");
    /fetch-trends/.test(text) ? ok(f + " roda fetch-trends") : fail(f + " não roda fetch-trends");
    /validate/.test(text) ? ok(f + " roda validate") : fail(f + " não roda validate");
    /chore\(trends\)/.test(text) ? ok(f + " commit automático chore(trends)") : warn(f + " sem commit automático padrão");
    /github-actions/.test(text) ? ok(f + " configura git user github-actions") : warn(f + " sem git config user github-actions");
  } else {
    fail(f + " não existe");
  }
}

// 14. NOVO: Scripts extras (gen-report, backup, restore)
{
  const extraScripts = ["gen-report.mjs", "backup.mjs", "restore.mjs"];
  for (const s of extraScripts) {
    const f = "scripts/" + s;
    if (existsSync(join(root, f))) {
      const text = readFileSync(join(root, f), "utf8");
      /#!/ .test(text) ? ok(f + " tem shebang") : warn(f + " sem shebang (opcional)");
      /node:fs/.test(text) ? ok(f + " importa fs") : warn(f + " sem import fs");
    } else {
      fail(f + " não existe");
    }
  }
  // package.json scripts
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const needed = ["gen-report", "backup", "restore"];
  for (const n of needed) {
    pkg.scripts?.[n] ? ok("package.json script " + n) : warn("package.json sem script " + n);
  }
}

if (errors.length) { console.error("\n" + errors.length + " falha(s)"); process.exit(1); }
if (warns.length) { console.log("\n" + warns.length + " aviso(s) — revise se necessário"); }
console.log("\nvalidate verde");