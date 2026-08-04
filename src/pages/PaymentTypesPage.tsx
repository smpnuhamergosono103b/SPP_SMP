import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { PaymentType, PaymentPeriod } from '../types';
import { Card, Badge } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { formatRupiah } from '../utils/formatters';
import { Tags, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export const PaymentTypesPage: React.FC = () => {
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPt, setEditingPt] = useState<PaymentType | null>(null);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formAmount, setFormAmount] = useState(150000);
  const [formPeriod, setFormPeriod] = useState<PaymentPeriod>('monthly');
  const [formIsMandatory, setFormIsMandatory] = useState(true);

  useEffect(() => {
    loadPaymentTypes();
  }, []);

  async function loadPaymentTypes() {
    try {
      const list = await apiService.getPaymentTypes();
      setPaymentTypes(list);
    } catch (err) {
      console.error('Failed to load payment types:', err);
    }
  }

  const handleOpenModal = (pt?: PaymentType) => {
    if (pt) {
      setEditingPt(pt);
      setFormName(pt.name);
      setFormDesc(pt.description);
      setFormAmount(pt.amount);
      setFormPeriod(pt.payment_period);
      setFormIsMandatory(pt.is_mandatory);
    } else {
      setEditingPt(null);
      setFormName('');
      setFormDesc('');
      setFormAmount(100000);
      setFormPeriod('monthly');
      setFormIsMandatory(true);
    }
    setIsModalOpen(true);
  };

  const handleSavePaymentType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPt) {
        await apiService.updatePaymentType(editingPt.id, {
          name: formName,
          description: formDesc,
          amount: formAmount,
          payment_period: formPeriod,
          is_mandatory: formIsMandatory
        });
      } else {
        await apiService.createPaymentType({
          name: formName,
          description: formDesc,
          amount: formAmount,
          payment_period: formPeriod,
          is_mandatory: formIsMandatory,
          academic_year_id: 'ay-2025-2026'
        });
      }
      setIsModalOpen(false);
      loadPaymentTypes();
    } catch (err) {
      console.error('Failed to save payment type:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus jenis pembayaran ini?')) {
      await apiService.deletePaymentType(id);
      loadPaymentTypes();
    }
  };

  return (
    <div id="page-payment-types" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Tags className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Jenis Pembayaran & Tarif Biaya
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pengaturan komponen tagihan SPP bulanan, gedung, seragam, & ujian.
          </p>
        </div>
        <button
          id="btn-add-payment-type"
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Pos Biaya Baru
        </button>
      </div>

      {/* Grid of Payment Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentTypes.map(pt => (
          <Card key={pt.id} className="p-5 flex flex-col justify-between hover:border-emerald-400 transition-all">
            <div>
              <div className="flex items-start justify-between mb-2">
                <Badge variant={pt.payment_period === 'monthly' ? 'emerald' : 'sky'}>
                  {pt.payment_period === 'monthly' ? 'Bulanan (SPP)' : pt.payment_period === 'one_time' ? 'Sekali Bayar' : 'Tahunan'}
                </Badge>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(pt)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pt.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {pt.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {pt.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Tarif Standar</span>
                <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                  {formatRupiah(pt.amount)}
                </p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                pt.is_mandatory ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {pt.is_mandatory ? 'Wajib' : 'Sukarela'}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPt ? 'Edit Jenis Pembayaran' : 'Tambah Pos Biaya Baru'}
        subtitle="Pengaturan Struktur Biaya Sekolah SMP NU"
        maxWidth="md"
        id="modal-payment-type-form"
      >
        <form onSubmit={handleSavePaymentType} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Nama Pos Biaya (Contoh: SPP Bulanan)</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Keterangan / Rincian Peruntukan</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              rows={2}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Nominal Biaya (Rp)</label>
              <input
                type="number"
                value={formAmount}
                onChange={(e) => setFormAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white text-sm"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Sifat Periode Pembayaran</label>
              <select
                value={formPeriod}
                onChange={(e) => setFormPeriod(e.target.value as PaymentPeriod)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
              >
                <option value="monthly">Setiap Bulan (SPP)</option>
                <option value="one_time">Sekali Bayar (Pangkal/Gedung)</option>
                <option value="annual">Setiap Tahun Ajaran</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="chk-mandatory"
              checked={formIsMandatory}
              onChange={(e) => setFormIsMandatory(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="chk-mandatory" className="font-semibold text-slate-700 dark:text-slate-300">
              Wajib Dibayar oleh Seluruh Siswa
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Simpan Pos Biaya
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
