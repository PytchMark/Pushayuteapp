/**
 * InfluencerHub - Admin Portal
 */

(function() {
  'use strict';

  // Initialize tabs
  IHUi.bindTabs('#adminSidebar');

  // DOM Elements
  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const adminBadge = document.getElementById('adminBadge');
  const refreshDashboard = document.getElementById('refreshDashboard');

  // Stats elements
  const statInfluencers = document.getElementById('statInfluencers');
  const statBrands = document.getElementById('statBrands');
  const statRequests = document.getElementById('statRequests');
  const statToday = document.getElementById('statToday');
  const topNiches = document.getElementById('topNiches');

  // Table elements
  const influencersBody = document.getElementById('influencersBody');
  const brandsBody = document.getElementById('brandsBody');
  const requestsBody = document.getElementById('requestsBody');
  const influencerCount = document.getElementById('influencerCount');
  const brandCount = document.getElementById('brandCount');
  const requestCount = document.getElementById('requestCount');

  /**
   * Show toast notification
   */
  function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.background = type === 'error' ? 'var(--error)' : type === 'success' ? 'var(--success)' : 'var(--text)';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  /**
   * Check if admin is authenticated
   */
  function isAuthenticated() {
    return !!localStorage.getItem('ih_admin_token');
  }

  /**
   * Update UI based on auth state
   */
  function updateAuthUI() {
    if (isAuthenticated()) {
      adminBadge.style.display = 'flex';
      // Auto-switch to dashboard tab
      const dashboardBtn = document.querySelector('[data-tab-target="dashboard"]');
      if (dashboardBtn) dashboardBtn.click();
    } else {
      adminBadge.style.display = 'none';
    }
  }

  /**
   * Handle login
   */
  async function handleLogin(e) {
    e.preventDefault();

    if (!username.value || !password.value) {
      showToast('Please enter username and password', 'error');
      return;
    }

    try {
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<i class="ph ph-spinner"></i> Signing in...';

      const result = await IHApi.adminLogin({
        username: username.value,
        password: password.value
      });

      IHApi.setAdminToken(result.token);
      showToast('Login successful!', 'success');
      updateAuthUI();
      loadAllData();

    } catch (error) {
      showToast(error.message || 'Invalid credentials', 'error');
    } finally {
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="ph ph-sign-in"></i> Sign In';
    }
  }

  /**
   * Load dashboard summary
   */
  async function loadDashboard() {
    try {
      const summary = await IHApi.adminSummary();

      statInfluencers.textContent = summary.totals?.influencers || 0;
      statBrands.textContent = summary.totals?.brands || 0;
      statRequests.textContent = summary.totals?.requests || 0;
      statToday.textContent = summary.totals?.requestsToday || 0;

      // Top niches
      const niches = summary.topNiches || [];
      if (niches.length) {
        const maxCount = niches[0][1] || 1;
        topNiches.innerHTML = niches.map(([name, count]) => `
          <div class="niche-item">
            <span class="niche-name">${name}</span>
            <div class="niche-bar">
              <div class="niche-bar-fill" style="width: ${(count / maxCount) * 100}%"></div>
            </div>
            <span class="niche-count">${count}</span>
          </div>
        `).join('');
      } else {
        topNiches.innerHTML = '<p class="cell-muted">No data available</p>';
      }

    } catch (error) {
      showToast('Failed to load dashboard: ' + error.message, 'error');
    }
  }

  /**
   * Load influencers table
   */
  async function loadInfluencers() {
    influencersBody.innerHTML = `
      <tr><td colspan="7" class="table-empty">
        <i class="ph ph-spinner"></i>
        <p>Loading...</p>
      </td></tr>
    `;

    try {
      const data = await IHApi.adminInfluencers();
      const list = data.influencers || [];
      influencerCount.textContent = `${list.length} records`;

      if (!list.length) {
        influencersBody.innerHTML = `
          <tr><td colspan="7" class="table-empty">
            <i class="ph ph-user-circle"></i>
            <p>No influencers found</p>
          </td></tr>
        `;
        return;
      }

      influencersBody.innerHTML = list.map((item) => `
        <tr data-testid="influencer-row-${item.id}">
          <td class="cell-name">${item.display_name || 'Unnamed'}</td>
          <td class="cell-muted">@${item.handle || '-'}</td>
          <td>${item.niche || '-'}</td>
          <td>${IHFormatters.num(item.followers_count)}</td>
          <td>${IHFormatters.money(item.rate_min)} - ${IHFormatters.money(item.rate_max)}</td>
          <td class="cell-badge">
            <span class="chip ${item.status === 'active' ? 'chip-success' : ''}">
              ${item.status || 'active'}
            </span>
          </td>
          <td>
            <button class="action-btn" title="View">
              <i class="ph ph-eye"></i>
            </button>
          </td>
        </tr>
      `).join('');

    } catch (error) {
      influencersBody.innerHTML = `
        <tr><td colspan="7" class="table-empty">
          <i class="ph ph-warning-circle"></i>
          <p>${error.message}</p>
        </td></tr>
      `;
    }
  }

  /**
   * Load brands table
   */
  async function loadBrands() {
    brandsBody.innerHTML = `
      <tr><td colspan="5" class="table-empty">
        <i class="ph ph-spinner"></i>
        <p>Loading...</p>
      </td></tr>
    `;

    try {
      const data = await IHApi.adminBrands();
      const list = data.brands || [];
      brandCount.textContent = `${list.length} records`;

      if (!list.length) {
        brandsBody.innerHTML = `
          <tr><td colspan="5" class="table-empty">
            <i class="ph ph-buildings"></i>
            <p>No brands found</p>
          </td></tr>
        `;
        return;
      }

      brandsBody.innerHTML = list.map((item) => `
        <tr data-testid="brand-row-${item.id}">
          <td class="cell-name">${item.company_name || 'Unnamed'}</td>
          <td>${item.contact_name || '-'}</td>
          <td class="cell-muted">${item.email || '-'}</td>
          <td>${item.industry || '-'}</td>
          <td class="cell-muted">${IHFormatters.date(item.created_at)}</td>
        </tr>
      `).join('');

    } catch (error) {
      brandsBody.innerHTML = `
        <tr><td colspan="5" class="table-empty">
          <i class="ph ph-warning-circle"></i>
          <p>${error.message}</p>
        </td></tr>
      `;
    }
  }

  /**
   * Load requests table
   */
  async function loadRequests() {
    requestsBody.innerHTML = `
      <tr><td colspan="6" class="table-empty">
        <i class="ph ph-spinner"></i>
        <p>Loading...</p>
      </td></tr>
    `;

    try {
      const data = await IHApi.adminRequests();
      const list = data.requests || [];
      requestCount.textContent = `${list.length} records`;

      if (!list.length) {
        requestsBody.innerHTML = `
          <tr><td colspan="6" class="table-empty">
            <i class="ph ph-paper-plane-tilt"></i>
            <p>No requests found</p>
          </td></tr>
        `;
        return;
      }

      requestsBody.innerHTML = list.map((item) => `
        <tr data-testid="request-row-${item.id}">
          <td class="cell-muted">${item.request_id || '-'}</td>
          <td class="cell-name">${item.campaign_name || 'Untitled'}</td>
          <td class="cell-badge">
            <span class="status-pill ${IHFormatters.statusClass(item.status)}">
              ${IHFormatters.status(item.status)}
            </span>
          </td>
          <td>${item.budget ? IHFormatters.money(item.budget) : '-'}</td>
          <td>${item.channel || '-'}</td>
          <td class="cell-muted">${IHFormatters.date(item.created_at)}</td>
        </tr>
      `).join('');

    } catch (error) {
      requestsBody.innerHTML = `
        <tr><td colspan="6" class="table-empty">
          <i class="ph ph-warning-circle"></i>
          <p>${error.message}</p>
        </td></tr>
      `;
    }
  }

  /**
   * Load all data
   */
  function loadAllData() {
    if (!isAuthenticated()) return;
    
    loadDashboard();
    loadInfluencers();
    loadBrands();
    loadRequests();
  }

  // Event Listeners
  loginForm.addEventListener('submit', handleLogin);
  refreshDashboard.addEventListener('click', loadDashboard);

  // Tab change listeners to load data
  document.querySelectorAll('[data-tab-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tabTarget;
      if (!isAuthenticated() && target !== 'login') {
        showToast('Please login first', 'error');
        return;
      }
    });
  });

  // Initial state
  updateAuthUI();
  if (isAuthenticated()) {
    loadAllData();
  }

})();
