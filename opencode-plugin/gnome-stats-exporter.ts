// SPDX-License-Identifier: GPL-3.0-or-later
// SPDX-FileCopyrightText: 2024 fmatsos
//
// OpenCode Plugin: GNOME Statistics Exporter
// 
// This plugin tracks token usage from OpenCode sessions and exports
// statistics to a file that the GNOME OpenCode Statistics Extension can read.

import type { Plugin } from "@opencode-ai/plugin";

// Debug logging configuration
const DEBUG_ENABLED = Bun.env.DEBUG_GNOME_STATS === "1";
const DEBUG_LOG_FILE = `${Bun.env.HOME || "~"}/.local/share/opencode/gnome-stats-exporter.log`;

// Helper function for conditional debug logging
async function debugLog(level: "info" | "debug" | "error", message: string, extra?: Record<string, any>): Promise<void> {
  if (!DEBUG_ENABLED) return;
  
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}${extra ? ` | ${JSON.stringify(extra)}` : ''}\n`;
  
  try {
    // Append to log file
    const file = Bun.file(DEBUG_LOG_FILE);
    const existingContent = await file.exists() ? await file.text() : '';
    await Bun.write(DEBUG_LOG_FILE, existingContent + logEntry);
  } catch (error) {
    // Silently fail - we don't want logging errors to crash the plugin
  }
}

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
    totalCost: number;
    costsByModel: Record<string, number>;
    lastActivity: number;
    startTime: number;
    isIdle?: boolean;
    idleSince?: number;
  };
  daily: {
    totalTokens: number;
    tokensByModel: Record<string, number>;
    totalCost: number;
    costsByModel: Record<string, number>;
    date: string;
  };
  total: {
    totalTokens: number;
    tokensByModel: Record<string, number>;
    totalCost: number;
    costsByModel: Record<string, number>;
    installDate: number;
  };
}

export const GnomeStatsExporter: Plugin = async ({ client, project, directory, worktree, $ }) => {
  const homeDir = Bun.env.HOME || "~";
  const statsDir = `${homeDir}/.local/share/opencode`;
  const statsFile = `${statsDir}/stats.json`;

  // Ensure the stats directory exists
  await $`mkdir -p ${statsDir}`.quiet();

  // Load or initialize statistics
  let stats: Statistics;
  const file = Bun.file(statsFile);
  if (await file.exists()) {
    try {
      const data = await file.text();
      stats = JSON.parse(data);
      
      // Reset session on plugin load (new OpenCode session)
      stats.session = {
        totalTokens: 0,
        tokensByModel: {},
        totalCost: 0,
        costsByModel: {},
        lastActivity: Date.now(),
        startTime: Date.now(),
        isIdle: false,
      };
      
      // Check if we need to reset daily stats
      const today = getTodayString();
      if (stats.daily.date !== today) {
        stats.daily = {
          totalTokens: 0,
          tokensByModel: {},
          totalCost: 0,
          costsByModel: {},
          date: today,
        };
      }
    } catch (error) {
      await debugLog("error", "Error loading stats file, creating new one", { error: String(error) });
      stats = createDefaultStats();
    }
  } else {
    stats = createDefaultStats();
  }

  // Save initial stats
  await saveStats(stats, statsFile);

  // Idle detection configuration (default 15 minutes) - fallback only
  const IDLE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
  const IDLE_CHECK_INTERVAL_MS = 60 * 1000; // Check every 60 seconds (fallback)

  // Set up fallback idle detection timer (runs even with event-based detection)
  const idleCheckTimer = setInterval(async () => {
    const now = Date.now();
    const idleTime = now - stats.session.lastActivity;
    const wasIdle = stats.session.isIdle;
    
    // Only use fallback if we haven't received real-time idle event
    // This ensures idle notification even if event system fails
    if (idleTime >= IDLE_THRESHOLD_MS && stats.session.totalTokens > 0) {
      if (!wasIdle) {
        stats.session.isIdle = true;
        stats.session.idleSince = now;
        await saveStats(stats, statsFile);
        await debugLog("info", "Session became idle (fallback detection)", { idleMinutes: Math.floor(idleTime / 60000) });
      }
    } else if (wasIdle && idleTime < IDLE_THRESHOLD_MS) {
      // Session is no longer idle
      stats.session.isIdle = false;
      delete stats.session.idleSince;
      await saveStats(stats, statsFile);
      await debugLog("info", "Session is active again");
    }
  }, IDLE_CHECK_INTERVAL_MS);

  return {
    // Event hook for both idle detection and message tracking
    "event": async ({ event }) => {
      try {
        // Listen for session.idle event from OpenCode
        if (event.type === "session.idle") {
          await debugLog("debug", "Received session.idle event from OpenCode");
          
          // Mark session as idle immediately
          if (!stats.session.isIdle && stats.session.totalTokens > 0) {
            stats.session.isIdle = true;
            stats.session.idleSince = Date.now();
            await saveStats(stats, statsFile);
            await debugLog("info", "Session marked as idle (real-time event)");
          }
        }
        
        // Listen for message.updated event to track assistant messages with token usage
        if (event.type === "message.updated") {
          // Access message from correct event property path
          const message = event.properties?.info;
          
          // Skip if no message data available
          if (!message) {
            await debugLog("debug", "No message data in event", { eventKeys: Object.keys(event) });
            return;
          }
          
          // Only process completed assistant messages with token usage
          if (message?.role === "assistant" && message.time?.completed) {
            const tokens = message.tokens;
            const modelID = message.modelID || "unknown";
            
            if (tokens) {
              // Calculate total tokens for this message
              const totalTokens =
                (tokens.input || 0) +
                (tokens.output || 0) +
                (tokens.reasoning || 0) +
                ((tokens.cache?.read || 0) + (tokens.cache?.write || 0));
              
              // Get cost data from message (defaults to 0 for backward compatibility)
              const cost = message.cost || 0;
              
              // Update session stats
              stats.session.totalTokens += totalTokens;
              stats.session.tokensByModel[modelID] = 
                (stats.session.tokensByModel[modelID] || 0) + totalTokens;
              stats.session.totalCost += cost;
              stats.session.costsByModel[modelID] = 
                (stats.session.costsByModel[modelID] || 0) + cost;
              stats.session.lastActivity = Date.now();
              
              // Clear idle flag when there's activity
              if (stats.session.isIdle) {
                stats.session.isIdle = false;
                delete stats.session.idleSince;
              }
              
              // Update daily stats
              const today = getTodayString();
              if (stats.daily.date !== today) {
                // Reset daily stats if it's a new day
                stats.daily = {
                  totalTokens: 0,
                  tokensByModel: {},
                  totalCost: 0,
                  costsByModel: {},
                  date: today,
                };
              }
              stats.daily.totalTokens += totalTokens;
              stats.daily.tokensByModel[modelID] = 
                (stats.daily.tokensByModel[modelID] || 0) + totalTokens;
              stats.daily.totalCost += cost;
              stats.daily.costsByModel[modelID] = 
                (stats.daily.costsByModel[modelID] || 0) + cost;
              
              // Update total stats
              stats.total.totalTokens += totalTokens;
              stats.total.tokensByModel[modelID] = 
                (stats.total.tokensByModel[modelID] || 0) + totalTokens;
              stats.total.totalCost += cost;
              stats.total.costsByModel[modelID] = 
                (stats.total.costsByModel[modelID] || 0) + cost;
              
              // Save updated stats
              await saveStats(stats, statsFile);
              
              await debugLog("info", "Tracked tokens and cost for model", { 
                totalTokens, 
                modelID, 
                cost 
              });
            }
          }
        }
      } catch (error) {
        await debugLog("error", "Error processing event", { error: String(error) });
      }
    },
  };
};

function createDefaultStats(): Statistics {
  return {
    session: {
      totalTokens: 0,
      tokensByModel: {},
      totalCost: 0,
      costsByModel: {},
      lastActivity: Date.now(),
      startTime: Date.now(),
      isIdle: false,
    },
    daily: {
      totalTokens: 0,
      tokensByModel: {},
      totalCost: 0,
      costsByModel: {},
      date: getTodayString(),
    },
    total: {
      totalTokens: 0,
      tokensByModel: {},
      totalCost: 0,
      costsByModel: {},
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

async function saveStats(stats: Statistics, filePath: string): Promise<void> {
  try {
    await Bun.write(filePath, JSON.stringify(stats, null, 2));
  } catch (error) {
    await debugLog("error", "Error saving stats", { error: String(error), filePath });
  }
}

export default GnomeStatsExporter;
