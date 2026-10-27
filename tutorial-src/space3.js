// ---------- logical space: every arrow means "then this must hold"; it ends at another supposition or at a set of worlds ----------
const ATOMS={snow:{key:'snow',pred:'Falling',role:'thing that falls',thing:'Snow',yes:'snow falling',no:'no snow falling',un:'snow unsettled',setT:'worlds where snow is falling',setF:'worlds where snow is not falling'},
 wind:{key:'wind',pred:'Blowing',role:'thing that blows',thing:'Wind',yes:'wind',no:'no wind',un:'wind unsettled',setT:'worlds with wind',setF:'worlds without wind'},
 man:{key:'man',pred:'Man',role:'thing that is a man',thing:'Socrates',yes:'Socrates a man',no:'not a man',un:'man unsettled',setT:'worlds where Socrates is a man',setF:'worlds where he is not a man'},
 mortal:{key:'mortal',pred:'Mortal',role:'mortal thing',thing:'Socrates',yes:'mortal',no:'not mortal',un:'mortal unsettled',setT:'worlds where he is mortal',setF:'worlds where he is not mortal'}};
const PRED2ATOM={Falling:'snow',Blowing:'wind',Man:'man',Mortal:'mortal'};
function cellStatus(defs,M){const names=Object.keys(defs);
 if(THEORY==='classical'){const V=verdicts(defs,M);return Object.fromEntries(names.map(n=>{const v=V[n];return [n,{c:v==='true'?'T':v==='false'?'F':v==='either'?'B':'N',w:v}];}));}
 const TV=theoryVerdicts(defs,M);return Object.fromEntries(names.map(n=>{const v=TV.val[n];return [n,{c:v==='T'?'T':v==='F'?'F':'N',w:vword(v)}];}));}
