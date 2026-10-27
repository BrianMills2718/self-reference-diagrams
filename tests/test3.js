const assert=require('node:assert/strict');
const E=require('./combined.js');const {genText,printText,graphLayout,graphReadBack,valueLayers,pureLoop,hasConsistentValue,evaluate,rng}=E;
const R=rng(4242);let ok=0,N=400;const fails=[];
for(let i=0;i<N;i++){const t=genText(R,1+Math.floor(R()*3));const f=printText(t);let b;try{b=printText(graphReadBack(graphLayout(t)));}catch(e){b='ERR '+e.rule+' '+e.message;}if(b===f)ok++;else fails.push([f,b]);}
console.log('graph form round trip',ok,'/',N);fails.slice(0,3).forEach(x=>console.log(' F',x[0],'\n B',x[1]));
// broken graph pictures
let tr={G1:[0,0],G2:[0,0]};for(let i=0;i<200;i++){const t=genText(R,2);const G=graphLayout(t);
 const g1=JSON.parse(JSON.stringify(G));g1.edges[0].to=[-500,-500];tr.G1[0]++;try{graphReadBack(g1);}catch(e){if(e.rule==='G1')tr.G1[1]++;}
 const g2=JSON.parse(JSON.stringify(G));const e0=g2.edges.find(e=>e.kind==='says'||e.kind==='inside');if(e0){const other=g2.nodes.find(n=>n.kind==='sent'&&!(Math.abs(n.x+n.w-e0.from[0])<2&&Math.abs(n.y+n.h/2-e0.from[1])<2));if(other){g2.edges.push({kind:'says',from:[other.x+other.w,other.y+other.h/2],to:e0.to});tr.G2[0]++;try{graphReadBack(g2);}catch(e){if(e.rule==='G2')tr.G2[1]++;}}}}
console.log('broken graph pictures caught',tr);
// value layers: one curve exactly when there is no consistent value
let agree=0,M=0,lapOK=0,lapN=0;const W0={Falling:new Set(),Blowing:new Set(),Happy:new Set(),Loves:new Set(),Man:new Set(),Mortal:new Set(),IsTrue:new Set()};
for(let i=0;i<500;i++){const n=1+Math.floor(R()*5);const t=pureLoop(R,n);const curves=valueLayers(t);const one=curves.length===1;const cons=hasConsistentValue(t);M++;if(one===!cons)agree++;
 const r=evaluate(t,t[0].name,W0,200);const unfolds=r.steps.filter(s=>s.rule.startsWith('unfold')).length;const curveLen=curves.find(c=>c.some(x=>x[0]===t[0].name))?.length;lapN++;if(!r.halts&&r.cycleFrom===0&&unfolds===curveLen)lapOK++;}
console.log('pure loops: one curve exactly when no consistent value',agree,'/',M);
console.log('looping derivation: unfold steps per lap = length of the curve',lapOK,'/',lapN);


assert.equal(ok,N,'graph round trips');
for(const [rule,[tried,caught]] of Object.entries(tr)){assert.ok(tried>0,rule+' exercised');assert.equal(caught,tried,rule+' rejection');}
assert.equal(agree,M,'pure-loop criterion');
assert.equal(lapOK,lapN,'derivation lap lengths');
