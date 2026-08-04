import React, { useState } from 'react';
import { SRS_DOCUMENTATION } from '../constants/srsDoc';
import { SUPABASE_SQL_SCHEMA } from '../constants/sqlSchema';
import { Card } from '../components/common/Card';
import {
  FileText,
  Database,
  Copy,
  Check,
  Code2,
  Table,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const SrsAndDatabaseDocPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'srs' | 'sql_schema' | 'erd'>('sql_schema');
  const [copied, setCopied] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div id="page-srs-db-docs" className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Dokumentasi SRS & Skema Database Supabase
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Spesifikasi Software (SRS) & Skema DDL DDL SQL PostgreSQL untuk Supabase Cloud.
          </p>
        </div>
        {activeTab === 'sql_schema' && (
          <button
            id="btn-copy-sql-schema"
            onClick={handleCopySql}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            {copied ? 'SQL Tersalin ke Clipboard!' : 'Salin SQL Schema Supabase'}
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('sql_schema')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'sql_schema'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" /> DDL SQL Schema Supabase
        </button>
        <button
          onClick={() => setActiveTab('erd')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'erd'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" /> Stuktur Tabel & ERD
        </button>
        <button
          onClick={() => setActiveTab('srs')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'srs'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" /> Dokumen SRS Lengkap
        </button>
      </div>

      {/* Tab 1: SQL Schema */}
      {activeTab === 'sql_schema' && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Script SQL DDL PostgreSQL (Siap di-Execute di Supabase SQL Editor)
              </p>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-slate-950 text-emerald-400 border border-slate-800 p-4 font-mono text-xs max-h-[600px] overflow-y-auto leading-relaxed shadow-inner">
            <pre>{SUPABASE_SQL_SCHEMA}</pre>
          </div>
        </Card>
      )}

      {/* Tab 2: ERD & Relasi Tabel */}
      {activeTab === 'erd' && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
              Diagram Relasi Antar Tabel (Database Normalized Architecture)
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Struktur tabel PostgreSQL ter-normalisasi hingga BCNF untuk performa tinggi & integritas data kas sekolah.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  1. students (Siswa)
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Primary Key: <code className="text-slate-800 dark:text-slate-200 font-bold">id (UUID)</code>
                  <br />
                  Foreign Key: <code className="text-slate-800 dark:text-slate-200 font-bold">class_id → classes(id)</code>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  2. classes (Kelas)
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Primary Key: <code className="text-slate-800 dark:text-slate-200 font-bold">id (UUID)</code>
                  <br />
                  Foreign Key: <code className="text-slate-800 dark:text-slate-200 font-bold">academic_year_id → academic_years(id)</code>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  3. payments (Pembayaran Kas)
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  FKs: <code className="text-slate-800 dark:text-slate-200 font-bold">student_id</code>, <code className="text-slate-800 dark:text-slate-200 font-bold">payment_type_id</code>, <code className="text-slate-800 dark:text-slate-200 font-bold">academic_year_id</code>, <code className="text-slate-800 dark:text-slate-200 font-bold">receiver_user_id</code>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  4. payment_types (Jenis Biaya)
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Komponen SPP, Uang Gedung, Seragam, Ujian, & Kegiatan.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  5. users & roles
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Akses Bendahara, Kepala Sekolah, dan Administrator.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  6. payment_history (Audit Log)
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Pencatatan riwayat revisi kuitansi & pembatalan transaksi.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: SRS Documents */}
      {activeTab === 'srs' && (
        <Card className="p-6 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {SRS_DOCUMENTATION.title}
            </h1>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {SRS_DOCUMENTATION.subtitle}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Versi {SRS_DOCUMENTATION.version} • Oleh {SRS_DOCUMENTATION.author} • {SRS_DOCUMENTATION.date}
            </p>
          </div>

          <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
            {SRS_DOCUMENTATION.sections.map(sec => (
              <div key={sec.id} className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-emerald-600" />
                  {sec.title}
                </h3>
                <ul className="list-disc list-inside space-y-1.5 pl-4 text-slate-600 dark:text-slate-300">
                  {sec.items.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
