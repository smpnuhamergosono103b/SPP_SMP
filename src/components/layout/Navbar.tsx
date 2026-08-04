import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { isSupabaseConfigured } from '../../services/supabase';
import { UserRole } from '../../types';
import {
  Sun,
  Moon,
  Database,
  Building2,
  ChevronDown,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  activeAcademicYearName?: string;
  id?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeAcademicYearName = '2025/2026 Ganjil',
  id
}) => {
  const { currentUser, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const supabaseConnected = isSupabaseConfigured();

  return (
    <header
      id={id || 'app-navbar'}
      className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 py-3 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: School Info & Year */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
              SMP NU MERGOSONO
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Sistem Keuangan Bendahara
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                TA {activeAcademicYearName}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Supabase Badge, Role Selector, Theme Toggle, User Profile */}
        <div className="flex items-center gap-3">
          {/* Supabase Status Indicator */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              supabaseConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
            }`}
            title={supabaseConnected ? 'Terhubung ke Database Supabase' : 'Menggunakan Local Reactive Storage (Siap SQL Schema)'}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{supabaseConnected ? 'Supabase Live' : 'Mode Simulasi (Local)'}</span>
          </div>

          {/* Role Switcher */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="capitalize">
                {currentUser?.role === 'bendahara' && 'Bendahara (Entry Kas)'}
                {currentUser?.role === 'kepala_sekolah' && 'Kepala Sekolah (Executive)'}
                {currentUser?.role === 'admin' && 'Administrator IT'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Dropdown Role Menu */}
            <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700 text-[11px] font-semibold text-slate-400 uppercase">
                Ganti Peran Akses Demo
              </div>
              <button
                onClick={() => switchRole('bendahara')}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 ${
                  currentUser?.role === 'bendahara' ? 'text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Bendahara Sekolah
              </button>
              <button
                onClick={() => switchRole('kepala_sekolah')}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 ${
                  currentUser?.role === 'kepala_sekolah' ? 'text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Kepala Sekolah
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 ${
                  currentUser?.role === 'admin' ? 'text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                Administrator
              </button>
            </div>
          </div>

          {/* Theme Dark Mode Toggle */}
          <button
            id="btn-toggle-theme"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
