import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    // Leer directamente el archivo .env.local
    const envPath = join(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    
    // Buscar la línea de OPENAI_API_KEY_LOCAL o OPENAI_API_KEY
    const lines = envContent.split('\n');
    const apiKeyLineLocal = lines.find(line => line.startsWith('OPENAI_API_KEY_LOCAL='));
    const apiKeyLineOld = lines.find(line => line.startsWith('OPENAI_API_KEY='));
    
    let fileApiKey = null;
    let usedLine = null;
    
    if (apiKeyLineLocal) {
      fileApiKey = apiKeyLineLocal.substring('OPENAI_API_KEY_LOCAL='.length);
      usedLine = apiKeyLineLocal;
    } else if (apiKeyLineOld) {
      fileApiKey = apiKeyLineOld.substring('OPENAI_API_KEY='.length);
      usedLine = apiKeyLineOld;
    }
    
         return NextResponse.json({
       file_content: {
         total_lines: lines.length,
         api_key_line_local: apiKeyLineLocal || "NOT_FOUND",
         api_key_line_old: apiKeyLineOld || "NOT_FOUND", 
         api_key_line_used: usedLine || "NOT_FOUND",
         api_key_from_file: fileApiKey,
         file_key_length: fileApiKey?.length || 0,
         first_10_chars_file: fileApiKey?.substring(0, 10) || "N/A",
         last_4_chars_file: fileApiKey?.slice(-4) || "N/A",
         // Investigar el carácter problemático
         char_at_56: fileApiKey ? fileApiKey.charAt(55) : "N/A", // posición 56 (0-indexed = 55)
         char_code_at_56: fileApiKey ? fileApiKey.charCodeAt(55) : "N/A",
         chars_50_to_60: fileApiKey ? fileApiKey.substring(50, 60) : "N/A",
         char_codes_50_to_60: fileApiKey ? Array.from(fileApiKey.substring(50, 60)).map(c => c.charCodeAt(0)) : [],
         full_char_codes_first_70: fileApiKey ? Array.from(fileApiKey.substring(0, 70)).map(c => c.charCodeAt(0)) : []
       },
             env_var: {
         api_key_from_env_local: process.env.OPENAI_API_KEY_LOCAL,
         api_key_from_env_old: process.env.OPENAI_API_KEY,
         api_key_used: process.env.OPENAI_API_KEY_LOCAL || process.env.OPENAI_API_KEY,
         env_key_local_length: process.env.OPENAI_API_KEY_LOCAL?.length || 0,
         env_key_old_length: process.env.OPENAI_API_KEY?.length || 0,
         env_key_used_length: (process.env.OPENAI_API_KEY_LOCAL || process.env.OPENAI_API_KEY)?.length || 0,
         first_10_chars_env: (process.env.OPENAI_API_KEY_LOCAL || process.env.OPENAI_API_KEY)?.substring(0, 10) || "N/A",
         last_4_chars_env: (process.env.OPENAI_API_KEY_LOCAL || process.env.OPENAI_API_KEY)?.slice(-4) || "N/A"
       },
             comparison: {
         lengths_match: fileApiKey?.length === (process.env.OPENAI_API_KEY_LOCAL || process.env.OPENAI_API_KEY)?.length,
         values_match: fileApiKey === (process.env.OPENAI_API_KEY_LOCAL || process.env.OPENAI_API_KEY),
         difference: fileApiKey && (process.env.OPENAI_API_KEY_LOCAL || process.env.OPENAI_API_KEY) ? 
           `File: ${fileApiKey.length} chars vs Env: ${(process.env.OPENAI_API_KEY_LOCAL || process.env.OPENAI_API_KEY).length} chars` : 
           "Unable to compare"
       },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      code: error.code || 'unknown'
    }, { status: 500 });
  }
} 