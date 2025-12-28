/* ============================
   Download HTML (save to file)
   ============================ */
document.getElementById('downloadAll').addEventListener('click', ()=>{
  const html = '<!doctype html>\\n' + document.documentElement.outerHTML;
  const blob = new Blob([html], {type:'text/html'}); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download='performance_tracker_pro.html'; a.click(); URL.revokeObjectURL(url);
});