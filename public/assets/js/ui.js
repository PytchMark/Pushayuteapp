window.IHUi = {
  bindTabs(rootSelector) {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const buttons = [...root.querySelectorAll('[data-tab-target]')];
    const panes = [...document.querySelectorAll('[data-tab-pane]')];
    buttons.forEach((btn) => btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      panes.forEach((pane) => { pane.hidden = pane.dataset.tabPane !== btn.dataset.tabTarget; });
    }));
  },
  toast(message) { alert(message); }
};
