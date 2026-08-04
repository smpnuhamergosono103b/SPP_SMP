import { supabase, isSupabaseConfigured } from './supabase';
import {
  Student,
  ClassRoom,
  PaymentType,
  Payment,
  PaymentHistory,
  SchoolSettings,
  AcademicYear,
  User,
  PaymentSummary,
  ClassPaymentOverview
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_CLASSES,
  INITIAL_PAYMENT_TYPES,
  INITIAL_PAYMENTS,
  INITIAL_SCHOOL_SETTINGS,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_USERS
} from '../constants/initialData';
import { generateReceiptNumber } from '../utils/formatters';

// Fallback in-memory storage when Supabase is not connected
let localStudents: Student[] = [...INITIAL_STUDENTS];
let localClasses: ClassRoom[] = [...INITIAL_CLASSES];
let localPaymentTypes: PaymentType[] = [...INITIAL_PAYMENT_TYPES];
let localPayments: Payment[] = [...INITIAL_PAYMENTS];
let localHistory: PaymentHistory[] = [];
let localSchoolSettings: SchoolSettings = { ...INITIAL_SCHOOL_SETTINGS };
let localAcademicYears: AcademicYear[] = [...INITIAL_ACADEMIC_YEARS];
let localUsers: User[] = [...INITIAL_USERS];

