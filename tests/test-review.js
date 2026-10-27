// Lightweight DOM smoke test: exercises the standalone page's scripts and controls.
// This does not test browser layout, accessibility, or pointer hit areas.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const path=require('node:path');
class Element{
 constructor(tag='div',dataset={}){this.tag=tag;this.dataset=dataset;this.children=[];this.attrs={};this.textContent='';this.hidden=false;}
 setAttribute(k,v){this.attrs[k]=String(v);}
 appendChild(child){this.children.push(child);return child;}
 replaceChildren(...children){this.children=children;}
}
const html=fs.readFileSync(path.join(__dirname,'../tutorial-review.html'),'utf8');
const ids=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element()]));
const lessons=[0,1,2].map(n=>new Element('button',{lesson:String(n)}));
const answers=['no-model','either','false'].map(answer=>new Element('button',{answer}));
const document={getElementById:id=>{assert.ok(ids[id],'known element '+id);return ids[id];},createElementNS:(_,tag)=>new Element(tag),querySelectorAll:selector=>selector==='[data-lesson]'?lessons:selector==='[data-answer]'?answers:[]};
const context=vm.createContext({document,console});
for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],context);
function answer(value,title){answers.find(b=>b.dataset.answer===value).onclick();assert.equal(ids.verdict.textContent,title);assert.match(ids.feedback.textContent,/agrees with both/);assert.equal(ids.explanation.hidden,false);}
assert.equal(ids.drawing.children[0].tag,'svg');assert.equal(ids.layers.children[0].tag,'svg');
answer('no-model','No consistent value.');
lessons[1].onclick();answer('either','Either value is consistent.');
lessons[2].onclick();assert.equal(ids.world.hidden,false);answer('no-model','No consistent value.');
ids.clear.onclick();answer('false','False is the only consistent value.');
ids.order.onclick();answer('false','False is the only consistent value.');
assert.match(ids.sentence.textContent,/not true, and snow/);
ids.snow.onclick();answer('no-model','No consistent value.');
assert.equal(ids.snow.attrs['aria-pressed'],'true');assert.equal(ids.clear.attrs['aria-pressed'],'false');
answers.find(b=>b.dataset.answer==='false').onclick();assert.match(ids.feedback.textContent,/Compare/);
assert.match(ids.formula.textContent,/IsTrue/);
console.log('standalone review: all lessons, candidate answers, snow toggle and order toggle passed (DOM smoke test only)');
