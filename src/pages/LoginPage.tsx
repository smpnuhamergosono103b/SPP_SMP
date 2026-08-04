import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserRole } from '../types';
import {
  Building2,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Sun,
  Moon,
  Sparkles,
  AlertCircle,
  Database,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState('bendahara');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Silakan masukkan username atau email Anda.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await login(username, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Username atau kata sandi salah.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    loginAsRole(role);
  };

  return (
    <div id="page-login" className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background Decorative Gradient Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Navigation & Dark Mode Toggle */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-none">
              SMP NUHA MERGOSONO
            </h1>
            <p className="text-[11px] text-emerald-400 font-semibold tracking-wide mt-0.5">
              MALANG • JAWA TIMUR
            </p>
          </div>
        </div>

        <button
          id="btn-login-theme-toggle"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors flex items-center gap-2 text-xs font-semibold"
          title={theme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Mode Terang</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline">Mode Gelap</span>
            </>
          )}
        </button>
      </div>

      {/* Main Login Workspace Center */}
      <div className="w-full max-w-5xl mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Side: System Identity & Features Overview */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistem Informasi Keuangan Resmi</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Aplikasi Bendahara & Kasir SPP Sekolah
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Portal terpadu pencatatan penerimaan kasir SPP, rekapitulasi tunggakan kelas, cetak kuitansi resmi, dan pelaporan keuangan executive SMP NUHA Mergosono Malang.
            </p>
          </div>

          {/* Feature Highlight Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Kuitansi Bermaterai ID</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Nomor kuitansi otomatis & format siap cetak/PDF.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 shrink-0 mt-0.5">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Database Supabase Ready</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Diintegrasikan dengan schema PostgreSQL DDL.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card Form */}
        <div className="lg:col-span-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white flex items-center justify-between">
                <span>Masuk ke Akun Anda</span>
                <span className="p-2 rounded-xl bg-slate-700/60 text-emerald-400 text-xs font-bold">
                  v2.5 Release
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Gunakan kredensial akun petugas atau pilih demo login instan.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Username / Email Petugas
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    id="input-login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: bendahara"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                  <input
                    id="chk-login-remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                  />
                  <span>Simpan Sesi Login Ini</span>
                </label>
                <span className="text-slate-400 text-[11px]">Bantuan: Hubungi Admin IT</span>
              </div>

              <button
                id="btn-submit-login"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Memproses Login...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Masuk ke Dashboard Sekolah
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Section */}
            <div className="pt-4 border-t border-slate-700/60 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
                Atau Pilih Akses Cepat Demo Peran:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  id="btn-demo-bendahara"
                  type="button"
                  onClick={() => handleQuickDemoLogin('bendahara')}
                  className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-bold text-center transition-all flex flex-col items-center gap-1 group"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Bendahara</span>
                </button>

                <button
                  id="btn-demo-kepsek"
                  type="button"
                  onClick={() => handleQuickDemoLogin('kepala_sekolah')}
                  className="p-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-[11px] font-bold text-center transition-all flex flex-col items-center gap-1 group"
                >
                  <UserCheck className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span>Kepala Sekolah</span>
                </button>

                <button
                  id="btn-demo-admin"
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold text-center transition-all flex flex-col items-center gap-1 group"
                >
                  <UserCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Administrator</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Credentials Info */}
      <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-4 z-10 gap-2">
        <p>© 2026 SMP NUHA Mergosono Malang. Hak Cipta Dilindungi Undang-Undang.</p>
        <p className="flex items-center gap-2">
          <span>NPSN: 70042822</span> • <span>TA 2025/2026 Ganjil</span>
        </p>
      </div>
    </div>
  );
};
