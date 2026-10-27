const assert=require('node:assert/strict');
const E=require('../src/engine.js');
const R=E.rng(12345);let ok=0,fail=0,wf=0,sem=0,semBad=0;const N=400;const fails=[];
for(let i=0;i<N;i++){const t=E.genText(R,1+Math.floor(R()*3));const f=E.printText(t);let back;
 try{back=E.printText(E.readBack(E.layout(t)));}catch(e){fail++;fails.push([f,'ERR '+e.rule+' '+e.message]);continue;}
 if(back===f)ok++;else{fail++;fails.push([f,back]);}
 const rb=E.readBack(E.layout(t));for(let w=0;w<20;w++){const W=E.randWorld(R,t.map(d=>d.name));t.forEach((d,j)=>{const a=E.evalFormula(d.area,W,{}),b=E.evalDiagram(rb[j].area,W,{});if(a===b)sem++;else semBad++;});}}
console.log('round trip',ok,'/',N,'fail',fail);fails.slice(0,5).forEach(x=>console.log(' F:',x[0],'\n B:',x[1]));
console.log('semantics agree',sem,'disagree',semBad);


assert.equal(ok,N,'Peirce round trips');
assert.equal(fail,0,'Peirce round-trip failures');
assert.equal(semBad,0,'semantic disagreements');
assert.ok(sem>0,'semantic comparisons ran');