function drawSpace(L,ex,defs,info,SH){
 const atoms=(SH.atoms||[]).map(k=>ATOMS[k]);const names=ex.boxes.map(b=>b.n);const main=L.main||names[names.length-1];const multi=names.length>1;
 const content=drawContent(ex,null,info,worldOf(ex,{}),null,null).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
 const bb=Math.max(...ex.boxes.map(b=>b.r.y+b.r.h));
 const three=THEORY==='kripke';const VALS=three?[true,false,'u']:[true,false];const cols=atoms.length?VALS:[null];const rows=atoms.length>1?VALS:[null];
 const cellW=(ci,ri)=>{const w={};if(atoms[0])w[atoms[0].key]=cols[ci];if(atoms[1])w[atoms[1].key]=rows[ri];return w;};
 const M0=worldOf(ex,cellW(0,0));const imp=buildImp(defs,M0);const A=impAnalyse(imp,defs);const lay=layoutImp(ex,imp,info);
 const isS=id=>imp.ports[id]&&imp.ports[id].kind==='sent';const isFact=id=>imp.ports[id]&&imp.ports[id].kind==='fact';const J=Object.fromEntries(imp.junc.map(j=>[j.id,j]));
 const showPorts=SH.T||SH.F||SH.arrows;
 // which edges to draw: everything reachable from the shown suppositions
 const starts=[];if(SH.T||SH.arrows)names.forEach(n=>{if(SH.T||SH.arrows)starts.push(n+'.T');});if(SH.F||SH.arrows)names.forEach(n=>starts.push(n+'.F'));
 const allow=id=>{const v=id.split('.').pop();return (v==='T'&&(SH.T||SH.arrows))||(v==='F'&&(SH.F||SH.arrows));};
 const reach=new Set();starts.filter(allow).forEach(p=>{const q=[p];while(q.length){const n=q.pop();if(reach.has(n))continue;reach.add(n);imp.edges.forEach(e=>{if(e.from===n)q.push(e.to);});}});
 const factsUsable=atoms.length>0&&SH.grid!==false;
 const drawE=imp.edges.map((e,i)=>({e,i})).filter(({e})=>reach.has(e.from)&&(!isFact(e.to)||factsUsable)&&showPorts);
 let band=bb+(showPorts?24:6);
 drawE.forEach(({e,i})=>{if(!(isS(e.from)&&isS(e.to)))return;const a=lay.pos[e.from],b=lay.pos[e.to];if(!a||!b)return;if(e.from===e.to)band=Math.max(band,a[1]+11+40);else band=Math.max(band,Math.max(a[1],b[1])+(lay.depth[i]||30)+16);});
 if(showPorts)band=Math.max(band,bb+50);
 // grid geometry
 const showStatus=multi||!atoms.length||SH.status;const CW=atoms.length?236:300,GAP=18,RH=(atoms.length?40+atoms.length*40:34)+(showStatus?28:0),gx0=atoms.length>1?110:24;
 const grid=atoms.length||SH.T||SH.F||SH.argue||SH.status;const gy0=band+(grid?56:0);
 const cellAt=(ci,ri)=>({x:gx0+ci*(CW+GAP),y:gy0+48+ri*(RH+GAP)});
 const gridR={x:gx0,y:gy0+48,w:cols.length*(CW+GAP)-GAP,h:rows.length*(RH+GAP)-GAP};
 let s='';let cellsSvg='',over='',extras='';const stats=[];
 if(grid){
  if(atoms.length){cols.forEach((c,ci)=>{const p=cellAt(ci,0);cellsSvg+=`<text class="colh" x="${p.x+CW/2}" y="${gy0+14}" text-anchor="middle">${c==='u'?atoms[0].un:c?atoms[0].yes:atoms[0].no}</text>`;});
   if(atoms.length>1)rows.forEach((r,ri)=>{const p=cellAt(0,ri);cellsSvg+=`<text class="rowh" x="${gx0-14}" y="${p.y+RH/2+4}" text-anchor="end">${r==='u'?atoms[1].un:r?atoms[1].yes:atoms[1].no}</text>`;});}
  const mentions=atoms.length&&ex.caps.some(c=>atoms.some(a=>a.pred===c.p));cellsSvg+=`<text class="spacet" x="${gx0}" y="${gy0-6}">${atoms.length?(mentions?'All possible worlds':'Possible worlds, shown for comparison: these sentences never mention snow')+(three?' (three-valued: a world may leave a claim unsettled)':''):'Any world: nothing here depends on the facts'}</text>`;
  cols.forEach((c,ci)=>rows.forEach((r,ri)=>{const p=cellAt(ci,ri);const w=cellW(ci,ri);const st=cellStatus(defs,worldOf(ex,w));stats.push({ci,ri,st,w});const m=st[main].c;
   const arg=SH.argue&&ex.argument;const prem=arg&&ex.argument.premises.every(n=>st[n].c==='T');const counter=prem&&st[ex.argument.conclusion].c!=='T';
   const inT=!arg&&SH.T&&(m==='T'||m==='B'),inF=!arg&&SH.F&&(m==='F'||m==='B'),inN=!arg&&SH.T&&SH.F&&m==='N';
   const cls=arg?(counter?' counter':prem?' prem':''):(inT&&inF?' inB':inT?' inT':inF?' inF':inN?' inN':'');
   cellsSvg+=`<g class="cell${cls}"><title>${atoms.length?'A world where '+atoms.map(a=>w[a.key]==='u'?a.un:w[a.key]?a.yes:a.no).join(', ')+'. ':''}${names.map(n=>n+': '+st[n].w).join('; ')}.</title><rect class="cellr" x="${p.x}" y="${p.y}" width="${CW}" height="${RH}" rx="10"/>${cls===' inB'?`<rect class="cellr2" x="${p.x+5}" y="${p.y+5}" width="${CW-10}" height="${RH-10}" rx="7"/>`:''}`;
   atoms.forEach((a,k)=>{const y=p.y+24+k*40;const holds=w[a.key];if(holds==='u'){cellsSvg+=`<text class="unset" x="${p.x+16}" y="${y+15}">says nothing about ${a.pred}(${a.thing})</text>`;return;}
    const cx=p.x+(holds?22:30),cw=a.pred.length*7.6+24,tx=cx+cw+46,tw=a.thing.length*7.4+22;
    if(!holds)cellsSvg+=`<rect class="fneg" x="${cx-14}" y="${y-14}" width="${tx+tw-cx+28}" height="38" rx="12"/><text class="fnegt" x="${cx-8}" y="${y-3}">not</text>`;
    cellsSvg+=`<rect class="fcap" x="${cx}" y="${y}" width="${cw}" height="22" rx="11"/><text class="fcapt" x="${cx+cw/2}" y="${y+15}" text-anchor="middle">${a.pred}</text><path class="farr" d="M${cx+cw} ${y+11}H${tx-2}"/><rect class="fthing" x="${tx}" y="${y}" width="${tw}" height="22" rx="6"/><text class="fthingt" x="${tx+tw/2}" y="${y+15}" text-anchor="middle">${a.thing}</text>`;});
   if(showStatus&&(SH.T||SH.F||SH.argue||SH.status))cellsSvg+=`<text class="cstat" x="${p.x+14}" y="${p.y+RH-11}">${names.map(n=>n+' '+st[n].w).join(' · ')}</text>`;
   (SH.points||[]).forEach(pt=>{if(atoms.every(a=>(pt.w[a.key]??true)===w[a.key])){cellsSvg+=`<g class="wpt"><circle cx="${p.x+CW-16}" cy="${p.y+14}" r="7"/><text x="${p.x+CW-28}" y="${p.y+18}" text-anchor="end">${pt.label}</text></g>`;}});
   cellsSvg+='</g>';}));}
 // sets of worlds that arrows can point at
 const setBox=(key,val)=>{const ai=atoms.findIndex(a=>a.key===key);if(ai<0)return null;const sel=stats.filter(o=>o.w[key]===val);if(!sel.length)return null;
  const c0=Math.min(...sel.map(o=>o.ci)),c1=Math.max(...sel.map(o=>o.ci)),r0=Math.min(...sel.map(o=>o.ri)),r1=Math.max(...sel.map(o=>o.ri));const a=cellAt(c0,r0),b=cellAt(c1,r1);
  return {x:a.x-9,y:a.y-9,w:b.x+CW-a.x+18,h:b.y+RH-a.y+18,col:ai===0,label:val?ATOMS[key].setT:ATOMS[key].setF};};
 const used={};const tgtOf=id=>{const p=imp.ports[id];const key=PRED2ATOM[p.atom.p];const k=key+':'+p.v;if(!used[k]){const bx=setBox(key,p.v==='T');if(!bx)return null;used[k]=bx;}return used[k];};
 // arrows: between sentences, the reasoning steps; into the world, one arrow per supposition straight to its set of worlds
 const sentEdge=e=>isS(e.from)&&isS(e.to);
 drawE.forEach(({e,i})=>{if(!sentEdge(e))return;const a=lay.pos[e.from],b=lay.pos[e.to];if(!a||!b)return;let c=A.cls[i];if(c==='faint'||c==='blocked')c='solid';const ay=a[1]+11,by=b[1]+11;let d;
  if(e.from===e.to)d=`M${a[0]-6} ${ay}C${a[0]-22} ${ay+40} ${a[0]+22} ${ay+40} ${a[0]+6} ${ay}`;else{const bot=Math.max(ay,by)+(lay.depth[i]||30);d=`M${a[0]} ${ay}C${a[0]} ${bot} ${b[0]} ${bot} ${b[0]} ${by}`;}
  s+=`<path class="imp ${c}" d="${d}" marker-end="url(#mi-${c}-${ex.id})"/>`;});
 const leadsToWorld=(n,v)=>{const q=[n+'.'+v],seen=new Set();while(q.length){const x=q.pop();if(seen.has(x))continue;seen.add(x);if(isFact(x))return true;imp.edges.forEach(e=>{if(e.from===x&&!(isS(e.from)&&isS(e.to)&&x!==n+'.'+v))q.push(e.to);});}return false;};
 const directOnly=(n,v)=>imp.edges.filter(e=>e.from===n+'.'+v).every(e=>isS(e.to));
 const regionArrows=[];
 if(grid&&stats.length&&!SH.argue)names.forEach(n=>['T','F'].forEach(v=>{if(!(v==='T'?SH.T:SH.F))return;if(directOnly(n,v)&&n!==main)return;
   if(directOnly(n,v)&&imp.edges.some(e=>e.from===n+'.'+v))return; // handled by the sentence arrows, plus the every/no-world arrows below for the main sentence
   if(!leadsToWorld(n,v)&&n===main)return;
   const cells=stats.filter(o=>{const c=o.st[n].c;return v==='T'?(c==='T'||c==='B'):(c==='F'||c==='B');});regionArrows.push({n,v,cells});}));
 regionArrows.forEach(({n,v,cells})=>{const p=lay.pos[n+'.'+v];const key=o=>o.ci+','+o.ri;const mine=cells.map(key).sort().join('|');const same=names.filter(m=>stats.filter(o=>{const c=o.st[m].c;return v==='T'?(c==='T'||c==='B'):(c==='F'||c==='B');}).map(key).sort().join('|')===mine);const lab=`worlds where ${same.length>1?same.slice(0,-1).join(', ')+' and '+same[same.length-1]+' are':n+' is'} ${v==='T'?'true':'false'}`;
  if(!cells.length){const bx=gridR.x+gridR.w+40,by=gridR.y+(v==='T'?0:70);extras+=`<g><title>No world can make ${n} ${v==='T'?'true':'false'}.</title><rect class="empty" x="${bx}" y="${by}" width="150" height="50" rx="12"/><text class="emptyt" x="${bx+75}" y="${by+30}" text-anchor="middle">no world fits</text></g>`;over+=`<path class="imp solid" d="M${p[0]} ${p[1]+11}C${p[0]} ${p[1]+90} ${bx-40} ${by+25} ${bx-2} ${by+25}" marker-end="url(#mi-solid-${ex.id})"/>`;return;}
  const c0=Math.min(...cells.map(o=>o.ci)),c1=Math.max(...cells.map(o=>o.ci)),r0=Math.min(...cells.map(o=>o.ri)),r1=Math.max(...cells.map(o=>o.ri));
  let tx,ty;if(cells.length===(c1-c0+1)*(r1-r0+1)){const a=cellAt(c0,r0),b=cellAt(c1,r1);const R2={x:a.x-9,y:a.y-9,w:b.x+CW-a.x+18,h:b.y+RH-a.y+18};extras+=`<rect class="tgt" x="${R2.x}" y="${R2.y}" width="${R2.w}" height="${R2.h}" rx="14"/>`;tx=R2.x+R2.w/2+(v==='T'?-20:20);ty=R2.y;}
  else{cells.forEach(o=>{const a=cellAt(o.ci,o.ri);extras+=`<rect class="tgt" x="${a.x-6}" y="${a.y-6}" width="${CW+12}" height="${RH+12}" rx="13"/>`;});const top=cells.slice().sort((x,y)=>x.ri-y.ri||x.ci-y.ci)[0];const a=cellAt(top.ci,top.ri);tx=a.x+CW/2;ty=a.y-6;}
  extras+=`<text class="tgtl" x="${tx}" y="${ty-6}" text-anchor="middle">${lab}</text>`;
  over+=`<g><title>If ${n} is ${v==='T'?'true':'false'}, the world must be one of the ${lab}.</title><path class="imp solid" d="M${p[0]} ${p[1]+11}C${p[0]} ${p[1]+70} ${tx} ${ty-70} ${tx} ${ty-18}" marker-end="url(#mi-solid-${ex.id})"/></g>`;});
 // optional: show some basic sets of worlds on their own (used to explain "and" and "one of")
 (SH.sets||[]).forEach(k=>{const [key,v]=k.split(':');const bx=setBox(key,v==='T');if(!bx)return;used[k]=bx;});
 // a supposition that says nothing about the facts leads to every world (or, if it contradicts itself, to none)
 const hasFactReach=v=>{const q=[main+'.'+v],seen=new Set();while(q.length){const n=q.pop();if(seen.has(n))continue;seen.add(n);if(isFact(n))return true;imp.edges.forEach(e=>{if(e.from===n)q.push(e.to);});}return false;};
 if(grid&&stats.length&&!SH.argue)[['T',SH.T],['F',SH.F]].forEach(([v,on])=>{if(!on||hasFactReach(v))return;const ok=stats.some(o=>{const c=o.st[main].c;return v==='T'?(c==='T'||c==='B'):(c==='F'||c==='B');});const p=lay.pos[main+'.'+v];
  if(ok){const tx=gridR.x+gridR.w*(v==='T'?0.3:0.7);over+=`<g><title>Supposing ${main} ${v==='T'?'true':'false'} places no demand on the facts: it fits every world.</title><path class="imp solid" d="M${p[0]} ${p[1]+11}C${p[0]} ${p[1]+60} ${tx} ${gridR.y-60} ${tx} ${gridR.y-12}" marker-end="url(#mi-solid-${ex.id})"/></g>`;if(!extras.includes('tgtall'))extras+=`<rect class="tgtall" x="${gridR.x-10}" y="${gridR.y-10}" width="${gridR.w+20}" height="${gridR.h+20}" rx="16"/><text class="tgtl" x="${gridR.x+gridR.w-4}" y="${gridR.y-16}" text-anchor="end">every world</text>`;}
  else{const bx=gridR.x+gridR.w+40,by=gridR.y+(v==='T'?0:70);const why=THEORY==='classical'?['no world fits:','it contradicts itself']:THEORY==='kripke'?['no value:','never grounded in facts']:['gap:','a closed loop'];const cl=THEORY==='classical'?'bad':'solid';extras+=`<g><title>${THEORY==='classical'?`Supposing ${main} ${v==='T'?'true':'false'} contradicts itself, so no world can be like that.`:THEORY==='kripke'?`Under Kripke’s rules ${main} never gets a value: nothing in the facts ever settles it.`:`Under Gaifman’s closed-loop rule, ${main} gets a gap: it only refers to itself, so its evaluation can never finish.`}</title><rect class="empty${THEORY==='classical'?'':' emptyn'}" x="${bx}" y="${by}" width="170" height="50" rx="12"/><text class="emptyt${THEORY==='classical'?'':' emptynt'}" x="${bx+85}" y="${by+22}" text-anchor="middle">${why[0]}</text><text class="emptyt${THEORY==='classical'?'':' emptynt'}" x="${bx+85}" y="${by+38}" text-anchor="middle">${why[1]}</text></g>`;over+=`<path class="imp ${cl}" d="M${p[0]} ${p[1]+11}C${p[0]} ${p[1]+90} ${bx-40} ${by+25} ${bx-2} ${by+25}" marker-end="url(#mi-${cl}-${ex.id})"/>`;}});
 // basic sets shown on their own, with their labels
 Object.values(used).forEach(t=>{extras+=`<rect class="tgtset" x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" rx="14"/><text class="setl" x="${t.col?t.x+t.w/2:gridR.x+gridR.w+18}" y="${t.col?t.y-6:t.y+t.h/2+4}" text-anchor="${t.col?'middle':'start'}">${t.label}</text>`;});
 // a derived relation, drawn separately from the arrows: two sentences true in exactly the same worlds are equivalent (≡)
 if(grid&&stats.length>1&&SH.T&&SH.F&&!SH.argue){const sig=(m,v)=>stats.filter(o=>{const c=o.st[m].c;return v==='T'?(c==='T'||c==='B'):(c==='F'||c==='B');}).map(o=>o.ci+','+o.ri).sort().join('|');
  for(let i=0;i<ex.boxes.length;i++)for(let j=i+1;j<ex.boxes.length;j++){const A1=ex.boxes[i],B1=ex.boxes[j];const n1=A1.n,n2=B1.n;if(sig(n1,'T')!==sig(n2,'T')||sig(n1,'F')!==sig(n2,'F'))continue;if(stats.some(o=>o.st[n1].c==='N'||o.st[n2].c==='N'))continue;
   const l=A1.r.x+A1.r.w<=B1.r.x?A1:B1,r=l===A1?B1:A1;if(l.r.x+l.r.w>r.r.x)continue;const x1=l.r.x+l.r.w,x2=r.r.x,y=Math.min(l.r.y+l.r.h,r.r.y+r.r.h)-18;
   extras+=`<g><title>${n1} and ${n2} are equivalent: true in exactly the same worlds. This is a result worked out from the worlds, not something either sentence requires.</title><path class="eqv" d="M${x1} ${y-3}H${x2}M${x1} ${y+3}H${x2}"/><circle class="eqvc" cx="${(x1+x2)/2}" cy="${y}" r="10"/><text class="eqvt" x="${(x1+x2)/2}" y="${y+5}" text-anchor="middle">≡</text><text class="eqvl" x="${(x1+x2)/2}" y="${y+24}" text-anchor="middle">equivalent</text></g>`;}}
 // ports
 if(showPorts)ex.boxes.forEach(b=>{[['T','sent T'],['F','sent F']].forEach(([v,c])=>{if(!(v==='T'?(SH.T||SH.arrows):(SH.F||SH.arrows)))return;const p=lay.pos[b.n+'.'+v];s+=`<g class="port ${c}"><title>${v==='T'?'Suppose '+b.n+' is true.':'Suppose '+b.n+' is false.'}</title><circle cx="${p[0]}" cy="${p[1]}" r="11"/><text x="${p[0]}" y="${p[1]+4}" text-anchor="middle">${v}</text></g>`;});});
 // a plain-language key under the grid
 let key='';const kY=grid?gridR.y+gridR.h+34:band+10;
 if(grid&&(SH.T||SH.F)&&!SH.argue){const parts=[];const has=f=>stats.some(o=>f(o.st[main].c));const sig=(m,v)=>stats.filter(o=>{const c=o.st[m].c;return v==='T'?(c==='T'||c==='B'):(c==='F'||c==='B');}).map(o=>o.ci+','+o.ri).sort().join('|');const who=v=>{const same=names.filter(m=>sig(m,v)===sig(main,v));return same.length>1?same.slice(0,-1).join(', ')+' and '+same[same.length-1]+' are':main+' is';};if(SH.T&&has(c=>c==='T'||c==='B'))parts.push(`<tspan class="kT">green</tspan>: worlds where ${who('T')} true`);if(SH.F&&has(c=>c==='F'||c==='B'))parts.push(`<tspan class="kF">orange</tspan>: worlds where ${who('F')} false`);if(stats.some(o=>o.st[main].c==='B'))parts.push('both colours: either value works');if(SH.T&&SH.F&&stats.some(o=>o.st[main].c==='N'))parts.push('<tspan class="kN">grey</tspan>: neither');key=parts.length?`<text class="key" x="${gx0}" y="${kY}">${parts.join('; ')}.</text>`:'';}
 if(SH.argue)key=`<text class="key" x="${gx0}" y="${kY}"><tspan class="kT">Green border</tspan>: every premise is true there. <tspan class="kX">Red border</tspan>: a counter-model.</text>`;
 const rowT=Object.values(used).some(t=>!t.col);const keyLen=key.replace(/<[^>]+>/g,'').length;const W=Math.max(gx0+keyLen*7+30,ex.vb[0]+ex.vb[2],gx0+cols.length*(CW+GAP)+(extras.includes('empty')?250:rowT?190:30));let H=grid?kY+16:(showPorts?band+10:bb+12);if(extras.includes('class="empty'))H=Math.max(H,gridR.y+140);
 return `<svg viewBox="${ex.vb[0]} ${ex.vb[1]} ${W-ex.vb[0]} ${H-ex.vb[1]}" class="fit" role="img" aria-label="Sentences and the space of possible worlds">${content}${cellsSvg}${extras}${s}${over}${key}</svg>`;}
