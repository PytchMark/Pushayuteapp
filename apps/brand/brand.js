(function () {
  IHUi.bindTabs('#brandSidebar');

  const tray = new Map();
  const discoverQuery = document.getElementById('discoverQuery');
  const discoverList = document.getElementById('discoverList');
  const searchBtn = document.getElementById('searchBtn');
  const submitCampaign = document.getElementById('submitCampaign');
  const campaignName = document.getElementById('campaign_name');
  const message = document.getElementById('message');
  const budget = document.getElementById('budget');
  const deliverables = document.getElementById('deliverables');
  const deadline = document.getElementById('deadline');
  const channel = document.getElementById('channel');
  const myRequests = document.getElementById('myRequests');

  function renderTray() {
    const wrap = document.getElementById('trayItems');
    wrap.innerHTML = [...tray.values()]
      .map((x) => `<li>${x.display_name} <button data-remove="${x.user_id || x.handle}" class="btn ghost">x</button></li>`)
      .join('');

    document.querySelectorAll('[data-remove]').forEach((btn) => btn.addEventListener('click', () => {
      tray.delete(btn.dataset.remove);
      renderTray();
    }));
  }

  async function loadDiscover() {
    try {
      const data = await IHApi.publicInfluencers({ query: discoverQuery.value });
      const list = data.influencers || [];
      discoverList.innerHTML = list.map((i) => `
        <article class="glass card">
          <strong>${i.display_name || 'Unnamed Creator'}</strong>
          <p>${i.niche || 'General'} · ${i.location || 'Global'}</p>
          <small>${IHFormatters.money(i.rate_min)}-${IHFormatters.money(i.rate_max)}</small>
          <div style="display:flex;gap:.4rem;margin-top:.7rem">
            <button class="btn" data-add="${encodeURIComponent(JSON.stringify(i))}">Add to Tray</button>
            <button class="btn ghost" data-wa="${i.handle || i.display_name || 'creator'}">WhatsApp</button>
          </div>
        </article>
      `).join('');

      document.querySelectorAll('[data-add]').forEach((btn) => btn.addEventListener('click', () => {
        const i = JSON.parse(decodeURIComponent(btn.dataset.add));
        tray.set(i.user_id || i.handle, i);
        renderTray();
      }));

      document.querySelectorAll('[data-wa]').forEach((btn) => btn.addEventListener('click', () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`Hi ${btn.dataset.wa}, we found your InfluencerHub profile and want to discuss a collaboration.`)}`, '_blank');
      }));
    } catch (error) {
      discoverList.innerHTML = `<article class="glass card"><h4>Discover unavailable</h4><p>${error.message}</p></article>`;
    }
  }

  async function loadMyRequests() {
    try {
      const data = await IHApi.brandRequests();
      myRequests.innerHTML = (data.requests || []).map((r) => `
        <article class="glass card">
          <h4>${r.campaign_name || 'Campaign'}</h4>
          <p>${r.status}</p>
          <small>${IHFormatters.date(r.created_at)}</small>
        </article>
      `).join('');
    } catch (error) {
      myRequests.innerHTML = `<article class="glass card"><p>${error.message}</p></article>`;
    }
  }

  searchBtn.addEventListener('click', loadDiscover);
  submitCampaign.addEventListener('click', async () => {
    const influencerUserIds = [...tray.values()].map((x) => x.user_id).filter(Boolean);
    if (!influencerUserIds.length) {
      IHUi.toast('Add at least one influencer with a linked user_id.');
      return;
    }

    try {
      await IHApi.createBrandRequests({
        influencerUserIds,
        campaignName: campaignName.value,
        message: message.value,
        budget: Number(budget.value),
        deliverables: deliverables.value,
        deadline: deadline.value,
        channel: channel.value
      });
      IHUi.toast('Campaign requests sent');
      tray.clear();
      renderTray();
      loadMyRequests();
    } catch (error) {
      IHUi.toast(error.message);
    }
  });

  loadDiscover();
  loadMyRequests();
})();
