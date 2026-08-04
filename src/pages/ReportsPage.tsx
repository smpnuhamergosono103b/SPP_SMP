import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Payment, ClassPaymentOverview, ClassRoom } from '../types';
import { Card, Badge } from '../components/common/Card';
import { formatRupiah, formatDateTimeID, getPaymentStatusBadgeClass } from '../utils/formatters';
import {
  FileBarChart2,
  Printer,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building2
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [classOverviews, setClassOverviews] = useState<ClassPaymentOverview[]>([]);

  const [activeTab, setActiveTab] = useState<'harian' | 'tunggakan' | 'pos_biaya'>('harian');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadReportData();
  }, [selectedClassFilter, startDate, endDate]);

  async function loadReportData() {
    try {
      const [payList, clsList, overviews] = await Promise.all([
        apiService.getPayments({
          classId: selectedClassFilter || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined
        }),
        apiService.getClasses(),
        apiService.getClassPaymentOverviews()
      ]);
      setPayments(payList);
      setClasses(clsList);
      setClassOverviews(overviews);
    } catch (err) {
      console.error('Failed to load reports data:', err);
    }
  }

  const totalRevenueReport = payments.reduce((acc, p) => acc + p.amount_paid, 0);

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['No. Kuitansi,Siswa,Kelas,Jenis Biaya,Bulan,Nominal (Rp),Status,Tanggal,Metode'];
    const rows = payments.map(p =>
      `"${p.receipt_number}","${p.student_name}","${p.class_name}","${p.payment_type_name}","${p.month_name || 'Non-SPP'}",${p.amount_paid},"${p.payment_status}","${p.payment_date}","${p.payment_method}"`
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Keuangan_SMP_NU_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div id="page-reports" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileBarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Laporan Keuangan & Kas Sekolah
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rekapitulasi resmi penerimaan SPP, tunggakan kelas, & ekspor data akuntansi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 font-bold text-xs text-slate-700 dark:text-slate-200 shadow-xs transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Ekspor Excel (CSV)
          </button>
          <button
            id="btn-print-report"
            onClick={handlePrintReport}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Cetak Laporan (PDF)
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('harian')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'harian'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Laporan Penerimaan Kas Harian / Periodik
        </button>
        <button
          onClick={() => setActiveTab('tunggakan')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'tunggakan'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Rekap Tunggakan SPP Per Kelas
        </button>
      </div>

      {/* Filters Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Filter Kelas</label>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="">Semua Kelas</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  Kelas {c.class_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-500 mb-1">Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-500 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>
        </div>
      </Card>

      {/* Tab 1: Laporan Transaksi Harian */}
      {activeTab === 'harian' && (
        <Card className="p-5 print:shadow-none print:border-none">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Rincian Transaksi Penerimaan Kas
              </h3>
              <p className="text-xs text-slate-500">
                Total Penerimaan Filter Ini: <strong className="text-emerald-600 font-extrabold">{formatRupiah(totalRevenueReport)}</strong> ({payments.length} transaksi)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Tgl & Jam</th>
                  <th className="py-2.5 px-3">No. Kuitansi</th>
                  <th className="py-2.5 px-3">Nama Siswa & Kelas</th>
                  <th className="py-2.5 px-3">Pos Biaya & Periode</th>
                  <th className="py-2.5 px-3">Kanal</th>
                  <th className="py-2.5 px-3 text-right">Nominal (Rp)</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map(pay => (
                  <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 text-slate-500 font-mono">
                      {formatDateTimeID(pay.payment_date)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {pay.receipt_number}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">{pay.student_name}</p>
                      <p className="text-[10px] text-slate-500">Kelas {pay.class_name}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{pay.payment_type_name}</p>
                      <p className="text-[10px] text-slate-500">{pay.month_name || 'Non-SPP'}</p>
                    </td>
                    <td className="py-3 px-3 uppercase font-bold text-[10px] text-slate-600 dark:text-slate-400">
                      {pay.payment_method}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(pay.amount_paid)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getPaymentStatusBadgeClass(pay.payment_status)}`}>
                        {pay.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 2: Rekap Tunggakan Per Kelas */}
      {activeTab === 'tunggakan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classOverviews.map(cls => (
            <Card key={cls.class_id} className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-extrabold text-base text-slate-900 dark:text-white">
                  Kelas {cls.class_name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Tingkat {cls.grade_level}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Siswa:</span>
                  <span className="font-bold">{cls.total_students} Orang</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Siswa SPP Lunas:</span>
                  <span className="font-bold text-emerald-600">{cls.paid_students_count} Siswa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Belum Lunas:</span>
                  <span className="font-bold text-rose-600">{cls.pending_students_count} Siswa</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2 font-bold">
                  <span>Estimasi Tunggakan:</span>
                  <span className="text-rose-600">{formatRupiah(cls.pending_amount)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
