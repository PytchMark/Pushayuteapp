(function () {
  const grid = document.getElementById('grid');
  const qInput = document.getElementById('q');
  const nicheInput = document.getElementById('niche');
  const searchBtn = document.getElementById('searchBtn');

  function skeleton() {
    grid.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
  }

  function renderError(message) {
    grid.innerHTML = `<article class="glass card"><h4>Unable to load influencers</h4><p>${message}</p></article>`;
  }

  async function load() {
    skeleton();
    try {
      const data = await IHApi.publicInfluencers({ query: qInput.value, niche: nicheInput.value });
      const list = data.influencers || [];
      if (!list.length) {
        grid.innerHTML = '<article class="glass card"><h4>No influencers found</h4><p>Try a broader search or remove filters.</p></article>';
        return;
      }
      grid.innerHTML = list.map((item) => `
        <article class="glass card tilt-card">
          <img src="${item.profile_image_url || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}" style="width:100%;aspect-ratio:1.25;object-fit:cover;border-radius:12px" alt="${item.display_name || 'Influencer'}" />
          <h4>${item.display_name || 'Unnamed Creator'}</h4>
          <p>${item.niche || 'General'} · ${item.location || 'Global'}</p>
          <small>${IHFormatters.num(item.followers_count)} followers · ${item.engagement_rate || 0}% ER</small>
          <div style="margin-top:.8rem"><span class="btn ghost">${IHFormatters.money(item.rate_min)}-${IHFormatters.money(item.rate_max)}</span></div>
        </article>
      `).join('');
    } catch (error) {
      renderError(error.message || 'Please check API configuration and retry.');
    }
  }

  searchBtn.addEventListener('click', load);
  window.addEventListener('DOMContentLoaded', load);
})();
