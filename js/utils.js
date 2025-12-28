
/* ============================
   Utilities
   ============================ */

function perPointValue(pair, lots){
  // per point value assuming 0.01 lot => $1 for indices
  const factor = pairFactor[pair] || 1;
  return (lots * 100) * factor; // e.g. 0.05 -> 5 * factor
}

function calcResultFromPoints(pair, lots, points){
  return +(points * perPointValue(pair, lots)).toFixed(2);
}
