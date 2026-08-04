export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDateID = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const formatDateTimeID = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const MONTH_NAMES_ID = [
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'
];

export const getMonthName = (monthNumber?: number | null): string => {
  if (!monthNumber) return '-';
  // Standard Academic Calendar in Indonesia starts in July (7)
  const monthMap: Record<number, string> = {
    7: 'Juli',
    8: 'Agustus',
    9: 'September',
    10: 'Oktober',
    11: 'November',
    12: 'Desember',
    1: 'Januari',
    2: 'Februari',
    3: 'Maret',
    4: 'April',
    5: 'Mei',
    6: 'Juni'
  };
  return monthMap[monthNumber] || `Bulan ${monthNumber}`;
};

export const generateReceiptNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `KWT/${year}/${month}/${randomDigits}`;
};

export const getPaymentStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'lunas':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'partial':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    case 'belum_bayar':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
  }
};

export const getPaymentStatusLabel = (status: string): string => {
  switch (status) {
    case 'lunas':
      return 'Lunas';
    case 'partial':
      return 'Diangsur (Sebagian)';
    case 'belum_bayar':
      return 'Belum Bayar';
    default:
      return status;
  }
};

export const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case 'cash':
      return 'Tunai (Kasir)';
    case 'bank_transfer':
      return 'Transfer Bank';
    case 'qris':
      return 'QRIS Jatim / GoPay / OVO';
    default:
      return method;
  }
};
