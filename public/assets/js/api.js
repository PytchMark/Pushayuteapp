(function () {
  const state = { token: localStorage.getItem('ih_token') || '', adminToken: localStorage.getItem('ih_admin_token') || '' };

  function setToken(token) {
    state.token = token || '';
    localStorage.setItem('ih_token', state.token);
  }

  function setAdminToken(token) {
    state.adminToken = token || '';
    localStorage.setItem('ih_admin_token', state.adminToken);
  }

  async function request(url, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (options.auth) headers.Authorization = `Bearer ${state.token}`;
    if (options.adminAuth) headers.Authorization = `Bearer ${state.adminToken}`;
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
    return res.json();
  }

  window.IHApi = {
    setToken,
    setAdminToken,
    publicInfluencers: (params = {}) => request(`/api/public/influencers?${new URLSearchParams(params).toString()}`),
    publicInfluencer: (handle) => request(`/api/public/influencers/${handle}`),
    brandShortlist: () => request('/api/brand/shortlist', { auth: true }),
    updateShortlist: (payload) => request('/api/brand/shortlist', { method: 'POST', auth: true, body: JSON.stringify(payload) }),
    createBrandRequests: (payload) => request('/api/brand/requests', { method: 'POST', auth: true, body: JSON.stringify(payload) }),
    brandRequests: () => request('/api/brand/requests', { auth: true }),
    influencerMe: () => request('/api/influencer/me', { auth: true }),
    upsertInfluencerProfile: (payload) => request('/api/influencer/profile', { method: 'POST', auth: true, body: JSON.stringify(payload) }),
    influencerRequests: () => request('/api/influencer/requests', { auth: true }),
    updateRequestStatus: (id, status) => request(`/api/influencer/requests/${id}/status`, { method: 'POST', auth: true, body: JSON.stringify({ status }) }),
    uploadMedia: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/media/upload', { method: 'POST', headers: { Authorization: `Bearer ${state.token}` }, body: formData });
      if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
      return res.json();
    },
    adminLogin: (payload) => request('/api/admin/login', { method: 'POST', body: JSON.stringify(payload) }),
    adminSummary: () => request('/api/admin/summary', { adminAuth: true }),
    adminInfluencers: () => request('/api/admin/influencers', { adminAuth: true }),
    adminBrands: () => request('/api/admin/brands', { adminAuth: true }),
    adminRequests: () => request('/api/admin/requests', { adminAuth: true })
  };
})();
