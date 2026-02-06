(function () {
  IHUi.bindTabs('#influencerSidebar');

  const form = document.getElementById('profileForm');
  const saveBtn = document.getElementById('saveProfile');
  const mediaUpload = document.getElementById('mediaUpload');
  const uploadResult = document.getElementById('uploadResult');
  const requestList = document.getElementById('requestList');

  saveBtn.addEventListener('click', async () => {
    const payload = {
      handle: form.handle.value,
      display_name: form.display_name.value,
      bio: form.bio.value,
      niche: form.niche.value,
      location: form.location.value,
      followers_count: Number(form.followers_count.value),
      engagement_rate: Number(form.engagement_rate.value),
      rate_min: Number(form.rate_min.value),
      rate_max: Number(form.rate_max.value),
      platforms: { instagram: form.instagram.value, tiktok: form.tiktok.value }
    };

    try {
      await IHApi.upsertInfluencerProfile(payload);
      IHUi.toast('Profile saved');
    } catch (error) {
      IHUi.toast(error.message);
    }
  });

  mediaUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploaded = await IHApi.uploadMedia(file);
      uploadResult.textContent = uploaded.secure_url;
    } catch (error) {
      uploadResult.textContent = error.message;
    }
  });

  async function loadRequests() {
    try {
      const data = await IHApi.influencerRequests();
      requestList.innerHTML = (data.requests || []).map((r) => `
        <article class="glass card">
          <strong>${r.campaign_name || 'Campaign'}</strong>
          <p>${r.message || ''}</p>
          <small>${r.status}</small>
          <div>
            <select data-id="${r.id}">
              <option ${r.status === 'new' ? 'selected' : ''}>new</option>
              <option ${r.status === 'contacted' ? 'selected' : ''}>contacted</option>
              <option ${r.status === 'negotiating' ? 'selected' : ''}>negotiating</option>
              <option ${r.status === 'booked' ? 'selected' : ''}>booked</option>
              <option ${r.status === 'closed' ? 'selected' : ''}>closed</option>
            </select>
            <button class="btn" data-save="${r.id}">Update</button>
          </div>
        </article>
      `).join('');

      document.querySelectorAll('[data-save]').forEach((btn) => btn.addEventListener('click', async () => {
        const id = btn.dataset.save;
        const status = document.querySelector(`select[data-id="${id}"]`).value;
        await IHApi.updateRequestStatus(id, status);
        loadRequests();
      }));
    } catch (error) {
      requestList.innerHTML = `<article class="glass card"><p>${error.message}</p></article>`;
    }
  }

  loadRequests();
})();
