#!/usr/bin/env node
// scripts/fetch-trends.mjs — Coleta diária de trends (7 fontes) → docs/dinheiro/trends-cache/YYYY-MM-DD.json
// Uso: npm run fetch-trends
// Requer: Node 20+, .env opcional (TIKTOK_CREATIVE_CENTER_KEY, META_ACCESS_TOKEN)

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CACHE_DIR = join(ROOT, "docs/dinheiro/trends-cache");
const TODAY = new Date().toISOString().split("T")[0];
const CACHE_FILE = join(CACHE_DIR, `${TODAY}.json`);

// Config das 7 fontes
const SOURCES = [
  { id: "tiktok", name: "TikTok Creative Center", url: "https://ads.tiktok.com/creative-center/api/v1/trends?region=BR&period=24h", type: "json", env: "TIKTOK_CREATIVE_CENTER_KEY" },
  { id: "google_trends", name: "Google Trends Daily", url: "https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR", type: "rss", env: null },
  { id: "tse", name: "TSE Dados Abertos", url: "https://dadosabertos.tse.jus.br/dataset/resultado-2026/resource/xxxx.json", type: "json", env: null },
  { id: "youtube", name: "YouTube Trending (fallback trends24.in)", url: "https://trends24.in/youtube", type: "html", env: null },
  { id: "meta", name: "Meta Ads Library", url: "https://graph.facebook.com/v19.0/ads_library?ad_active_status=ACTIVE&ad_type=ALL&country=BR&limit=100", type: "json", env: "META_ACCESS_TOKEN" },
  { id: "ibge", name: "IBGE SIDRA IPCA", url: "https://servicodados.ibge.gov.br/api/v3/agregados/7060/periodos/all/variaveis/63|69|2263?localidades=N1[all]", type: "json", env: null },
  { id: "tesouro", name: "Tesouro Direto Histórico", url: "https://www.tesourodireto.com.br/produtos/dados-sobre-titulos/historico-de-precos-e-taxas", type: "html", env: null }
];

const RATE_LIMIT_MS = 2000; // 2s entre requisições
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;

async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const start = performance.now();
      const res = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
      const duration = performance.now() - start;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get("content-type") || "";
      let data;
      if (contentType.includes("application/json")) data = await res.json();
      else if (contentType.includes("xml") || contentType.includes("rss")) data = await res.text();
      else data = await res.text();
      return { ok: true, data, duration, status: res.status };
    } catch (err) {
      if (attempt === retries) return { ok: false, error: err.message };
      await new Promise(r => setTimeout(r, RETRY_BASE_MS * 2 ** attempt));
    }
  }
}

async function fetchAll() {
  const results = [];
  for (const src of SOURCES) {
    const envKey = src.env ? process.env[src.env] : null;
    const headers = envKey ? { "Authorization": `Bearer ${envKey}` } : {};
    const logBase = { ts: new Date().toISOString(), fonte: src.id, fonte_nome: src.name };

    console.log(`[${src.id}] Iniciando...`);
    const start = performance.now();
    const res = await fetchWithRetry(src.url, { headers });
    const duration = performance.now() - start;

    let itens = 0;
    if (res.ok) {
      if (src.type === "json" && Array.isArray(res.data)) itens = res.data.length;
      else if (src.type === "rss" && typeof res.data === "string") itens = (res.data.match(/<item>/g) || []).length;
      else if (src.type === "html" && typeof res.data === "string") itens = (res.data.match(/trend|hashtag|viral/gi) || []).length;
      else itens = 1;
      console.log(`[${src.id}] OK ${itens} itens (${duration.toFixed(0)}ms)`);
      results.push({ ...logBase, status: "ok", itens, duracao_ms: duration });
    } else {
      const aviso = src.env && !envKey ? "sem KEY — configure .env" : res.error;
      console.log(`[${src.id}] AVISO: ${aviso}`);
      results.push({ ...logBase, status: "aviso", detalhe: aviso, duracao_ms: duration });
    }

    await new Promise(r => setTimeout(r, RATE_LIMIT_MS));
  }
  return results;
}

function buildCache(results) {
  return {
    fetched_at: new Date().toISOString(),
    data: TODAY,
    fontes: results,
    topicos: results.flatMap(f => {
      if (f.status !== "ok") return [];
      // Aqui você faria o parse real de cada fonte
      // Por enquanto retorna estrutura base
      return [{ fonte: f.fonte, coletado: true }];
    })
  };
}

async function main() {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });

  console.log(`=== FETCH TRENDS ${TODAY} ===`);
  const results = await fetchAll();
  const cache = buildCache(results);

  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  console.log(`Cache salvo: ${CACHE_FILE}`);

  const ok = results.filter(r => r.status === "ok").length;
  const avisos = results.filter(r => r.status === "aviso").length;
  console.log(`Resumo: ${ok} OK, ${avisos} avisos, ${results.length} fontes`);
}

main().catch(err => {
  console.error("ERRO FATAL:", err);
  process.exit(1);
});