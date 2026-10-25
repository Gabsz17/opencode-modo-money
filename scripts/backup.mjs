#!/usr/bin/env node
// scripts/backup.mjs — Backup do objetivo (zip docs/dinheiro/<objetivo> + memoria)
// Uso: node scripts/backup.mjs <objetivo>

import { createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createReadStream, readdirSync, statSync, existsSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OBJ = process.argv[2];

if (!OBJ) {
  console.error("Uso: node scripts/backup.mjs <objetivo>");
  process.exit(1);
}

const OBJ_DIR = join(ROOT, "docs/dinheiro", OBJ);
const MEM_DIR = join(ROOT, ".opencode/memory/inbox");
const OUT_DIR = join(ROOT, "backups");
const TS = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const OUT_FILE = join(OUT_DIR, `${OBJ}-backup-${TS}.tar.gz`);

if (!existsSync(OBJ_DIR)) {
  console.error(`Objetivo nao encontrado: ${OBJ_DIR}`);
  process.exit(1);
}

if (!existsSync(OUT_DIR)) {
  require("node:fs").mkdirSync(OUT_DIR, { recursive: true });
}

function collectFiles(dir, prefix = "") {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(full, rel));
    } else if (entry.isFile()) {
      files.push({ full, rel });
    }
  }
  return files;
}

async function main() {
  const objFiles = collectFiles(OBJ_DIR, `docs/dinheiro/${OBJ}`);
  const memFiles = existsSync(MEM_DIR) ? collectFiles(MEM_DIR, ".opencode/memory/inbox").filter(f => f.rel.includes("moneymaker") || f.rel.includes("trends")) : [];

  const allFiles = [...objFiles, ...memFiles];
  console.log(`Empacotando ${allFiles.length} arquivos...`);

  // Usa tar + gzip via execSync (mais simples no Windows)
  const args = allFiles.map(f => `"${f.full}"`).join(" ");
  const cmd = `tar -czf "${OUT_FILE}" -C "${ROOT}" ${args}`;
  
  try {
    execSync(cmd, { stdio: "pipe", cwd: ROOT });
    const size = (statSync(OUT_FILE).size / 1024).toFixed(1);
    console.log(`Backup criado: ${OUT_FILE} (${size} KB)`);
  } catch (e) {
    console.error("Erro ao criar backup:", e.message);
    process.exit(1);
  }
}

main();