import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY_LOCAL || process.env.OPENAI_API_KEY 
});

export async function GET() {
  try {
    const models = await client.models.list();
    
    // Filtrar modelos relevantes
    const relevantModels = models.data.filter(model => 
      model.id.includes('gpt-4') || 
      model.id.includes('gpt-3.5') ||
      model.id.startsWith('ft:')
    );

    // Separar por tipo
    const baseModels = relevantModels.filter(m => !m.id.startsWith('ft:'));
    const fineModels = relevantModels.filter(m => m.id.startsWith('ft:'));

    return NextResponse.json({
      success: true,
      total_models: models.data.length,
      relevant_models: relevantModels.length,
      base_models: baseModels.map(m => ({
        id: m.id,
        created: new Date(m.created * 1000).toISOString(),
        owned_by: m.owned_by
      })),
      fine_tuned_models: fineModels.map(m => ({
        id: m.id,
        created: new Date(m.created * 1000).toISOString(),
        owned_by: m.owned_by
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      type: error.type || 'unknown',
      code: error.code || 'unknown'
    }, { status: 500 });
  }
} 