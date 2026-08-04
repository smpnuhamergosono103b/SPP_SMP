import {
  User,
  AcademicYear,
  ClassRoom,
  Student,
  PaymentType,
  Payment,
  SchoolSettings
} from '../types';

export const INITIAL_SCHOOL_SETTINGS: SchoolSettings = {
  id: 'set-1',
  school_name: 'SMP NUHA MERGOSONO MALANG',
  npsn: '20531234',
  address: 'Jl. Kolonel Sugiono No. 12, Mergosono, Kedungkandang, Kota Malang, Jawa Timur 65148',
  phone: '(0341) 325888',
  email: 'smpnuhamergosono@gmail.com',
  website: 'https://smpnuhamergosono.sch.id',
  logo_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
  principal_name: 'Drs. H. Ahmad Fauzi, M.Pd.',
  principal_nip: '19750812 200212 1 003',
  treasurer_name: 'Siti Rahmah, S.Pd.',
  treasurer_nip: '19820315 201001 2 011',
  active_academic_year_id: 'ay-2025-2026',
  bank_name: 'Bank BNI Syariah / BSI',
  bank_account_number: '123-456-7890',
  bank_account_holder: 'YAYASAN SMP NUHA MERGOSONO'
};

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: 'ay-2025-2026',
    year_name: '2025/2026',
    semester: 'Ganjil',
    is_active: true,
    start_date: '2025-07-15',
    end_date: '2025-12-20'
  },
  {
    id: 'ay-2024-2025',
    year_name: '2024/2025',
    semester: 'Genap',
    is_active: false,
    start_date: '2025-01-05',
    end_date: '2025-06-25'
  }
];

export const INITIAL_CLASSES: ClassRoom[] = [
  { id: 'cls-7a', class_name: '7-A', grade_level: 7, homeroom_teacher: 'Bpk. Sugeng Rahmat, S.Pd.', capacity: 36, academic_year_id: 'ay-2025-2026' },
  { id: 'cls-7b', class_name: '7-B', grade_level: 7, homeroom_teacher: 'Ibu Endang Sri Rahayu, S.Si.', capacity: 36, academic_year_id: 'ay-2025-2026' },
  { id: 'cls-8a', class_name: '8-A', grade_level: 8, homeroom_teacher: 'Bpk. Drs. M. Zainuri', capacity: 36, academic_year_id: 'ay-2025-2026' },
  { id: 'cls-8b', class_name: '8-B', grade_level: 8, homeroom_teacher: 'Ibu Hj. Nurul Hidayah, M.Pd.', capacity: 36, academic_year_id: 'ay-2025-2026' },
  { id: 'cls-9a', class_name: '9-A', grade_level: 9, homeroom_teacher: 'Bpk. Ahmad Syarifuddin, S.Ag.', capacity: 36, academic_year_id: 'ay-2025-2026' },
  { id: 'cls-9b', class_name: '9-B', grade_level: 9, homeroom_teacher: 'Ibu Rina Kartika, S.Pd.', capacity: 36, academic_year_id: 'ay-2025-2026' }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'bendahara',
    full_name: 'Siti Rahmah, S.Pd.',
    email: 'bendahara@smpnuhamergosono.sch.id',
    phone: '0812-3456-7890',
    role: 'bendahara',
    is_active: true,
    created_at: '2025-01-10T08:00:00Z'
  },
  {
    id: 'usr-2',
    username: 'kepala_sekolah',
    full_name: 'Drs. H. Ahmad Fauzi, M.Pd.',
    email: 'kepsek@smpnuhamergosono.sch.id',
    phone: '0813-9876-5432',
    role: 'kepala_sekolah',
    is_active: true,
    created_at: '2025-01-10T08:00:00Z'
  },
  {
    id: 'usr-3',
    username: 'admin',
    full_name: 'Administrator IT',
    email: 'admin@smpnuhamergosono.sch.id',
    phone: '0857-1122-3344',
    role: 'admin',
    is_active: true,
    created_at: '2025-01-10T08:00:00Z'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-101',
    nis: '250101',
    nisn: '0098271625',
    full_name: 'Ahmad Raihan Pratama',
    class_id: 'cls-7a',
    class_name: '7-A',
    gender: 'L',
    parent_name: 'Budi Santoso',
    parent_phone: '0812-9876-1234',
    parent_email: 'budi.santoso@gmail.com',
    address: 'Jl. Mergosono Gang 3 No. 45, Malang',
    status: 'aktif',
    created_at: '2025-07-10T09:00:00Z'
  },
  {
    id: 'std-102',
    nis: '250102',
    nisn: '0098271626',
    full_name: 'Anisa Nur Aini',
    class_id: 'cls-7a',
    class_name: '7-A',
    gender: 'P',
    parent_name: 'Muhammad Farhan',
    parent_phone: '0813-4567-8901',
    parent_email: 'm.farhan@yahoo.com',
    address: 'Jl. Kolonel Sugiono Gang 5 No. 12, Malang',
    status: 'aktif',
    created_at: '2025-07-10T09:15:00Z'
  },
  {
    id: 'std-103',
    nis: '250103',
    nisn: '0098271627',
    full_name: 'Bagas Aditya Putra',
    class_id: 'cls-7b',
    class_name: '7-B',
    gender: 'L',
    parent_name: 'Heri Susanto',
    parent_phone: '0856-7890-1234',
    address: 'Jl. Gadang Pasar No. 88, Malang',
    status: 'aktif',
    created_at: '2025-07-10T09:30:00Z'
  },
  {
    id: 'std-104',
    nis: '240201',
    nisn: '0087612345',
    full_name: 'Citra Dewi Maharani',
    class_id: 'cls-8a',
    class_name: '8-A',
    gender: 'P',
    parent_name: 'H. Slamet Widodo',
    parent_phone: '0821-3344-5566',
    parent_email: 'slamet.widodo@gmail.com',
    address: 'Jl. Kebonsari No. 17, Malang',
    status: 'aktif',
    created_at: '2024-07-12T10:00:00Z'
  },
  {
    id: 'std-105',
    nis: '240202',
    nisn: '0087612346',
    full_name: 'Dimas Prasetyo',
    class_id: 'cls-8b',
    class_name: '8-B',
    gender: 'L',
    parent_name: 'Bambang Irawan',
    parent_phone: '0819-0987-6543',
    address: 'Jl. Ciptomulyo Gang 1 No. 5, Malang',
    status: 'aktif',
    created_at: '2024-07-12T10:30:00Z'
  },
  {
    id: 'std-106',
    nis: '230301',
    nisn: '0076543210',
    full_name: 'Fikri Haikal Rahman',
    class_id: 'cls-9a',
    class_name: '9-A',
    gender: 'L',
    parent_name: 'Ustadz Moh. Ali',
    parent_phone: '0812-1122-3344',
    address: 'Jl. Kyai Tamin No. 99, Malang',
    status: 'aktif',
    created_at: '2023-07-14T08:00:00Z'
  },
  {
    id: 'std-107',
    nis: '230302',
    nisn: '0076543211',
    full_name: 'Zahra Maulida Az-Zahra',
    class_id: 'cls-9b',
    class_name: '9-B',
    gender: 'P',
    parent_name: 'Ir. Ahmad Subagyo',
    parent_phone: '0813-7788-9900',
    parent_email: 'subagyo.family@gmail.com',
    address: 'Jl. Lowokdoro Permai No. A-12, Malang',
    status: 'aktif',
    created_at: '2023-07-14T08:30:00Z'
  }
];

