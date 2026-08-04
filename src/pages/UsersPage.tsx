import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { User, UserRole } from '../types';
import { Card, Badge } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Users, Plus, ShieldCheck, Mail, Phone } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('bendahara');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const list = await apiService.getUsers();
      setUsers(list);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createUser({
        username,
        full_name: fullName,
        email,
        phone,
        role,
        is_active: true
      });
      setIsModalOpen(false);
      setUsername('');
      setFullName('');
      setEmail('');
      setPhone('');
      loadUsers();
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  return (
    <div id="page-users" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Pengguna & Hak Akses Peran
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen akun operasional Bendahara, Kepala Sekolah, & Administrator.
          </p>
        </div>
        <button
          id="btn-add-user"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Pengguna Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map(u => (
          <Card key={u.id} className="p-5 relative overflow-hidden space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-black flex items-center justify-center text-sm border border-emerald-300">
                {u.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {u.full_name}
                </h3>
                <p className="text-[10px] text-slate-500">@{u.username}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {u.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {u.phone}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hak Peran:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 capitalize">
                {u.role.replace('_', ' ')}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Akun Pengguna"
        subtitle="Sistem Hak Akses Multi-User SMP NU"
        maxWidth="md"
        id="modal-add-user"
      >
        <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Username Login</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Nama Lengkap & Gelar</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Email Resmi</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Nomor HP</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Peran Akses</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
            >
              <option value="bendahara">Bendahara (Kasir & Laporan)</option>
              <option value="kepala_sekolah">Kepala Sekolah (Monitoring Executive)</option>
              <option value="admin">Administrator IT</option>
            </select>
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
              Simpan Akun
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
