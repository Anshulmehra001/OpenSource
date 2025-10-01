// shared.js - common behaviors across guide pages
(function(){
  // Copy buttons
  document.querySelectorAll('[data-copy]').forEach(btn => {
    if(btn.dataset.bound) return; btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const code = btn.nextElementSibling?.innerText || '';
      navigator.clipboard.writeText(code).then(()=>{
        const prev = btn.textContent; btn.textContent = 'Copied';
        setTimeout(()=> btn.textContent = prev, 1500);
      });
    });
  });
  // Q&A toggles
  document.querySelectorAll('.qa-q').forEach(q => {
    if(q.dataset.bound) return; q.dataset.bound='1';
    q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
  });
})();

// Checklist utility: call registerChecklist(key, selector, progressKey)
function registerChecklist(storageKey, selector, progressKey){
  const tasks = [...document.querySelectorAll(selector)];
  if(!tasks.length) return;
  const saved = JSON.parse(localStorage.getItem(storageKey)||'{}');
  tasks.forEach((cb,i) => {
    if(saved[i]){ cb.checked = true; cb.parentElement.classList.add('completed'); }
    cb.addEventListener('change', () => {
      cb.parentElement.classList.toggle('completed', cb.checked);
      saved[i] = cb.checked; localStorage.setItem(storageKey, JSON.stringify(saved));
      updateProgress();
    });
  });
  function updateProgress(){
    const done = tasks.filter(t=>t.checked).length;
    if(progressKey) {
      localStorage.setItem('progress:'+progressKey, (done/tasks.length).toFixed(2));
      window.dispatchEvent(new CustomEvent('guideProgressUpdate', {detail:{guide:progressKey}}));
    }
  }
  updateProgress();
}

// Service worker registration (idempotent)
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
