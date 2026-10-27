// ===== value layers for texts whose sentences are "and"s of (not)^k IsTrue(...) claims =====
// literal = {to, val}: "the sentence `to` has value `val`"
function literalsOf(area){let a=area,k=0;const out=[];const walk=(a,k)=>{a.items.forEach(it=>{if(it.t==='enc'){walk(it.area,k+1);}else out.push({to:it.fill[0].v,neg:k%2===1});});};
 // only conjunctions of (not)^k IsTrue(..), where each "not" encloses exactly one item
 const ok=(a)=>a.lines.length===0&&a.items.every(it=>it.t==='claim'?it.pred==='IsTrue':(it.area.items.length===1&&ok(it.area)));if(!ok(area))return null;walk(area,0);return out;}
function implication(text){const names=text.map(d=>d.name);const L=Object.fromEntries(text.map(d=>[d.name,literalsOf(d.area)]));if(names.some(n=>!L[n]))return null;
 // supposing S true: every literal must hold ("both"); supposing S false: at least one must fail ("one of")
 const out={};names.forEach(n=>{const ls=L[n];out[n+'T']={kind:ls.length>1?'both':'one',to:ls.map(l=>l.to+(l.neg?'F':'T'))};out[n+'F']={kind:ls.length>1?'oneof':'one',to:ls.map(l=>l.to+(l.neg?'T':'F'))};});
 return {names,out,pure:names.every(n=>L[n].length===1)};}
function fixedPoints(text){const n=text.length,names=text.map(d=>d.name),fps=[];
 for(let m=0;m<(1<<n);m++){const W={Falling:new Set(),Blowing:new Set(),Happy:new Set(),Loves:new Set(),Man:new Set(),Mortal:new Set(),IsTrue:new Set(names.filter((_,i)=>m>>i&1))};
  if(text.every((d,i)=>evalFormula(d.area,W,{})===!!(m>>i&1)))fps.push(Object.fromEntries(names.map((nm,i)=>[nm,!!(m>>i&1)])));}return fps;}
if(typeof module!=='undefined')module.exports={implication,fixedPoints,literalsOf};
