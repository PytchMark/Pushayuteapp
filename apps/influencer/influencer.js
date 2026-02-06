IHUi.bindTabs('#influencerSidebar');

document.getElementById('saveProfile').addEventListener('click', async () => {
  const payload = {
    handle: profileForm.handle.value,
    display_name: profileForm.display_name.value,
    bio: profileForm.bio.value,
    niche: profileForm.niche.value,
    location: profileForm.location.value,
    followers_count: Number(profileForm.followers_count.value),
    engagement_rate: Number(profileForm.engagement_rate.value),
    rate_min: Number(profileForm.rate_min.value),
    rate_max: Number(profileForm.rate_max.value),
    platforms: { instagram: profileForm.instagram.value, tiktok: profileForm.tiktok.value }
  };
  await IHApi.upsertInfluencerProfile(payload);
  IHUi.toast('Profile saved');
});

document.getElementById('mediaUpload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const uploaded = await IHApi.uploadMedia(file);
  document.getElementById('uploadResult').textContent = uploaded.secure_url;
});

async function loadRequests(){
  const data = await IHApi.influencerRequests();
  document.getElementById('requestList').innerHTML = data.requests.map((r)=>`<article class="glass card"><strong>${r.campaign_name||'Campaign'}</strong><p>${r.message||''}</p><small>${r.status}</small><div><select data-id="${r.id}"><option>new</option><option>contacted</option><option>negotiating</option><option>booked</option><option>closed</option></select><button class="btn" data-save="${r.id}">Update</button></div></article>`).join('');
  document.querySelectorAll('[data-save]').forEach((btn)=>btn.addEventListener('click', async()=>{
    const id = btn.dataset.save;
    const status = document.querySelector(`select[data-id="${id}"]`).value;
    await IHApi.updateRequestStatus(id,status);
    loadRequests();
  }));
}
loadRequests();
