import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  
  // Detect bot visits
  const botKeywords = [
    "bot",
    "crawler",
    "spider",
    "curl",
    "wget",
    "python",
    "node",
    "axios",
    "uptime",
    "monitor",
  ];

  const isBot = botKeywords.some((keyword) =>
    userAgent.toLowerCase().includes(keyword)
  );

  if (isBot) {
    console.log("🤖 Bot visit detected:", {
      timestamp: new Date().toISOString(),
      userAgent,
      path: request.nextUrl.pathname,
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    });
  }

  // Add custom headers to identify bot visits
  const response = NextResponse.next();
  if (isBot) {
    response.headers.set("x-bot-detected", "true");
    response.headers.set("x-bot-timestamp", new Date().toISOString());
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
