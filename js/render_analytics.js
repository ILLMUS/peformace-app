/* ============================
   Rendering & analytics
   ============================ */
let equityChart;
function render(){
  // table
  tbody.innerHTML = '';
  trades.forEach((t,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.date}</td>
      <td>${t.pair}</td>
      <td>${t.side}</td>
      <td><input data-index="${i}" data-field="lots" value="${t.lots}" style="width:72px"></td>
      <td><input data-index="${i}" data-field="points" value="${t.points||''}" style="width:80px"></td>
      <td><input data-index="${i}" data-field="result" value="${t.result||''}" style="width:100px"></td>
      <td>${(t.notes||'')}</td>
      <td><button class="del" data-index="${i}">Del</button></td>
    `;
    tbody.appendChild(tr);
  });
  attachRowHandlers();

  // analytics
  const results = trades.map(t=>({ ...t, result: Number(t.result || 0) }));
  const total = results.reduce((s,r)=>s + r.result,0);
  const wins = results.filter(r=>r.result>0);
  const losses = results.filter(r=>r.result<=0);
  const avgWin = wins.length ? wins.reduce((s,r)=>s+r.result,0)/wins.length : 0;
  const avgLoss = losses.length ? losses.reduce((s,r)=>s+r.result,0)/losses.length : 0;
  const winRate = results.length ? (wins.length / results.length)*100 : 0;
  const grossWin = wins.reduce((s,r)=>s+r.result,0);
  const grossLoss = Math.abs(losses.reduce((s,r)=>s+r.result,0));
  const expectancy = (winRate/100)*avgWin - ((100-winRate)/100)*Math.abs(avgLoss);
  const pf = grossLoss ? (grossWin / grossLoss) : (grossWin>0?Infinity:0);

  document.getElementById('tradeCount').textContent = results.length;
  winRateEl.textContent = winRate.toFixed(1) + '%';
  avgWinEl.textContent = '$' + avgWin.toFixed(2);
  avgLossEl.textContent = '$' + Math.abs(avgLoss).toFixed(2);
  expectancyEl.textContent = '$' + expectancy.toFixed(2);
  pfEl.textContent = pf === Infinity ? '∞' : (pf?pf.toFixed(2):'0');
  document.getElementById('netPL')?.remove();
  document.getElementById('acctVal').textContent = '$' + total.toFixed(2);
  ddEl.textContent = '$' + maxDrawdown(results).toFixed(2);

  // equity chart
  const labels = results.map(r=>r.date);
  let cum = 0; const equity = results.map(r=> cum += r.result);
  if(!equityChart){
    const ctx = document.getElementById('equityChart').getContext('2d');
    equityChart = new Chart(ctx,{ type:'line', data:{ labels:labels, datasets:[{ label:'Equity', data:equity, fill:true, backgroundColor:'rgba(124,58,237,0.12)', borderColor:'#7c3aed'}]}, options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}} } });
  } else {
    equityChart.data.labels = labels;
    equityChart.data.datasets[0].data = equity;
    equityChart.update();
  }

  // heatmap & calendar
  renderHeatmap(results);
  renderCalendar(results);
}

/* max drawdown */
function maxDrawdown(results){
  let cum=0, peak=-Infinity, maxDD=0;
  results.forEach(r => { cum += r.result; if(cum>peak) peak=cum; const dd = peak - cum; if(dd>maxDD) maxDD = dd; });
  return maxDD;
}
