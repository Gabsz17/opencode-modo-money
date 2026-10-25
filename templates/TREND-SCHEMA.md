# TrendOportunidade — Schema Zod (Fase 10)

> Estende `Oportunidade` Fase 9 (`PLANO-GANHO.md`). Validação manual em `scripts/validate.mjs` (sem instalar Zod no CI). Workers com Node_modules podem importar o Zod real.

```typescript
// templates/TREND-SCHEMA.md — single source of truth
import { z } from "zod";

export const TrendCategoriaEnum = z.enum([
  "tiktok",
  "google_trends",
  "youtube",
  "meta",
  "x_twitter",
  "tse",
  "sebrae",
  "ibge",
  "bcb",
  "tesouro_direto",
  "outro"
]);

export const SaturacaoEnum = z.enum(["baixa", "media", "alta"]);
export const RiscoEnum = z.enum(["baixo", "medio", "alto"]);

export const TrendOportunidadeSchema = z.object({
  // --- Campos herdados de Oportunidade (Fase 9) ---
  id: z.string().min(1).max(64).regex(/^[\w-]+$/),
  titulo: z.string().min(3).max(120),
  trilha: z.enum(["mercado", "negocios", "trends"]),
  custo_estimado_faixa: z.enum(["ate-1k", "1k-5k", "5k-20k", "20k+"]),
  retorno_estimado_desc: z.string().min(3).max(500),
  risco: RiscoEnum,
  tempo_estimado: z.enum(["dias", "semanas", "meses", "longo-prazo"]),
  validado_fonte: z.string().max(200), // ex: "TikTok Creative Center 2026-10-25" ou "não confirmado"
  validado_data: z.string().regex(/^\d{4}-\d{2}-\d{2}$|não confirmado$/),
  disclaimer_aceito: z.literal(true),
  autor: z.string().min(1).max(80),
  resumo: z.string().min(10).max(500),

  // --- Campos novos Fase 10 (TRENDS) ---
  trend_categoria: TrendCategoriaEnum,        // obrigatório
  trend_fonte: z.string().min(3).max(200),   // URL descritiva com data
  trend_data_coleta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO date
  trend_volume: z.number().min(0),            // views/buscas/menções 24h
  trend_crescimento_pct: z.number(),          // % vs baseline 7d (pode ser negativo)
  trend_persistencia_dias: z.number().int().min(0), // dias consecutivos top 50
  score_oportunidade: z.number().min(0).max(100),   // 0-100 educacional
  saturacao: SaturacaoEnum,                   // obrigatório
  eleitoral: z.boolean().default(false),      // true = sensível (Lei 9.504/97)
  base_legal: z.string().optional(),          // obrigatório se eleitoral=true
}).superRefine((data, ctx) => {
  // Regra 1: eleitoral → base_legal obrigatório + formato Lei/Res
  if (data.eleitoral) {
    if (!data.base_legal || data.base_legal.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Campo 'base_legal' obrigatório quando eleitoral=true (ex: 'Lei 9.504/97 art. 39 + Res. TSE 23.610/2019 art. 9')",
        path: ["base_legal"]
      });
    }
    const legalOk = /Lei\s+\d+\.\d+\/\d{4}|Res\.\s+TSE\s+\d+\.\d+\/\d{4}/i.test(data.base_legal);
    if (!legalOk) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "base_legal deve citar Lei 9.504/97 e/ou Res. TSE 23.610/2019 (ex: 'Lei 9.504/97 art. 39 + Res. TSE 23.610/2019 art. 9')",
        path: ["base_legal"]
      });
    }
  }

  // Regra 2: score > 0 exige volume > 0 E persistência >= 3
  if (data.score_oportunidade > 0) {
    if (data.trend_volume <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "score_oportunidade > 0 exige trend_volume > 0", path: ["score_oportunidade"] });
    }
    if (data.trend_persistencia_dias < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "score_oportunidade > 0 exige trend_persistencia_dias >= 3", path: ["score_oportunidade"] });
    }
  }

  // Regra 3: campos trend vazios → validado_fonte = "não confirmado"
  const trendVazio =
    !data.trend_fonte || data.trend_fonte === "não confirmado" ||
    data.trend_volume === 0 ||
    data.trend_persistencia_dias === 0;
  if (trendVazio && data.validado_fonte !== "não confirmado") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Dados de trend ausentes → validado_fonte deve ser 'não confirmado'",
      path: ["validado_fonte"]
    });
  }

  // Regra 4: disclaimer_aceito deve ser true
  if (data.disclaimer_aceito !== true) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "disclaimer_aceito deve ser true", path: ["disclaimer_aceito"] });
  }

  // Regra 5: resumo max 500 chars (XSS prevention no frontend)
  if (data.resumo.length > 500) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "resumo max 500 caracteres", path: ["resumo"] });
  }

  // Regra 6: retorno_estimado_desc NUNCA promete lucro/%
  const promete = /lucro garantido|retorno \d+%|compre |venda |recomendo /i.test(data.retorno_estimado_desc);
  if (promete) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "retorno_estimado_desc não pode prometer lucro/retorno garantido/recomendação", path: ["retorno_estimado_desc"] });
  }
});

export type TrendOportunidade = z.infer<typeof TrendOportunidadeSchema>;

// --- Exemplos válidos (para testes manuais) ---
/*
{
  "id": "trend-ia-criadores-20261025",
  "titulo": "Landing pages IA para criadores educacionais",
  "trilha": "negocios",
  "custo_estimado_faixa": "ate-1k",
  "retorno_estimado_desc": "Freela ticket medio R$500-2000 por landing page com IA; nicho criadores educacionais",
  "risco": "medio",
  "tempo_estimado": "semanas",
  "validado_fonte": "TikTok Creative Center 2026-10-25",
  "validado_data": "2026-10-25",
  "disclaimer_aceito": true,
  "autor": "moneymaker",
  "resumo": "Trend #IAparaCriadores 1.2M views TikTok 2026-10-25. Oferta: landing page demo com IA + template Notion para autonomos.",
  "trend_categoria": "tiktok",
  "trend_fonte": "[TikTok Creative Center — trending hashtags 2026-10-25](https://ads.tiktok.com/creative-center)",
  "trend_data_coleta": "2026-10-25",
  "trend_volume": 1200000,
  "trend_crescimento_pct": 240,
  "trend_persistencia_dias": 5,
  "score_oportunidade": 87,
  "saturacao": "media",
  "eleitoral": false
}
*/

/*
{
  "id": "trend-eleicoes-renda-basica-20261025",
  "titulo": "Monitorar propostas renda basica eleições 2026",
  "trilha": "trends",
  "custo_estimado_faixa": "ate-1k",
  "retorno_estimado_desc": "Conteudo educacional: explicacao propostas candidatos, como fiscalizar, calendario TSE",
  "risco": "alto",
  "tempo_estimado": "dias",
  "validado_fonte": "não confirmado",
  "validado_data": "2026-10-25",
  "disclaimer_aceito": true,
  "autor": "moneymaker",
  "resumo": "Eleicoes 2º turno 2026-10-25. Apenas monitorar propostas renda basica. Nao usar como base de oferta. Fonte: TSE dados abertos.",
  "trend_categoria": "tse",
  "trend_fonte": "[TSE Dados Abertos — candidatos 2026](https://divulgacandcontas.tse.jus.br/)",
  "trend_data_coleta": "2026-10-25",
  "trend_volume": 56000,
  "trend_crescimento_pct": 15,
  "trend_persistencia_dias": 2,
  "score_oportunidade": 41,
  "saturacao": "baixa",
  "eleitoral": true,
  "base_legal": "Lei 9.504/97 art. 39 + Res. TSE 23.610/2019 art. 9"
}
*/