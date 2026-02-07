/**
 * InfluencerHub - Brand Portal
 */

(function() {
  'use strict';

  // Initialize tabs
  IHUi.bindTabs('#brandSidebar');

  // Campaign tray storage
  const tray = new Map();

  // DOM Elements
  const discoverQuery = document.getElementById('discoverQuery');
  const discoverNiche = document.getElementById('discoverNiche');
  const discoverBtn = document.getElementById('discoverBtn');
  const discoverGrid = document.getElementById('discoverGrid');
  const trayItems = document.getElementById('trayItems');
  const trayCount = document.getElementById('trayCount');
  const clearTray = document.getElementById('clearTray');
  const submitCampaign = document.getElementById('submitCampaign');
  const requestsGrid = document.getElementById('requestsGrid');
  const refreshRequests = document.getElementById('refreshRequests');

  // Form fields
  const campaignName = document.getElementById('campaign_name');
  const message = document.getElementById('message');
  const budget = document.getElementById('budget');
  const deadline = document.getElementById('deadline');
  const deliverables = document.getElementById('deliverables');
  const channel = document.getElementById('channel');

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
   * Render skeleton loaders
   */
  function renderSkeletons(container, count = 6) {
    container.innerHTML = Array(count).fill(0).map(() => `
      <div class="skeleton skeleton-discover"></div>
    `).join('');
  }

  /**
   * Update tray count badge
   */
  function updateTrayCount() {
    trayCount.textContent = tray.size;
    trayCount.dataset.count = tray.size;
  }

  /**
   * Render tray items
   */
  function renderTray() {
    updateTrayCount();

    if (tray.size === 0) {
      trayItems.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="ph ph-users-three"></i></div>
          <h4>No influencers selected</h4>
          <p>Add influencers from the Discover tab to start your campaign.</p>
        </div>
      `;
      return;
    }

    trayItems.innerHTML = [...tray.values()].map((item) => `
      <div class="tray-item" data-id="${item.id || item.handle}">
        <img 
          class="tray-item-image" 
          src="${item.profile_image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'}" 
          alt="${item.display_name}"
        />
        <div class="tray-item-info">
          <div class="tray-item-name">${item.display_name || 'Unnamed'}</div>
          <div class="tray-item-meta">${item.niche || 'General'} · ${IHFormatters.money(item.rate_min)}-${IHFormatters.money(item.rate_max)}</div>
        </div>
        <button class="tray-item-remove" data-remove="${item.id || item.handle}" title="Remove">
          <i class="ph ph-x"></i>
        </button>
      </div>
    `).join('');

    // Bind remove buttons
    document.querySelectorAll('.tray-item-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.remove;
        tray.delete(key);
        renderTray();
        showToast('Removed from tray');
      });
    });
  }

  /**
   * Render discover card
   */
  function renderDiscoverCard(item) {
    const inTray = tray.has(item.id || item.handle);
    const profileImage = item.profile_image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80';
    const verified = item.verified ? '<span class="verified-badge" title="Verified"><i class="ph-fill ph-check"></i></span>' : '';

    return `
      <article class="discover-card" data-testid="discover-card-${item.handle || item.id}">
        <div class="discover-card-image">
          <img src="${profileImage}" alt="${item.display_name}" loading="lazy" />
        </div>
        <div class="discover-card-content">
          <div class="discover-card-header">
            <span class="discover-card-name">${item.display_name || 'Unnamed'} ${verified}</span>
          </div>
          <div class="discover-card-niche">
            <i class="ph ph-map-pin"></i> ${item.niche || 'General'} · ${item.location || 'Global'}
          </div>
          <div class="discover-card-stats">
            <div class="discover-card-stat">
              <strong>${IHFormatters.num(item.followers_count)}</strong>
              followers
            </div>
            <div class="discover-card-stat">
              <strong>${item.engagement_rate || 0}%</strong>
              engagement
            </div>
          </div>
          <div class="discover-card-actions">
            <button 
              class="btn ${inTray ? 'btn-secondary' : 'btn-primary'}" 
              data-add="${encodeURIComponent(JSON.stringify(item))}"
              data-testid="add-to-tray-${item.handle || item.id}"
            >
              <i class="ph ph-${inTray ? 'check' : 'plus'}"></i>
              ${inTray ? 'In Tray' : 'Add to Tray'}
            </button>
            <button 
              class="btn btn-ghost" 
              data-wa="${item.display_name || 'creator'}"
              title="WhatsApp"
            >
              <i class="ph ph-whatsapp-logo"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Load discover influencers
   */
  async function loadDiscover() {
    renderSkeletons(discoverGrid);

    try {
      const params = {
        query: discoverQuery.value || '',
        niche: discoverNiche.value || ''
      };

      const data = await IHApi.publicInfluencers(params);
      const list = data.influencers || [];

      if (!list.length) {
        discoverGrid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon"><i class="ph ph-users-three"></i></div>
            <h4>No influencers found</h4>
            <p>Try adjusting your search filters.</p>
          </div>
        `;
        return;
      }

      discoverGrid.innerHTML = list.map(renderDiscoverCard).join('');

      // Bind add to tray buttons
      document.querySelectorAll('[data-add]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const item = JSON.parse(decodeURIComponent(btn.dataset.add));
          const key = item.id || item.handle;
          
          if (tray.has(key)) {
            tray.delete(key);
            btn.innerHTML = '<i class="ph ph-plus"></i> Add to Tray';
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
            showToast('Removed from tray');
          } else {
            tray.set(key, item);
            btn.innerHTML = '<i class="ph ph-check"></i> In Tray';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
            showToast('Added to tray', 'success');
          }
          
          updateTrayCount();
          renderTray();
        });
      });

      // Bind WhatsApp buttons
      document.querySelectorAll('[data-wa]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const name = btn.dataset.wa;
          const text = `Hi ${name}, we found your InfluencerHub profile and want to discuss a collaboration opportunity.`;
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        });
      });

    } catch (error) {
      discoverGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon"><i class="ph ph-warning-circle"></i></div>
          <h4>Unable to load influencers</h4>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  /**
   * Load my requests
   */
  async function loadRequests() {
    renderSkeletons(requestsGrid);

    try {
      const data = await IHApi.brandRequests();
      const list = data.requests || [];

      if (!list.length) {
        requestsGrid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon"><i class="ph ph-paper-plane-tilt"></i></div>
            <h4>No requests yet</h4>
            <p>Submit your first campaign request to see it here.</p>
          </div>
        `;
        return;
      }

      requestsGrid.innerHTML = list.map((req) => `
        <article class="request-card" data-testid="request-card-${req.request_id}">
          <div class="request-card-header">
            <div>
              <div class="request-card-title">${req.campaign_name || 'Untitled Campaign'}</div>
              <div class="request-card-id">${req.request_id || ''}</div>
            </div>
            <span class="status-pill ${IHFormatters.statusClass(req.status)}">
              ${IHFormatters.status(req.status)}
            </span>
          </div>
          <div class="request-card-body">
            ${IHFormatters.truncate(req.message || 'No message', 120)}
          </div>
          <div class="request-card-meta">
            <span><i class="ph ph-calendar"></i> ${IHFormatters.date(req.created_at)}</span>
            ${req.budget ? `<span><i class="ph ph-currency-dollar"></i> ${IHFormatters.money(req.budget)}</span>` : ''}
            ${req.channel ? `<span><i class="ph ph-hash"></i> ${req.channel}</span>` : ''}
          </div>
        </article>
      `).join('');

    } catch (error) {
      requestsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon"><i class="ph ph-warning-circle"></i></div>
          <h4>Unable to load requests</h4>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  /**
   * Submit campaign
   */
  async function handleSubmitCampaign() {
    const influencerUserIds = [...tray.values()]
      .map((x) => x.user_id)
      .filter(Boolean);

    if (!campaignName.value.trim()) {
      showToast('Please enter a campaign name', 'error');
      return;
    }

    if (tray.size === 0) {
      showToast('Add at least one influencer to your tray', 'error');
      return;
    }

    // Note: Demo influencers don't have user_id, so we show a message
    if (influencerUserIds.length === 0) {
      showToast('Demo influencers cannot receive requests. Please use real influencer accounts.', 'error');
      return;
    }

    try {
      submitCampaign.disabled = true;
      submitCampaign.innerHTML = '<i class="ph ph-spinner"></i> Sending...';

      await IHApi.createBrandRequests({
        influencerUserIds,
        campaignName: campaignName.value,
        message: message.value,
        budget: Number(budget.value) || null,
        deliverables: deliverables.value,
        deadline: deadline.value,
        channel: channel.value
      });

      showToast('Campaign requests sent successfully!', 'success');
      
      // Clear form and tray
      tray.clear();
      renderTray();
      campaignName.value = '';
      message.value = '';
      budget.value = '';
      deliverables.value = '';
      deadline.value = '';

      loadRequests();

    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      submitCampaign.disabled = false;
      submitCampaign.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send Campaign Requests';
    }
  }

  // Event Listeners
  discoverBtn.addEventListener('click', loadDiscover);
  discoverQuery.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loadDiscover();
  });
  discoverNiche.addEventListener('change', loadDiscover);

  clearTray.addEventListener('click', () => {
    tray.clear();
    renderTray();
    loadDiscover(); // Refresh to update button states
    showToast('Campaign tray cleared');
  });

  submitCampaign.addEventListener('click', handleSubmitCampaign);
  refreshRequests.addEventListener('click', loadRequests);

  // Initial load
  loadDiscover();
  loadRequests();
  renderTray();

})();
