/**
 * InfluencerHub - Influencer Portal
 */

(function() {
  'use strict';

  // Initialize tabs
  IHUi.bindTabs('#influencerSidebar');

  // DOM Elements - Profile
  const profileForm = document.getElementById('profileForm');
  const saveProfile = document.getElementById('saveProfile');

  // DOM Elements - Media
  const uploadZone = document.getElementById('uploadZone');
  const mediaUpload = document.getElementById('mediaUpload');
  const uploadBtn = document.getElementById('uploadBtn');
  const uploadProgress = document.getElementById('uploadProgress');
  const uploadResult = document.getElementById('uploadResult');
  const mediaGallery = document.getElementById('mediaGallery');

  // DOM Elements - Requests
  const requestList = document.getElementById('requestList');
  const refreshInbound = document.getElementById('refreshInbound');
  const requestBadge = document.getElementById('requestBadge');

  // Uploaded media storage
  const uploadedMedia = [];

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
   * Handle profile save
   */
  async function handleSaveProfile() {
    const formData = new FormData(profileForm);
    
    const payload = {
      handle: formData.get('handle'),
      display_name: formData.get('display_name'),
      bio: formData.get('bio'),
      niche: formData.get('niche'),
      location: formData.get('location'),
      followers_count: Number(formData.get('followers_count')) || null,
      engagement_rate: Number(formData.get('engagement_rate')) || null,
      avg_views: Number(formData.get('avg_views')) || null,
      rate_min: Number(formData.get('rate_min')) || null,
      rate_max: Number(formData.get('rate_max')) || null,
      pricing_notes: formData.get('pricing_notes'),
      platforms: {
        instagram: formData.get('instagram'),
        tiktok: formData.get('tiktok'),
        youtube: formData.get('youtube')
      }
    };

    if (!payload.handle || !payload.display_name) {
      showToast('Please fill in handle and display name', 'error');
      return;
    }

    try {
      saveProfile.disabled = true;
      saveProfile.innerHTML = '<i class="ph ph-spinner"></i> Saving...';

      await IHApi.upsertInfluencerProfile(payload);
      showToast('Profile saved successfully!', 'success');

    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      saveProfile.disabled = false;
      saveProfile.innerHTML = '<i class="ph ph-floppy-disk"></i> Save Profile';
    }
  }

  /**
   * Load profile data
   */
  async function loadProfile() {
    try {
      const data = await IHApi.influencerMe();
      const profile = data.profile;

      if (profile) {
        // Populate form
        profileForm.handle.value = profile.handle || '';
        profileForm.display_name.value = profile.display_name || '';
        profileForm.bio.value = profile.bio || '';
        profileForm.niche.value = profile.niche || '';
        profileForm.location.value = profile.location || '';
        profileForm.followers_count.value = profile.followers_count || '';
        profileForm.engagement_rate.value = profile.engagement_rate || '';
        profileForm.avg_views.value = profile.avg_views || '';
        profileForm.rate_min.value = profile.rate_min || '';
        profileForm.rate_max.value = profile.rate_max || '';
        profileForm.pricing_notes.value = profile.pricing_notes || '';
        
        if (profile.platforms) {
          profileForm.instagram.value = profile.platforms.instagram || '';
          profileForm.tiktok.value = profile.platforms.tiktok || '';
          profileForm.youtube.value = profile.platforms.youtube || '';
        }

        // Load portfolio media
        if (profile.portfolio_media && profile.portfolio_media.length) {
          renderMediaGallery(profile.portfolio_media);
        }
      }
    } catch (error) {
      // User likely not logged in, which is expected
      console.log('Profile not loaded:', error.message);
    }
  }

  /**
   * Handle file upload
   */
  async function handleFileUpload(file) {
    if (!file) return;

    // Validate file size (40MB max)
    if (file.size > 40 * 1024 * 1024) {
      showToast('File too large. Maximum size is 40MB.', 'error');
      return;
    }

    uploadProgress.classList.remove('hidden');
    uploadResult.innerHTML = '';
    uploadResult.className = 'upload-result';

    try {
      const result = await IHApi.uploadMedia(file);
      
      uploadProgress.classList.add('hidden');
      uploadResult.classList.add('success');
      uploadResult.innerHTML = `
        <i class="ph ph-check-circle"></i>
        Upload successful! URL: <code>${result.secure_url}</code>
      `;

      // Add to gallery
      uploadedMedia.push({
        type: result.resource_type || 'image',
        url: result.secure_url
      });
      renderMediaGallery(uploadedMedia);

      showToast('File uploaded successfully!', 'success');

    } catch (error) {
      uploadProgress.classList.add('hidden');
      uploadResult.classList.add('error');
      uploadResult.innerHTML = `
        <i class="ph ph-warning-circle"></i>
        Upload failed: ${error.message}
      `;
      showToast(error.message, 'error');
    }
  }

  /**
   * Render media gallery
   */
  function renderMediaGallery(items) {
    if (!items || !items.length) {
      mediaGallery.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon"><i class="ph ph-images"></i></div>
          <h4>No media uploaded yet</h4>
          <p>Upload photos and videos to showcase your content portfolio.</p>
        </div>
      `;
      return;
    }

    mediaGallery.innerHTML = items.map((item, index) => {
      if (item.type === 'video') {
        return `
          <div class="media-item" data-testid="media-item-${index}">
            <video src="${item.url}" muted></video>
            <div class="media-item-overlay">
              <i class="ph ph-play" style="font-size: 2rem; color: white;"></i>
            </div>
          </div>
        `;
      }
      return `
        <div class="media-item" data-testid="media-item-${index}">
          <img src="${item.url}" alt="Portfolio item" loading="lazy" />
          <div class="media-item-overlay">
            <i class="ph ph-magnifying-glass-plus" style="font-size: 1.5rem; color: white;"></i>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Load inbound requests
   */
  async function loadRequests() {
    requestList.innerHTML = `
      <div class="skeleton" style="height: 120px; margin-bottom: 1rem;"></div>
      <div class="skeleton" style="height: 120px; margin-bottom: 1rem;"></div>
    `;

    try {
      const data = await IHApi.influencerRequests();
      const requests = data.requests || [];

      // Update badge
      const newCount = requests.filter(r => r.status === 'new').length;
      requestBadge.textContent = newCount > 0 ? newCount : '';

      // Update analytics
      document.getElementById('statRequests').textContent = requests.length;
      document.getElementById('statBooked').textContent = requests.filter(r => r.status === 'booked').length;

      if (!requests.length) {
        requestList.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon"><i class="ph ph-envelope-simple"></i></div>
            <h4>No requests yet</h4>
            <p>When brands send you collaboration requests, they'll appear here.</p>
          </div>
        `;
        return;
      }

      requestList.innerHTML = requests.map((req) => `
        <article class="request-item" data-testid="request-item-${req.id}">
          <div class="request-item-header">
            <div>
              <div class="request-item-title">${req.campaign_name || 'Untitled Campaign'}</div>
              <div class="request-item-id">${req.request_id || ''}</div>
            </div>
            <span class="status-pill ${IHFormatters.statusClass(req.status)}">
              ${IHFormatters.status(req.status)}
            </span>
          </div>
          <div class="request-item-body">
            ${req.message || 'No message provided.'}
          </div>
          <div class="request-item-meta">
            <span><i class="ph ph-calendar"></i> ${IHFormatters.date(req.created_at)}</span>
            ${req.budget ? `<span><i class="ph ph-currency-dollar"></i> ${IHFormatters.money(req.budget)}</span>` : ''}
            ${req.deadline ? `<span><i class="ph ph-clock"></i> Due ${req.deadline}</span>` : ''}
            ${req.channel ? `<span><i class="ph ph-hash"></i> ${req.channel}</span>` : ''}
          </div>
          <div class="request-item-actions">
            <select data-request-id="${req.id}" data-testid="status-select-${req.id}">
              <option value="new" ${req.status === 'new' ? 'selected' : ''}>New</option>
              <option value="contacted" ${req.status === 'contacted' ? 'selected' : ''}>Contacted</option>
              <option value="negotiating" ${req.status === 'negotiating' ? 'selected' : ''}>Negotiating</option>
              <option value="booked" ${req.status === 'booked' ? 'selected' : ''}>Booked</option>
              <option value="closed" ${req.status === 'closed' ? 'selected' : ''}>Closed</option>
            </select>
            <button class="btn btn-primary" data-update-id="${req.id}" data-testid="update-status-${req.id}">
              <i class="ph ph-check"></i>
              Update Status
            </button>
          </div>
        </article>
      `).join('');

      // Bind update buttons
      document.querySelectorAll('[data-update-id]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.updateId;
          const select = document.querySelector(`select[data-request-id="${id}"]`);
          const status = select.value;

          try {
            btn.disabled = true;
            btn.innerHTML = '<i class="ph ph-spinner"></i>';
            await IHApi.updateRequestStatus(id, status);
            showToast('Status updated', 'success');
            loadRequests();
          } catch (error) {
            showToast(error.message, 'error');
          } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="ph ph-check"></i> Update Status';
          }
        });
      });

    } catch (error) {
      requestList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="ph ph-warning-circle"></i></div>
          <h4>Unable to load requests</h4>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  // Event Listeners
  saveProfile.addEventListener('click', handleSaveProfile);

  uploadBtn.addEventListener('click', () => mediaUpload.click());
  uploadZone.addEventListener('click', () => mediaUpload.click());
  
  mediaUpload.addEventListener('change', (e) => {
    handleFileUpload(e.target.files[0]);
  });

  // Drag and drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFileUpload(e.dataTransfer.files[0]);
  });

  refreshInbound.addEventListener('click', loadRequests);

  // Initial load
  loadProfile();
  loadRequests();

})();
