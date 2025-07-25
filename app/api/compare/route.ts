import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";

const client = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY_LOCAL || process.env.OPENAI_API_KEY 
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt es requerido y debe ser un string no vacío" }, 
        { status: 400 }
      );
    }

    const baseModel = process.env.BASE_MODEL!;
    const ftModel = process.env.FT_MODEL!;
    const temperature = Number(process.env.TEMPERATURE ?? 0.2);
    const top_p = Number(process.env.TOP_P ?? 1);
    const max_tokens = Number(process.env.MAX_TOKENS ?? 1024);

    console.log(`Comparando modelos: ${baseModel} vs ${ftModel}`);

    // Ejecutar ambas consultas en paralelo usando Chat Completions API
    const [baseResp, ftResp] = await Promise.allSettled([
      client.chat.completions.create({
        model: baseModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt.trim() }
        ],
        temperature,
        top_p,
        max_tokens
      }),
      client.chat.completions.create({
        model: ftModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt.trim() }
        ],
        temperature,
        top_p,
        max_tokens
      })
    ]);

    // Procesar respuesta del modelo base
    const baseResult = baseResp.status === 'fulfilled'
      ? {
          model: baseModel,
          text: baseResp.value.choices[0]?.message?.content ?? "Sin respuesta",
          usage: baseResp.value.usage,
          error: null
        }
      : {
          model: baseModel,
          text: "",
          usage: null,
          error: baseResp.reason?.message || "Error desconocido"
        };

    // Procesar respuesta del modelo fine-tuned
    const ftResult = ftResp.status === 'fulfilled'
      ? {
          model: ftModel,
          text: ftResp.value.choices[0]?.message?.content ?? "Sin respuesta",
          usage: ftResp.value.usage,
          error: null
        }
      : {
          model: ftModel,
          text: "",
          usage: null,
          error: ftResp.reason?.message || "Error desconocido"
        };

    return NextResponse.json({
      base: baseResult,
      ft: ftResult,
      timestamp: new Date().toISOString(),
      config: {
        temperature,
        top_p,
        max_tokens
      }
    });

  } catch (error: any) {
    console.error("Error en /api/compare:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    models: {
      base: process.env.BASE_MODEL,
      ft: process.env.FT_MODEL
    }
  });
} 