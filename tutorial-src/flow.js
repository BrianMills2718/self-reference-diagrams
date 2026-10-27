// ---------- the supposition as a dot: it walks the implications through the sentence's own parts, automatically ----------
let FLOWRUN=0;
function flowGeom(ex,info){const b=ex.boxes[0].r;const a=ex.arrows.find(x=>ex.boxes.some(bx=>onEdge(x.to,bx.r)));const c=ex.caps.find(k=>k.id===a.from).r;const enc=ex.encs[0]?ex.encs[0].r:null;const nots=info[a.from].negs;
 const fx=c.x+c.w,fy=c.y+c.h/2,cx=c.x+c.w/2;const exitY=enc?enc.y+enc.h:c.y+c.h;const B=b.y+b.h,right=b.x+b.w;const pT=b.x+40,pF=b.x+76;
 const route=(sx,ex2)=>{const pts=[[sx,B],[sx,B+22],[right+18,B+22],[right+18,fy],[right,fy],[fx,fy],[cx,fy],[cx,exitY],[cx,B-14],[ex2,B-14],[ex2,B]];return pts;};
 return {b,c,enc,nots,fx,fy,cx,exitY,B,right,pT,pF,route};}
function ptsToD(p){return 'M'+p.map(q=>q.join(' ')).join('L');}
function drawFlow(ex,defs,info){const g=flowGeom(ex,info);
 let s=drawContent(ex,null,info,worldOf(ex,{}),null,null).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
 const res=v=>g.nots%2?!v:v;
 s+=`<rect id="fbox" class="fbox fT" x="${g.b.x-4}" y="${g.b.y-4}" width="${g.b.w+8}" height="${g.b.h+8}" rx="7"/>`;
 if(g.enc)s+=`<rect id="fenc" class="fenc" x="${g.enc.x-3}" y="${g.enc.y-3}" width="${g.enc.w+6}" height="${g.enc.h+6}" rx="18" opacity="0"/>`;
 // the two routes: from T to wherever supposing T leads, and from F likewise
 const rT=g.route(g.pT,res(true)?g.pT:g.pF),rF=g.route(g.pF,res(false)?g.pT:g.pF);
 [rT,rF].forEach(r=>{s+=`<path class="froute" d="${ptsToD(r.slice(0,5))}"/><path class="froute" d="${ptsToD(r.slice(7))}"/>`;});
 s+=`<path id="fpathT" class="fhid" d="${ptsToD(rT)}"/><path id="fpathF" class="fhid" d="${ptsToD(rF)}"/>`;
 [['T',g.pT],['F',g.pF]].forEach(([v,x])=>{s+=`<g id="fport${v}" class="port sent ${v}"><circle cx="${x}" cy="${g.B}" r="11"/><text x="${x}" y="${g.B+4}" text-anchor="middle">${v}</text></g>`;});
 s+=`<g id="fdot" class="fdot fT"><circle r="13" cx="${g.pT}" cy="${g.B}"/><text x="${g.pT}" y="${g.B+5}" text-anchor="middle">T</text></g>`;
 return `<svg viewBox="${ex.vb[0]-4} ${ex.vb[1]-6} ${g.right+40-ex.vb[0]} ${g.B+40-ex.vb[1]}" class="fit flow" role="img" aria-label="A dot carrying the supposition about S round the sentence">${s}</svg>`;}
function flowPanel(ex,info){const g=flowGeom(ex,info);
 return `<div class="mrow" id="fhistrow"><span>S</span><span id="fhist"></span></div>`;}
function flowStart(ex,info){const run=++FLOWRUN;const g=flowGeom(ex,info);const res=v=>g.nots%2?!v:v;
 const dot=document.getElementById('fdot');if(!dot)return;const circ=dot.querySelector('circle'),txt=dot.querySelector('text');const box=document.getElementById('fbox'),enc=document.getElementById('fenc'),hist=document.getElementById('fhist');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let cur=true;const H=['T'];
 const setDot=(x,y,v)=>{circ.setAttribute('cx',x);circ.setAttribute('cy',y);txt.setAttribute('x',x);txt.setAttribute('y',y+5);txt.textContent=v?'T':'F';dot.setAttribute('class','fdot '+(v?'fT':'fF'));};
 const lit=v=>{['T','F'].forEach(k=>{const p=document.getElementById('fport'+k);if(p)p.style.opacity=(k==='T')===v?'1':'0.35';});box.setAttribute('class','fbox '+(v?'fT':'fF'));};
 const showHist=()=>{if(hist)hist.innerHTML=H.slice(-14).map(h=>`<span class="chip ${h==='T'?'cT':'cF'}">${h}</span>`).join('');};
 lit(cur);showHist();
 const lap=()=>{if(run!==FLOWRUN||!document.body.contains(dot))return;const path=document.getElementById(cur?'fpathT':'fpathF');const total=path.getTotalLength();
  const pts=g.route(cur?g.pT:g.pF,0);let flipAt=0;for(let i=1;i<=7;i++)flipAt+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
  const out=res(cur);const speed=total/3600,hold=enc?900:300,tF=flipAt/speed,dur=total/speed+hold;const t0=performance.now();let flipped=false;
  const frame=now=>{if(run!==FLOWRUN||!document.body.contains(dot))return;const t=now-t0;let L,v;
   if(t<tF){L=speed*t;v=cur;}else if(t<tF+hold){L=flipAt;v=t<tF+hold*0.45?cur:out;if(!flipped){flipped=true;if(enc&&out!==cur){enc.setAttribute('opacity','1');setTimeout(()=>enc&&enc.setAttribute('opacity','0'),hold+300);}}}else{L=Math.min(total,flipAt+speed*(t-tF-hold));v=out;}
   if(reduced){const ph=t<tF?0:t<tF+hold?1:2;L=[0,flipAt,total][ph];v=ph===0?cur:ph===1&&t<tF+hold*0.45?cur:out;}
   const p=path.getPointAtLength(L);setDot(p.x,p.y,v);
   if(t<dur){requestAnimationFrame(frame);return;}
   cur=out;H.push(cur?'T':'F');lit(cur);showHist();setTimeout(lap,900);};
  requestAnimationFrame(frame);};
 setTimeout(lap,800);}
