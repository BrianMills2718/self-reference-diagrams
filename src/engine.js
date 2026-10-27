// ===== vocabulary =====
const SORTS=['thing','sentence'];
const PREDS={Man:[['thing that is a man','thing']],Mortal:[['mortal thing','thing']],Falling:[['thing that falls','thing']],Blowing:[['thing that blows','thing']],Happy:[['happy one','thing']],Loves:[['lover','thing'],['loved','thing']],IsTrue:[['bearer','sentence']]};
const THINGS=['Snow','Wind','Romeo','Juliet','Socrates'];
const VARN=['x','y','z','u','v','w','p','q'];
// ===== seeded random =====
function rng(seed){let s=seed>>>0||1;return ()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
// ===== generator: texts in area normal form =====
// area = {lines:[{id,sort}], items:[item]} ; item = {t:'claim',pred,fill:[{kind:'name'|'sent'|'var',v}]} | {t:'enc',area}
function genText(R,nSent){const names=Array.from({length:nSent},(_,i)=>'S'+(i+1));let lid=0;
 function genArea(depth,scope){const area={lines:[],items:[]};const nl=depth>0&&R()<0.4?1+(R()<0.25?1:0):0;
  for(let i=0;i<nl;i++)area.lines.push({id:lid++,sort:'thing'});
  const sc=scope.concat(area.lines);const n=1+Math.floor(R()*(depth>1?3:2));
  for(let i=0;i<n;i++){if(depth>0&&R()<0.35)area.items.push({t:'enc',area:genArea(depth-1,sc)});else area.items.push(genClaim(sc));}
  area.lines.forEach(l=>{if(!uses(area,l.id)){const p=R()<0.5?'Happy':'Falling';area.items.push({t:'claim',pred:p,fill:[{kind:'var',v:l.id}]});}});
  return area;}
 function genClaim(sc){const ps=Object.keys(PREDS);
  return genClaimP(ps.filter(q=>q!=='Man'&&q!=='Mortal'),sc);}
 function genClaimP(ps0,sc){const pred=ps0[Math.floor(R()*ps0.length)];
  return {t:'claim',pred,fill:PREDS[pred].map(([r,s])=>{if(s==='sentence')return {kind:'sent',v:names[Math.floor(R()*names.length)]};const vs=sc.filter(l=>l.sort==='thing');if(vs.length&&R()<0.55)return {kind:'var',v:vs[Math.floor(R()*vs.length)].id};return {kind:'name',v:THINGS.slice(0,4)[Math.floor(R()*4)]};})};}
 return names.map(n=>({name:n,area:genArea(2,[])}));}
function uses(area,id){return area.items.some(it=>it.t==='claim'?it.fill.some(f=>f.kind==='var'&&f.v===id):uses(it.area,id));}
// ===== printing a text (canonical variable names by preorder of introduction) =====
function printText(text){let k=0;return text.map(d=>{const vm={};const pa=area=>{area.lines.forEach(l=>{vm[l.id]=VARN[k++]||('v'+k);});
  const body=area.items.length===0?'⊤':area.items.map(it=>it.t==='claim'?`${it.pred}(${PREDS[it.pred].map(([r],i)=>`${r}: ${it.fill[i].kind==='var'?vm[it.fill[i].v]:it.fill[i].v}`).join(', ')})`:`¬(${pa(it.area)})`).join(' ∧ ');
  return area.lines.length?area.lines.map(l=>'∃'+vm[l.id]).join(' ')+` (${body})`:body;};k=0;return `${d.name} := ${pa(d.area)}`;}).join('\n');}
// ===== layout: abstract diagram -> picture (shapes with positions), following rules D1-D6 =====
function layout(text){const shapes={boxes:[],encs:[],caps:[],things:[],roleArrows:[],refArrows:[],lines:[],dividers:[]};let cid=0;
 const PAD=14,GAP=12,TRUNK=14;
 function capW(p){return Math.max(70,p.length*8+22);}
 function measureItem(it){if(it.t==='claim'){const nn=it.fill.filter(f=>f.kind==='name').length;const tw=Math.max(0,...it.fill.filter(f=>f.kind==='name').map(f=>f.v.length*8+20));
   const hasRef=it.fill.some(f=>f.kind==='sent');return {w:capW(it.pred)+(nn?70+tw:0)+(hasRef?90:0),h:Math.max(28,nn*32)};}
  const m=measureArea(it.area);return {w:m.w+2*PAD,h:m.h+2*PAD+12};}
 function measureArea(area){const g=area.lines.length*TRUNK+(area.lines.length?8:0);const ms=area.items.map(measureItem);
  return {w:g+Math.max(40,...ms.map(m=>m.w))+4,h:Math.max(24,ms.reduce((s,m)=>s+m.h,0)+GAP*Math.max(0,ms.length-1))};}
 const pending=[];
 function placeArea(area,x,y,w,h,scopeLines,negs,boxName){negs=negs||0;const g=area.lines.length*TRUNK+(area.lines.length?8:0);const trunks={};
  area.lines.forEach((l,i)=>{trunks[l.id]={x:x+4+i*TRUNK,y0:y,y1:y+h,branches:[]};});
  const sc=Object.assign({},scopeLines,trunks);let cy=y;
  area.items.forEach(it=>{const m=measureItem(it);
   if(it.t==='claim'){const id='c'+(cid++);const cw=capW(it.pred);const cx=x+g;const capY=cy+(m.h-28)/2;
    shapes.caps.push({id,pred:it.pred,x:cx,y:capY,w:cw,h:28});let ni=0;const vRoles=it.fill.map((f,i)=>f.kind==='var'?i:-1).filter(i=>i>=0);
    it.fill.forEach((f,i)=>{const role=PREDS[it.pred][i][0];
     if(f.kind==='name'){const tw=f.v.length*8+20;const ty=cy+ni*32;const tx=cx+cw+70;shapes.things.push({name:f.v,x:tx,y:ty+2,w:tw,h:24});shapes.roleArrows.push({cap:id,role,from:[cx+cw,capY+14],to:[tx,ty+14]});ni++;}
     else if(f.kind==='sent'){pending.push({cap:id,role,from:[cx+cw,capY+14],target:f.v,neg:negs%2===1,inBox:boxName});}
     else{const off=vRoles.length>1?(vRoles.indexOf(i)-0.5)*12:0;const ay=capY+14+off;sc[f.v].branches.push({cap:id,role,at:[cx,ay]});}});}
   else{const ex=x+g,ew=m.w,eh=m.h;shapes.encs.push({x:ex,y:cy,w:ew,h:eh});placeArea(it.area,ex+PAD,cy+PAD+12,ew-2*PAD,eh-2*PAD-12,sc,negs+1,boxName);}
   const last=it===area.items[area.items.length-1];if(!last)shapes.dividers.push({x1:x+g,x2:x+w,y:cy+m.h+GAP/2});cy+=m.h+GAP;});
  area.lines.forEach(l=>{const t=trunks[l.id];const pts=[[t.x,t.y0+4],[t.x,Math.max(t.y0+8,...t.branches.map(b=>b.at[1]))]];
   shapes.lines.push({pts:[...pts,...t.branches.flatMap(b=>[[t.x,b.at[1]],b.at])],trunk:pts,branches:t.branches.map(b=>({from:[t.x,b.at[1]],to:b.at})),attach:t.branches.map(b=>({cap:b.cap,role:b.role,at:b.at}))});});}
 let bx=10;const boxPos={};
 text.forEach(d=>{const m=measureArea(d.area);const w=m.w+2*PAD,h=m.h+2*PAD+20;boxPos[d.name]={x:bx,y:60,w,h};shapes.boxes.push({name:d.name,x:bx,y:60,w,h});placeArea(d.area,bx+PAD,60+PAD+20,m.w,m.h,{},0,d.name);bx+=w+70;});
 pending.forEach(p=>{const b=boxPos[p.target];const self=p.target===p.inBox;shapes.refArrows.push({cap:p.cap,role:p.role,from:p.from,neg:p.neg,self,target:p.target,to:self?[b.x+b.w,p.from[1]]:[b.x+b.w/2+((p.from[0]%7)-3)*4,b.y]});});
 shapes.W=bx;shapes.H=Math.max(...shapes.boxes.map(b=>b.y+b.h))+20;return shapes;}
// ===== read-back: picture -> abstract diagram, from geometry only =====
const inside=(a,b)=>a.x>=b.x-0.5&&a.y>=b.y-0.5&&a.x+a.w<=b.x+b.w+0.5&&a.y+a.h<=b.y+b.h+0.5;
const ptIn=(p,b)=>p[0]>=b.x-0.5&&p[0]<=b.x+b.w+0.5&&p[1]>=b.y-0.5&&p[1]<=b.y+b.h+0.5;
const onOutline=(p,b)=>ptIn(p,b)&&(Math.abs(p[0]-b.x)<1.5||Math.abs(p[0]-b.x-b.w)<1.5||Math.abs(p[1]-b.y)<1.5||Math.abs(p[1]-b.y-b.h)<1.5);
const disjoint=(a,b)=>a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y;
class ReadErr extends Error{constructor(rule,msg){super(msg);this.rule=rule;}}
function readBack(sh){const C=[...sh.boxes.map(b=>({...b,kind:'box'})),...sh.encs.map(e=>({...e,kind:'enc'}))];
 for(let i=0;i<C.length;i++)for(let j=i+1;j<C.length;j++){const a=C[i],b=C[j];if(!(inside(a,b)||inside(b,a)||disjoint(a,b)))throw new ReadErr('D1','two outlines cross');}
 const smallest=(r,excl)=>C.filter(c=>c!==excl&&inside(r,c)).sort((p,q)=>p.w*p.h-q.w*q.h)[0];
 C.forEach(c=>{c.parent=c.kind==='box'?null:smallest(c,c);if(c.kind==='enc'&&!c.parent)throw new ReadErr('D1','an enclosure outside every sentence box');});
 sh.boxes.forEach(b=>{if(C.some(c=>c.kind==='enc'&&inside(b,c)))throw new ReadErr('D5','a sentence box inside an enclosure');});
 const boxOf=c=>c.kind==='box'?c:boxOf(c.parent);
 const caps=sh.caps.map(k=>({...k,area:smallest(k,null)}));
 caps.forEach(k=>{if(!k.area)throw new ReadErr('D1','a claim outside every sentence box');});
 // roles
 const fill={};caps.forEach(k=>fill[k.id]={});
 // Resolve visible arrow origins, then check their stored claim identifiers.
 [...sh.roleArrows,...sh.refArrows].forEach(a=>{const origins=caps.filter(k=>onOutline(a.from,k));
  if(origins.length!==1||origins[0].id!==a.cap)throw new ReadErr('D3','a role arrow must start on its claim outline');
 });
 const filledRoles=new Set();
 const checkRole=a=>{const k=caps.find(k=>k.id===a.cap),roles=k&&PREDS[k.pred];
  if(!roles||!roles.some(([r])=>r===a.role))throw new ReadErr('D3','unknown claim or role');
  const key=JSON.stringify([a.cap,a.role]);if(filledRoles.has(key))throw new ReadErr('D3','a role is filled more than once');filledRoles.add(key);
 };
 [...sh.roleArrows,...sh.refArrows,...sh.lines.flatMap(l=>l.attach)].forEach(checkRole);
 sh.roleArrows.forEach(a=>{const t=sh.things.find(t=>onOutline(a.to,t));if(!t)throw new ReadErr('D3',`role arrow "${a.role}" does not end on a thing box`);fill[a.cap][a.role]={kind:'name',v:t.name,sort:'thing'};});
 sh.refArrows.forEach(a=>{const b=sh.boxes.find(b=>onOutline(a.to,b));if(!b)throw new ReadErr('D3',`reference arrow "${a.role}" does not end on a sentence box`);fill[a.cap][a.role]={kind:'sent',v:b.name,sort:'sentence'};});
 const lines=sh.lines.map((l,i)=>{const homes=l.pts.map(p=>C.filter(c=>ptIn(p,{x:c.x,y:c.y,w:c.w,h:c.h})).sort((p,q)=>p.w*p.h-q.w*q.h)[0]).filter(Boolean);
  const depth=c=>c.parent?1+depth(c.parent):0;const home=homes.sort((a,b)=>depth(a)-depth(b))[0];if(!home)throw new ReadErr('D4','a heavy line outside every box');
  l.attach.forEach(a=>{const k=caps.find(k=>k.id===a.cap);if(!k||!(Math.abs(a.at[0]-k.x)<1.5&&a.at[1]>=k.y&&a.at[1]<=k.y+k.h))throw new ReadErr('D4','a heavy line does not meet its claim at the claim\u2019s edge');fill[a.cap][a.role]={kind:'var',v:'L'+i,sort:'thing'};});
  if(!l.attach.length)throw new ReadErr('D4','an idle heavy line');return {id:'L'+i,home,x:l.trunk[0][0]};});
 // build areas
 const areaOf=c=>{const items=[...caps.filter(k=>k.area===c).map(k=>({cy:k.y+k.h/2,x:k.x,h:k.h,it:k,t:'claim'})),...C.filter(e=>e.kind==='enc'&&e.parent===c).map(e=>({cy:e.y+e.h/2,x:e.x,h:e.h,it:e,t:'enc'}))];
  items.sort((a,b)=>Math.abs(a.cy-b.cy)<Math.min(a.h,b.h)/2?a.x-b.x:a.cy-b.cy);
  return {lines:lines.filter(l=>l.home===c).sort((a,b)=>a.x-b.x).map(l=>({id:l.id,sort:'thing'})),
   items:items.map(o=>{if(o.t==='enc')return {t:'enc',area:areaOf(o.it)};const k=o.it;const roles=PREDS[k.pred];if(!roles)throw new ReadErr('D3','unknown predicate '+k.pred);
    return {t:'claim',pred:k.pred,fill:roles.map(([r,s])=>{const f=fill[k.id][r];if(!f)throw new ReadErr('D3',`role "${r}" of ${k.pred} is not filled`);if(f.sort!==s)throw new ReadErr('D3',`role "${r}" needs a ${s}`);return {kind:f.kind,v:f.v};})};})};};
 const text=sh.boxes.slice().sort((a,b)=>a.x-b.x).map(b=>({name:b.name,area:areaOf(C.find(c=>c.kind==='box'&&c.name===b.name))}));
 // scope check (section 1, rule 2): a line's home must contain each claim it fills
 const contains=(outer,inner)=>{for(let c=inner;c;c=c.parent)if(c===outer)return true;return false;};
 lines.forEach(l=>Object.entries(fill).forEach(([cap,rs])=>Object.values(rs).forEach(f=>{if(f.kind==='var'&&f.v===l.id){const k=caps.find(k=>k.id===cap);if(!contains(l.home,k.area))throw new ReadErr('D4','a heavy line fills a claim outside its home area');}})));
 return text;}
// ===== semantics: on the formula (Tarski) and on the diagram (area by area), independently =====
function randWorld(R,sentNames){const ext={};['Falling','Blowing','Happy'].forEach(p=>ext[p]=new Set(THINGS.filter(()=>R()<0.5)));ext.Loves=new Set();THINGS.forEach(a=>THINGS.forEach(b=>{if(R()<0.3)ext.Loves.add(a+'|'+b);}));ext.IsTrue=new Set(sentNames.filter(()=>R()<0.5));return ext;}
const holds=(W,pred,args)=>W[pred].has(args.join('|'));
function evalFormula(area,W,env){ // Tarski, by recursion on the formula: ∃ over home lines, then ∧ of items
 const go=(i,e)=>{if(i===area.lines.length)return area.items.every(it=>it.t==='claim'?holds(W,it.pred,it.fill.map(f=>f.kind==='var'?e[f.v]:f.v)):!evalFormula(it.area,W,e));return THINGS.some(d=>go(i+1,{...e,[area.lines[i].id]:d}));};return go(0,env);}
function evalDiagram(area,W,asg){ // Dau-style: an area is true if some choice of objects for its home lines makes every item true
 const ids=area.lines.map(l=>l.id);const n=ids.length;const total=Math.pow(THINGS.length,n);
 for(let k=0;k<total;k++){const a={...asg};let r=k;ids.forEach(id=>{a[id]=THINGS[r%THINGS.length];r=Math.floor(r/THINGS.length);});
  let ok=true;for(const it of area.items){if(it.t==='enc'){if(evalDiagram(it.area,W,a)){ok=false;break;}}else{if(!holds(W,it.pred,it.fill.map(f=>f.kind==='var'?a[f.v]:f.v))){ok=false;break;}}}
  if(ok)return true;}return false;}
// ===== unfolding demonstration, not a semantic decision procedure =====
// Use solveClassical in semantics.js for classical verdicts, including quantifiers.
const clone=x=>JSON.parse(JSON.stringify(x));
const isBot=it=>it.t==='enc'&&it.area.items.length===0&&it.area.lines.length===0;
function simplify(area,log){let changed=true;while(changed){changed=false;
  for(const it of area.items)if(it.t==='enc'){if(simplify(it.area,log))changed=true;}
  if(area.items.some(isBot)&&area.items.length>1){area.items=[{t:'enc',area:{lines:[],items:[]}}];log.push('an empty \u201cnot\u201d makes its area false');changed=true;}
  const i=area.items.findIndex(it=>it.t==='enc'&&it.area.lines.length===0&&it.area.items.length===1&&it.area.items[0].t==='enc'&&!isBot(it.area.items[0]));
  if(i>=0){const inner=area.items[i].area.items[0].area;area.items.splice(i,1,...inner.items);area.lines.push(...inner.lines);log.push('double cut: two \u201cnot\u201ds with nothing between them are removed');changed=true;continue;}
  const j=area.items.findIndex(it=>it.t==='enc'&&it.area.items.length===1&&isBot(it.area.items[0]));
  if(j>=0){area.items.splice(j,1);log.push('double cut: a \u201cnot\u201d around an empty \u201cnot\u201d is removed');changed=true;}}
 return false;}
function evaluate(text,name,W,maxSteps){const defs=Object.fromEntries(text.map(d=>[d.name,d.area]));let area=clone(defs[name]);const steps=[{rule:'start',area:clone(area)}];const seen=new Map([[JSON.stringify(area),0]]);
 for(let s=0;s<maxSteps;s++){const log=[];simplify(area,log);if(log.length)steps.push({rule:log[0],area:clone(area)});
  if(area.items.length===0)return {result:true,halts:true,steps};
  if(area.items.length===1&&isBot(area.items[0]))return {result:false,halts:true,steps};
  let done=false;const visit=a=>{for(let i=0;i<a.items.length&&!done;i++){const it=a.items[i];if(it.t==='enc'){visit(it.area);continue;}
    if(it.pred==='IsTrue'){const tgt=clone(defs[it.fill[0].v]);a.items.splice(i,1,...(tgt.lines.length?[{t:'enc',area:{lines:[],items:[{t:'enc',area:tgt}]}}]:tgt.items));steps.push({rule:`unfold IsTrue(${it.fill[0].v})`,area:null});done=true;}
    else if(it.fill.every(f=>f.kind==='name')){const h=holds(W,it.pred,it.fill.map(f=>f.v));a.items.splice(i,1,...(h?[]:[{t:'enc',area:{lines:[],items:[]}}]));steps.push({rule:`look up ${it.pred}(${it.fill.map(f=>f.v).join(', ')}): ${h?'holds':'does not hold'}`,area:null});done=true;}}};
  visit(area);steps[steps.length-1].area=clone(area);
  if(!done)return {result:null,halts:false,steps,why:'unsupported'};
  const key=JSON.stringify(area);if(seen.has(key))return {result:null,halts:false,cycleFrom:seen.get(key),steps};seen.set(key,steps.length-1);}
 return {result:null,halts:false,steps,why:'step limit'};}
if(typeof module!=='undefined')module.exports={genText,printText,layout,readBack,ReadErr,randWorld,evalFormula,evalDiagram,evaluate,rng,THINGS,PREDS};

