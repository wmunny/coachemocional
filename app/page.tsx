"use client";
import { useState } from "react";

type ModelResult = {
  model: string;
  text: string;
  usage: any;
  error: string | null;
};

type ComparisonResult = {
  base: ModelResult;
  ft: ModelResult;
  timestamp: string;
  config: any;
};

// Función para calcular costes basado en los precios actuales de OpenAI (25 julio 2025)
function calculateCost(usage: any, isFineTuned: boolean): { inputCost: number; outputCost: number; totalCost: number } {
  if (!usage) return { inputCost: 0, outputCost: 0, totalCost: 0 };
  
  // Precios por millón de tokens (USD)
  const pricesUSD = isFineTuned 
    ? { input: 3.00, output: 12.00 }  // GPT-4.1 fine-tuned
    : { input: 2.00, output: 8.00 };  // GPT-4.1 base
  
  // Tipo de cambio USD to EUR (julio 2025)
  const usdToEur = 0.85;
  
  const inputCostUSD = (usage.prompt_tokens / 1_000_000) * pricesUSD.input;
  const outputCostUSD = (usage.completion_tokens / 1_000_000) * pricesUSD.output;
  const totalCostUSD = inputCostUSD + outputCostUSD;
  
  // Convertir a euros
  const inputCost = inputCostUSD * usdToEur;
  const outputCost = outputCostUSD * usdToEur;
  const totalCost = totalCostUSD * usdToEur;
  
  return { inputCost, outputCost, totalCost };
}

// Función para formatear el precio en EUR
function formatPrice(price: number): string {
  return `€${price.toFixed(6)}`;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prompts de ejemplo para pruebas rápidas
  const examplePrompts = [
    "Me siento muy ansioso últimamente y no sé cómo manejarlo. ¿Podrías ayudarme?",
    "Tengo problemas de autoestima y siempre me comparo con otros. ¿Qué puedo hacer?",
    "Estoy pasando por una ruptura difícil y me siento perdido emocionalmente.",
    "¿Cómo puedo gestionar mejor el estrés del trabajo sin que afecte mi vida personal?"
  ];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  function loadExample(examplePrompt: string) {
    setPrompt(examplePrompt);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧠 Coach Emocional AI - Comparador de Modelos
          </h1>
          <p className="text-gray-600">
            Compara respuestas entre GPT-4.1 base vs modelo fine-tuned para coaching emocional
          </p>
        </header>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Escribe tu consulta emocional:
              </label>
              <textarea
                id="prompt"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Ej: Me siento muy estresado en el trabajo y no sé cómo manejar la ansiedad..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            
            {/* Prompts de ejemplo */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Prueba rápida con ejemplos:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => loadExample(example)}
                    className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    Ejemplo {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizando...
                </>
              ) : (
                "🔍 Comparar Modelos"
              )}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">❌ {error}</p>
          </div>
        )}

        {/* Resultados */}
        {data && (
          <div className="space-y-6">
            {/* Información de la consulta */}
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Consulta:</strong> {prompt}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {data.timestamp} • Temperature: {data.config.temperature} • Max tokens: {data.config.max_tokens}
              </p>
            </div>

            {/* Comparación en dos columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ModelPanel 
                title="🤖 Modelo Base (GPT-4.1)" 
                subtitle={data.base.model}
                result={data.base}
                bgColor="bg-gray-50"
                borderColor="border-gray-200"
              />
              <ModelPanel 
                title="🎯 Modelo Fine-Tuned" 
                subtitle={data.ft.model}
                result={data.ft}
                bgColor="bg-blue-50"
                borderColor="border-blue-200"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ModelPanel({ 
  title, 
  subtitle, 
  result, 
  bgColor, 
  borderColor 
}: { 
  title: string; 
  subtitle: string; 
  result: ModelResult;
  bgColor: string;
  borderColor: string;
}) {
  // Determinar si es modelo fine-tuned basado en el subtitle (que contiene el nombre del modelo)
  const isFineTuned = subtitle.includes('ft:');
  const cost = calculateCost(result.usage, isFineTuned);

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-6`}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600 font-mono">{subtitle}</p>
      </div>
      
      {result.error ? (
        <div className="bg-red-100 border border-red-300 rounded p-3">
          <p className="text-red-800 text-sm">❌ Error: {result.error}</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded border p-4 mb-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
              {result.text || "Sin respuesta"}
            </pre>
          </div>
          
          {result.usage && (
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Tokens de entrada:</span>
                <span className="font-mono">{result.usage.prompt_tokens}</span>
              </div>
              <div className="flex justify-between">
                <span>Tokens de salida:</span>
                <span className="font-mono">{result.usage.completion_tokens}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span className="font-mono">{result.usage.total_tokens}</span>
              </div>
              
              {/* Costes calculados */}
              <div className="mt-3 pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span>Coste entrada:</span>
                  <span className="font-mono">{formatPrice(cost.inputCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coste salida:</span>
                  <span className="font-mono">{formatPrice(cost.outputCost)}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-700">
                  <span>Coste total:</span>
                  <span className="font-mono font-bold">{formatPrice(cost.totalCost)}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 