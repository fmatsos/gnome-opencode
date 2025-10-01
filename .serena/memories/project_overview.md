# Project Overview

## Purpose
GNOME OpenCode Statistics Extension - A GNOME Shell extension that displays usage statistics for OpenCode (an open-source AI coding agent). It tracks token usage across sessions, days, and total usage.

## Tech Stack
- **Language**: JavaScript (GJS - GNOME JavaScript bindings)
- **Runtime**: GNOME Shell extension framework
- **Plugin**: TypeScript/Bun for OpenCode plugin
- **UI Framework**: GNOME Shell UI components (St, Clutter)
- **Data Storage**: JSON files for persistence

## Architecture
- Extension reads stats from `~/.local/share/opencode/stats.json` (written by OpenCode plugin)
- Extension stores its own data in `~/.local/share/gnome-opencode/statistics.json`
- OpenCode plugin (`gnome-stats-exporter.ts`) tracks token usage and writes to stats file
- Extension polls stats file every 60 seconds for updates
- Extension displays stats in GNOME top bar with popup menu

## Key Components
1. **OpencodeIndicator**: Main UI component (panel button with menu)
2. **DataManager**: Handles data loading, saving, and syncing with OpenCode
3. **OpenCode Plugin**: Tracks token usage from OpenCode sessions

## Current Update Mechanism
- Polling-based: Extension checks stats file every 60 seconds
- Manual refresh available via menu button