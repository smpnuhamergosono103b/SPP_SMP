import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { PaymentSummary, ClassPaymentOverview, Payment } from '../types';
import { StatCard, Card, Badge } from '../components/common/Card';
import { formatRupiah, formatDateTimeID, getPaymentStatusBadgeClass } from '../utils/formatters';
import {
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ArrowRight,
  Receipt,
  Building2,
  TrendingUp,
  CreditCard
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateToPayments: () => void;
  onNavigateToReports: () => void;
  onViewReceipt: (payment: Payment) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToPayments,
  onNavigateToReports,
  onViewReceipt
}) => {
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [classOverviews, setClassOverviews] = useState<ClassPaymentOverview[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sum, classes, payments] = await Promise.all([
          apiService.getPaymentSummary(),
          apiService.getClassPaymentOverviews(),
          apiService.getPayments()
        ]);
        setSummary(sum);
        setClassOverviews(classes);
        setRecentPayments(payments.slice(0, 6));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse">
        Memuat data dashboard keuangan sekolah...
      </div>
    );
  }

  return (
    <div id="page-dashboard" className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-950/60 text-emerald-200 border border-emerald-500/30">
            Sistem Informasi Keuangan Sekolah
          </span>
          <h2 className="text-2xl font-extrabold mt-2">
            Selamat Datang di Sistem Bendahara SMP NUHA MERGOSONO
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl">
            Kelola penerimaan kas SPP, uang pangkal, seragam, dan laporan keuangan sekolah secara efisien, terintegrasi, dan transparan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="btn-quick-payment"
            onClick={onNavigateToPayments}
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 shadow-sm transition-all flex items-center gap-2"
          >
            <Receipt className="w-4 h-4 text-emerald-700" />
            Kasir / Bayar SPP
          </button>
          <button
            id="btn-quick-reports"
            onClick={onNavigateToReports}
            className="px-4 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-white font-semibold text-xs border border-emerald-500/40 transition-all flex items-center gap-2"
          >
            Laporan
          </button>
        </div>
      </div>

      {/* Top 4 Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-revenue-today"
          title="Penerimaan Hari Ini"
          value={formatRupiah(summary?.todayRevenue || 0)}
          subtitle={`${summary?.todayTransactionsCount || 0} Transaksi Masuk`}
          icon={<Wallet className="w-5 h-5" />}
          trend={{ value: '+12.5%', isPositive: true }}
        />
        <StatCard
          id="stat-revenue-year"
          title="Total Kas Diterima"
          value={formatRupiah(summary?.totalRevenueThisYear || 0)}
          subtitle="Tahun Ajaran 2025/2026"
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: '+8.3%', isPositive: true }}
        />
        <StatCard
          id="stat-spp-status"
          title="Siswa SPP Lunas Bulan Ini"
          value={`${summary?.sppPaidCountThisMonth || 0} Siswa`}
          subtitle={`Dari total ${summary?.totalActiveStudents || 0} siswa aktif`}
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          id="stat-pending-amount"
          title="Estimasi Tunggakan"
          value={formatRupiah(summary?.totalPendingAmount || 0)}
          subtitle={`${summary?.sppPendingCountThisMonth || 0} siswa belum lunas SPP`}
          icon={<AlertCircle className="w-5 h-5" />}
        />
      </div>

      {/* Main Content Grid: Class Progress & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class SPP Payment Status Overview (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Rekapitulasi SPP Per Kelas
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Status kelunasan SPP bulanan untuk seluruh kelas SMP NUHA MERGOSONO
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {classOverviews.map((cls) => {
                const percentage = cls.total_students > 0
                  ? Math.round((cls.paid_students_count / cls.total_students) * 100)
                  : 0;

                return (
                  <div
                    key={cls.class_id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center">
                          {cls.class_name}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Kelas {cls.class_name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {cls.total_students} Siswa Terdaftar
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {percentage}% Lunas
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden my-2">
                      <div
                        className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Lunas: <strong className="text-slate-800 dark:text-slate-200">{cls.paid_students_count}</strong></span>
                      <span>Belum: <strong className="text-rose-600 dark:text-rose-400">{cls.pending_students_count}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Stream Transaksi Terakhir (1 Column) */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Transaksi Terbaru
              </h3>
              <button
                onClick={onNavigateToPayments}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {recentPayments.map((pay) => (
                <div
                  key={pay.id}
                  onClick={() => onViewReceipt(pay)}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {pay.student_name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {pay.payment_type_name} ({pay.month_name || 'Non-SPP'})
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(pay.amount_paid)}
                    </p>
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-semibold border ${getPaymentStatusBadgeClass(pay.payment_status)}`}>
                      {pay.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
