const E=require('../src/engine.js');const R=E.rng(999);
let stats={lines:0,depth2:0,self:0,multi:0,loves:0};const N=400;
const depth=a=>Math.max(0,...a.items.map(it=>it.t==='enc'?1+depth(it.area):0));
const hasLines=a=>a.lines.length>0||a.items.some(it=>it.t==='enc'&&hasLines(it.area));
const claims=a=>a.items.flatMap(it=>it.t==='claim'?[it]:claims(it.area));
for(let i=0;i<N;i++){const t=E.genText(R,1+Math.floor(R()*3));t.forEach(d=>{if(hasLines(d.area))stats.lines++;if(depth(d.area)>=2)stats.depth2++;const cs=claims(d.area);if(cs.some(c=>c.pred==='IsTrue'&&c.fill[0].v===d.name))stats.self++;if(cs.some(c=>c.pred==='Loves'))stats.loves++;});if(t.length>1)stats.multi++;}
console.log('coverage over',N,'texts:',stats);
// bad pictures: break each rule on purpose and check it is caught, and named
const tests={D1:0,D3:0,D4:0,D5:0};const caught={D1:0,D3:0,D4:0,D5:0};
for(let i=0;i<300;i++){const t=E.genText(R,2);const sh=E.layout(t);
 const tryRule=(rule,mut)=>{const s=JSON.parse(JSON.stringify(sh));if(!mut(s))return;tests[rule]++;try{E.readBack(s);}catch(e){if(e.rule===rule)caught[rule]++;else console.log('wrong rule',rule,'->',e.rule,e.message);return;}console.log('NOT CAUGHT',rule);};
 tryRule('D1',s=>{const e=s.encs[0];if(!e)return false;const b=s.boxes.find(b=>e.x>=b.x&&e.x<=b.x+b.w);e.x=b.x+b.w-10;return true;});
 tryRule('D3',s=>{const a=s.roleArrows[0]||s.refArrows[0];if(!a)return false;a.to=[-5000,-5000];return true;});
 tryRule('D4',s=>{const l=s.lines[0];if(!l)return false;l.attach[0].at=[l.attach[0].at[0]-9,l.attach[0].at[1]];return true;});
 tryRule('D5',s=>{const e=s.encs[0];if(!e)return false;s.boxes.push({name:'Sx',x:e.x+2,y:e.y+2,w:8,h:8});return true;});}
console.log('bad pictures tried',tests,'caught with the right rule',caught);
// termination on the tutorial's examples
const A=(...items)=>({lines:[],items}),C=(p,...f)=>({t:'claim',pred:p,fill:f}),N_=a=>({t:'enc',area:a}),nm=v=>({kind:'name',v}),st=v=>({kind:'sent',v});
const EX={snow:[{name:'S',area:A(C('Falling',nm('Snow')))}],truth:[{name:'S',area:A(C('IsTrue',st('S')))}],liar:[{name:'S',area:A(N_(A(C('IsTrue',st('S')))))}],
 ab:[{name:'A',area:A(N_(A(C('IsTrue',st('B')))))},{name:'B',area:A(C('IsTrue',st('A')))}],
 about:[{name:'S1',area:A(C('Falling',nm('Snow')))},{name:'S2',area:A(C('IsTrue',st('S1')))}],
 mixed:[{name:'S',area:A(C('Falling',nm('Snow')),N_(A(C('IsTrue',st('S')))))}]};
const W1={Falling:new Set(['Snow']),Blowing:new Set(),Happy:new Set(),Loves:new Set(),IsTrue:new Set()},W2={...W1,Falling:new Set()};
for(const [k,t] of Object.entries(EX))for(const [wn,W] of [['snow',W1],['no snow',W2]])t.forEach(d=>{const r=E.evaluate(t,d.name,W,40);console.log(k.padEnd(6),wn.padEnd(8),d.name.padEnd(3),r.halts?'halts: '+r.result:'never halts'+(r.cycleFrom!==undefined?' (cycle back to step '+r.cycleFrom+')':' '+r.why),'| steps:',r.steps.slice(0,8).map(s=>s.rule).join(' > '));});
// each derivation step reads back
let stepOK=0,stepN=0;for(const [k,t] of Object.entries(EX))t.forEach(d=>{const r=E.evaluate(t,d.name,W1,40);r.steps.forEach(s=>{if(!s.area)return;stepN++;const tt=t.map(x=>x.name===d.name?{name:x.name,area:s.area}:x);try{if(E.printText(E.readBack(E.layout(tt)))===E.printText(tt))stepOK++;}catch(e){console.log('step fail',e.message);}});});
console.log('derivation steps that read back exactly',stepOK,'/',stepN);
