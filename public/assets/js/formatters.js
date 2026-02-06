window.IHFormatters = {
  money: (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0),
  num: (v) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(v || 0),
  date: (v) => new Date(v).toLocaleDateString()
};
