import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { timestamp, userAgent } = body;

    // Get user agent from headers (more reliable for bot detection)
    const headerUserAgent = request.headers.get("user-agent") || "";
    
    // Detect if it's likely a bot
    const botKeywords = [
      "bot",
      "crawler",
      "spider",
      "curl",
      "wget",
      "python",
      "node",
      "axios",
      "fetch",
      "uptime",
      "monitor",
      "pingdom",
      "uptimerobot",
    ];

    const isBot = botKeywords.some((keyword) =>
      headerUserAgent.toLowerCase().includes(keyword)
    );

    // Log the visit (you can expand this to save to a database)
    console.log("Visit detected:", {
      timestamp,
      userAgent: headerUserAgent,
      isBot,
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    });

    return NextResponse.json({
      success: true,
      isBot,
      timestamp: new Date().toISOString(),
      detectedUserAgent: headerUserAgent,
    });
  } catch (error) {
    console.error("Error processing visit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process visit" },
      { status: 500 }
    );
  }
}
