/* ============================
   Adding / editing trades
   ============================ */
document.getElementById('addBtn').addEventListener('click', ()=>{
  const date = document.getElementById('date').value || (new Date()).toISOString().slice(0,10);
  const pair = document.getElementById('pair').value;
  const side = document.getElementById('side').value;
  const lots = parseFloat(document.getElementById('lots').value) || 0.01;
  let points = parseFloat(document.getElementById('points').value);
  const entry = parseFloat(document.getElementById('entry').value);
  const exit = parseFloat(document.getElementById('exit').value);
  let result = document.getElementById('result').value;
  const atr = document.getElementById('atr').value;
  const notes = document.getElementById('notes').value;

  if((!points || isNaN(points)) && entry && exit){
    points = +( (side === 'Buy') ? (exit - entry) : (entry - exit) ).toFixed(2);
  }
  if((!result || result==='') && points!=null && !isNaN(points)){
    result = calcResultFromPoints(pair, lots, points);
  } else result = result?Number(result):0;

const trade = {
  date,
  pair,
  side,
  lots,
  points,
  result,
  atr,
  notes,
  time: (new Date()).toISOString()
};

trades.push(trade);
save();

// 👇 THIS is what you were missing
persistTradeToSupabase(trade);

  // clear fields
  document.getElementById('points').value=''; document.getElementById('result').value=''; document.getElementById('entry').value=''; document.getElementById('exit').value=''; document.getElementById('notes').value='';
  save();
});

/* Inline editing & delete */
function attachRowHandlers(){
  tbody.querySelectorAll('input').forEach(inp=>{
    inp.onchange = (e)=>{
      const i = +e.target.dataset.index;
      const f = e.target.dataset.field;
      trades[i][f] = isNaN(e.target.value) ? e.target.value : Number(e.target.value);
      // if fields affect result, recalc
      if(f==='lots' || f==='points' || f==='pair') {
        const t = trades[i];
        if(t.points!=null && !isNaN(t.points)) t.result = calcResultFromPoints(t.pair, t.lots, t.points);
      }
      save();
    };
  });
  tbody.querySelectorAll('.del').forEach(btn=> btn.onclick = ()=>{
    const i = +btn.dataset.index;
    trades.splice(i,1); save();
  });
}
