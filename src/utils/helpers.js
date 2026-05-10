// Format number to Egyptian Pounds
export const formatEGP = (amount) => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date to dd/mm/yyyy
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB'); // dd/mm/yyyy format
};

// Format date with time
export const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get relative time (e.g., "منذ ساعتين")
export const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  return formatDate(dateStr);
};

// Get severity color for audit logs
export const getSeverityBadge = (severity) => {
  const map = {
    info: 'badge-info',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
  };
  return map[severity] || 'badge-neutral';
};

// Get logistics status color
export const getStatusBadge = (status) => {
  const map = {
    'تم التوصيل': 'badge-success',
    'قيد التوصيل': 'badge-info',
    'قيد الانتظار': 'badge-warning',
    'مرتجع': 'badge-danger',
  };
  return map[status] || 'badge-neutral';
};

// Generate invoice number
let invoiceCounter = 36;
export const generateInvoice = () => {
  invoiceCounter++;
  const year = new Date().getFullYear();
  return `INV-${year}-${String(invoiceCounter).padStart(3, '0')}`;
};

// Get unique brands from products
export const getBrands = (products) => {
  return [...new Set(products.map((p) => p.brand))];
};

// Get unique sizes from products
export const getSizes = (products) => {
  return [...new Set(products.map((p) => p.dimensions))];
};

// Get unique heights from products
export const getHeights = (products) => {
  return [...new Set(products.map((p) => p.height))];
};
