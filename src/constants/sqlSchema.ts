export const SUPABASE_SQL_SCHEMA = `-- ====================================================================
-- SKEMA DATABASE POSTGRESQL / SUPABASE
-- SISTEM BENDAHARA SEKOLAH (SMP NU / SMP NEGERI/SWASTA)
-- ====================================================================

-- 1. EXTENSIONS & SCHEMA CLEANUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-initialising (in reverse dependency order)
DROP TABLE IF EXISTS payment_history CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS payment_types CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS school_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS academic_years CASCADE;

-- 2. TABEL ROLES (Peran Pengguna)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'admin', 'Administrator Sistem dengan Hak Akses Penuh'),
('22222222-2222-2222-2222-222222222222', 'bendahara', 'Bendahara Sekolah (Entri Transaksi & Laporan Keuangan)'),
('33333333-3333-3333-3333-333333333333', 'kepala_sekolah', 'Kepala Sekolah (Monitoring Laporan & Rekapitulasi)');

-- 3. TABEL USERS (Pengguna Sistem)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL ACADEMIC_YEARS (Tahun Ajaran & Semester)
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year_name VARCHAR(20) NOT NULL, -- Contoh: "2025/2026"
    semester VARCHAR(10) NOT NULL CHECK (semester IN ('Ganjil', 'Genap')),
    is_active BOOLEAN DEFAULT FALSE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Constraint unik agar tidak ada kombinasi tahun & semester ganda
ALTER TABLE academic_years ADD CONSTRAINT unique_academic_period UNIQUE (year_name, semester);

-- 5. TABEL CLASSES (Kelas)
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_name VARCHAR(50) NOT NULL, -- Contoh: "7-A", "8-B", "9-C"
    grade_level INT NOT NULL CHECK (grade_level IN (7, 8, 9)),
    homeroom_teacher VARCHAR(100),
    capacity INT DEFAULT 36,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL STUDENTS (Siswa)
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nis VARCHAR(20) NOT NULL UNIQUE,
    nisn VARCHAR(20) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('L', 'P')),
    parent_name VARCHAR(100) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_email VARCHAR(100),
    address TEXT,
    status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'alumni', 'pindah', 'do')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABEL PAYMENT_TYPES (Jenis Pembayaran)
CREATE TABLE payment_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- Contoh: "SPP Bulanan", "Uang Pangkal / Gedung", "Seragam"
    description TEXT,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (amount >= 0),
    payment_period VARCHAR(20) NOT NULL CHECK (payment_period IN ('monthly', 'one_time', 'annual')),
    is_mandatory BOOLEAN DEFAULT TRUE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABEL PAYMENTS (Pembayaran Utama)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    payment_type_id UUID NOT NULL REFERENCES payment_types(id) ON DELETE RESTRICT,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    month_for INT CHECK (month_for BETWEEN 1 AND 12), -- 1=Januari, 7=Juli (Awal TA)
    amount_due DECIMAL(12,2) NOT NULL CHECK (amount_due >= 0),
    amount_paid DECIMAL(12,2) NOT NULL CHECK (amount_paid >= 0),
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('lunas', 'partial', 'belum_bayar')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'qris')),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    receiver_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TABEL PAYMENT_HISTORY (Audit Log Pembayaran)
CREATE TABLE payment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    receipt_number VARCHAR(50) NOT NULL,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('create', 'update', 'cancel', 'refund')),
    old_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    new_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    changed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    change_reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. TABEL SCHOOL_SETTINGS (Pengaturan Profil Sekolah)
CREATE TABLE school_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_name VARCHAR(150) NOT NULL DEFAULT 'SMP NU MERGOSONO',
    npsn VARCHAR(20) DEFAULT '20531234',
    address TEXT DEFAULT 'Jl. Kolonel Sugiono No. 12, Mergosono, Kedungkandang, Kota Malang',
    phone VARCHAR(20) DEFAULT '(0341) 325888',
    email VARCHAR(100) DEFAULT 'smpnumergosono@gmail.com',
    website VARCHAR(100) DEFAULT 'https://smpnumergosono.sch.id',
    logo_url TEXT,
    principal_name VARCHAR(100) DEFAULT 'Drs. H. Ahmad Fauzi, M.Pd.',
    principal_nip VARCHAR(30) DEFAULT '19750812 200212 1 003',
    treasurer_name VARCHAR(100) DEFAULT 'Siti Rahmah, S.Pd.',
    treasurer_nip VARCHAR(30) DEFAULT '19820315 201001 2 011',
    active_academic_year_id UUID REFERENCES academic_years(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- INDEXING UNTUK PERFORMA TINGGI (HIGH PERFORMANCE INDEXES)
-- ====================================================================

CREATE INDEX idx_students_nis ON students(nis);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_status ON students(status);

CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_payment_type_id ON payments(payment_type_id);
CREATE INDEX idx_payments_academic_year ON payments(academic_year_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_receipt ON payments(receipt_number);

CREATE INDEX idx_history_payment_id ON payment_history(payment_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- ====================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated reads and edits
CREATE POLICY "Public Read School Settings" ON school_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Academic Years" ON academic_years FOR SELECT USING (true);
CREATE POLICY "Public Read Classes" ON classes FOR SELECT USING (true);
CREATE POLICY "Public Read Students" ON students FOR SELECT USING (true);
CREATE POLICY "Public Read Payment Types" ON payment_types FOR SELECT USING (true);
CREATE POLICY "Public Read Payments" ON payments FOR SELECT USING (true);

-- End of Supabase DDL SQL Schema Script
`;
