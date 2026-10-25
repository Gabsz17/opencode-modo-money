#!/usr/bin/env node
// scripts/restore.mjs — Restaura backup do objetivo
// Uso: node scripts/restore.mjs <arquivo-backup.tar.gz>

import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BACKUP_FILE = process.argv[2];

if (!BACKUP_FILE) {
  console.error("Uso: node scripts/restore.mjs <arquivo-backup.tar.gz>");
  process.exit(1);
}

const FULL_PATH = join(ROOT, "backups", BACKUP_FILE);
if (!existsSync(FULL_PATH)) {
  console.error(`Backup nao encontrado: ${FULL_PATH}`);
  console.log("Backups disponiveis:");
  const fs = require("node:fs");
  for (const f of fs.readdirSync(join(ROOT, "backups")).filter(x => x.endsWith(".tar.gz"))) {
    console.log("  ", f);
  }
  process.exit(1);
}

console.log(`Restaurando ${BACKUP_FILE} para ${ROOT}...`);
try {
  execSync(`tar -xzf "${FULL_PATH}" -C "${ROOT}"`, { stdio: "inherit", cwd: ROOT });
  console.log("Restauracao concluida.");
} catch (e) {
  console.error("Erro na restauracao:", e.message);
  process.exit(1);
}