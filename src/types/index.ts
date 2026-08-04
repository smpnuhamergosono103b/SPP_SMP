export type UserRole = 'admin' | 'bendahara' | 'kepala_sekolah';

export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface AcademicYear {
  id: string;
  year_name: string; // e.g. "2025/2026"
  semester: 'Ganjil' | 'Genap';
  is_active: boolean;
  start_date: string;
  end_date: string;
}

export interface ClassRoom {
  id: string;
  class_name: string; // e.g. "7-A", "8-B", "9-C"
  grade_level: 7 | 8 | 9;
  homeroom_teacher: string;
  capacity: number;
  academic_year_id: string;
  total_students?: number;
}

export type StudentStatus = 'aktif' | 'alumni' | 'pindah' | 'do';
export type Gender = 'L' | 'P';

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  full_name: string;
  class_id: string;
  class_name?: string;
  gender: Gender;
  parent_name: string;
  parent_phone: string;
  parent_email?: string;
  address: string;
  status: StudentStatus;
  created_at: string;
}

export type PaymentPeriod = 'monthly' | 'one_time' | 'annual';

export interface PaymentType {
  id: string;
  name: string; // e.g., "SPP Bulanan", "Uang Pangkal/Gedung", "Uang Seragam"
  description: string;
  amount: number;
  payment_period: PaymentPeriod;
  is_mandatory: boolean;
  academic_year_id: string;
  created_at: string;
}

export type PaymentStatus = 'lunas' | 'partial' | 'belum_bayar';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'qris';

export interface Payment {
  id: string;
  receipt_number: string;
  student_id: string;
  student_name?: string;
  nis?: string;
  class_name?: string;
  payment_type_id: string;
  payment_type_name?: string;
  academic_year_id: string;
  academic_year_name?: string;
  month_for?: number | null; // 1 to 12 for monthly payments (e.g. 7 = Juli)
  month_name?: string;
  amount_due: number;
  amount_paid: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_date: string;
  receiver_user_id: string;
  receiver_name?: string;
  notes?: string;
  created_at: string;
}

export interface PaymentHistory {
  id: string;
  payment_id: string;
  receipt_number: string;
  action_type: 'create' | 'update' | 'cancel' | 'refund';
  old_amount: number;
  new_amount: number;
  changed_by_user_id: string;
  changed_by_name?: string;
  change_reason: string;
  created_at: string;
}

export interface SchoolSettings {
  id: string;
  school_name: string;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
  principal_name: string;
  principal_nip: string;
  treasurer_name: string;
  treasurer_nip: string;
  active_academic_year_id: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
}

export interface PaymentSummary {
  totalRevenueThisMonth: number;
  totalRevenueThisYear: number;
  totalPendingAmount: number;
  sppPaidCountThisMonth: number;
  sppPendingCountThisMonth: number;
  totalActiveStudents: number;
  totalClasses: number;
  todayTransactionsCount: number;
  todayRevenue: number;
}

export interface ClassPaymentOverview {
  class_id: string;
  class_name: string;
  grade_level: number;
  total_students: number;
  paid_students_count: number;
  pending_students_count: number;
  paid_amount: number;
  pending_amount: number;
}
