// ===== layout 2: the graph form. Every link is an edge: "says" (sentence to its parts), "inside" (a "not" to its parts),
// "home" (where a "something" sits), role edges (claim to what fills each role). =====
function graphLayout(text){const G={nodes:[],edges:[]};let nid=0;const COLW=150,ROWH=46;let row=0;const sentNode={};
 const add=(kind,label,col)=>{const id='n'+(nid++);const w=kind==='sent'?46:kind==='not'?48:kind==='var'?60:kind==='thing'?Math.max(56,label.length*8+18):Math.max(70,label.length*8+22);
  const n={id,kind,label,x:20+col*COLW,y:20+row*ROWH,w,h:30};G.nodes.push(n);return n;};
 const edge=(a,b,kind,label)=>G.edges.push({kind,label,from:[a.x+a.w,a.y+a.h/2],to:[b.x,b.y+b.h/2]});
 const pendingRefs=[];
 const placeArea=(parent,area,col,kindEdge,vmap)=>{area.lines.forEach(l=>{const v=add('var','something',col);vmap[l.id]=v;edge(parent,v,'home','home');row++;});
  area.items.forEach(it=>{if(it.t==='enc'){const n=add('not','not',col);edge(parent,n,kindEdge);row++;placeArea(n,it.area,col+1,'inside',Object.assign({},vmap));}
   else{const c=add('claim',it.pred,col);edge(parent,c,kindEdge);const r0=row;row++;
    it.fill.forEach((f,i)=>{const role=PREDS[it.pred][i][0];if(f.kind==='name'){const keep=row;row=r0+i;const t=add('thing',f.v,col+1);row=Math.max(keep,row+1);edge(c,t,'role',role);}
     else if(f.kind==='var'){const v=vmap[f.v];G.edges.push({kind:'role',label:role,from:[c.x,c.y+c.h/2+4],to:[v.x+v.w,v.y+v.h/2+(i?6:-6)],back:true});}
     else pendingRefs.push({c,role,target:f.v});});}});};
 text.forEach(d=>{const s=add('sent',d.name,0);sentNode[d.name]=s;row++;placeArea(s,d.area,1,'says',{});row++;});
 pendingRefs.forEach(p=>{const s=sentNode[p.target];G.edges.push({kind:'role',label:p.role,ref:true,from:[p.c.x+p.c.w,p.c.y+p.c.h/2],to:[s.x+s.w/2,s.y+s.h]});});
 G.W=Math.max(...G.nodes.map(n=>n.x+n.w))+30;G.H=Math.max(...G.nodes.map(n=>n.y+n.h))+30;return G;}
// ===== read-back for the graph form: follow the edges; nothing is read from nesting =====
function graphReadBack(G){const at=p=>G.nodes.filter(n=>onOutline(p,n));
 const E=G.edges.map(e=>{const a=at(e.from),b=at(e.to);if(a.length!==1||b.length!==1)throw new ReadErr('G1',`an edge does not run from one node's outline to another's`);return {...e,a:a[0],b:b[0]};});
 const parentOf={};E.filter(e=>e.kind==='says'||e.kind==='inside'||e.kind==='home').forEach(e=>{if(parentOf[e.b.id])throw new ReadErr('G2','a node has two parents');parentOf[e.b.id]=e.a;});
 const filledRoles=new Set();E.filter(e=>e.kind==='role').forEach(e=>{
  const roles=e.a.kind==='claim'&&PREDS[e.a.label];
  if(!roles||!roles.some(([r])=>r===e.label))throw new ReadErr('G3','unknown claim or role');
  const key=JSON.stringify([e.a.id,e.label]);if(filledRoles.has(key))throw new ReadErr('G3','a role is filled more than once');filledRoles.add(key);
 });
 G.nodes.forEach(n=>{if(n.kind!=='sent'&&n.kind!=='thing'&&!parentOf[n.id])throw new ReadErr('G2',`a "${n.label}" node hangs loose`);});
 const kids=(n,kinds)=>E.filter(e=>e.a===n&&kinds.includes(e.kind)).map(e=>e.b).sort((p,q)=>p.y-q.y||p.x-q.x);
 const inScope=(v,c)=>{const home=parentOf[v.id];for(let n=parentOf[c.id];n;n=parentOf[n.id])if(n===home)return true;return false;};
 const area=n=>({lines:kids(n,['home']).map(v=>({id:v.id,sort:'thing'})),items:kids(n,['says','inside']).filter(m=>m.kind!=='var').map(m=>{
   if(m.kind==='not')return {t:'enc',area:area(m)};if(m.kind!=='claim')throw new ReadErr('G2','a sentence or thing cannot be part of a sentence');
   const rs=E.filter(e=>e.kind==='role'&&e.a===m);const roles=PREDS[m.label];
   return {t:'claim',pred:m.label,fill:roles.map(([r,s])=>{const e=rs.find(e=>e.label===r);if(!e)throw new ReadErr('G3',`role "${r}" of ${m.label} is not filled`);const t=e.b;
    if(t.kind==='var'){if(!inScope(t,m))throw new ReadErr('G4','a "something" fills a claim outside its home');return {kind:'var',v:t.id};}
    if(s==='sentence'){if(t.kind!=='sent')throw new ReadErr('G3',`role "${r}" needs a sentence`);return {kind:'sent',v:t.label};}
    if(t.kind!=='thing')throw new ReadErr('G3',`role "${r}" needs a thing`);return {kind:'name',v:t.label};})};})});
 return G.nodes.filter(n=>n.kind==='sent').sort((p,q)=>p.y-q.y).map(s=>({name:s.label,area:area(s)}));}
// ===== value layers: the implication graph drawn on a true layer and a false layer =====
// For a "pure loop" text (each sentence says (not)^k IsTrue(next)), each node (sentence, value) has exactly one successor,
// so the layers fall apart into closed curves. This counts them.
function valueLayers(text){const name=text.map(d=>d.name);const step={};
 text.forEach(d=>{let a=d.area,k=0;while(a.items.length===1&&a.items[0].t==='enc'){k++;a=a.items[0].area;}const c=a.items[0];step[d.name]={to:c.fill[0].v,flip:k%2===1};});
 const succ=(s,v)=>[step[s].to,step[s].flip?!v:v];const seen=new Set();const curves=[];
 name.forEach(s=>[true,false].forEach(v=>{const k=s+v;if(seen.has(k))return;const cur=[];let x=[s,v];while(!seen.has(x[0]+x[1])){seen.add(x[0]+x[1]);cur.push(x);x=succ(x[0],x[1]);}curves.push(cur);}));
 return curves;}
function pureLoop(R,n){const names=Array.from({length:n},(_,i)=>'S'+(i+1));return names.map((s,i)=>{let a={lines:[],items:[{t:'claim',pred:'IsTrue',fill:[{kind:'sent',v:names[(i+1)%n]}]}]};const k=Math.floor(R()*3);for(let j=0;j<k;j++)a={lines:[],items:[{t:'enc',area:a}]};return {name:s,area:a};});}
function hasConsistentValue(text){const n=text.length;const names=text.map(d=>d.name);
 for(let m=0;m<(1<<n);m++){const W={Falling:new Set(),Blowing:new Set(),Happy:new Set(),Loves:new Set(),Man:new Set(),Mortal:new Set(),IsTrue:new Set(names.filter((_,i)=>m>>i&1))};
  if(text.every((d,i)=>evalFormula(d.area,W,{})===!!(m>>i&1)))return true;}return false;}
if(typeof module!=='undefined')module.exports={graphLayout,graphReadBack,valueLayers,pureLoop,hasConsistentValue};

