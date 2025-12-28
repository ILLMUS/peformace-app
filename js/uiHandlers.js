
/* ============================
   Other UI handlers
   ============================ */
document.getElementById('clearBtn').addEventListener('click', ()=>{ if(confirm('Clear all trades?')){ trades=[]; save(); }});
document.getElementById('downloadAll').addEventListener('click', ()=>{}); // handled above
document.getElementById('themeSel').addEventListener('change', e=> document.body.setAttribute('data-theme', e.target.value));
document.getElementById('clearBtn').addEventListener('click', ()=>{ if(confirm('Clear all trades?')){ trades=[]; save(); }});

// export monthly PDF (quick)
document.getElementById('monthlyPdfBtn').addEventListener('click', ()=> generateMonthlyPDF());

// init
render();
