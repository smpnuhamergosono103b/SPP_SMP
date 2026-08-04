import React, { useRef } from 'react';
import { Modal } from './Modal';
import { Payment, SchoolSettings } from '../../types';
import { formatRupiah, formatDateTimeID, getPaymentMethodLabel } from '../../utils/formatters';
import { Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  schoolSettings: SchoolSettings;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  schoolSettings
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kuitansi Bukti Pembayaran"
      subtitle={`Nomor: ${payment.receipt_number}`}
      maxWidth="2xl"
      id="receipt-modal"
    >
      <div className="space-y-6">
        {/* Printable Area */}
        <div
          ref={printRef}
          className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs text-slate-800 dark:text-slate-200 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black"
        >
          {/* Header Kop Sekolah */}
          <div className="text-center pb-4 border-b-2 border-slate-800 dark:border-slate-300 mb-6">
            <h2 className="text-xl font-extrabold uppercase tracking-wide text-emerald-800 dark:text-emerald-400">
              {schoolSettings.school_name}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              NPSN: {schoolSettings.npsn} • Status: Terakreditasi A
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {schoolSettings.address} | Telp: {schoolSettings.phone}
            </p>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
              SURAT BUKTI PENERIMAAN KAS / KUITANSI SAH
            </p>
          </div>

          {/* Receipt Info Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block font-medium">No. Kuitansi:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                {payment.receipt_number}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block font-medium">Tanggal Transaksi:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {formatDateTimeID(payment.payment_date)}
              </span>
            </div>
          </div>

          {/* Student Details */}
          <div className="grid grid-cols-2 gap-y-2 text-xs mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-slate-400">Telah Diterima Dari (Siswa):</span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                {payment.student_name}
              </p>
              <p className="text-slate-500">NIS: {payment.nis || '-'}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Kelas / Tingkat:</span>
              <p className="font-bold text-slate-900 dark:text-white">
                Kelas {payment.class_name}
              </p>
              <p className="text-slate-500">Tahun Ajaran: {payment.academic_year_name || '2025/2026'}</p>
            </div>
          </div>

          {/* Payment Items Table */}
          <table className="w-full text-xs border-collapse mb-6">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <th className="py-2 px-3 text-left">Rincian Pembayaran</th>
                <th className="py-2 px-3 text-center">Bulan / Keterangan</th>
                <th className="py-2 px-3 text-right">Jumlah Total (Rp)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                  {payment.payment_type_name}
                </td>
                <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400">
                  {payment.month_name || 'Sekali Bayar / Non-SPP'}
                </td>
                <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                  {formatRupiah(payment.amount_paid)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Payment Summary */}
          <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 mb-6">
            <div>
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                Metode Pembayaran:
              </span>
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                {getPaymentMethodLabel(payment.payment_method)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                TOTAL DIBAYAR:
              </span>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">
                {formatRupiah(payment.amount_paid)}
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-6 text-center text-xs mt-8 pt-4">
            <div>
              <p className="text-slate-500 mb-12">Siswa / Orang Tua Wali</p>
              <p className="font-bold border-b border-slate-300 inline-block px-4 pb-0.5 text-slate-800 dark:text-slate-200">
                ( {payment.student_name} )
              </p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Mergosono Malang, {formatDateTimeID(payment.payment_date).split(',')[0]}</p>
              <p className="text-slate-500 mb-8">Bendahara Sekolah</p>
              <div className="inline-flex items-center gap-1 text-emerald-600 font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Lunas Verified
              </div>
              <p className="font-bold border-b border-slate-300 inline-block px-4 pb-0.5 text-slate-900 dark:text-white">
                {payment.receiver_name || schoolSettings.treasurer_name}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                NIP: {schoolSettings.treasurer_nip}
              </p>
            </div>
          </div>

          {/* Security Badge Footer */}
          <div className="mt-8 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Dokumen Resmi Terverifikasi Sistem Bendahara SMP NU
            </span>
            <span>Ref ID: {payment.id}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            id="btn-close-receipt-modal"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Tutup
          </button>
          <button
            id="btn-print-receipt"
            onClick={handlePrint}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm flex items-center gap-2 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" /> Cetak Kuitansi (PDF)
          </button>
        </div>
      </div>
    </Modal>
  );
};
