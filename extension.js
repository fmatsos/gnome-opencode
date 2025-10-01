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

const IDLE_THRESHOLD_MINUTES = 15;
const UPDATE_INTERVAL_SECONDS = 60;

const OpencodeIndicator = GObject.registerClass(
class OpencodeIndicator extends PanelMenu.Button {
    _init(extension) {
        super._init(0.0, 'OpenCode Statistics');
        
        this._extension = extension;
        this._dataManager = new DataManager(extension);
        
        // Create icon
        let icon = new St.Icon({
            icon_name: 'utilities-terminal-symbolic',
            style_class: 'system-status-icon'
        });
        this.add_child(icon);
        
        // Build menu
        this._buildMenu();
        
        // Start monitoring
        this._idleCheckerId = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT,
            UPDATE_INTERVAL_SECONDS,
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
    
    _checkIdleSession() {
        let stats = this._dataManager.getStatistics();
        let lastActivityTime = stats.session.lastActivity;
        
        if (!lastActivityTime) {
            return;
        }
        
        let now = Date.now();
        let idleMinutes = (now - lastActivityTime) / (1000 * 60);
        
        if (idleMinutes >= IDLE_THRESHOLD_MINUTES && stats.session.tokens > 0) {
            Main.notify(
                'OpenCode Session Idle',
                `Your OpenCode session has been idle for ${Math.floor(idleMinutes)} minutes`
            );
        }
    }
    
    destroy() {
        if (this._idleCheckerId) {
            GLib.source_remove(this._idleCheckerId);
            this._idleCheckerId = null;
        }
        super.destroy();
    }
});

class DataManager {
    constructor(extension) {
        this._extension = extension;
        this._dataFile = GLib.build_filenamev([
            GLib.get_user_data_dir(),
            'gnome-opencode',
            'statistics.json'
        ]);
        
        this._ensureDataDirectory();
        this._data = this._loadData();
        
        // Try to fetch initial data from OpenCode
        this._fetchFromOpencode();
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
        let opencodePath = GLib.build_filenamev([
            GLib.get_home_dir(),
            '.local',
            'share',
            'opencode',
            'stats.json'
        ]);
        
        try {
            let file = Gio.File.new_for_path(opencodePath);
            if (file.query_exists(null)) {
                let [success, contents] = file.load_contents(null);
                if (success) {
                    let opencodeStats = JSON.parse(new TextDecoder().decode(contents));
                    this._updateFromOpencodeStats(opencodeStats);
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
