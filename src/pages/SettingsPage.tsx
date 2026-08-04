import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { isSupabaseConfigured } from '../services/supabase';
import { SchoolSettings } from '../types';
import { Card } from '../components/common/Card';
import { Settings, Save, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await apiService.getSchoolSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      await apiService.updateSchoolSettings(settings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  if (!settings) return null;

  const supabaseConfigured = isSupabaseConfigured();

  return (
    <div id="page-settings" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Pengaturan Profil Sekolah & Dokumen
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pengisian identitas sekolah, KOP kuitansi resmi, & status koneksi Supabase.
          </p>
        </div>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-300 flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Pengaturan sekolah berhasil diperbarui!
        </div>
      )}

      {/* Supabase Connection Status Banner */}
      <Card className="p-4 bg-slate-900 text-white border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                Status Integrasi Supabase PostgreSQL
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  supabaseConfigured ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                }`}>
                  {supabaseConfigured ? 'Aktif (Connected)' : 'Siap Kredensial'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kunci env `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` disiapkan untuk deployment Vercel.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Settings Form */}
      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            1. Identitas Lengkap Sekolah
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Nama Resmi Sekolah</label>
              <input
                type="text"
                value={settings.school_name}
                onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">NPSN (Nomor Pokok Sekolah Nasional)</label>
              <input
                type="text"
                value={settings.npsn}
                onChange={(e) => setSettings({ ...settings, npsn: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Alamat Lengkap KOP Sekolah</label>
            <textarea
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              rows={2}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Telepon Sekolah</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email Resmi</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Website Resmi</label>
              <input
                type="text"
                value={settings.website}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 pt-4">
            2. Penandatangan Kuitansi (Pimpinan & Bendahara)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  value={settings.principal_name}
                  onChange={(e) => setSettings({ ...settings, principal_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={settings.principal_nip}
                  onChange={(e) => setSettings({ ...settings, principal_nip: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Nama Bendahara Sekolah</label>
                <input
                  type="text"
                  value={settings.treasurer_name}
                  onChange={(e) => setSettings({ ...settings, treasurer_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">NIP Bendahara Sekolah</label>
                <input
                  type="text"
                  value={settings.treasurer_nip}
                  onChange={(e) => setSettings({ ...settings, treasurer_nip: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              id="btn-save-settings"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan Pengaturan Sekolah
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
