/**
 * InfluencerHub Storefront - Discovery & Interactions
 */

(function() {
  'use strict';

  // DOM Elements
  const searchQuery = document.getElementById('searchQuery');
  const nicheFilter = document.getElementById('nicheFilter');
  const sortFilter = document.getElementById('sortFilter');
  const searchBtn = document.getElementById('searchBtn');
  const influencerGrid = document.getElementById('influencerGrid');

  /**
   * Render skeleton loaders
   */
  function renderSkeletons(count = 6) {
    influencerGrid.innerHTML = Array(count).fill(0).map(() => `
      <div class="skeleton skeleton-card"></div>
    `).join('');
  }

  /**
   * Render error state
   */
  function renderError(message) {
    influencerGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon"><i class="ph ph-warning-circle"></i></div>
        <h4>Unable to load influencers</h4>
        <p>${message}</p>
        <button class="btn btn-primary mt-2" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }

  /**
   * Render empty state
   */
  function renderEmpty() {
    influencerGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon"><i class="ph ph-users-three"></i></div>
        <h4>No influencers found</h4>
        <p>Try adjusting your search filters or browse all creators.</p>
        <button class="btn btn-secondary mt-2" onclick="window.clearFilters()">Clear Filters</button>
      </div>
    `;
  }

  /**
   * Render influencer card
   */
  function renderInfluencerCard(influencer) {
    const verified = influencer.verified ? `<span class="verified-badge" title="Verified"><i class="ph-fill ph-check"></i></span>` : '';
    const profileImage = influencer.profile_image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80';
    
    return `
      <article class="influencer-card" data-testid="influencer-card-${influencer.handle || influencer.id}">
        <div class="influencer-card-image">
          <img src="${profileImage}" alt="${influencer.display_name || 'Influencer'}" loading="lazy" />
          <div class="influencer-card-overlay"></div>
          <div class="influencer-card-metrics">
            <span class="metric-chip">${IHFormatters.num(influencer.followers_count)} followers</span>
            <span class="metric-chip">${influencer.engagement_rate || 0}% ER</span>
          </div>
        </div>
        <div class="influencer-card-content">
          <div class="influencer-card-header">
            <span class="influencer-card-name">
              ${influencer.display_name || 'Unnamed Creator'}
              ${verified}
            </span>
          </div>
          <div class="influencer-card-niche">
            <i class="ph ph-map-pin" style="font-size: 0.875rem;"></i>
            ${influencer.niche || 'General'} · ${influencer.location || 'Global'}
          </div>
          <div class="influencer-card-rate">
            <span class="rate-label">Starting at</span>
            <span class="rate-value">${IHFormatters.money(influencer.rate_min)}</span>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Load and display influencers
   */
  async function loadInfluencers() {
    renderSkeletons();

    try {
      const params = {
        query: searchQuery.value || '',
        niche: nicheFilter.value || '',
        sort: sortFilter.value || ''
      };

      const data = await IHApi.publicInfluencers(params);
      const influencers = data.influencers || [];

      if (!influencers.length) {
        renderEmpty();
        return;
      }

      influencerGrid.innerHTML = influencers.map(renderInfluencerCard).join('');

      // Re-initialize tilt effects for new cards
      if (window.IHMotion && window.IHMotion.initTiltCards) {
        window.IHMotion.initTiltCards();
      }

      // Animate cards in
      if (window.gsap) {
        gsap.from('.influencer-card', {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out'
        });
      }

    } catch (error) {
      console.error('Failed to load influencers:', error);
      renderError(error.message || 'Please check your connection and try again.');
    }
  }

  /**
   * Clear all filters
   */
  window.clearFilters = function() {
    searchQuery.value = '';
    nicheFilter.value = '';
    sortFilter.value = '';
    loadInfluencers();
  };

  /**
   * Handle search on Enter key
   */
  searchQuery.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      loadInfluencers();
    }
  });

  /**
   * Handle search button click
   */
  searchBtn.addEventListener('click', loadInfluencers);

  /**
   * Handle filter changes
   */
  nicheFilter.addEventListener('change', loadInfluencers);
  sortFilter.addEventListener('change', loadInfluencers);

  /**
   * Smooth scroll for anchor links
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Initial load
  loadInfluencers();

})();
