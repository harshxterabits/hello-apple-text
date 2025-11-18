"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Visit {
  timestamp: string;
  userAgent: string;
  isBot: boolean;
}

export default function BotVisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    // Load visits from localStorage
    const storedVisits = localStorage.getItem("bot-visits");
    if (storedVisits) {
      setVisits(JSON.parse(storedVisits));
    }

    // Poll for new visits
    const interval = setInterval(() => {
      const storedVisits = localStorage.getItem("bot-visits");
      if (storedVisits) {
        setVisits(JSON.parse(storedVisits));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            🤖 Uptime Bot Visits
          </h1>
          <p className="text-slate-400">
            Monitor all bot visits to your application
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Recent Visits ({visits.length})
            </h2>
            <button
              onClick={() => {
                localStorage.removeItem("bot-visits");
                setVisits([]);
              }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>

          {visits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No bot visits detected yet</p>
              <p className="text-slate-500 text-sm mt-2">
                Visits will appear here when your uptime bot checks the site
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visits.map((visit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {visit.isBot ? "🤖" : "👤"}
                        </span>
                        <div>
                          <p className="text-white font-medium">
                            {visit.isBot ? "Bot Visit" : "User Visit"}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {new Date(visit.timestamp).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs font-mono mt-2 break-all">
                        {visit.userAgent}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
