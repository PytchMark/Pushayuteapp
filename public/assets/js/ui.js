/**
 * InfluencerHub - UI Utilities
 */

window.IHUi = {
  /**
   * Bind tab navigation
   */
  bindTabs(rootSelector) {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    
    const buttons = [...root.querySelectorAll('[data-tab-target]')];
    const panes = [...document.querySelectorAll('[data-tab-pane]')];
    
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active button
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show/hide panes
        const target = btn.dataset.tabTarget;
        panes.forEach((pane) => {
          pane.hidden = pane.dataset.tabPane !== target;
        });
      });
    });
  },

  /**
   * Show toast notification
   */
  toast(message, type = 'info') {
    // Check if toast container exists
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = 'position:fixed;bottom:2rem;right:2rem;z-index:1000;display:flex;flex-direction:column;gap:0.5rem;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Style based on type
    const colors = {
      success: 'var(--success, #10B981)',
      error: 'var(--error, #EF4444)',
      warning: 'var(--warning, #F59E0B)',
      info: 'var(--text, #0F172A)'
    };
    toast.style.background = colors[type] || colors.info;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  /**
   * Create skeleton loader
   */
  skeleton(height = 100) {
    const div = document.createElement('div');
    div.className = 'skeleton';
    div.style.height = `${height}px`;
    return div;
  },

  /**
   * Debounce function
   */
  debounce(fn, delay = 300) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  },

  /**
   * Format file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};
