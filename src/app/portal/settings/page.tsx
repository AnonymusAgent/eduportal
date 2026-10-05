'use client';

import Card, { CardTitle } from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import { Settings, Shield, Bell, Eye } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800">Settings</h1>

      <Card>
        <CardTitle className="flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-indigo-500" />Security</CardTitle>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/30">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Change Password</p>
              <p className="text-xs text-slate-400">Update your account password.</p>
            </div>
            <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700">Change</button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/30">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Two-Factor Authentication</p>
              <p className="text-xs text-slate-400">Add an extra layer of security.</p>
            </div>
            <span className="text-xs text-slate-400 bg-white/40 px-2 py-1 rounded-lg">Coming Soon</span>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle className="flex items-center gap-2 mb-4"><Bell className="w-5 h-5 text-indigo-500" />Notifications</CardTitle>
        <div className="space-y-3">
          {['Fee reminders', 'Exam schedules', 'Attendance alerts', 'Announcements'].map((n) => (
            <div key={n} className="flex items-center justify-between p-3 rounded-xl bg-white/30">
              <span className="text-sm text-slate-700 font-medium">{n}</span>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50/80 px-2 py-0.5 rounded-full">Enabled</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle className="flex items-center gap-2 mb-4"><Eye className="w-5 h-5 text-indigo-500" />Display</CardTitle>
        <Alert variant="info">Use the accessibility button (⚙️ icon at bottom-right) to adjust text size, contrast, spacing, and motion preferences.</Alert>
      </Card>
    </div>
  );
}
