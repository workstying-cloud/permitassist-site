
(function(){
  const dispatchMode = (mode) => document.dispatchEvent(new CustomEvent('flow-mode',{detail:mode}));
  document.addEventListener('DOMContentLoaded', () => {
    // Toggle buttons
    const btns = document.querySelectorAll('[data-mode]');
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      dispatchMode(b.dataset.mode);
    }));
    // Default
    const def = document.querySelector('[data-mode].active') || btns[0];
    if(def){ def.classList.add('active'); dispatchMode(def.dataset.mode); }

    // Smoke tests
    const ids = ['offers','cloud','data','management','industries','stakeholders','risk','flows','flow360','engage','results','contact'];
    ids.forEach(id => console.assert(!!document.getElementById(id), '[SMOKE] Missing #'+id));
    const navLinks = document.querySelectorAll('header nav a[href^="#"]').length;
    console.assert(navLinks>=8, '[TEST] Expect >=8 nav anchors');
    const calendly = document.querySelector('#contact iframe[title="Calendly"]');
    console.assert(!!calendly, '[TEST] Calendly iframe should exist');
  });

  // Flow diagram dynamic tweaks
  document.addEventListener('flow-mode', (e)=>{
     const mode = e.detail;
     const svg = document.getElementById('flow-svg');
     if(!svg) return;
     const isRisk = mode==='risk';
     const isDeps = mode==='deps';
     svg.querySelectorAll('[data-edge]').forEach(el=>{
       const sec = el.getAttribute('data-sec')==='1';
       el.setAttribute('opacity', (isRisk && !sec)? '0.35':'1');
       el.setAttribute('stroke-width', (isRisk && sec)? '8':'6');
     });
     svg.querySelectorAll('[data-node]').forEach(el=>{
       const id = el.getAttribute('data-node');
       const isHL = isDeps && ['infra','data','api'].indexOf(id)>=0;
       const isSEC = isRisk && id==='sec';
       el.setAttribute('data-outline', isSEC? 'red' : isHL? 'blue':'gray');
       const rect = el.querySelector('rect[data-outline]');
       if(rect){
         rect.setAttribute('stroke', isSEC? 'var(--brand3)' : isHL? 'var(--brand2)':'#e5e7eb');
         rect.setAttribute('stroke-width', isSEC? '3':'2');
       }
     });
  });
})();
