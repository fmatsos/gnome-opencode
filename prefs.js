// SPDX-License-Identifier: GPL-3.0-or-later
// SPDX-FileCopyrightText: 2024 fmatsos

import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class OpencodeStatsPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        
        // Create a preferences page
        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);
        
        // Timing Settings Group
        const timingGroup = new Adw.PreferencesGroup({
            title: _('Timing Settings'),
            description: _('Configure update intervals and thresholds'),
        });
        page.add(timingGroup);
        
        // Idle Threshold Setting
        const idleThresholdRow = new Adw.SpinRow({
            title: _('Idle Threshold'),
            subtitle: _('Minutes of inactivity before showing notification'),
            adjustment: new Gtk.Adjustment({
                lower: 1,
                upper: 120,
                step_increment: 1,
                page_increment: 5,
            }),
        });
        settings.bind(
            'idle-threshold-minutes',
            idleThresholdRow,
            'value',
            Gio.SettingsBindFlags.DEFAULT
        );
        timingGroup.add(idleThresholdRow);
        
        // Update Interval Setting
        const updateIntervalRow = new Adw.SpinRow({
            title: _('Polling Interval'),
            subtitle: _('Seconds between statistics checks (fallback polling)'),
            adjustment: new Gtk.Adjustment({
                lower: 10,
                upper: 600,
                step_increment: 10,
                page_increment: 30,
            }),
        });
        settings.bind(
            'update-interval-seconds',
            updateIntervalRow,
            'value',
            Gio.SettingsBindFlags.DEFAULT
        );
        timingGroup.add(updateIntervalRow);
        
        // Real-time Monitoring Group
        const monitoringGroup = new Adw.PreferencesGroup({
            title: _('Real-time Monitoring'),
            description: _('File monitoring provides instant updates when OpenCode processes tokens'),
        });
        page.add(monitoringGroup);
        
        // File Monitor Toggle
        const fileMonitorRow = new Adw.SwitchRow({
            title: _('Enable File Monitoring'),
            subtitle: _('Watch stats file for changes (recommended for instant updates)'),
        });
        settings.bind(
            'file-monitor-enabled',
            fileMonitorRow,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        monitoringGroup.add(fileMonitorRow);
        
        // Info text
        const infoGroup = new Adw.PreferencesGroup({
            description: _('Note: Changes take effect after reloading the extension (disable and re-enable)'),
        });
        page.add(infoGroup);
    }
}
