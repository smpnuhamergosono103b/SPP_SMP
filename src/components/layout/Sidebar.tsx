import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Receipt,
  GraduationCap,
  School,
  Tags,
  Calendar,
  FileBarChart2,
  Users,
  Settings,
  Database,
  FileText
} from 'lucide-react';

export type NavRoute =
  | 'dashboard'
  | 'payments'
  | 'students'
  | 'classes'
  | 'payment_types'
  | 'academic_years'
  | 'reports'
  | 'users'
  | 'settings'
  | 'srs_db_docs';

interface SidebarProps {
  currentRoute: NavRoute;
  onSelectRoute: (route: NavRoute) => void;
  id?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onSelectRoute,
  id
}) => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'bendahara';

  const mainMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      roles: ['bendahara', 'kepala_sekolah', 'admin']
    },
    {
      id: 'payments',
      label: 'Transaksi Pembayaran',
      icon: Receipt,
      roles: ['bendahara', 'admin'],
      badge: 'Kasir'
    },
    {
      id: 'reports',
      label: 'Laporan Keuangan',
      icon: FileBarChart2,
      roles: ['bendahara', 'kepala_sekolah', 'admin']
    }
  ];

  const masterDataItems = [
    {
      id: 'students',
      label: 'Data Siswa',
      icon: GraduationCap,
      roles: ['bendahara', 'kepala_sekolah', 'admin']
    },
    {
      id: 'classes',
      label: 'Data Kelas',
      icon: School,
      roles: ['bendahara', 'admin']
    },
    {
      id: 'payment_types',
      label: 'Jenis Pembayaran',
      icon: Tags,
      roles: ['bendahara', 'admin']
    },
    {
      id: 'academic_years',
      label: 'Tahun Ajaran',
      icon: Calendar,
      roles: ['admin']
    }
  ];

  const systemItems = [
    {
      id: 'users',
      label: 'Pengguna & Peran',
      icon: Users,
      roles: ['admin', 'kepala_sekolah']
    },
    {
      id: 'settings',
      label: 'Pengaturan Sekolah',
      icon: Settings,
      roles: ['admin', 'bendahara']
    },
    {
      id: 'srs_db_docs',
      label: 'SRS & SQL Schema DB',
      icon: Database,
      roles: ['bendahara', 'kepala_sekolah', 'admin'],
      badge: 'SQL'
    }
  ];

  const renderNavGroup = (title: string, items: typeof mainMenuItems) => {
    const filtered = items.filter(item => item.roles.includes(role));
    if (filtered.length === 0) return null;

    return (
      <div className="mb-6">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          {title}
        </p>
        <nav className="space-y-1">
          {filtered.map(item => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onSelectRoute(item.id as NavRoute)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-md font-bold ${
                      isActive
                        ? 'bg-emerald-700 text-emerald-100'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    );
  };

  return (
    <aside
      id={id || 'app-sidebar'}
      className="w-64 bg-slate-50/80 dark:bg-slate-900/80 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 min-h-[calc(100vh-65px)] transition-colors"
    >
      <div>
        {renderNavGroup('Menu Utama', mainMenuItems)}
        {renderNavGroup('Master Data Sekolah', masterDataItems)}
        {renderNavGroup('Sistem & Dokumen', systemItems)}
      </div>

      {/* User Info Footer */}
      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center justify-center text-xs border border-emerald-300 dark:border-emerald-700">
          {currentUser?.full_name?.charAt(0) || 'U'}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {currentUser?.full_name}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize truncate">
            Akses: {currentUser?.role?.replace('_', ' ')}
          </p>
        </div>
      </div>
    </aside>
  );
};
