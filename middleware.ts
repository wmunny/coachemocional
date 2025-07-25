import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const user = process.env.BASIC_AUTH_USER!;
  const pass = process.env.BASIC_AUTH_PASS!;
  const url = req.nextUrl;

  // Excluir rutas públicas y archivos estáticos
  if (url.pathname.startsWith("/health") || 
      url.pathname.startsWith("/favicon.ico") ||
      url.pathname.startsWith("/_next/") ||
      url.pathname.startsWith("/api/health") ||
      url.pathname.startsWith("/api/debug") ||
      url.pathname.startsWith("/api/models") ||
      url.pathname.startsWith("/api/env-file")) {
    return NextResponse.next();
  }

  if (!auth?.startsWith("Basic ")) {
    return new Response("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Coach Emocional"' },
    });
  }

  const [u, p] = Buffer.from(auth.split(" ")[1], "base64").toString().split(":");
  if (u === user && p === pass) {
    return NextResponse.next();
  }

  return new Response("Forbidden", { status: 403 });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}; 