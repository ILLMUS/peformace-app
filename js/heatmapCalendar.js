/* ============================
   Heatmap & Calendar
   ============================ */
function renderHeatmap(results){
  const heatWrap = document.getElementById('heatmap'); heatWrap.innerHTML = '';
  // grid: Mon..Sun x 24 hours (we show 7 cols; each cell will be Day label + Hour block approximated)
  // We'll aggregate by day-of-week (0=Sun..6=Sat) and hour (0..23). For mobile compactness we show day-of-week with weighted color by avg result
  const dow = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  // compute per-day stats
  const dayStats = {}; for(let i=0;i<7;i++) dayStats[i]={count:0, sum:0};
  results.forEach(r=>{
    const d = new Date(r.time || r.date);
    const day = d.getDay();
    dayStats[day].count++; dayStats[day].sum += r.result;
  });
  // render 7 cells
  for(let i=1;i<=7;i++){
    const idx = i%7; // show Mon..Sun more readable maybe
    const st = dayStats[idx];
    const val = st.count ? st.sum / st.count : 0;
    const intensity = Math.min(1, Math.abs(val) / 100); // normalize
    let bg = 'rgba(255,255,255,0.03)';
    if(val>0) bg = `rgba(16,185,129,${0.15 + intensity*0.7})`; // green
    if(val<0) bg = `rgba(239,68,68,${0.15 + intensity*0.7})`; // red
    const el = document.createElement('div'); el.className='heat-cell'; el.style.background=bg;
    el.title = `${dow[idx]} • trades ${st.count} • avg $${st.count? (st.sum/st.count).toFixed(2):0}`;
    el.textContent = `${dow[idx]} ${st.count? '('+st.count+')':''}`;
    heatWrap.appendChild(el);
  }
}

function renderCalendar(results){
  const cal = document.getElementById('calendar'); cal.innerHTML='';
  // group by date (YYYY-MM-DD)
  const map = {};


  /* TODO later fix:
  results.forEach(r=>{ 
    const d = (r.date || r.time).slice(0,10); 
    map[d] = map[d]||{count:0,sum:0}; map[d].count++; 
    map[d].sum += r.result; });*/

    results.forEach(r => {
  const rawDate = r.date || r.time;
  if (!rawDate) return; // ← critical guard

  const d = rawDate.slice(0, 10);

  map[d] = map[d] || { count: 0, sum: 0 };
  map[d].count++;
  map[d].sum += Number(r.result) || 0;
});

  // show last 30 days
  const days=30; const now = new Date();
  for(let i=days-1;i>=0;i--){
    const d = new Date(now); d.setDate(now.getDate()-i);
    const key = d.toISOString().slice(0,10);
    const obj = map[key] || {count:0,sum:0};
    const el = document.createElement('div'); el.className='heat-cell';
    // color by sum
    const intensity = Math.min(1, Math.abs(obj.sum)/100);
    if(obj.count===0) el.style.background = 'rgba(255,255,255,0.02)';
    else if(obj.sum>0) el.style.background = `rgba(16,185,129,${0.15 + intensity*0.7})`;
    else el.style.background = `rgba(239,68,68,${0.15 + intensity*0.7})`;
    el.title = `${key} • trades ${obj.count} • net $${obj.sum.toFixed(2)}`;
    el.textContent = d.getDate().toString();
    cal.appendChild(el);
  }
}