export const INITIAL_PAYMENT_TYPES: PaymentType[] = [
  {
    id: 'pt-spp',
    name: 'SPP Bulanan',
    description: 'Sumbangan Pembinaan Pendidikan per bulan',
    amount: 250000,
    payment_period: 'monthly',
    is_mandatory: true,
    academic_year_id: 'ay-2025-2026',
    created_at: '2025-07-01T00:00:00Z'
  },
  {
    id: 'pt-makan',
    name: 'Uang Makan',
    description: 'Biaya konsumsi/catering makan siswa per bulan',
    amount: 450000,
    payment_period: 'monthly',
    is_mandatory: true,
    academic_year_id: 'ay-2025-2026',
    created_at: '2025-07-01T00:00:00Z'
  },
  {
    id: 'pt-sarpras',
    name: 'Uang Sarpras',
    description: 'Iuran pemeliharaan sarana & prasarana per bulan',
    amount: 15000,
    payment_period: 'monthly',
    is_mandatory: true,
    academic_year_id: 'ay-2025-2026',
    created_at: '2025-07-01T00:00:00Z'
  },
  {
    id: 'pt-kesehatan',
    name: 'Uang Kesehatan',
    description: 'Iuran layanan & obat-obatan UKS kesehatan per bulan',
    amount: 15000,
    payment_period: 'monthly',
    is_mandatory: true,
    academic_year_id: 'ay-2025-2026',
    created_at: '2025-07-01T00:00:00Z'
  },
  {
    id: 'pt-pendaftaran',
    name: 'Uang Pendaftaran Awal',
    description: 'Biaya pendaftaran awal & registrasi siswa baru (dapat diangsur)',
    amount: 1500000,
    payment_period: 'one_time',
    is_mandatory: true,
    academic_year_id: 'ay-2025-2026',
    created_at: '2025-07-01T00:00:00Z'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-1001',
    receipt_number: 'KWT/2026/08/0001',
    student_id: 'std-101',
    student_name: 'Ahmad Raihan Pratama',
    nis: '250101',
    class_name: '7-A',
    payment_type_id: 'pt-spp',
    payment_type_name: 'SPP Bulanan',
    academic_year_id: 'ay-2025-2026',
    academic_year_name: '2025/2026',
    month_for: 7, // Juli
    month_name: 'Juli 2025',
    amount_due: 250000,
    amount_paid: 250000,
    payment_status: 'lunas',
    payment_method: 'cash',
    payment_date: '2026-08-03T09:30:00Z',
    receiver_user_id: 'usr-1',
    receiver_name: 'Siti Rahmah, S.Pd.',
    notes: 'Pembayaran SPP Juli 2025 Lunas via Kasir',
    created_at: '2026-08-03T09:30:00Z'
  },
  {
    id: 'pay-1002',
    receipt_number: 'KWT/2026/08/0002',
    student_id: 'std-101',
    student_name: 'Ahmad Raihan Pratama',
    nis: '250101',
    class_name: '7-A',
    payment_type_id: 'pt-makan',
    payment_type_name: 'Uang Makan',
    academic_year_id: 'ay-2025-2026',
    academic_year_name: '2025/2026',
    month_for: 7, // Juli
    month_name: 'Juli 2025',
    amount_due: 450000,
    amount_paid: 450000,
    payment_status: 'lunas',
    payment_method: 'qris',
    payment_date: '2026-08-03T10:15:00Z',
    receiver_user_id: 'usr-1',
    receiver_name: 'Siti Rahmah, S.Pd.',
    notes: 'Bayar via Scan QRIS Bank Jatim',
    created_at: '2026-08-03T10:15:00Z'
  },
  {
    id: 'pay-1003',
    receipt_number: 'KWT/2026/08/0003',
    student_id: 'std-102',
    student_name: 'Anisa Nur Aini',
    nis: '250102',
    class_name: '7-A',
    payment_type_id: 'pt-sarpras',
    payment_type_name: 'Uang Sarpras',
    academic_year_id: 'ay-2025-2026',
    academic_year_name: '2025/2026',
    month_for: 7,
    month_name: 'Juli 2025',
    amount_due: 15000,
    amount_paid: 15000,
    payment_status: 'lunas',
    payment_method: 'cash',
    payment_date: '2026-08-02T14:20:00Z',
    receiver_user_id: 'usr-1',
    receiver_name: 'Siti Rahmah, S.Pd.',
    notes: 'Lunas',
    created_at: '2026-08-02T14:20:00Z'
  },
  {
    id: 'pay-1004',
    receipt_number: 'KWT/2026/08/0004',
    student_id: 'std-102',
    student_name: 'Anisa Nur Aini',
    nis: '250102',
    class_name: '7-A',
    payment_type_id: 'pt-pendaftaran',
    payment_type_name: 'Uang Pendaftaran Awal',
    academic_year_id: 'ay-2025-2026',
    academic_year_name: '2025/2026',
    month_for: null,
    amount_due: 1500000,
    amount_paid: 750000,
    payment_status: 'partial',
    payment_method: 'bank_transfer',
    payment_date: '2026-08-01T11:00:00Z',
    receiver_user_id: 'usr-1',
    receiver_name: 'Siti Rahmah, S.Pd.',
    notes: 'Angsuran 1 Uang Pendaftaran Awal (Sisa Rp 750.000)',
    created_at: '2026-08-01T11:00:00Z'
  },
  {
    id: 'pay-1005',
    receipt_number: 'KWT/2026/08/0005',
    student_id: 'std-104',
    student_name: 'Citra Dewi Maharani',
    nis: '240201',
    class_name: '8-A',
    payment_type_id: 'pt-kesehatan',
    payment_type_name: 'Uang Kesehatan',
    academic_year_id: 'ay-2025-2026',
    academic_year_name: '2025/2026',
    month_for: 7,
    month_name: 'Juli 2025',
    amount_due: 15000,
    amount_paid: 15000,
    payment_status: 'lunas',
    payment_method: 'bank_transfer',
    payment_date: '2026-08-01T08:45:00Z',
    receiver_user_id: 'usr-1',
    receiver_name: 'Siti Rahmah, S.Pd.',
    notes: 'Transfer via BNI Mobile',
    created_at: '2026-08-01T08:45:00Z'
  },
  {
    id: 'pay-1006',
    receipt_number: 'KWT/2026/08/0006',
    student_id: 'std-106',
    student_name: 'Fikri Haikal Rahman',
    nis: '230301',
    class_name: '9-A',
    payment_type_id: 'pt-makan',
    payment_type_name: 'Uang Makan',
    academic_year_id: 'ay-2025-2026',
    academic_year_name: '2025/2026',
    month_for: 8,
    month_name: 'Agustus 2025',
    amount_due: 450000,
    amount_paid: 450000,
    payment_status: 'lunas',
    payment_method: 'cash',
    payment_date: '2026-07-28T13:10:00Z',
    receiver_user_id: 'usr-1',
    receiver_name: 'Siti Rahmah, S.Pd.',
    notes: 'Lunas Uang Makan Agustus',
    created_at: '2026-07-28T13:10:00Z'
  }
];
