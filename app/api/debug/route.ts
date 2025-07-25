import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY_LOCAL || process.env.OPENAI_API_KEY;
  
  // Diagnosticar el parsing del .env.local
  console.log("=== DEBUG API KEY ===");
  console.log("Raw value:", JSON.stringify(apiKey));
  console.log("Length:", apiKey?.length);
  console.log("All env vars starting with OPENAI:", Object.keys(process.env).filter(k => k.startsWith('OPENAI')));
  
  return NextResponse.json({
    env_loaded: {
      has_basic_auth_user: !!process.env.BASIC_AUTH_USER,
      has_basic_auth_pass: !!process.env.BASIC_AUTH_PASS,
      has_openai_key: !!apiKey,
      basic_auth_user_value: process.env.BASIC_AUTH_USER || "NOT_FOUND",
      // No mostramos la contraseña por seguridad
      middleware_should_work: !!(process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASS)
    },
         openai_key_info: {
       has_local_var: !!process.env.OPENAI_API_KEY_LOCAL,
       has_old_var: !!process.env.OPENAI_API_KEY,
       using_local_var: !!process.env.OPENAI_API_KEY_LOCAL,
       local_length: process.env.OPENAI_API_KEY_LOCAL?.length || 0,
       old_length: process.env.OPENAI_API_KEY?.length || 0,
       used_key_info: {
         exists: !!apiKey,
         length: apiKey?.length || 0,
         starts_with_sk: apiKey?.startsWith('sk-') || false,
         first_10_chars: apiKey?.substring(0, 10) || "N/A",
         last_4_chars: apiKey?.slice(-4) || "N/A",
         has_spaces: apiKey?.includes(' ') || false,
         has_newlines: apiKey?.includes('\n') || false,
         has_carriage_return: apiKey?.includes('\r') || false,
         has_quotes: apiKey?.includes('"') || apiKey?.includes("'") || false,
         char_codes_first_60: apiKey ? Array.from(apiKey.substring(0, 60)).map(c => c.charCodeAt(0)) : [],
         raw_json: JSON.stringify(apiKey),
         expected_length_range: "debería ser ~200+ caracteres"
       }
     },
    models_config: {
      base_model: process.env.BASE_MODEL,
      ft_model: process.env.FT_MODEL,
      temperature: process.env.TEMPERATURE,
      top_p: process.env.TOP_P,
      max_tokens: process.env.MAX_TOKENS
    },
    timestamp: new Date().toISOString()
  });
} 