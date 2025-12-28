/* ============================
   CSV import/export
   ============================ */
document.getElementById('importBtn').addEventListener('click', ()=> document.getElementById('fileInput').click());
document.getElementById('fileInput').addEventListener('change', (e)=>{
  const f = e.target.files[0]; if(!f) return;
  const reader = new FileReader(); reader.onload = ev=>{
    const rows = ev.target.result.split(/\r?\n/).filter(r=>r.trim());
    rows.forEach(r=>{
      const cols = r.split(',').map(c=>c.trim());
      // expected: date,pair,side,lots,points,result,notes
      const obj = {
        date: cols[0] || (new Date()).toISOString().slice(0,10),
        pair: cols[1] || 'US100',
        side: cols[2] || 'Buy',
        lots: Number(cols[3]||0.01),
        points: Number(cols[4]||0),
        result: cols[5]?Number(cols[5]):calcResultFromPoints(cols[1]||'US100', Number(cols[3]||0.01), Number(cols[4]||0)),
        notes: cols[6] || ''
      };
      trades.push(obj);
    });
    save();
  };
  reader.readAsText(f);
});

document.getElementById('downloadCsv').addEventListener('click', ()=>{
  const csv = trades.map(t=> `${t.date},${t.pair},${t.side},${t.lots},${t.points||''},${t.result||''},${(t.notes||'')}`).join('\n');
  const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='trades_export.csv'; a.click(); URL.revokeObjectURL(url);
});
