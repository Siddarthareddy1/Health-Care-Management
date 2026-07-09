"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { getSystemSettings, saveSystemSettings, SystemSettings } from "../../../lib/firestore";
import { useToast } from "../../../hooks/useNotification";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SystemSettings>({
    allowSignups: true,
    alertOnEmergency: true,
    backupInterval: "daily"
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSettings(getSystemSettings());
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      saveSystemSettings(settings);
      setSaving(false);
      showToast("success", "Settings Saved", "System preference configurations updated successfully.");
    }, 1000);
  };

  const role = user?.role || "patient";

  return (
    <div className="space-y-6 font-sans text-healthcare-textDark">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-healthcare-textDark font-display tracking-tight font-sans">System Settings</h1>
        <p className="text-sm text-healthcare-textMedium font-medium mt-1">Configure workspace rules, alerts thresholds, and logging preferences.</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {role === "admin" ? (
          <Card title="Administrative Controls" subtitle="System-wide workspace rules">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-healthcare-border pb-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-healthcare-textDark font-display">New User Registrations</h4>
                  <p className="text-xs text-healthcare-textMedium">Allow new patients, doctors, and admin credentials registration from landing pages.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowSignups}
                  onChange={(e) => setSettings({ ...settings, allowSignups: e.target.checked })}
                  className="rounded border-healthcare-border text-healthcare-primary focus:ring-healthcare-primary"
                />
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-healthcare-border pb-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-healthcare-textDark font-display">Emergency Intake alerts</h4>
                  <p className="text-xs text-healthcare-textMedium">Dispatch instant dashboard banner alerts upon emergency patient registrations.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.alertOnEmergency}
                  onChange={(e) => setSettings({ ...settings, alertOnEmergency: e.target.checked })}
                  className="rounded border-healthcare-border text-healthcare-primary focus:ring-healthcare-primary"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-healthcare-textDark font-display">Database Auto-Backup Frequency</h4>
                  <p className="text-xs text-healthcare-textMedium">Configure automated exports scheduler for clinical firestore records.</p>
                </div>
                <select
                  value={settings.backupInterval}
                  onChange={(e) => setSettings({ ...settings, backupInterval: e.target.value })}
                  className="px-3 py-1.5 border border-healthcare-border rounded bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-healthcare-primary"
                >
                  <option value="hourly">Hourly Backup</option>
                  <option value="daily">Daily Backup</option>
                  <option value="weekly">Weekly Export</option>
                </select>
              </div>
            </div>
          </Card>
        ) : (
          <Card title="Notification Preferences" subtitle="Custom dashboard notification rules">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-healthcare-border pb-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-healthcare-textDark font-display">Appointment Reminders</h4>
                  <p className="text-xs text-healthcare-textMedium">Deliver alerts 24 hours prior to scheduled consultation times.</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-healthcare-border text-healthcare-primary focus:ring-healthcare-primary"
                />
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-healthcare-border pb-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-healthcare-textDark font-display">Invoices Receipts</h4>
                  <p className="text-xs text-healthcare-textMedium">Receive automatic notifications on payments receipts clearance.</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-healthcare-border text-healthcare-primary focus:ring-healthcare-primary"
                />
              </div>
            </div>
          </Card>
        )}

        <Button onClick={handleSave} variant="primary" loading={saving} className="gap-2">
          <Save className="w-4 h-4" /> Save System Settings
        </Button>
      </div>
    </div>
  );
}
