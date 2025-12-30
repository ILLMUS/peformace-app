/* ===== GLOBAL STATE (TOP OF FILE) ===== */
let hasMerged = false;
const LS_KEY = 'pt_pro_trades_v1';
let trades = JSON.parse(localStorage.getItem(LS_KEY) || '[]');