export const apiService = {
  // ----------------------------------------------------
  // SCHOOL SETTINGS
  // ----------------------------------------------------
  async getSchoolSettings(): Promise<SchoolSettings> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('school_settings').select('*').limit(1).single();
      if (!error && data) return data as SchoolSettings;
    }
    return localSchoolSettings;
  },

  async updateSchoolSettings(settings: Partial<SchoolSettings>): Promise<SchoolSettings> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('school_settings')
        .update(settings)
        .eq('id', settings.id || localSchoolSettings.id)
        .select()
        .single();
      if (!error && data) return data as SchoolSettings;
    }
    localSchoolSettings = { ...localSchoolSettings, ...settings };
    return localSchoolSettings;
  },

  // ----------------------------------------------------
  // ACADEMIC YEARS
  // ----------------------------------------------------
  async getAcademicYears(): Promise<AcademicYear[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('academic_years').select('*').order('start_date', { ascending: false });
      if (!error && data) return data as AcademicYear[];
    }
    return localAcademicYears;
  },

  async createAcademicYear(year: Omit<AcademicYear, 'id'>): Promise<AcademicYear> {
    const newYear: AcademicYear = { ...year, id: `ay-${Date.now()}` };
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('academic_years').insert(newYear).select().single();
      if (!error && data) return data as AcademicYear;
    }
    localAcademicYears.unshift(newYear);
    return newYear;
  },

  // ----------------------------------------------------
  // CLASSES
  // ----------------------------------------------------
  async getClasses(): Promise<ClassRoom[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('classes').select('*').order('grade_level', { ascending: true });
      if (!error && data) return data as ClassRoom[];
    }
    return localClasses.map(cls => ({
      ...cls,
      total_students: localStudents.filter(s => s.class_id === cls.id && s.status === 'aktif').length
    }));
  },

  async createClass(classroom: Omit<ClassRoom, 'id'>): Promise<ClassRoom> {
    const newClass: ClassRoom = { ...classroom, id: `cls-${Date.now()}` };
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('classes').insert(newClass).select().single();
      if (!error && data) return data as ClassRoom;
    }
    localClasses.push(newClass);
    return newClass;
  },

  async updateClass(id: string, updates: Partial<ClassRoom>): Promise<ClassRoom> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('classes').update(updates).eq('id', id).select().single();
      if (!error && data) return data as ClassRoom;
    }
    localClasses = localClasses.map(c => c.id === id ? { ...c, ...updates } : c);
    return localClasses.find(c => c.id === id)!;
  },

  async deleteClass(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('classes').delete().eq('id', id);
      if (!error) return true;
    }
    localClasses = localClasses.filter(c => c.id !== id);
    return true;
  },

  // ----------------------------------------------------
  // STUDENTS
  // ----------------------------------------------------
  async getStudents(classIdFilter?: string, statusFilter?: string): Promise<Student[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('students').select('*, classes(class_name)');
      if (classIdFilter) query = query.eq('class_id', classIdFilter);
      if (statusFilter) query = query.eq('status', statusFilter);
      const { data, error } = await query;
      if (!error && data) {
        return data.map((item: any) => ({
          ...item,
          class_name: item.classes?.class_name || 'Tanpa Kelas'
        }));
      }
    }
    let list = localStudents.map(s => {
      const cls = localClasses.find(c => c.id === s.class_id);
      return { ...s, class_name: cls ? cls.class_name : 'Tanpa Kelas' };
    });
    if (classIdFilter) list = list.filter(s => s.class_id === classIdFilter);
    if (statusFilter) list = list.filter(s => s.status === statusFilter);
    return list;
  },

  async getStudentByNis(nis: string): Promise<Student | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('students').select('*, classes(class_name)').eq('nis', nis).single();
      if (!error && data) return data as Student;
    }
    const student = localStudents.find(s => s.nis === nis || s.nisn === nis);
    if (!student) return null;
    const cls = localClasses.find(c => c.id === student.class_id);
    return { ...student, class_name: cls?.class_name || '-' };
  },

  async createStudent(student: Omit<Student, 'id' | 'created_at'>): Promise<Student> {
    const newStudent: Student = {
      ...student,
      id: `std-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('students').insert(newStudent).select().single();
      if (!error && data) return data as Student;
    }
    const cls = localClasses.find(c => c.id === newStudent.class_id);
    newStudent.class_name = cls?.class_name || '-';
    localStudents.unshift(newStudent);
    return newStudent;
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('students').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Student;
    }
    localStudents = localStudents.map(s => s.id === id ? { ...s, ...updates } : s);
    const updated = localStudents.find(s => s.id === id)!;
    const cls = localClasses.find(c => c.id === updated.class_id);
    updated.class_name = cls?.class_name || '-';
    return updated;
  },

  async deleteStudent(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (!error) return true;
    }
    localStudents = localStudents.filter(s => s.id !== id);
    return true;
  },

  // ----------------------------------------------------
  // PAYMENT TYPES
  // ----------------------------------------------------
  async getPaymentTypes(): Promise<PaymentType[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('payment_types').select('*');
      if (!error && data) return data as PaymentType[];
    }
    return localPaymentTypes;
  },

  async createPaymentType(paymentType: Omit<PaymentType, 'id' | 'created_at'>): Promise<PaymentType> {
    const newPt: PaymentType = {
      ...paymentType,
      id: `pt-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('payment_types').insert(newPt).select().single();
      if (!error && data) return data as PaymentType;
    }
    localPaymentTypes.unshift(newPt);
    return newPt;
  },

  async updatePaymentType(id: string, updates: Partial<PaymentType>): Promise<PaymentType> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('payment_types').update(updates).eq('id', id).select().single();
      if (!error && data) return data as PaymentType;
    }
    localPaymentTypes = localPaymentTypes.map(p => p.id === id ? { ...p, ...updates } : p);
    return localPaymentTypes.find(p => p.id === id)!;
  },

  async deletePaymentType(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('payment_types').delete().eq('id', id);
      if (!error) return true;
    }
    localPaymentTypes = localPaymentTypes.filter(p => p.id !== id);
    return true;
  },

  // ----------------------------------------------------
  // PAYMENTS & TRANSACTIONS
  // ----------------------------------------------------
  async getPayments(filters?: {
    studentId?: string;
    classId?: string;
    paymentTypeId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<Payment[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('payments').select('*, students(full_name, nis, classes(class_name)), payment_types(name)').order('created_at', { ascending: false });
      if (filters?.studentId) query = query.eq('student_id', filters.studentId);
      if (filters?.paymentTypeId) query = query.eq('payment_type_id', filters.paymentTypeId);
      if (filters?.status) query = query.eq('payment_status', filters.status);
      const { data, error } = await query;
      if (!error && data) return data as Payment[];
    }

    let list = [...localPayments];
    if (filters?.studentId) list = list.filter(p => p.student_id === filters.studentId);
    if (filters?.paymentTypeId) list = list.filter(p => p.payment_type_id === filters.paymentTypeId);
    if (filters?.status) list = list.filter(p => p.payment_status === filters.status);
    if (filters?.classId) {
      const studentIdsInClass = localStudents.filter(s => s.class_id === filters.classId).map(s => s.id);
      list = list.filter(p => studentIdsInClass.includes(p.student_id));
    }
    if (filters?.startDate) {
      list = list.filter(p => p.payment_date >= filters.startDate!);
    }
    if (filters?.endDate) {
      list = list.filter(p => p.payment_date <= filters.endDate!);
    }
    return list.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
  },

  async createPayment(paymentData: Omit<Payment, 'id' | 'receipt_number' | 'created_at'>): Promise<Payment> {
    const student = localStudents.find(s => s.id === paymentData.student_id);
    const cls = localClasses.find(c => c.id === student?.class_id);
    const pt = localPaymentTypes.find(p => p.id === paymentData.payment_type_id);
    const ay = localAcademicYears.find(a => a.id === paymentData.academic_year_id);

    const receiptNumber = generateReceiptNumber();
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receipt_number: receiptNumber,
      student_name: student?.full_name || paymentData.student_name || 'Siswa',
      nis: student?.nis || paymentData.nis || '-',
      class_name: cls?.class_name || paymentData.class_name || '-',
      payment_type_name: pt?.name || paymentData.payment_type_name || 'Pembayaran',
      academic_year_name: ay?.year_name || '2025/2026',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('payments').insert(newPayment).select().single();
      if (!error && data) return data as Payment;
    }

    localPayments.unshift(newPayment);

    // Audit log entry
    localHistory.unshift({
      id: `hist-${Date.now()}`,
      payment_id: newPayment.id,
      receipt_number: newPayment.receipt_number,
      action_type: 'create',
      old_amount: 0,
      new_amount: newPayment.amount_paid,
      changed_by_user_id: newPayment.receiver_user_id,
      changed_by_name: newPayment.receiver_name || 'Bendahara',
      change_reason: 'Penerimaan pembayaran baru',
      created_at: new Date().toISOString()
    });

    return newPayment;
  },

  async updatePaymentStatus(id: string, amountPaid: number, status: 'lunas' | 'partial', reason: string): Promise<Payment> {
    const existing = localPayments.find(p => p.id === id);
    if (!existing) throw new Error('Payment record not found');

    const oldAmount = existing.amount_paid;
    const updatedFields = {
      amount_paid: amountPaid,
      payment_status: status,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('payments').update(updatedFields).eq('id', id).select().single();
      if (!error && data) return data as Payment;
    }

    localPayments = localPayments.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    const updated = localPayments.find(p => p.id === id)!;

    localHistory.unshift({
      id: `hist-${Date.now()}`,
      payment_id: updated.id,
      receipt_number: updated.receipt_number,
      action_type: 'update',
      old_amount: oldAmount,
      new_amount: amountPaid,
      changed_by_user_id: 'usr-1',
      changed_by_name: 'Siti Rahmah, S.Pd.',
      change_reason: reason || 'Update nominal bayar',
      created_at: new Date().toISOString()
    });

    return updated;
  },

  async getPaymentHistory(): Promise<PaymentHistory[]> {
    return localHistory;
  },

  // ----------------------------------------------------
  // USERS & ROLES
  // ----------------------------------------------------
  async getUsers(): Promise<User[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('users').select('*');
      if (!error && data) return data as User[];
    }
    return localUsers;
  },

  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('users').insert(newUser).select().single();
      if (!error && data) return data as User;
    }
    localUsers.push(newUser);
    return newUser;
  },

  // ----------------------------------------------------
  // EXECUTIVE SUMMARY & METRICS
  // ----------------------------------------------------
  async getPaymentSummary(): Promise<PaymentSummary> {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayPayments = localPayments.filter(p => p.payment_date.startsWith(todayStr));
    const todayRevenue = todayPayments.reduce((acc, p) => acc + p.amount_paid, 0);

    const totalRevenueThisYear = localPayments.reduce((acc, p) => acc + p.amount_paid, 0);

    // Calculate total SPP paid vs pending
    const totalActiveStudents = localStudents.filter(s => s.status === 'aktif').length;
    const sppPaidCountThisMonth = localPayments.filter(p => p.payment_type_id === 'pt-spp' && p.payment_status === 'lunas').length;
    const sppPendingCountThisMonth = Math.max(0, totalActiveStudents - sppPaidCountThisMonth);

    const totalPendingAmount = localPayments
      .filter(p => p.payment_status === 'partial')
      .reduce((acc, p) => acc + (p.amount_due - p.amount_paid), 0) + (sppPendingCountThisMonth * 150000);

    return {
      totalRevenueThisMonth: totalRevenueThisYear,
      totalRevenueThisYear,
      totalPendingAmount,
      sppPaidCountThisMonth,
      sppPendingCountThisMonth,
      totalActiveStudents,
      totalClasses: localClasses.length,
      todayTransactionsCount: todayPayments.length,
      todayRevenue
    };
  },

  async getClassPaymentOverviews(): Promise<ClassPaymentOverview[]> {
    return localClasses.map(cls => {
      const studentsInClass = localStudents.filter(s => s.class_id === cls.id && s.status === 'aktif');
      const studentIds = studentsInClass.map(s => s.id);

      const classPayments = localPayments.filter(p => studentIds.includes(p.student_id));
      const paidStudentsCount = new Set(classPayments.filter(p => p.payment_type_id === 'pt-spp' && p.payment_status === 'lunas').map(p => p.student_id)).size;
      const pendingStudentsCount = Math.max(0, studentsInClass.length - paidStudentsCount);

      const paidAmount = classPayments.reduce((acc, p) => acc + p.amount_paid, 0);
      const pendingAmount = pendingStudentsCount * 150000;

      return {
        class_id: cls.id,
        class_name: cls.class_name,
        grade_level: cls.grade_level,
        total_students: studentsInClass.length,
        paid_students_count: paidStudentsCount,
        pending_students_count: pendingStudentsCount,
        paid_amount: paidAmount,
        pending_amount: pendingAmount
      };
    });
  }
};
