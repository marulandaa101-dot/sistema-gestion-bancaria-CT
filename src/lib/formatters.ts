export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '$ 0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(rate: number): string {
  if (isNaN(rate) || rate === null || rate === undefined) return '0.00%';
  return `${rate.toFixed(2)}%`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}
