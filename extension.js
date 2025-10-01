// SPDX-License-Identifier: GPL-3.0-or-later
// SPDX-FileCopyrightText: 2024 fmatsos

import GObject from 'gi://GObject';
import St from 'gi://St';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Clutter from 'gi://Clutter';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

const OpencodeIndicator = GObject.registerClass(
class OpencodeIndicator extends PanelMenu.Button {
    _init(extension) {
        super._init(0.0, 'OpenCode Statistics');
        
        this._extension = extension;
        this._settings = extension.getSettings();
        this._idleNotificationShown = false;
        this._dataManager = new DataManager(
            extension,
            () => {
                // Callback when data is updated from file monitor
                this._updateDisplay();
            },
            (idleMinutes) => {
                // Callback when OpenCode plugin detects idle state (real-time)
                this._showIdleNotification(idleMinutes);
            }
        );
        
        // Create icon
        let icon = new St.Icon({
            icon_name: 'utilities-terminal-symbolic',
            style_class: 'system-status-icon'
        });
        this.add_child(icon);
        
        // Build menu
        this._buildMenu();
        
        // Start monitoring
        const updateInterval = this._settings.get_int('update-interval-seconds');
        this._idleCheckerId = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT,
            updateInterval,
            () => {
                this._checkIdleSession();
                this._updateDisplay();
                return GLib.SOURCE_CONTINUE;
            }
        );
        
        // Initial update
        this._updateDisplay();
    }
    
    _buildMenu() {
        // Current session section
        this._sessionSection = new PopupMenu.PopupMenuSection();
        this._sessionLabel = new PopupMenu.PopupMenuItem('Session: Loading...', {
            reactive: false,
            style_class: 'opencode-stats-item'
        });
        this._sessionSection.addMenuItem(this._sessionLabel);
        
        this._sessionDetailsButton = new PopupMenu.PopupMenuItem('View Session Details');
        this._sessionDetailsButton.connect('activate', () => {
            this._showModelBreakdown('session');
        });
        this._sessionSection.addMenuItem(this._sessionDetailsButton);
        
        this.menu.addMenuItem(this._sessionSection);
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        // Daily usage section
        this._dailySection = new PopupMenu.PopupMenuSection();
        this._dailyLabel = new PopupMenu.PopupMenuItem('Today: Loading...', {
            reactive: false,
            style_class: 'opencode-stats-item'
        });
        this._dailySection.addMenuItem(this._dailyLabel);
        
        this._dailyDetailsButton = new PopupMenu.PopupMenuItem('View Daily Details');
        this._dailyDetailsButton.connect('activate', () => {
            this._showModelBreakdown('daily');
        });
        this._dailySection.addMenuItem(this._dailyDetailsButton);
        
        this.menu.addMenuItem(this._dailySection);
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        // Total usage section
        this._totalSection = new PopupMenu.PopupMenuSection();
        this._totalLabel = new PopupMenu.PopupMenuItem('Total: Loading...', {
            reactive: false,
            style_class: 'opencode-stats-item'
        });
        this._totalSection.addMenuItem(this._totalLabel);
        
        this._totalDetailsButton = new PopupMenu.PopupMenuItem('View Total Details');
        this._totalDetailsButton.connect('activate', () => {
            this._showModelBreakdown('total');
        });
        this._totalSection.addMenuItem(this._totalDetailsButton);
        
        this.menu.addMenuItem(this._totalSection);
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        // Last update label
        this._lastUpdateLabel = new PopupMenu.PopupMenuItem('Last update: Never', {
            reactive: false,
            style_class: 'opencode-stats-item'
        });
        this.menu.addMenuItem(this._lastUpdateLabel);
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        // Refresh button
        let refreshItem = new PopupMenu.PopupMenuItem('Refresh Statistics');
        refreshItem.connect('activate', () => {
            this._dataManager.fetchFromOpencode();
            this._updateDisplay();
        });
        this.menu.addMenuItem(refreshItem);
    }
    
    _updateDisplay() {
        let stats = this._dataManager.getStatistics();
        
        // Update session stats
        this._sessionLabel.label.text = `Session: ${this._formatTokens(stats.session.tokens)} tokens`;
        
        // Update daily stats
        this._dailyLabel.label.text = `Today: ${this._formatTokens(stats.daily.tokens)} tokens`;
        
        // Update total stats
        this._totalLabel.label.text = `Total: ${this._formatTokens(stats.total.tokens)} tokens`;
        
        // Update last update time
        let lastUpdate = this._dataManager.getLastUpdateTime();
        if (lastUpdate) {
            this._lastUpdateLabel.label.text = `Last update: ${this._formatLastUpdate(lastUpdate)}`;
        } else {
            this._lastUpdateLabel.label.text = 'Last update: Never';
        }
    }
    
    _formatLastUpdate(timestamp) {
        let now = Date.now();
        let diffMs = now - timestamp;
        let diffSec = Math.floor(diffMs / 1000);
        
        if (diffSec < 60) {
            return 'Just now';
        } else if (diffSec < 3600) {
            let minutes = Math.floor(diffSec / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffSec < 86400) {
            let hours = Math.floor(diffSec / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            let date = new Date(timestamp);
            return date.toLocaleString();
        }
    }
    
    _formatTokens(tokens) {
        if (tokens >= 1000000) {
            return (tokens / 1000000).toFixed(2) + 'M';
        } else if (tokens >= 1000) {
            return (tokens / 1000).toFixed(2) + 'K';
        }
        return tokens.toString();
    }
    
    _showModelBreakdown(type) {
        let stats = this._dataManager.getStatistics();
        let data = stats[type];
        
        if (!data || !data.models || Object.keys(data.models).length === 0) {
            Main.notify('OpenCode Statistics', `No model data available for ${type}`);
            return;
        }
        
        let message = Object.entries(data.models)
            .map(([model, tokens]) => `${model}: ${this._formatTokens(tokens)} tokens`)
            .join('\n');
        
        Main.notify(`${type.charAt(0).toUpperCase() + type.slice(1)} Breakdown`, message);
    }
    
    _showIdleNotification(idleMinutes) {
        // Show idle notification (called by real-time detection or fallback polling)
        // Notification will show for ~5 seconds and can be manually closed by user
        if (!this._idleNotificationShown) {
            Main.notify(
                'OpenCode Session Idle',
                `Your OpenCode session has been idle for ${Math.floor(idleMinutes)} minutes`
            );
            this._idleNotificationShown = true;
        }
    }
    
    _checkIdleSession() {
        // Fallback idle detection (polling-based)
        // This runs when real-time detection from OpenCode plugin is not available
        let stats = this._dataManager.getStatistics();
        let lastActivityTime = stats.session.lastActivity;
        
        if (!lastActivityTime) {
            return;
        }
        
        let now = Date.now();
        let idleMinutes = (now - lastActivityTime) / (1000 * 60);
        
        const idleThreshold = this._settings.get_int('idle-threshold-minutes');
        if (idleMinutes >= idleThreshold && stats.session.tokens > 0) {
            // Show notification via fallback mechanism
            this._showIdleNotification(idleMinutes);
        } else {
            // Reset flag when session becomes active again
            this._idleNotificationShown = false;
        }
    }
    
    destroy() {
        if (this._idleCheckerId) {
            GLib.source_remove(this._idleCheckerId);
            this._idleCheckerId = null;
        }
        if (this._dataManager) {
            this._dataManager.destroy();
            this._dataManager = null;
        }
        super.destroy();
    }
});

class DataManager {
    constructor(extension, updateCallback, idleCallback) {
        this._extension = extension;
        this._settings = extension.getSettings();
        this._updateCallback = updateCallback;
        this._idleCallback = idleCallback;
        this._lastUpdateTime = null;
        this._fileMonitor = null;
        
        this._dataFile = GLib.build_filenamev([
            GLib.get_user_data_dir(),
            'gnome-opencode',
            'statistics.json'
        ]);
        
        this._opencodeStatsPath = GLib.build_filenamev([
            GLib.get_home_dir(),
            '.local',
            'share',
            'opencode',
            'stats.json'
        ]);
        
        this._ensureDataDirectory();
        this._data = this._loadData();
        
        // Try to fetch initial data from OpenCode
        this._fetchFromOpencode();
        
        // Set up file monitor for real-time updates
        const fileMonitorEnabled = this._settings.get_boolean('file-monitor-enabled');
        if (fileMonitorEnabled) {
            this._setupFileMonitor();
        }
    }
    
    _ensureDataDirectory() {
        let dir = GLib.path_get_dirname(this._dataFile);
        let dirFile = Gio.File.new_for_path(dir);
        
        try {
            dirFile.make_directory_with_parents(null);
        } catch (e) {
            if (!e.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.EXISTS)) {
                logError(e, 'Failed to create data directory');
            }
        }
    }
    
    _loadData() {
        try {
            let file = Gio.File.new_for_path(this._dataFile);
            if (!file.query_exists(null)) {
                return this._getDefaultData();
            }
            
            let [success, contents] = file.load_contents(null);
            if (success) {
                let data = JSON.parse(new TextDecoder().decode(contents));
                return data;
            }
        } catch (e) {
            logError(e, 'Failed to load data');
        }
        
        return this._getDefaultData();
    }
    
    _getDefaultData() {
        return {
            session: {
                tokens: 0,
                models: {},
                lastActivity: null,
                startTime: Date.now()
            },
            daily: {
                tokens: 0,
                models: {},
                date: this._getTodayString()
            },
            total: {
                tokens: 0,
                models: {},
                installDate: Date.now()
            }
        };
    }
    
    _getTodayString() {
        let now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    
    _saveData() {
        try {
            let file = Gio.File.new_for_path(this._dataFile);
            let contents = JSON.stringify(this._data, null, 2);
            file.replace_contents(
                contents,
                null,
                false,
                Gio.FileCreateFlags.REPLACE_DESTINATION,
                null
            );
        } catch (e) {
            logError(e, 'Failed to save data');
        }
    }
    
    _fetchFromOpencode() {
        // Check if we need to reset daily stats
        let today = this._getTodayString();
        if (this._data.daily.date !== today) {
            this._data.daily = {
                tokens: 0,
                models: {},
                date: today
            };
        }
        
        // Try to read OpenCode's stats file if it exists
        try {
            let file = Gio.File.new_for_path(this._opencodeStatsPath);
            if (file.query_exists(null)) {
                let [success, contents] = file.load_contents(null);
                if (success) {
                    let opencodeStats = JSON.parse(new TextDecoder().decode(contents));
                    this._updateFromOpencodeStats(opencodeStats);
                    this._lastUpdateTime = Date.now();
                }
            }
        } catch (e) {
            // OpenCode stats not available, that's okay
            log('OpenCode stats not available: ' + e.message);
        }
        
        this._saveData();
    }
    
    _updateFromOpencodeStats(opencodeStats) {
        // Update session data
        if (opencodeStats.session) {
            this._data.session.tokens = opencodeStats.session.totalTokens || 0;
            this._data.session.models = opencodeStats.session.tokensByModel || {};
            this._data.session.lastActivity = opencodeStats.session.lastActivity || Date.now();
            
            // Check for real-time idle notification from OpenCode plugin
            if (opencodeStats.session.isIdle && !this._data.session.wasIdle) {
                // OpenCode plugin detected idle state - trigger notification immediately
                const idleSince = opencodeStats.session.idleSince || opencodeStats.session.lastActivity;
                const idleMinutes = Math.floor((Date.now() - idleSince) / (1000 * 60));
                
                if (this._idleCallback && opencodeStats.session.totalTokens > 0) {
                    this._idleCallback(idleMinutes);
                }
            }
            
            // Track idle state to detect transitions
            this._data.session.wasIdle = opencodeStats.session.isIdle || false;
        }
        
        // Update daily data
        if (opencodeStats.daily) {
            this._data.daily.tokens = opencodeStats.daily.totalTokens || 0;
            this._data.daily.models = opencodeStats.daily.tokensByModel || {};
        }
        
        // Update total data
        if (opencodeStats.total) {
            this._data.total.tokens = opencodeStats.total.totalTokens || 0;
            this._data.total.models = opencodeStats.total.tokensByModel || {};
        }
    }
    
    getStatistics() {
        return this._data;
    }
    
    fetchFromOpencode() {
        this._fetchFromOpencode();
    }
    
    getLastUpdateTime() {
        return this._lastUpdateTime;
    }
    
    _setupFileMonitor() {
        try {
            let file = Gio.File.new_for_path(this._opencodeStatsPath);
            
            // Create parent directory if it doesn't exist
            let parentDir = file.get_parent();
            if (parentDir && !parentDir.query_exists(null)) {
                try {
                    parentDir.make_directory_with_parents(null);
                } catch (e) {
                    // Directory might already exist, ignore
                }
            }
            
            // Set up file monitor
            this._fileMonitor = file.monitor_file(Gio.FileMonitorFlags.NONE, null);
            this._fileMonitor.connect('changed', (monitor, file, otherFile, eventType) => {
                // Only react to changes and creations
                if (eventType === Gio.FileMonitorEvent.CHANGED || 
                    eventType === Gio.FileMonitorEvent.CREATED ||
                    eventType === Gio.FileMonitorEvent.CHANGES_DONE_HINT) {
                    log('[OpenCode Stats] File changed, updating...');
                    this._fetchFromOpencode();
                    if (this._updateCallback) {
                        this._updateCallback();
                    }
                }
            });
            
            log('[OpenCode Stats] File monitor set up for: ' + this._opencodeStatsPath);
        } catch (e) {
            logError(e, '[OpenCode Stats] Failed to set up file monitor');
        }
    }
    
    destroy() {
        if (this._fileMonitor) {
            this._fileMonitor.cancel();
            this._fileMonitor = null;
        }
    }
}

export default class OpencodeStatsExtension extends Extension {
    enable() {
        this._indicator = new OpencodeIndicator(this);
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }
    
    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}
