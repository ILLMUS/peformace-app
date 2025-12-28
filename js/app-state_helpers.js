/* ============================
   App state & helpers
   ============================ */

function save(){
   localStorage.setItem(LS_KEY, JSON.stringify(trades)); render(); }



const pairFactor = { US100:0.1, US500:1, XAUUSD:0.1, BTCUSD:0.05, EURUSD:0.1 }; // per 0.01 lot => $1/pt for indices (our convention)