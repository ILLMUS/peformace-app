/* ============================
   Live Price Integration
   ============================ */
let autoPrice = false, autoInterval;

document.getElementById('provider').addEventListener('change', e=>{
  document.getElementById('customUrl').style.display = e.target.value==='custom' ? 'block' : 'none';
});

document.getElementById('getPriceBtn').addEventListener('click', fetchPrice);
document.getElementById('autoPriceBtn').addEventListener('click', ()=>{
  autoPrice = !autoPrice;
  document.getElementById('autoPriceBtn').textContent = autoPrice ? 'Auto: On' : 'Auto: Off';
  if(autoPrice){ autoInterval = setInterval(fetchPrice, 15000); fetchPrice(); } else clearInterval(autoInterval);
});

async function fetchPrice(){
  const provider = document.getElementById('provider').value;
  const symbol = encodeURIComponent(document.getElementById('symbol').value.trim());
  const apikey = document.getElementById('apiKey').value.trim();
  const custom = document.getElementById('customUrl').value.trim();

  if(!symbol || (!apikey && provider!=='custom' && !custom)){ alert('Please enter symbol and API key (or provide custom URL).'); return; }

  try {
    livePriceEl.textContent = 'Connecting…';
    let url;
    if(provider==='twelvedata'){
      // TwelveData price endpoint
      url = `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apikey}`;
      const res = await fetch(url);
      const j = await res.json();
      if(j.price!==undefined) { livePriceEl.textContent = `${symbol} → ${j.price}`; return; }
      throw new Error(j.message || 'invalid response');
    } else if(provider==='finnhub'){
      url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apikey}`;
      const res = await fetch(url);
      const j = await res.json();
      if(j.c!==undefined){ livePriceEl.textContent = `${symbol} → ${j.c}`; return; }
      throw new Error('invalid response');
    } else {
      // custom template: expects {symbol} and {apikey}
      url = custom.replace(/{symbol}/g, symbol).replace(/{apikey}/g, apikey);
      const res = await fetch(url);
      const j = await res.json();
      // try common fields
      const possible = j.price || j.c || j.data?.price || j[0]?.price || j[0]?.p;
      if(possible!==undefined) { livePriceEl.textContent = `${symbol} → ${possible}`; return; }
      livePriceEl.textContent = JSON.stringify(j).slice(0,200);
    }
  } catch (err){
    livePriceEl.textContent = 'Error: ' + (err.message || err);
  }
}
