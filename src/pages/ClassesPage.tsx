import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { ClassRoom } from '../types';
import { Card, Badge } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { School, Plus, Edit2, Users, GraduationCap } from 'lucide-react';

export const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  const [formClassName, setFormClassName] = useState('');
  const [formGradeLevel, setFormGradeLevel] = useState<7 | 8 | 9>(7);
  const [formTeacher, setFormTeacher] = useState('');
  const [formCapacity, setFormCapacity] = useState(36);

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    try {
      const list = await apiService.getClasses();
      setClasses(list);
    } catch (err) {
      console.error('Failed to load classes:', err);
    }
  }

  const handleOpenModal = (cls?: ClassRoom) => {
    if (cls) {
      setEditingClass(cls);
      setFormClassName(cls.class_name);
      setFormGradeLevel(cls.grade_level);
      setFormTeacher(cls.homeroom_teacher);
      setFormCapacity(cls.capacity);
    } else {
      setEditingClass(null);
      setFormClassName('7-C');
      setFormGradeLevel(7);
      setFormTeacher('Ibu Fitriani, S.Pd.');
      setFormCapacity(36);
    }
    setIsModalOpen(true);
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await apiService.updateClass(editingClass.id, {
          class_name: formClassName,
          grade_level: formGradeLevel,
          homeroom_teacher: formTeacher,
          capacity: formCapacity
        });
      } else {
        await apiService.createClass({
          class_name: formClassName,
          grade_level: formGradeLevel,
          homeroom_teacher: formTeacher,
          capacity: formCapacity,
          academic_year_id: 'ay-2025-2026'
        });
      }
      setIsModalOpen(false);
      loadClasses();
    } catch (err) {
      console.error('Failed to save class:', err);
    }
  };

  return (
    <div id="page-classes" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <School className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Master Kelas & Wali Kelas
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar pembagian Rombongan Belajar (Rombel) Tingkat 7, 8, dan 9 SMP NUHA MERGOSONO.
          </p>
        </div>
        <button
          id="btn-add-class"
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Kelas Baru
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map(cls => {
          const filled = cls.total_students || 0;
          const percentage = Math.round((filled / cls.capacity) * 100);

          return (
            <Card key={cls.id} className="p-5 relative overflow-hidden group hover:border-emerald-400 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
                    {cls.class_name}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Kelas {cls.class_name}
                    </h3>
                    <p className="text-xs text-slate-500">Tingkat {cls.grade_level} SMP</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenModal(cls)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 my-4 border-t border-b border-slate-100 dark:border-slate-800 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Wali Kelas:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{cls.homeroom_teacher}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kapasitas Maksimal:</span>
                  <span className="font-bold">{cls.capacity} Siswa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Siswa Terdaftar:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{filled} Siswa</span>
                </div>
              </div>

              {/* Progress Bar Capacity */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1">
                  <span>Okupansi Ruang Kelas</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal Add / Edit Class */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? 'Edit Rombel Kelas' : 'Tambah Kelas Baru'}
        subtitle="Sistem Manajemen Rombel SMP NUHA MERGOSONO"
        maxWidth="md"
        id="modal-class-form"
      >
        <form onSubmit={handleSaveClass} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Nama Kelas (Contoh: 7-A, 8-B)</label>
            <input
              type="text"
              value={formClassName}
              onChange={(e) => setFormClassName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Tingkat Kelas</label>
              <select
                value={formGradeLevel}
                onChange={(e) => setFormGradeLevel(Number(e.target.value) as 7 | 8 | 9)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
              >
                <option value={7}>Kelas 7 (Tingkat I)</option>
                <option value={8}>Kelas 8 (Tingkat II)</option>
                <option value={9}>Kelas 9 (Tingkat III)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Kapasitas Kursi Siswa</label>
              <input
                type="number"
                value={formCapacity}
                onChange={(e) => setFormCapacity(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Nama Wali Kelas</label>
            <input
              type="text"
              value={formTeacher}
              onChange={(e) => setFormTeacher(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
              placeholder="Contoh: Ibu Endang Sri Rahayu, S.Si."
              required
            />
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
              Simpan Data Kelas
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
