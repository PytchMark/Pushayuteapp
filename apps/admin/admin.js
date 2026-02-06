(function () {
  IHUi.bindTabs('#adminSidebar');

  const loginBtn = document.getElementById('adminLogin');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const metrics = document.getElementById('metrics');
  const influencerTable = document.getElementById('influencerTable');
  const brandTable = document.getElementById('brandTable');
  const requestTable = document.getElementById('requestTable');

  loginBtn.addEventListener('click', async () => {
    try {
      const { token } = await IHApi.adminLogin({ username: username.value, password: password.value });
      IHApi.setAdminToken(token);
      await loadAdmin();
      IHUi.toast('Admin authenticated');
    } catch (error) {
      IHUi.toast(error.message);
    }
  });

  async function loadAdmin() {
    const [summary, inf, brands, reqs] = await Promise.all([
      IHApi.adminSummary(),
      IHApi.adminInfluencers(),
      IHApi.adminBrands(),
      IHApi.adminRequests()
    ]);
    metrics.textContent = JSON.stringify(summary, null, 2);
    influencerTable.textContent = JSON.stringify((inf.influencers || []).slice(0, 20), null, 2);
    brandTable.textContent = JSON.stringify((brands.brands || []).slice(0, 20), null, 2);
    requestTable.textContent = JSON.stringify((reqs.requests || []).slice(0, 20), null, 2);
  }
})();
