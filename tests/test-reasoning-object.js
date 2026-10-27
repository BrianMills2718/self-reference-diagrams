'use strict';
const assert=require('node:assert/strict');
const R=require('../src/reasoning-object');
const o=R.snow(), copy=x=>JSON.parse(JSON.stringify(x));
const variables=o.variables.map(v=>v.id);
// Independent Boolean oracle: no production constraint tables or propagator.
const universe=Array.from({length:2**variables.length},(_,k)=>
  Object.fromEntries(variables.map((v,i)=>[v,Boolean(k&(1<<i))])));
const models=universe.filter(a=>a.snow===a.p && a.reference===a.S &&
  a.negative===!a.reference && a.body===(a.snow&&a.negative) && a.S===a.body);
assert.equal(models.length,1);
assert.deepEqual(R.solve(o),models);
let checked=0,steps=0;
for(let k=0;k<3**variables.length;k++) {
  let n=k; const assumptions=[];
  variables.forEach(variable=>{const v=n%3;n=Math.floor(n/3);if(v)assumptions.push({variable,value:v===2});});
  const context={id:'context-'+k,assumptions}, trace=R.explore(o,context);
  assert.equal(R.verify(o,trace),true); steps+=trace.records.length;
  const expected=models.filter(a=>assumptions.every(h=>a[h.variable]===h.value));
  assert.deepEqual(R.solve(o,context),expected);
  if(trace.status==='conflict') assert.equal(expected.length,0);
  for(const r of trace.records.filter(r=>r.kind==='inference')) {
    const c=o.constraints.find(c=>c.id===r.constraint);
    const premises=r.premises.map(id=>trace.records.find(p=>p.id===id));
    const local=universe.filter(a=>{
      const x=c.vars.map(v=>a[v]);
      const holds=c.rule==='equal'?x[0]===x[1]:c.rule==='not'?x[1]===!x[0]:x[2]===(x[0]&&x[1]);
      return holds&&premises.every(p=>a[p.variable]===p.value);
    });
    assert.ok(local.length); assert.ok(local.every(a=>a[r.variable]===r.value));
  }
  for(const visible of [[],['p'],['S'],['p','S'],variables]) {
    const p=R.project(o,context,visible);
    assert.deepEqual(p.groups.flatMap(g=>g.witnesses),expected);
    p.groups.forEach(g=>g.witnesses.forEach(w=>visible.forEach(v=>assert.equal(g.values[v],w[v]))));
  }
  checked++;
}
// All four full world/candidate choices have the expected consistency verdict.
for(const p of [false,true])for(const S of [false,true]){
 const c={id:'pair',assumptions:[{variable:'p',value:p},{variable:'S',value:S}]};
 assert.equal(R.solve(o,c).length,(!p&&!S)?1:0);
}
const trace=R.explore(o,{id:'false',assumptions:[{variable:'S',value:false}]});
assert.equal(trace.status,'complete-assignment');
assert.ok(trace.records.some(r=>r.variable==='p'&&r.value===false&&r.kind==='inference'));
assert.equal(R.explore(o,{id:'true',assumptions:[{variable:'S',value:true}]}).status,'conflict');
assert.equal(R.explore(o,{id:'root',assumptions:[]}).status,'open');
let rejected=0;
function rejects(f){assert.throws(f);rejected++;}
for(const change of [
 t=>{t.records[1].value=!t.records[1].value;},
 t=>{t.records[1].premises=['future'];},
 t=>{t.records[1].context='sibling';},
 t=>{t.records[1].constraint='missing';},
 t=>{t.records[0].value=true;},
 t=>{t.records[1].id=t.records[0].id;},
 t=>{t.status='conflict';},
 t=>{t.records[1].premises=[];},
 t=>{t.records.push(copy(t.records[1]));}
]) {const t=copy(trace);change(t);rejects(()=>R.verify(o,t));}
const allBad={id:'bad',assumptions:variables.map(variable=>({variable,value:true}))};
rejects(()=>R.verify(o,{context:allBad,status:'complete-assignment',records:allBad.assumptions.map((a,i)=>({id:'s'+i,context:'bad',kind:'assumption',...a}))}));
for(const change of [s=>{s.sentences[0].body.op='xor';},s=>{s.sentences[0].body.left.target='S';},s=>{s.sentences[0].body.right.arg.target='p';},s=>{s.sentences[0].body.left.id='S';}]){
 const source=copy(o.syntax);change(source);rejects(()=>R.compile(source));
}
rejects(()=>R.explore(o,{id:'bad',assumptions:[{variable:'ghost',value:true}]}));
rejects(()=>R.project(o,{id:'x',assumptions:[]},['p','p']));
const independent=R.compile({version:1,facts:[],sentences:[{id:'S',body:{id:'r',op:'reference',target:'S'}}]});
assert.equal(R.solve(independent).length,2);
const pair=R.compile({version:1,facts:[],sentences:[
 {id:'A',body:{id:'na',op:'not',arg:{id:'ra',op:'reference',target:'B'}}},
 {id:'B',body:{id:'nb',op:'not',arg:{id:'rb',op:'reference',target:'A'}}}
]});
const projected=R.project(pair,{id:'root',assumptions:[]},['A','B']);
assert.equal(projected.groups.length,2);
assert.ok(projected.groups.every(g=>g.values.A!==g.values.B));
const hidden=R.compile({version:1,facts:[{id:'p'}],sentences:[
 {id:'L',body:{id:'n',op:'not',arg:{id:'r',op:'reference',target:'L'}}},
 {id:'Q',body:{id:'f',op:'fact',target:'p'}}
]});
assert.deepEqual(R.project(hidden,{id:'root',assumptions:[]},['p','Q']).groups,[]);
console.log(`reasoning object: ${checked} contexts, ${steps} records, ${rejected} rejected mutations; correlation and hidden-conflict projections pass`);
