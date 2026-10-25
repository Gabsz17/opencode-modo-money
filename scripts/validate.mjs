// Validacao estrutural do modo moneymaker (sem dependencias).
// Uso: npm run validate
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const ok = (msg) => console.log(`ok - ${msg}`);
const fail = (msg) => { errors.push(msg); console.error(`FAIL - ${msg}`); };

// 1. Arquivos obrigatorios
const required = [
  "opencode.jsonc", "README.md", "LICENSE", ".env.example", "package.json",
  "templates/PLANO-GANHO.md",
  "commands/ganhar.md", "commands/ganhar-diario.md",
  "docs/dinheiro/README.md", "docs/dinheiro/disclaimer.md", "docs/dinheiro/fontes-mercado.md",
  "docs/dinheiro/exemplo-renda-extra/PLANO-GANHO.md",
  "evals/money.md",
  "agents/moneymaker.md", "agents/coord-mercado.md", "agents/coord-negocios.md", "agents/coord-risco.md",
  "agents/mercado-acoes.md", "agents/mercado-cripto.md", "agents/mercado-renda-fixa.md",
  "agents/negocio-freela.md", "agents/negocio-digital.md", "agents/negocio-local.md",
  "agents/tendencia-pesquisa.md", "agents/risco-gestao.md"
];
for (const f of required) existsSync(join(root, f)) ? ok(`existe ${f}`) : fail(`faltando ${f}`);

// 2. opencode.jsonc parseavel + base segura (Opcao A: sem trigger global)
try {
  const raw = readFileSync(join(root, "opencode.jsonc"), "utf8").replace(/^\s*\/\/.*$/gm, "");
  const cfg = JSON.parse(raw);
  cfg.default_agent === "moneymaker" ? ok("default_agent=moneymaker") : fail("opencode.jsonc sem default_agent=moneymaker");
  const bash = cfg?.permission?.bash ?? {};
  const denies = ["git push --force*", "rm -rf*"].every((k) => bash[k] === "deny");
  denies ? ok("base segura nega force-push/rm-rf") : fail("opencode.jsonc sem deny de force-push/rm-rf");
  cfg?.permission?.external_directory === "deny" ? ok("external_directory=deny") : fail("sem external_directory=deny");
} catch (e) { fail(`opencode.jsonc invalido: ${e.message}`); }

// 3. Frontmatter agents + task allow
const agentsDir = join(root, "agents");
const agentFiles = new Set(readdirSync(agentsDir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")));
for (const file of readdirSync(agentsDir).filter((f) => f.endsWith(".md"))) {
  const text = readFileSync(join(agentsDir, file), "utf8");
  if (!text.startsWith("---")) { fail(`${file} sem frontmatter`); continue; }
  const fm = text.split("---")[1] ?? "";
  if (!/description:/.test(fm)) fail(`${file} sem description`);
  if (!/mode:\s*(primary|subagent)/.test(fm)) fail(`${file} sem mode`);
  if (!/temperature:\s*0\.1/.test(fm)) fail(`${file} sem temperature 0.1`);
  if (!/question:\s*deny/.test(fm)) fail(`${file} sem question deny`);
}
ok(`agents verificados (${agentFiles.size})`);

// moneymaker so fala com coords
{
  const text = readFileSync(join(agentsDir, "moneymaker.md"), "utf8");
  const fm = text.split("---")[1] ?? "";
  for (const c of ["coord-mercado", "coord-negocios", "coord-risco", "coord-pesquisa"]) {
    fm.includes(`"${c}": allow`) ? ok(`moneymaker -> ${c}`) : fail(`moneymaker nao autoriza ${c}`);
  }
  /"mode":\s*primary|mode:\s*primary/.test(fm) ? ok("moneymaker primary") : fail("moneymaker nao primary");
}

// 4. Disclaimer linkado em todo doc dinheiro
{
  const docs = ["docs/dinheiro/README.md", "docs/dinheiro/fontes-mercado.md", "docs/dinheiro/exemplo-renda-extra/PLANO-GANHO.md"];
  for (const d of docs) {
    const t = readFileSync(join(root, d), "utf8");
    /disclaimer\.md/.test(t) ? ok(`${d} linka disclaimer`) : fail(`${d} sem link disclaimer`);
  }
}

// 5. Sem segredo (nomes vazios ok, valor real falha)
{
  const envEx = readFileSync(join(root, ".env.example"), "utf8");
  const lines = envEx.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));
  const withVal = lines.filter((l) => /=.+\S/.test(l.split("=")[1] ?? "") && !/ANONYMIZED_TELEMETRY=false/.test(l));
  withVal.length === 0 ? ok(".env.example sem valores reais") : fail(`.env.example com valor: ${withVal.join(";")}`);
  const bad = ["AKIA", "ghp_", "github_pat_", "sk-"];
  const hits = [];
  for (const f of required.filter((x) => x.endsWith(".md"))) {
    try {
      const t = readFileSync(join(root, f), "utf8");
      for (const b of bad) if (t.includes(b)) hits.push(`${f}:${b}`);
    } catch {}
  }
  hits.length === 0 ? ok("sem segredo nos .md") : fail(`possivel segredo: ${hits.join(",")}`);
}

// 6. Template 8 secoes
{
  const t = readFileSync(join(root, "templates/PLANO-GANHO.md"), "utf8");
  const secs = ["## 1.", "## 2.", "## 3.", "## 4.", "## 5.", "## 6.", "## 7.", "## 8."];
  secs.every((s) => t.includes(s)) ? ok("PLANO-GANHO 8 secoes") : fail("PLANO-GANHO sem 8 secoes");
  /nao constitui recomendacao|nao e recomendacao/i.test(t) ? ok("template com disclaimer") : fail("template sem disclaimer");
}

if (errors.length) { console.error(`\n${errors.length} falha(s)`); process.exit(1); }
console.log("\nvalidate verde");
