IHUi.bindTabs('#adminSidebar');

document.getElementById('adminLogin').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const { token } = await IHApi.adminLogin({ username, password });
  IHApi.setAdminToken(token);
  await loadAdmin();
});

async function loadAdmin() {
  const [summary, inf, brands, reqs] = await Promise.all([
    IHApi.adminSummary(), IHApi.adminInfluencers(), IHApi.adminBrands(), IHApi.adminRequests()
  ]);
  metrics.textContent = JSON.stringify(summary, null, 2);
  influencerTable.textContent = JSON.stringify(inf.influencers.slice(0, 20), null, 2);
  brandTable.textContent = JSON.stringify(brands.brands.slice(0, 20), null, 2);
  requestTable.textContent = JSON.stringify(reqs.requests.slice(0, 20), null, 2);
}
