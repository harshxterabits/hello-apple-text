"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function UptimeDetector() {
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    // Check on initial load
    const checkBotVisit = async () => {
      try {
        const response = await fetch("/api/uptime-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Store visit in localStorage
          const visits = JSON.parse(localStorage.getItem("bot-visits") || "[]");
          visits.unshift({
            timestamp: data.timestamp,
            userAgent: data.detectedUserAgent,
            isBot: data.isBot,
          });
          // Keep only last 50 visits
          localStorage.setItem("bot-visits", JSON.stringify(visits.slice(0, 50)));
          
          // Check if bot was detected by middleware
          const botDetected = response.headers.get("x-bot-detected") === "true";
          const botTimestamp = response.headers.get("x-bot-timestamp");
          
          if (data.isBot || botDetected) {
            const now = new Date();
            const timestamp = now.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });
            
            const date = now.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            setLastCheck(now);
            
            toast.success(
              <div className="flex flex-col gap-1">
                <div className="font-semibold">🤖 Uptime Bot Checking</div>
                <div className="text-sm opacity-90">{timestamp} • {date}</div>
                {data.detectedUserAgent && (
                  <div className="text-xs opacity-75 mt-1">
                    {data.detectedUserAgent.substring(0, 50)}...
                  </div>
                )}
              </div>,
              {
                duration: 6000,
                position: "top-right",
                style: {
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#fff",
                  padding: "16px",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
                },
              }
            );
          }
        }
      } catch (error) {
        console.error("Failed to check bot visit:", error);
      }
    };

    // Run on mount
    checkBotVisit();

    // Poll every 30 seconds to detect new visits
    const interval = setInterval(() => {
      checkBotVisit();
    }, 30000);

    // Listen for page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkBotVisit();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
