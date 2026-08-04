import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Student, PaymentType, Payment, AcademicYear } from '../types';
import { Card, Badge } from '../components/common/Card';
import { formatRupiah, formatDateTimeID, getMonthName, getPaymentStatusBadgeClass } from '../utils/formatters';
import {
  Receipt,
  Search,
  CheckCircle2,
  Printer,
  CreditCard,
  User,
  Calendar,
  AlertCircle,
  Plus
} from 'lucide-react';

interface PaymentsPageProps {
  onViewReceipt: (payment: Payment) => void;
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({ onViewReceipt }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);

  // Search & Form State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedPaymentTypeId, setSelectedPaymentTypeId] = useState<string>('pt-spp');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [amountPaid, setAmountPaid] = useState<number>(250000);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer' | 'qris'>('cash');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Table Filter State
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [stdList, ptList, ayList, payList] = await Promise.all([
          apiService.getStudents(),
          apiService.getPaymentTypes(),
          apiService.getAcademicYears(),
          apiService.getPayments()
        ]);
        setStudents(stdList);
        setPaymentTypes(ptList);
        setAcademicYears(ayList);
        setRecentPayments(payList);

        if (stdList.length > 0) {
          setSelectedStudent(stdList[0]);
        }
      } catch (err) {
        console.error('Error loading payments data:', err);
      }
    }
    loadData();
  }, []);

  // Update default amount when payment type changes
  const handlePaymentTypeChange = (ptId: string) => {
    setSelectedPaymentTypeId(ptId);
    const pt = paymentTypes.find(p => p.id === ptId);
    if (pt) {
      setAmountPaid(pt.amount);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSearchQuery('');
  };

  const filteredStudents = searchQuery.trim()
    ? students.filter(s =>
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nis.includes(searchQuery) ||
        s.nisn.includes(searchQuery)
      )
    : [];

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const pt = paymentTypes.find(p => p.id === selectedPaymentTypeId);
    if (!pt) return;

    setIsSubmitting(true);
    try {
      const activeAY = academicYears.find(a => a.is_active) || academicYears[0];
      const monthFor = pt.payment_period === 'monthly' ? selectedMonth : null;
      const monthNameStr = monthFor ? `${getMonthName(monthFor)} 2025` : undefined;

      const newPayment = await apiService.createPayment({
        student_id: selectedStudent.id,
        payment_type_id: pt.id,
        academic_year_id: activeAY.id,
        month_for: monthFor,
        month_name: monthNameStr,
        amount_due: pt.amount,
        amount_paid: amountPaid,
        payment_status: amountPaid >= pt.amount ? 'lunas' : 'partial',
        payment_method: paymentMethod,
        payment_date: new Date().toISOString(),
        receiver_user_id: 'usr-1',
        receiver_name: 'Siti Rahmah, S.Pd.',
        notes: notes || `Pembayaran ${pt.name} ${monthNameStr || ''}`
      });

      setRecentPayments(prev => [newPayment, ...prev]);
      setSuccessMessage(`Transaksi berhasil! Kuitansi #${newPayment.receipt_number} terbit.`);
      setNotes('');

      // Open printable receipt automatically
      onViewReceipt(newPayment);

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Failed to record payment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecentPayments = statusFilter
    ? recentPayments.filter(p => p.payment_status === statusFilter)
    : recentPayments;

  return (
    <div id="page-payments" className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Kasir Transaksi Pembayaran
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Layanan penerimaan SPP bulanan, uang pangkal, seragam, & kuitansi sah.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold">{successMessage}</span>
        </div>
      )}

      {/* Main Payment Grid: Entry Form (Left) & Recent Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Entry Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Form Entri Bayar Kasir
            </h3>

            {/* Student Search & Picker */}
            <div className="space-y-3 mb-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                1. Cari Siswa (Ketik NIS atau Nama)
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  id="input-search-student-kasir"
                  type="text"
                  placeholder="Ketik NIS / Nama Siswa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                {/* Auto-suggest dropdown */}
                {filteredStudents.length > 0 && (
                  <div className="absolute z-40 left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredStudents.map(s => (
                      <div
                        key={s.id}
                        onClick={() => handleSelectStudent(s)}
                        className="p-2.5 hover:bg-emerald-50 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{s.full_name}</p>
                          <p className="text-[10px] text-slate-500">NIS: {s.nis} • Kelas {s.class_name}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 font-semibold">
                          Pilih
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Student Box */}
              {selectedStudent ? (
                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      {selectedStudent.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {selectedStudent.full_name}
                      </p>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">
                        NIS: {selectedStudent.nis} • Kelas: {selectedStudent.class_name} • Ortu: {selectedStudent.parent_name}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Aktif
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Pilih siswa terlebih dahulu untuk melanjutkan pembayaran.</span>
                </div>
              )}
            </div>

            {/* Payment Form */}
            <form onSubmit={handleProcessPayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  2. Jenis Tagihan Pembayaran
                </label>
                <select
                  id="select-payment-type"
                  value={selectedPaymentTypeId}
                  onChange={(e) => handlePaymentTypeChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  {paymentTypes.map(pt => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name} - {formatRupiah(pt.amount)} ({pt.payment_period === 'monthly' ? 'Bulanan' : 'Sekali Bayar'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Selector if Monthly */}
              {paymentTypes.find(p => p.id === selectedPaymentTypeId)?.payment_period === 'monthly' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bulan SPP
                  </label>
                  <select
                    id="select-spp-month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    {[7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6].map(m => (
                      <option key={m} value={m}>
                        {getMonthName(m)} 2025
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Nominal Dibayar */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nominal Dibayar (Rp)
                </label>
                <input
                  id="input-amount-paid"
                  type="number"
                  min="1000"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Metode / Kanal Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Tunai Kasir
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'qris'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    QRIS Jatim
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan / Keterangan (Opsional)
                </label>
                <input
                  id="input-payment-notes"
                  type="text"
                  placeholder="Contoh: Lunas via Kasir / Titipan Ortu"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                id="btn-submit-payment"
                type="submit"
                disabled={!selectedStudent || isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Printer className="w-4 h-4" />
                {isSubmitting ? 'Memproses Transaksi...' : 'Proses & Cetak Kuitansi'}
              </button>
            </form>
          </Card>
        </div>

        {/* Transaction History Table (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Riwayat Transaksi Terbaru
              </h3>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Filter:</span>
                <select
                  id="select-filter-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  <option value="">Semua Status</option>
                  <option value="lunas">Lunas</option>
                  <option value="partial">Diangsur</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">No. Kuitansi</th>
                    <th className="py-2.5 px-3">Siswa & Kelas</th>
                    <th className="py-2.5 px-3">Jenis Biaya</th>
                    <th className="py-2.5 px-3 text-right">Nominal</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRecentPayments.map(pay => (
                    <tr
                      key={pay.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-white">
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
                      <td className="py-3 px-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(pay.amount_paid)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getPaymentStatusBadgeClass(pay.payment_status)}`}>
                          {pay.payment_status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onViewReceipt(pay)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold hover:bg-emerald-100 transition-colors inline-flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" /> Cetak
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
