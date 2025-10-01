// SPDX-License-Identifier: GPL-3.0-or-later
// SPDX-FileCopyrightText: 2024 fmatsos
//
// OpenCode Plugin: GNOME Statistics Exporter
// 
// This plugin tracks token usage from OpenCode sessions and exports
// statistics to a file that the GNOME OpenCode Statistics Extension can read.

import type { Plugin } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

interface TokenUsage {
  input: number;
  output: number;
  reasoning: number;
  cache: {
    read: number;
    write: number;
  };
}

interface Statistics {
  session: {
    totalTokens: number;
    tokensByModel: Record<string, number>;
    lastActivity: number;
    startTime: number;
  };
  daily: {
    totalTokens: number;
    tokensByModel: Record<string, number>;
    date: string;
  };
  total: {
    totalTokens: number;
    tokensByModel: Record<string, number>;
    installDate: number;
  };
}

export const GnomeStatsExporter: Plugin = async ({ client, project, directory, worktree, $ }) => {
  const statsDir = path.join(os.homedir(), ".local", "share", "opencode");
  const statsFile = path.join(statsDir, "stats.json");

  // Ensure the stats directory exists
  if (!fs.existsSync(statsDir)) {
    fs.mkdirSync(statsDir, { recursive: true });
  }

  // Load or initialize statistics
  let stats: Statistics;
  if (fs.existsSync(statsFile)) {
    try {
      const data = fs.readFileSync(statsFile, "utf-8");
      stats = JSON.parse(data);
      
      // Reset session on plugin load (new OpenCode session)
      stats.session = {
        totalTokens: 0,
        tokensByModel: {},
        lastActivity: Date.now(),
        startTime: Date.now(),
      };
      
      // Check if we need to reset daily stats
      const today = getTodayString();
      if (stats.daily.date !== today) {
        stats.daily = {
          totalTokens: 0,
          tokensByModel: {},
          date: today,
        };
      }
    } catch (error) {
      console.error("Error loading stats file, creating new one:", error);
      stats = createDefaultStats();
    }
  } else {
    stats = createDefaultStats();
  }

  // Save initial stats
  saveStats(stats, statsFile);

  return {
    "chat.message": async (input, output) => {
      try {
        const message = output.message;
        
        // Only process assistant messages with token usage
        if (message.role === "assistant") {
          const assistantMessage = message as any;
          const tokens: TokenUsage | undefined = assistantMessage.tokens;
          const model = assistantMessage.model || "unknown";
          
          if (tokens) {
            // Calculate total tokens for this message
            const totalTokens =
              (tokens.input || 0) +
              (tokens.output || 0) +
              (tokens.reasoning || 0) +
              ((tokens.cache?.read || 0) + (tokens.cache?.write || 0));
            
            // Update session stats
            stats.session.totalTokens += totalTokens;
            stats.session.tokensByModel[model] = 
              (stats.session.tokensByModel[model] || 0) + totalTokens;
            stats.session.lastActivity = Date.now();
            
            // Update daily stats
            const today = getTodayString();
            if (stats.daily.date !== today) {
              // Reset daily stats if it's a new day
              stats.daily = {
                totalTokens: 0,
                tokensByModel: {},
                date: today,
              };
            }
            stats.daily.totalTokens += totalTokens;
            stats.daily.tokensByModel[model] = 
              (stats.daily.tokensByModel[model] || 0) + totalTokens;
            
            // Update total stats
            stats.total.totalTokens += totalTokens;
            stats.total.tokensByModel[model] = 
              (stats.total.tokensByModel[model] || 0) + totalTokens;
            
            // Save updated stats
            saveStats(stats, statsFile);
            
            console.log(`[GNOME Stats Exporter] Tracked ${totalTokens} tokens for model ${model}`);
          }
        }
      } catch (error) {
        console.error("[GNOME Stats Exporter] Error processing message:", error);
      }
    },
  };
};

function createDefaultStats(): Statistics {
  return {
    session: {
      totalTokens: 0,
      tokensByModel: {},
      lastActivity: Date.now(),
      startTime: Date.now(),
    },
    daily: {
      totalTokens: 0,
      tokensByModel: {},
      date: getTodayString(),
    },
    total: {
      totalTokens: 0,
      tokensByModel: {},
      installDate: Date.now(),
    },
  };
}

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function saveStats(stats: Statistics, filePath: string): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(stats, null, 2), "utf-8");
  } catch (error) {
    console.error("[GNOME Stats Exporter] Error saving stats:", error);
  }
}

export default GnomeStatsExporter;
