const assert=require('node:assert/strict');
const {solveClassical}=require('../src/semantics.js');
const E=require('../src/engine.js');
const A=(...items)=>({lines:[],items}),C=(pred,kind,v)=>({t:'claim',pred,fill:[{kind,v}]}),N=area=>({t:'enc',area});
const T=()=>C('IsTrue','sent','S'),snow=()=>C('Falling','name','Snow');
const text=area=>[{name:'S',area}];
const W={Falling:new Set(),Happy:new Set(['Snow'])};
const verdict=(area,world=W)=>{const r=solveClassical(text(area),world);assert.equal(r.status,'complete');return r.verdicts.S;};
assert.equal(verdict(A(T())),'either');
assert.equal(verdict(A(N(A(T())))),'no-model');
for(const negated of [false,true])for(const falling of [false,true]){
 const ref=negated?N(A(T())):T(),world={...W,Falling:new Set(falling?['Snow']:[])};
 const expected=!falling?'false':negated?'no-model':'either';
 assert.equal(verdict(A(ref,snow()),world),expected);
 assert.equal(verdict(A(snow(),ref),world),expected);
}
const exists={lines:[{id:'x',sort:'thing'}],items:[C('Happy','var','x')]};
assert.equal(verdict(exists),'true');
assert.equal(verdict(exists,{...W,Happy:new Set()}),'false');
assert.equal(verdict(A(N({lines:[{id:'x',sort:'thing'}],items:[N(A(C('Happy','var','x')))]}))), 'false');
assert.equal(verdict(A(N({lines:[{id:'x',sort:'thing'}],items:[N(A(C('Happy','var','x')))]})),{...W,Happy:new Set(E.THINGS)}), 'true');
for(const [input,world,options,status] of [
 [text(A(T())),W,{maxAssignments:1},'limit'],
 [text(A(T())),W,{maxWork:1},'limit'],
 [text(A(C('Provable','sent','S'))),W,{},'unsupported'],
 [text(A(C('IsTrue','sent','missing'))),W,{},'unsupported'],
 [text(A(C('Happy','var','x'))),W,{},'unsupported'],
 [text(A(snow())),{}, {},'unsupported'],
 [text(A(snow())),W,{domain:[]},'unsupported']
]){const r=solveClassical(input,world,options);assert.equal(r.status,status);assert.equal(r.verdicts,undefined);}
// Compare the new evaluator to both existing interpretations on generated inputs.
const R=E.rng(76123);let comparisons=0;
for(let i=0;i<100;i++){
 const t=E.genText(R,1+Math.floor(R()*3)),world=E.randWorld(R,t.map(d=>d.name));
 const result=solveClassical(t,world,{maxWork:10000000});assert.equal(result.status,'complete');
 const reversed=JSON.parse(JSON.stringify(t));
 const reverse=area=>{area.items.reverse();area.items.filter(i=>i.t==='enc').forEach(i=>reverse(i.area));};
 reversed.forEach(d=>reverse(d.area));
 assert.deepEqual(solveClassical(reversed,world,{maxWork:10000000}).verdicts,result.verdicts);
 const diagram=E.readBack(E.layout(t));
 for(const row of result.candidates){const candidateWorld={...world,IsTrue:new Set(t.filter(d=>row.assignment[d.name]).map(d=>d.name))};
  for(let j=0;j<t.length;j++){
   assert.equal(row.values[t[j].name],E.evalFormula(t[j].area,candidateWorld,{}));
   assert.equal(row.values[t[j].name],E.evalDiagram(diagram[j].area,candidateWorld,{}));comparisons++;
  }
 }
}
console.log('classical semantics: examples, quantifiers, limits and',comparisons,'independent comparisons passed');
