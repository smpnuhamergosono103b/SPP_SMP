import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Student, ClassRoom } from '../types';
import { Card, Badge } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  UserCheck,
  Phone,
  Home
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form Fields
  const [formNis, setFormNis] = useState('');
  const [formNisn, setFormNisn] = useState('');
  const [formName, setFormName] = useState('');
  const [formClassId, setFormClassId] = useState('');
  const [formGender, setFormGender] = useState<'L' | 'P'>('L');
  const [formParentName, setFormParentName] = useState('');
  const [formParentPhone, setFormParentPhone] = useState('');
  const [formParentEmail, setFormParentEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formStatus, setFormStatus] = useState<'aktif' | 'alumni' | 'pindah' | 'do'>('aktif');

  useEffect(() => {
    loadData();
  }, [selectedClassFilter, selectedStatusFilter]);

  async function loadData() {
    try {
      const [stdList, clsList] = await Promise.all([
        apiService.getStudents(selectedClassFilter, selectedStatusFilter),
        apiService.getClasses()
      ]);
      setStudents(stdList);
      setClasses(clsList);
      if (clsList.length > 0 && !formClassId) {
        setFormClassId(clsList[0].id);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  }

  const handleOpenModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormNis(student.nis);
      setFormNisn(student.nisn);
      setFormName(student.full_name);
      setFormClassId(student.class_id);
      setFormGender(student.gender);
      setFormParentName(student.parent_name);
      setFormParentPhone(student.parent_phone);
      setFormParentEmail(student.parent_email || '');
      setFormAddress(student.address);
      setFormStatus(student.status);
    } else {
      setEditingStudent(null);
      setFormNis(`250${Math.floor(100 + Math.random() * 900)}`);
      setFormNisn(`009${Math.floor(1000000 + Math.random() * 9000000)}`);
      setFormName('');
      setFormGender('L');
      setFormParentName('');
      setFormParentPhone('0812-');
      setFormParentEmail('');
      setFormAddress('Jl. Mergosono, Malang');
      setFormStatus('aktif');
    }
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await apiService.updateStudent(editingStudent.id, {
          nis: formNis,
          nisn: formNisn,
          full_name: formName,
          class_id: formClassId,
          gender: formGender,
          parent_name: formParentName,
          parent_phone: formParentPhone,
          parent_email: formParentEmail,
          address: formAddress,
          status: formStatus
        });
      } else {
        await apiService.createStudent({
          nis: formNis,
          nisn: formNisn,
          full_name: formName,
          class_id: formClassId,
          gender: formGender,
          parent_name: formParentName,
          parent_phone: formParentPhone,
          parent_email: formParentEmail,
          address: formAddress,
          status: formStatus
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save student:', err);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      await apiService.deleteStudent(id);
      loadData();
    }
  };

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nis.includes(searchQuery) ||
    s.parent_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="page-students" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Master Data Siswa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen direktori peserta didik aktif, alumni, & kontak orang tua wali.
          </p>
        </div>
        <button
          id="btn-add-student"
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Tambah Siswa Baru
        </button>
      </div>

      {/* Filters Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              id="input-search-student-page"
              type="text"
              placeholder="Cari Nama / NIS Siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            id="select-filter-class"
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="">Semua Kelas</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                Kelas {c.class_name}
              </option>
            ))}
          </select>

          <select
            id="select-filter-status-siswa"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="">Semua Status Siswa</option>
            <option value="aktif">Siswa Aktif</option>
            <option value="alumni">Alumni</option>
            <option value="pindah">Pindah Sekolah</option>
          </select>
        </div>
      </Card>

      {/* Students Table */}
      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">NIS / NISN</th>
                <th className="py-2.5 px-3">Nama Lengkap & JK</th>
                <th className="py-2.5 px-3">Kelas</th>
                <th className="py-2.5 px-3">Orang Tua / Wali</th>
                <th className="py-2.5 px-3">Kontak HP</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-mono font-bold text-slate-900 dark:text-white">{student.nis}</p>
                    <p className="text-[10px] text-slate-400">NISN: {student.nisn}</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {student.full_name}
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        student.gender === 'L' ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {student.gender}
                      </span>
                    </p>
                  </td>
                  <td className="py-3 px-3 font-semibold text-emerald-700 dark:text-emerald-400">
                    Kelas {student.class_name}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    {student.parent_name}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" /> {student.parent_phone}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge variant={student.status === 'aktif' ? 'emerald' : 'slate'}>
                      {student.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenModal(student)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Data Siswa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Hapus Siswa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Add / Edit Student */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
        subtitle="Sistem Informasi Induk Siswa SMP NU Mergosono"
        maxWidth="lg"
        id="modal-student-form"
      >
        <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">NIS (Nomor Induk Siswa)</label>
              <input
                type="text"
                value={formNis}
                onChange={(e) => setFormNis(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">NISN (Nasional)</label>
              <input
                type="text"
                value={formNisn}
                onChange={(e) => setFormNisn(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Nama Lengkap Siswa</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              placeholder="Contoh: Muhammad Raihan Pratama"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Pilih Kelas</label>
              <select
                value={formClassId}
                onChange={(e) => setFormClassId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    Kelas {c.class_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Jenis Kelamin</label>
              <select
                value={formGender}
                onChange={(e) => setFormGender(e.target.value as 'L' | 'P')}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Nama Orang Tua / Wali</label>
              <input
                type="text"
                value={formParentName}
                onChange={(e) => setFormParentName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Contoh: Budi Santoso"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Nomor HP / WhatsApp Ortu</label>
              <input
                type="text"
                value={formParentPhone}
                onChange={(e) => setFormParentPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Alamat Domisili Siswa</label>
            <textarea
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              rows={2}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
              Simpan Data Siswa
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
