// Lightweight DOM interaction checks; not a substitute for browser layout QA.
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const rootPath=path.resolve(__dirname,'..');
const fragment=fs.readFileSync(path.join(rootPath,'review/snow-schematic.fragment.html'),'utf8')
 .replace('/* REASONING_KERNEL */',fs.readFileSync(path.join(rootPath,'src/reasoning-object.js'),'utf8'));
function mount(width){
 const ids=[...fragment.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
 const els=Object.fromEntries(ids.map(id=>[id,{style:{},events:{},addEventListener(k,f){this.events[k]=f;}}]));
 els['snow-assumption'].value='SF';els['snow-view'].value='network';
 const root=els['snow-reasoning-review'];root.querySelector=s=>{assert.ok(els[s.slice(1)]);return els[s.slice(1)];};root.getBoundingClientRect=()=>({width});
 const context=vm.createContext({document:{getElementById:id=>els[id]},ResizeObserver:class{observe(){}}});
 for(const m of fragment.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],context);
 return els;
}
for(const width of [320,736]){
 const els=mount(width);
 for(const value of ['SF','ST','pF','pT','none','FF','FT','TF','TT']){
  els['snow-assumption'].value=value;els['snow-assumption'].events.change();
  const start=els['snow-drawing'].innerHTML;
  els['snow-end'].events.click();
  assert.match(els['snow-drawing'].innerHTML,/data-variable="p"/);
  assert.match(els['snow-drawing'].innerHTML,/data-variable="S"/);
  if(['SF','pF','FF'].includes(value))assert.match(els['snow-drawing'].innerHTML,/Consistent ·/);
  if(['ST','FT','TF','TT'].includes(value))assert.match(els['snow-drawing'].innerHTML,/CONFLICT/);
  if(['pT','none'].includes(value))assert.match(els['snow-drawing'].innerHTML,/Locally open/);
  els['snow-view'].value='step';els['snow-view'].events.change();
  assert.match(els['snow-drawing'].innerHTML,/faint/);
  els['snow-view'].value='worlds';els['snow-view'].events.change();
  const expected=['SF','pF','FF','none'].includes(value)?1:0;
  assert.equal((els['snow-drawing'].innerHTML.match(/Admitted/g)||[]).length,expected);
  assert.match(els['snow-drawing'].innerHTML,/All sentence constraints retained/);
  els['snow-view'].value='network';els['snow-view'].events.change();
  while(!els['snow-back'].disabled)els['snow-back'].events.click();
  assert.equal(els['snow-drawing'].innerHTML,start);
 }
}
console.log('snow review: 9 contexts × 3 views at 320/736px; rewind and exact query checks pass (DOM harness)');
module.exports={mount,fragment};
