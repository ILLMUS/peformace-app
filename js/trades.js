/* ============================
   Trade Management
============================ */
function attachRowHandlers(){
  tbody.querySelectorAll('input').forEach(inp=>{
    inp.onchange = (e)=>{
      const i = +e.target.dataset.index;
      const f = e.target.dataset.field;
      trades[i][f] = isNaN(e.target.value) ? e.target.value : Number(e.target.value);
      if(f==='lots' || f==='points' || f==='pair') {
        const t = trades[i];
        if(t.points!=null && !isNaN(t.points)) t.result = calcResultFromPoints(t.pair, t.lots, t.points);
      }
      saveTrades(); render();
    };
  });
  tbody.querySelectorAll('.del').forEach(btn=>{
    btn.onclick = ()=>{
      const i = +btn.dataset.index;
      trades.splice(i,1); saveTrades(); render();
    };
  });
}

/* Add trade */
async function addTrade(trade){
  trades.push(trade);
  saveTrades();
  render();

  if(currentUser){
    try {
      await window.supabase.from('trades').insert({ ...trade, user_id: currentUser.id });
    } catch(err){
      console.error('Supabase insert error', err);
    }
  }
}

/* CSV import/export */
function importCSV(fileContent){
  const rows = fileContent.split(/\r?\n/).filter(r=>r.trim());
  rows.forEach(r=>{
    const cols = r.split(',').map(c=>c.trim());
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
  saveTrades(); render();
}

function exportCSV(){
  const csv = trades.map(t=> `${t.date},${t.pair},${t.side},${t.lots},${t.points||''},${t.result||''},${(t.notes||'')}`).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='trades_export.csv'; a.click();
  URL.revokeObjectURL(url);
}
