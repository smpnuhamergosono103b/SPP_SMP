import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Payment, ClassPaymentOverview, ClassRoom, PaymentType } from '../types';
import { Card, Badge } from '../components/common/Card';
import { formatRupiah, formatDateTimeID, getPaymentStatusBadgeClass, getMonthName } from '../utils/formatters';
import {
  FileBarChart2,
  Printer,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building2,
  Layers,
  Coins,
  TrendingUp,
  CreditCard
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [classOverviews, setClassOverviews] = useState<ClassPaymentOverview[]>([]);

  const [activeTab, setActiveTab] = useState<'harian' | 'pos_biaya' | 'tunggakan'>('pos_biaya');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  const [selectedPosFilter, setSelectedPosFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadReportData();
  }, [selectedClassFilter, startDate, endDate]);

  async function loadReportData() {
    try {
      const [payList, clsList, ptList, overviews] = await Promise.all([
        apiService.getPayments({
          classId: selectedClassFilter || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined
        }),
        apiService.getClasses(),
        apiService.getPaymentTypes(),
        apiService.getClassPaymentOverviews()
      ]);
      setPayments(payList);
      setClasses(clsList);
      setPaymentTypes(ptList);
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
    a.download = `Laporan_Keuangan_SMP_NUHA_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Academic months array (Juli s.d. Juni)
  const academicMonths = [
    { number: 7, name: 'Juli' },
    { number: 8, name: 'Agustus' },
    { number: 9, name: 'September' },
    { number: 10, name: 'Oktober' },
    { number: 11, name: 'November' },
    { number: 12, name: 'Desember' },
    { number: 1, name: 'Januari' },
    { number: 2, name: 'Februari' },
    { number: 3, name: 'Maret' },
    { number: 4, name: 'April' },
    { number: 5, name: 'Mei' },
    { number: 6, name: 'Juni' }
  ];

  // Calculate revenue per payment type per month
  const getRevenueForPosAndMonth = (ptId: string, monthNum: number) => {
    return payments
      .filter(p => {
        if (p.payment_type_id !== ptId) return false;
        // For monthly payments, check month_for if present, otherwise check transaction date month
        if (p.month_for) return p.month_for === monthNum;
        const txMonth = new Date(p.payment_date).getMonth() + 1;
        return txMonth === monthNum;
      })
      .reduce((sum, p) => sum + p.amount_paid, 0);
  };

  const getTotalForPos = (ptId: string) => {
    return payments
      .filter(p => p.payment_type_id === ptId)
      .reduce((sum, p) => sum + p.amount_paid, 0);
  };

  const getTxCountForPos = (ptId: string) => {
    return payments.filter(p => p.payment_type_id === ptId).length;
  };

  const filteredPaymentTypes = selectedPosFilter
    ? paymentTypes.filter(pt => pt.id === selectedPosFilter)
    : paymentTypes;

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
            Rekapitulasi resmi penerimaan per pos biaya, kas harian, & tunggakan kelas SMP NUHA MERGOSONO.
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
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('pos_biaya')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pos_biaya'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Laporan Per Pos Biaya (Penerimaan Bulanan)
        </button>

        <button
          onClick={() => setActiveTab('harian')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'harian'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Laporan Transaksi Kas Harian
        </button>

        <button
          onClick={() => setActiveTab('tunggakan')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tunggakan'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          Rekap Tunggakan SPP Per Kelas
        </button>
      </div>

      {/* Filters Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Filter Pos Biaya</label>
            <select
              value={selectedPosFilter}
              onChange={(e) => setSelectedPosFilter(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="">Semua Pos Biaya</option>
              {paymentTypes.map(pt => (
                <option key={pt.id} value={pt.id}>
                  {pt.name}
                </option>
              ))}
            </select>
          </div>

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

      {/* Tab 1: Laporan Per Pos Biaya */}
      {activeTab === 'pos_biaya' && (
        <div className="space-y-6">
          {/* Summary Cards Per Pos Biaya */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPaymentTypes.map(pt => {
              const totalAmount = getTotalForPos(pt.id);
              const txCount = getTxCountForPos(pt.id);

              return (
                <Card key={pt.id} className="p-5 space-y-3 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                        {pt.payment_period === 'monthly' ? 'Bulanan' : 'Sekali Bayar'}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                        {pt.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Tarif: <strong className="text-slate-800 dark:text-slate-200">{formatRupiah(pt.amount)}</strong>
                      </p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      <Coins className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500">Total Terkumpul</p>
                      <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(totalAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500">Total Transaksi</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {txCount} Transaksi
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Matrix Table: Breakdown Per Pos Biaya Per Bulan */}
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Matriks Penerimaan Kas Per Bulan Per Pos Biaya
                </h3>
                <p className="text-xs text-slate-500">
                  Rincian nominal uang yang masuk setiap bulan untuk masing-masing pos pembayaran.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                Total Keseluruhan: {formatRupiah(totalRevenueReport)}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-3 min-w-[180px]">Nama Pos Biaya</th>
                    {academicMonths.map(m => (
                      <th key={m.number} className="py-3 px-2 text-center min-w-[90px]">
                        {m.name}
                      </th>
                    ))}
                    <th className="py-3 px-3 text-right bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 min-w-[120px]">
                      Total Pos
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPaymentTypes.map(pt => {
                    const rowTotal = getTotalForPos(pt.id);

                    return (
                      <tr key={pt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">
                          <div>{pt.name}</div>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({formatRupiah(pt.amount)})
                          </span>
                        </td>

                        {academicMonths.map(m => {
                          const monthRev = getRevenueForPosAndMonth(pt.id, m.number);
                          return (
                            <td key={m.number} className="py-3 px-2 text-center font-mono">
                              {monthRev > 0 ? (
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                  {formatRupiah(monthRev)}
                                </span>
                              ) : (
                                <span className="text-slate-300 dark:text-slate-600">-</span>
                              )}
                            </td>
                          );
                        })}

                        <td className="py-3 px-3 text-right font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                          {formatRupiah(rowTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 dark:border-slate-700 font-black bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                    <td className="py-3.5 px-3 uppercase text-slate-600 dark:text-slate-300">
                      TOTAL PER BULAN
                    </td>
                    {academicMonths.map(m => {
                      const totalMonthAllPos = filteredPaymentTypes.reduce(
                        (sum, pt) => sum + getRevenueForPosAndMonth(pt.id, m.number),
                        0
                      );

                      return (
                        <td key={m.number} className="py-3.5 px-2 text-center text-emerald-700 dark:text-emerald-400 font-mono">
                          {totalMonthAllPos > 0 ? formatRupiah(totalMonthAllPos) : '-'}
                        </td>
                      );
                    })}
                    <td className="py-3.5 px-3 text-right text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50">
                      {formatRupiah(totalRevenueReport)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Laporan Transaksi Harian */}
      {activeTab === 'harian' && (
        <Card className="p-5 print:shadow-none print:border-none">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Rincian Transaksi Penerimaan Kas Harian
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

      {/* Tab 3: Rekap Tunggakan Per Kelas */}
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

