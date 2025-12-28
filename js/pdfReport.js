/* ============================
   Monthly PDF Report
============================ */
document.getElementById('monthlyPdfBtn').addEventListener('click', async ()=> generateMonthlyPDF());

async function generateMonthlyPDF(){
  const month = new Date().toISOString().slice(0,7);
  const filtered = trades.filter(t => (t.date||'').slice(0,7) === month);

  const wins = filtered.filter(t=>t.result>0), losses = filtered.filter(t=>t.result<=0);
  const grossWin = wins.reduce((s,r)=>s+r.result,0), grossLoss = Math.abs(losses.reduce((s,r)=>s+r.result,0));
  const winRate = filtered.length ? (wins.length/filtered.length)*100 : 0;
  const avgWin = wins.length ? (grossWin/wins.length) : 0;
  const avgLoss = losses.length ? (grossLoss/losses.length) : 0;
  const pf = grossLoss ? (grossWin/grossLoss) : (grossWin>0?Infinity:0);

  const node = document.createElement('div');
  node.style.padding='18px'; node.style.background='#fff'; node.style.color='#000'; node.style.width='800px';
  node.innerHTML = `<h2>Monthly Report — ${month}</h2>
    <p>Total trades: ${filtered.length} • Wins: ${wins.length} • Losses: ${losses.length} • Win rate: ${winRate.toFixed(1)}%</p>
    <p>Gross win: $${grossWin.toFixed(2)} • Gross loss: $${grossLoss.toFixed(2)} • Profit factor: ${pf===Infinity?'∞':pf.toFixed(2)}</p>
    <p>Avg win: $${avgWin.toFixed(2)} • Avg loss: $${avgLoss.toFixed(2)}</p>
    <h3>Equity Snapshot</h3>
    <div id="rep-chart" style="width:760px;height:220px"></div>
    <h3>Top trades</h3>
    <ol>${filtered.sort((a,b)=>b.result-a.result).slice(0,10).map(t=>`<li>${t.date} ${t.pair} ${t.side} $${t.result.toFixed(2)} (${t.notes||''})</li>`).join('')}</ol>
  `;
  document.body.appendChild(node);

  const canvas = document.createElement('canvas'); canvas.width=760; canvas.height=220;
  node.querySelector('#rep-chart').appendChild(canvas);
  const ctx = canvas.getContext('2d'); let cum=0; const labels=[], data=[];
  filtered.forEach(t=>{ labels.push(t.date); cum += t.result; data.push(cum); });
  new Chart(ctx,{ type:'line', data:{ labels, datasets:[{ label:'Equity', data, borderColor:'#7c3aed', backgroundColor:'rgba(124,58,237,0.12)', fill:true }] }, options:{responsive:false,plugins:{legend:{display:false}}}});

  const canvasImg = await html2canvas(node, { scale:2 });
  const imgData = canvasImg.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation:'portrait', unit:'px', format:'a4' });
  const pdfW = pdf.internal.pageSize.getWidth(), pdfH = pdf.internal.pageSize.getHeight();
  const imgW = pdfW - 40, imgH = (canvasImg.height * imgW) / canvasImg.width;
  pdf.addImage(imgData, 'PNG', 20, 20, imgW, imgH);
  pdf.save(`monthly_report_${month}.pdf`);
  document.body.removeChild(node);
}
