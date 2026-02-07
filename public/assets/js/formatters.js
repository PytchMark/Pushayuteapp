/**
 * InfluencerHub - Formatters Utility
 */

window.IHFormatters = {
  /**
   * Format number with K/M suffix
   */
  num(value) {
    if (!value && value !== 0) return '0';
    const num = Number(value);
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toLocaleString();
  },

  /**
   * Format currency
   */
  money(value, currency = 'USD') {
    if (!value && value !== 0) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  },

  /**
   * Format date
   */
  date(value) {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  },

  /**
   * Format relative time
   */
  relativeTime(value) {
    if (!value) return '';
    const date = new Date(value);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 30) return this.date(value);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  },

  /**
   * Format percentage
   */
  percent(value, decimals = 1) {
    if (!value && value !== 0) return '0%';
    return `${Number(value).toFixed(decimals)}%`;
  },

  /**
   * Truncate text
   */
  truncate(text, length = 100) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
  },

  /**
   * Capitalize first letter
   */
  capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  /**
   * Format status to display label
   */
  status(value) {
    const statusMap = {
      new: 'New',
      contacted: 'Contacted',
      negotiating: 'Negotiating',
      booked: 'Booked',
      closed: 'Closed'
    };
    return statusMap[value] || value;
  },

  /**
   * Get status CSS class
   */
  statusClass(value) {
    return `status-${value || 'new'}`;
  }
};
