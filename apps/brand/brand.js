IHUi.bindTabs('#brandSidebar');
const tray = new Map();

function renderTray(){
  const wrap = document.getElementById('trayItems');
  wrap.innerHTML = [...tray.values()].map((x)=>`<li>${x.display_name} <button data-remove="${x.user_id}" class="btn ghost">x</button></li>`).join('');
  document.querySelectorAll('[data-remove]').forEach((btn)=>btn.addEventListener('click',()=>{tray.delete(btn.dataset.remove);renderTray();}));
}

async function loadDiscover(){
  const data = await IHApi.publicInfluencers({ query: discoverQuery.value });
  discoverList.innerHTML = data.influencers.map((i)=>`<article class="glass card"><strong>${i.display_name}</strong><p>${i.niche} · ${i.location}</p><small>${IHFormatters.money(i.rate_min)}-${IHFormatters.money(i.rate_max)}</small><div style="display:flex;gap:.4rem;margin-top:.7rem"><button class="btn" data-add="${encodeURIComponent(JSON.stringify(i))}">Add to Tray</button><button class="btn ghost" data-wa="${i.handle}">WhatsApp</button></div></article>`).join('');
  document.querySelectorAll('[data-add]').forEach((btn)=>btn.addEventListener('click',()=>{ const i = JSON.parse(decodeURIComponent(btn.dataset.add)); tray.set(i.user_id || i.handle, i); renderTray(); }));
  document.querySelectorAll('[data-wa]').forEach((btn)=>btn.addEventListener('click',()=>{ window.open(`https://wa.me/?text=${encodeURIComponent('Hi '+btn.dataset.wa+', we found your InfluencerHub profile and want to discuss a collaboration.')}`,'_blank'); }));
}

searchBtn.addEventListener('click', loadDiscover);
submitCampaign.addEventListener('click', async ()=>{
  const influencerUserIds = [...tray.values()].map((x)=>x.user_id).filter(Boolean);
  await IHApi.createBrandRequests({ influencerUserIds, campaignName: campaign_name.value, message: message.value, budget: Number(budget.value), deliverables: deliverables.value, deadline: deadline.value, channel: channel.value });
  IHUi.toast('Campaign requests sent');
});

async function loadMyRequests(){
  const data = await IHApi.brandRequests();
  myRequests.innerHTML = data.requests.map((r)=>`<article class="glass card"><h4>${r.campaign_name}</h4><p>${r.status}</p><small>${IHFormatters.date(r.created_at)}</small></article>`).join('');
}
loadDiscover();
loadMyRequests();
