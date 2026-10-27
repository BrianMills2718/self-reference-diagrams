const assert=require('node:assert/strict');
const E=require('../src/engine.js'),G=require('./combined.js');
const {teaching,cycle,truthTellers,branching,quantifiers,disconnected}=require('../examples/catalog.js');
let candidates=0,roundTrips=0,worlds=0;
const emptyWorld=()=>Object.fromEntries(Object.keys(E.PREDS).map(p=>[p,new Set()]));
const assignment=(names,mask)=>Object.fromEntries(names.map((n,i)=>[n,Math.floor(mask/2**i)%2===1]));
const key=a=>JSON.stringify(Object.entries(a).sort(([a],[b])=>a.localeCompare(b)));
const keys=xs=>xs.map(key).sort();
function roundTrip(text){const expected=E.printText(text);assert.equal(E.printText(E.readBack(E.layout(text))),expected);assert.equal(E.printText(G.graphReadBack(G.graphLayout(text))),expected);roundTrips+=2;}
// Test oracle over the declared finite fragment, not a production large-model solver.
function enumerate(text,world){
 const count=2**text.length;assert.ok(Number.isSafeInteger(count)&&count<=4096,'fixture exceeds exhaustive test budget');
 const names=text.map(d=>d.name),models=[],rows=[];worlds++;
 for(let m=0;m<count;m++){
  const assumed=assignment(names,m),W={...world,IsTrue:new Set(names.filter(n=>assumed[n]))};
  const evaluated=Object.fromEntries(text.map(d=>[d.name,E.evalFormula(d.area,W,{})]));
  const consistent=names.every(n=>assumed[n]===evaluated[n]);
  rows.push({assumed,evaluated,consistent});if(consistent)models.push(assumed);candidates++;
 }
 return {models,rows};
}
function worldFor(atoms,values){const W=emptyWorld();for(const a of atoms)if(values[a.id])W[a.pred].add(a.args.join('|'));return W;}
const objects=[];
for(const fixture of teaching){
 roundTrip(fixture.text);assert.equal(fixture.expected.length,2**fixture.atoms.length,fixture.id+' covers all worlds');
 assert.equal(new Set(fixture.expected.map(r=>key(r.world))).size,fixture.expected.length,'distinct worlds');
 for(const expected of fixture.expected){
  assert.deepEqual(Object.keys(expected.world).sort(),fixture.atoms.map(a=>a.id).sort());
  const observed=enumerate(fixture.text,worldFor(fixture.atoms,expected.world));
  assert.deepEqual(keys(observed.models),keys(expected.models),fixture.id+' '+key(expected.world));
  if(fixture.id==='E05')for(const r of observed.rows)objects.push(Object.freeze({p:expected.world.p,s:r.assumed.S,out:r.evaluated.S,consistent:r.consistent}));
 }
}
// Exhaustive parity families, including zero, one and two negative edges.
for(let n=1;n<=10;n++)for(const negative of [[],[0],...(n>1?[[0,n-1]]:[])]){
 const text=cycle(n,negative);roundTrip(text);
 const {models}=enumerate(text,emptyWorld());assert.equal(models.length,negative.length%2?0:2);
 for(const model of models)for(let i=0;i<n;i++)assert.equal(model['S'+i],negative.includes(i)?!model['S'+((i+1)%n)]:model['S'+((i+1)%n)]);
}
for(let n=1;n<=12;n++){const text=truthTellers(n);roundTrip(text);assert.equal(enumerate(text,emptyWorld()).models.length,2**n);}
for(let n=1;n<=3;n++){
 const fixture=branching(E.THINGS.slice(0,n));roundTrip(fixture.text);
 for(let m=0;m<2**n;m++){
  const w=assignment(fixture.atoms.map(a=>a.id),m),expected=m===0?[Object.fromEntries(Array.from({length:n},(_,i)=>[['A'+i,true],['B'+i,true],['C'+i,false]]).flat())]:[];
  assert.deepEqual(keys(enumerate(fixture.text,worldFor(fixture.atoms,w)).models),keys(expected),'branching '+n+' world '+m);
 }
}
roundTrip(quantifiers);
for(const [edges,expected] of [
 [[],{EachSome:false,SomeAll:false}],
 [E.THINGS.map(x=>x+'|'+x),{EachSome:true,SomeAll:false}],
 [E.THINGS.map(x=>x+'|Snow'),{EachSome:true,SomeAll:true}]
]){const W=emptyWorld();W.Loves=new Set(edges);assert.deepEqual(enumerate(quantifiers,W).models,[expected]);}
roundTrip(disconnected);
for(const falling of [false,true]){
 const W=emptyWorld();if(falling)W.Falling.add('Snow');const r=enumerate(disconnected,W);
 assert.equal(r.models.length,0);assert.ok(r.rows.every(row=>row.evaluated.Q===falling),'local Q remains evaluable despite no global model');
}
// Larger structural checks; deliberately no exhaustive semantic claim at these sizes.
for(const text of [cycle(128,[0]),truthTellers(64),branching(E.THINGS).text])roundTrip(text);
assert.throws(()=>enumerate(truthTellers(64),emptyWorld()),/budget/);
// The E05 object: filtering restricts cases; projection hides columns but retains witnesses.
const before=JSON.stringify(objects);assert.equal(objects.length,4);
const filter=(rows,predicate)=>rows.filter(predicate);
const project=(rows,columns)=>{
 const groups=new Map();for(const row of rows){const visible=Object.fromEntries(columns.map(c=>[c,row[c]])),k=key(visible);if(!groups.has(k))groups.set(k,{visible,witnesses:[]});groups.get(k).witnesses.push(row);}
 return [...groups.values()];
};
assert.equal(filter(objects,r=>r.p).length,2);assert.equal(filter(objects,r=>!r.s).length,2);
assert.deepEqual(filter(objects,r=>r.consistent).map(r=>[r.p,r.s]),[[false,false]]);
const grouped=project(objects,['s']);assert.equal(grouped.length,2);assert.ok(grouped.every(g=>g.witnesses.length===2));
assert.deepEqual(keys(grouped.flatMap(g=>g.witnesses)),keys(objects),'expand restores every case');
const falseGroup=grouped.find(g=>!g.visible.s);
assert.ok(falseGroup.witnesses.some(r=>r.consistent));assert.ok(!falseGroup.witnesses.every(r=>r.consistent),'some compatible world does not mean all worlds');
assert.deepEqual(project(filter(objects,r=>r.consistent),['s']).map(g=>g.visible),[{s:false}]);
assert.equal(JSON.stringify(objects),before,'views do not mutate the underlying rows');
// Hiding coordinates cannot turn correlated alternatives into a Cartesian product.
const mutual=teaching.find(f=>f.id==='E06b').expected[0].models;
assert.equal(project(mutual,['A']).length,2);assert.equal(project(mutual,['B']).length,2);
assert.equal(project(mutual,['A','B']).length,2);assert.ok(mutual.every(m=>m.A!==m.B));
// Hiding an inconsistent component is different from removing its constraint.
assert.deepEqual(project([],['Q']),[]);
for(const falling of [false,true]){const W=emptyWorld();if(falling)W.Falling.add('Snow');assert.deepEqual(enumerate([disconnected[1]],W).models,[{Q:falling}]);}
console.log(`example suite: ${teaching.length} named fixtures; ${worlds} world checks; ${candidates} candidate checks; ${roundTrips} layout round trips; E05 view contracts passed`);
console.log('large fixtures: 128-node cycle, 64 independent truth-tellers, 5 branching blocks checked structurally only');
