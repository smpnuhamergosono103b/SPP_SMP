import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { AcademicYear } from '../types';
import { Card, Badge } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Calendar, Plus, CheckCircle2 } from 'lucide-react';

export const AcademicYearsPage: React.FC = () => {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [yearName, setYearName] = useState('2026/2027');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [startDate, setStartDate] = useState('2026-07-15');
  const [endDate, setEndDate] = useState('2026-12-20');

  useEffect(() => {
    loadYears();
  }, []);

  async function loadYears() {
    try {
      const list = await apiService.getAcademicYears();
      setYears(list);
    } catch (err) {
      console.error('Failed to load academic years:', err);
    }
  }

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createAcademicYear({
        year_name: yearName,
        semester,
        is_active: false,
        start_date: startDate,
        end_date: endDate
      });
      setIsModalOpen(false);
      loadYears();
    } catch (err) {
      console.error('Failed to create academic year:', err);
    }
  };

  return (
    <div id="page-academic-years" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Master Tahun Ajaran & Semester
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pengaturan periode kalender pendidikan & penetapan tahun ajaran aktif.
          </p>
        </div>
        <button
          id="btn-add-academic-year"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Tahun Ajaran Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {years.map(y => (
          <Card key={y.id} className="p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  Tahun Ajaran {y.year_name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Semester {y.semester}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Periode: {y.start_date} s/d {y.end_date}
              </p>
            </div>
            <div>
              <Badge variant={y.is_active ? 'emerald' : 'slate'}>
                {y.is_active ? 'AKTIF BERJALAN' : 'ARSIP'}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Tahun Ajaran Baru"
        subtitle="Sistem Kalender Akademik SMP NU"
        maxWidth="md"
        id="modal-add-academic-year"
      >
        <form onSubmit={handleCreateYear} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Nama Tahun Ajaran (Contoh: 2026/2027)</label>
            <input
              type="text"
              value={yearName}
              onChange={(e) => setYearName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value as 'Ganjil' | 'Genap')}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Tanggal Selesai</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700"
                required
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
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
              Simpan Periode
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
