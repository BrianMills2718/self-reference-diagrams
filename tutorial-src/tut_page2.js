// ---------- tutorial: truth as a relation between sentences and worlds ----------
const DN={snow:'Snow',wind:'Wind',soc:'Socrates',k:'the king'};
const usesWorld=ex=>ex.caps.some(c=>c.p!=='IsTrue');
const worldKeys=ex=>{const ps=ex.caps.map(c=>c.p);if(ps.includes('Man')||ps.includes('Mortal'))return ['man','mortal'];const k=[];if(ps.includes('Falling'))k.push('snow');if(ps.includes('Blowing'))k.push('wind');return k;};
function worldOf(ex,w){const ps=ex.caps.map(c=>c.p);if(ps.includes('Man')||ps.includes('Mortal'))return {D:['soc'],ent:{Socrates:'soc'},holds:{Man:d=>d==='soc'&&w.man===true,Mortal:d=>d==='soc'&&w.mortal===true},unk:{Man:d=>d==='soc'&&w.man==='u',Mortal:d=>d==='soc'&&w.mortal==='u'}};
 return {D:['snow','wind'],ent:{Snow:'snow',Wind:'wind'},holds:{Falling:d=>d==='snow'&&w.snow===true,Blowing:d=>d==='wind'&&w.wind===true},unk:{Falling:d=>d==='snow'&&w.snow==='u',Blowing:d=>d==='wind'&&w.wind==='u'}};}
function wdesc(ex,w){const k=worldKeys(ex);if(!k.length)return 'its facts make no difference to these sentences';if(k[0]==='man')return 'Socrates is '+(w.man?'':'not ')+'a man, and '+(w.mortal?'':'not ')+'mortal';
 return (w.snow?'snow is falling':'nothing is falling')+(k.includes('wind')?(w.wind?'; the wind is blowing':'; no wind'):'');}
const WBT={snow:v=>v?'Snow is falling':'Nothing is falling',wind:v=>v?'Wind is blowing':'No wind',man:v=>v?'Socrates is a man':'Socrates is not a man',mortal:v=>v?'Socrates is mortal':'Socrates is not mortal'};
let TYPES=true,THEORY='classical',SHOWREASON=true;const MOT={},ANIM={},WS={},FOCUS={},ANS={};let LI=0;
function edgeLabel(v,name,multi){const p=multi?name+' ':'';return p+(v==='true'?'true in':v==='false'?'false in':v==='either'?'either, in':v==='paradox'?'paradox in':v==='inherits a paradox'?'inherits a paradox in':v==='neither'?'no value in':v==='gap'?'gap in':v==='not yet'?'not yet worked out in':v+' in');}
function drawLesson(L,li,ex,defs,info,SH){SH=SH||{worlds:true,lines:true,T:true,F:true};
 const worlds=WS[li].slice(0,SH.nworlds||WS[li].length);const fi=Math.min(FOCUS[li]||0,worlds.length-1);const allowP=id=>{const parts=id.split('.');const q=parts.pop();const nm=parts.join('.');if(SH.sents&&!SH.sents.includes(nm))return false;return (q==='T'&&SH.T)||(q==='F'&&SH.F);};const Ms=worlds.map(w=>worldOf(ex,w));
 const per=Ms.map(M=>{const imp=buildImp(defs,M);const A=impAnalyse(imp,defs);let TV=THEORY!=='classical'?theoryVerdicts(defs,M):null;return {M,imp,A,TV};});
 const F=per[fi];const MK=MOT[ex.id];let selInfo=null,GAPS=null,TVf=F.TV;
 if(L.motion&&MK!==undefined){if(THEORY!=='classical'){const p=partialTV(defs,F.M,MK);TVf={val:p.val,why:p.why};GAPS=p.loop;}else{const run=classicalRun(defs,F.M);selInfo={st:stateAt(run,MK),next:stateAt(run,MK+1)};}}
 const verdict=i=>{const P=per[i];const TV=i===fi?TVf:P.TV;return TV?Object.fromEntries(Object.keys(defs).map(n=>[n,TV.why[n]&&TV.why[n].startsWith('not yet')?'not yet':vword(TV.val[n])])):P.A.verdict;};
 const lay=layoutImp(ex,F.imp,info);const pos={...lay.pos};
 // content (sentences only, no badges)
 let content=drawContent(ex,TVf?null:selInfo,info,F.M,null,null,ANIM[ex.id],GAPS);content=content.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
 const boxBottom=Math.max(...ex.boxes.map(b=>b.r.y+b.r.h));
 let band=(SH.T||SH.F)?boxBottom+34:boxBottom+6;F.imp.edges.forEach((e,i)=>{if(lay.depth[i]!==undefined){const a=pos[e.from],b=pos[e.to];if(a&&b)band=Math.max(band,Math.max(a[1],b[1])+lay.depth[i]+8);}});
 F.imp.junc.forEach(j=>{if(pos[j.id])band=Math.max(band,pos[j.id][1]+24);});
 // world panels
 const bases=[...new Set(Object.values(F.imp.ports).filter(p=>p.kind==='fact').map(p=>p.base))];
 const rowOf=b=>{const p=Object.values(F.imp.ports).find(q=>q.base===b);const t=p.atom.args[0][1];const thing=DN[p.d||F.M.ent[t.name]]||t.name;return {base:b,pred:p.atom.p,role:p.atom.args[0][0],thing};};
 const rows=bases.map(rowOf);const capw=r=>r.pred.length*8.2+30,thw=r=>r.thing.length*8+28;
 const PW=Math.max(250,...worlds.map(w=>wdesc(ex,w).length*6.6+40),...rows.map(r=>capw(r)+Math.max(110,r.role.length*6.4+20)+thw(r)+90));const PY=band+(worlds.length>1||Object.keys(defs).length>1?84:70);const RT=L.reqLabels?62:38;const PH=rows.length?RT+4+rows.length*58+40:84;
 const px=i=>ex.vb[0]+10+i*(PW+24);
 let s='';
 if(SH.worlds)worlds.forEach((w,i)=>{const x=px(i);s+=`<g class="wpanel${i===fi?' focus':''}" data-wi="${i}" role="button" tabindex="0" aria-label="World ${i+1}: ${esc(wdesc(ex,w))}. Click to show the requirement arrows for this world."><title>World ${i+1}: ${esc(wdesc(ex,w))}. Click to show why each verdict holds here.</title><rect class="wrect" x="${x}" y="${PY}" width="${PW}" height="${PH}" rx="12"/><text class="wtitle" x="${x+14}" y="${PY+PH-30}">World ${i+1}${i===fi&&worlds.length>1?' · showing why':''}</text><text class="wdesc" x="${x+14}" y="${PY+PH-12}">${esc(wdesc(ex,w))}</text>`;
  if(!rows.length)s+=`<text class="wdesc" x="${x+14}" y="${PY+30}">(no facts are used here)</text>`;
  rows.forEach((r,k)=>{const ry=PY+RT+k*58;const holds=!per[i].imp.ports[r.base+'.T'].closed;const cx=x+16,cw=capw(r),tx=x+16+cw+Math.max(110,r.role.length*6.4+20);
   const ex2=tx+thw(r);s+=`<g class="frow"><title>${esc(r.pred+'('+r.role+': '+r.thing+')')} ${holds?'holds':'does not hold'} in World ${i+1}.</title>${holds?'':`<rect class="fneg" x="${cx-10}" y="${ry-18}" width="${ex2-cx+20}" height="${26+28}" rx="14"/><text class="fnegt" x="${cx-2}" y="${ry-6}">not</text>`}<rect class="fcap" x="${cx}" y="${ry}" width="${cw}" height="26" rx="13"/><text class="fcapt" x="${cx+cw/2}" y="${ry+18}" text-anchor="middle">${r.pred}</text><path class="farr" d="M${cx+cw} ${ry+13}H${tx-2}"/><text class="frole" x="${(cx+cw+tx)/2}" y="${ry+6}" text-anchor="middle">${esc(r.role)}</text><rect class="fthing" x="${tx}" y="${ry}" width="${thw(r)}" height="26" rx="7"/><text x="${tx+thw(r)/2}" y="${ry+18}" text-anchor="middle">${r.thing}</text></g>`;
   if(i===fi){pos[r.base+'.T']=[cx+cw/2-9,ry];pos[r.base+'.F']=[cx+cw/2+9,ry];}});
  s+='</g>';});
 // requirement arrows (focus world), unless a three-valued theory is in force
 let req='';
 const reach=new Set();Object.values(F.imp.ports).filter(p=>p.kind==='sent'&&allowP(p.id)).forEach(p=>{const q=[p.id];while(q.length){const n=q.pop();if(reach.has(n))continue;reach.add(n);F.imp.edges.forEach(e=>{if(e.from===n)q.push(e.to);});}});
 if(!TVf){F.imp.edges.forEach((e,i)=>{if(!reach.has(e.from))return;if(F.imp.ports[e.to]&&F.imp.ports[e.to].kind==='fact'&&!SH.worlds)return;const a=pos[e.from],b=pos[e.to];if(!a||!b)return;const c=F.A.cls[i]==='faint'?'solid':F.A.cls[i];const fromPort=!!F.imp.ports[e.from];const tp=F.imp.ports[e.to];const toFact=tp&&tp.kind==='fact';const ay=fromPort&&!(F.imp.ports[e.from].kind==='fact')?a[1]+11:a[1]+5;
   if(toFact){const by=b[1]-3;const h=Math.max(30,(by-ay)*0.45);const bar=tp.v==='F';const met=!tp.closed;req+=`<g class="rmark ${met?'ok':'bad'}"><title>${met?'Fits this world.':'Clashes with this world.'}</title><circle cx="${b[0]}" cy="${by-15}" r="7.5"/><text x="${b[0]}" y="${by-11}" text-anchor="middle">${met?'✓':'✗'}</text></g>`;
   if(L.reqLabels){req+=`<text class="reqlab" x="${b[0]+(bar?18:36)}" y="${by-(bar?44:28)}">${bar?'if F: this must not hold':'if T: this must hold'}${met?' ✓':' ✗ but it '+(bar?'does':'does not')}</text>`;}
   req+=`<path class="imp ${c}" d="M${a[0]} ${ay}C${a[0]} ${ay+h} ${b[0]} ${by-h} ${b[0]} ${by-(bar?2:0)}"${bar?'':` marker-end="url(#mi-${c}-${ex.id})"`}/>${bar?`<line class="imp ${c} barend" x1="${b[0]-8}" y1="${by-2}" x2="${b[0]+8}" y2="${by-2}"/>`:''}`;return;}
   const by=tp?b[1]+11:b[1]-5;let d;
   if(e.from===e.to)d=`M${a[0]-6} ${ay}C${a[0]-22} ${ay+40} ${a[0]+22} ${ay+40} ${a[0]+6} ${ay}`;else if(fromPort&&!tp&&Math.abs(a[0]-b[0])<1)d=`M${a[0]} ${ay}V${by}`;else{const bottom=Math.max(ay,by)+(lay.depth[i]||30);d=`M${a[0]} ${ay}C${a[0]} ${bottom} ${b[0]} ${bottom} ${b[0]} ${by}`;}
   req+=`<path class="imp ${c}" d="${d}"${tp?` marker-end="url(#mi-${c}-${ex.id})"`:''}/>`;});
  F.imp.junc.forEach(j=>{const p=pos[j.id];if(!p||!reach.has(j.id))return;const [x,y]=p;req+=`<g><title>${j.kind==='both'?'Both: every branch must hold.':'One of: at least one branch must hold.'}</title><circle class="jn ${j.kind}" cx="${x}" cy="${y}" r="5"/><text class="ptype" x="${x}" y="${y+17}" text-anchor="middle">${j.kind==='both'?'both':'one of'}</text></g>`;});
  Object.values(F.imp.ports).filter(p=>p.kind==='sent'&&allowP(p.id)).forEach(p=>{const [x,y]=pos[p.id];const r=11;const ruled=F.A.ruled.has(p.id);req+=`<g class="port sent ${p.v}${ruled?' ruled':''}"><title>${p.sent} ${p.v==='T'?'true':'false'} in World ${fi+1}${ruled?': crossed out, because supposing it leads to a conflict':': supposing it leads to no conflict'}.</title><circle cx="${x}" cy="${y}" r="${r}"/>${ruled?`<path class="slash" d="M${x-r+3} ${y+r-3}L${x+r-3} ${y-r+3}"/>`:''}<text x="${x}" y="${y+4}" text-anchor="middle">${p.v}</text></g>`;});}
 else req+=drawTV(ex,F.imp,{pos},TVf);
 // truth lines: one per sentence per world
 let lines='';const names=ex.boxes.map(b=>b.n);const multi=names.length>1;
 if(SH.lines&&SH.worlds)worlds.forEach((w,i)=>{const V=verdict(i);names.forEach((n,bi)=>{const v=V[n];const bx=ex.boxes.find(b=>b.n===n).r;const st=[bx.x+Math.min(bx.w-24,118)+i*26,bx.y+bx.h-12];
  const ex2=px(i)+PW/2+(bi-(names.length-1)/2)*Math.min(70,PW/(names.length+1));const sy=st[1]+12,ey=PY-2;const cls=v==='true'?'tT':v==='false'?'tF':v==='either'?'tE':v==='not yet'?'tE':'tX';
  const t=multi?0.62+0.22*(bi/(names.length-1||1)):0.7;const mx=st[0]+(ex2-st[0])*t,my=sy+(ey-sy)*t;const lab=edgeLabel(v,n,multi)+' W'+(i+1);const lw=lab.length*6.3+16;
  lines+=`<g><title>${n} is ${v} in World ${i+1}.</title><path class="tline ${cls}" d="M${st[0]} ${sy}L${ex2} ${ey}"/><rect class="tchip ${cls}" x="${mx-lw/2}" y="${my-10}" width="${lw}" height="20" rx="10"/><text class="tchipt" x="${mx}" y="${my+4}" text-anchor="middle">${esc(lab)}</text></g>`;});});
 const W2=SH.worlds?Math.max(ex.vb[0]+ex.vb[2],px(worlds.length-1)+PW+10):ex.vb[0]+ex.vb[2];const H=SH.worlds?PY+PH+16:(SH.T||SH.F?band+12:boxBottom+12);
 return `<svg viewBox="${ex.vb[0]} ${ex.vb[1]} ${W2-ex.vb[0]} ${H-ex.vb[1]}" style="max-width:${Math.round((W2-ex.vb[0])*1.25)}px" role="img" aria-label="Drawing of ${esc(ex.sym||'')}">${content}${s}${req}${lines}</svg>`;}
const STEP={};
function lessonHTML(L,idx){const ex=byId(L.ex);if(!WS[idx])WS[idx]=(L.worlds||[{}]).map(w=>({...w}));const steps=L.steps;const si=steps?Math.min(STEP[idx]||0,steps.length-1):0;const SH=steps?steps[si].show:null;if(steps&&steps[si].theory)THEORY=steps[si].theory;if(steps&&steps[si].focus!==undefined&&FOCUS[idx]===undefined)FOCUS[idx]=steps[si].focus;const last=!steps||si===steps.length-1;
 const defs=readBack(ex);const info=defs.__info;delete defs.__info;
 const back=Object.keys(defs).map(n=>n+' := '+show(defs[n])).join('; ');const q=L.quiz;const ans=ANS[idx];const fi=Math.min(FOCUS[idx]||0,WS[idx].length-1);
 const savedTheory=THEORY;
 const MK=MOT[ex.id];const Mf=worldOf(ex,WS[idx][fi]);
 const motion=L.motion&&last?`<div class="motion"><div class="mhead">Watch it run${WS[idx].length>1?' (in World '+(fi+1)+')':''} <button data-act="mstep">Step</button><button data-act="mreset">Reset</button></div>${MK!==undefined?motionPanel(ex,defs,Mf,classicalRun(defs,Mf),MK):'<p>Press Step to watch the values being worked out, one pass at a time.</p>'}</div>`:'';
 const pic=SH&&SH.flow?drawFlow(ex,defs,info):L.space?drawSpace(L,ex,defs,info,SH):drawLesson(L,idx,ex,defs,info,SH);THEORY=savedTheory;
 const wk=worldKeys(ex);
 const nW=SH&&SH.nworlds?SH.nworlds:WS[idx].length;const wctl=wk.length?WS[idx].slice(0,nW).map((w,i)=>`<div class="world">World ${i+1}: ${wk.map(k=>`<button data-wi="${i}" data-w="${k}">${WBT[k](!!w[k])}</button>`).join('')}${nW>1?`<button data-focus="${i}" aria-pressed="${i===fi}">Show why</button>`:''}</div>`).join(''):'';
 const texts=steps?steps[si].text:L.text;
 return `<div class="lgrid"><div class="lt"><div class="lpart">${L.part} · Lesson ${idx+1} of ${LESSONS.length}${steps?` · step ${si+1} of ${steps.length}`:''}</div><h2>${L.title}</h2>${steps?`<div class="stepmarks" role="group" aria-label="Steps in this lesson"><span>Step ${si+1} of ${steps.length}</span>${steps.map((_,k)=>`<button class="smark${k===si?' cur':k<si?' done':''}" data-goto="${k}" aria-label="Go to step ${k+1}" ${k===si?'aria-current="step"':''}></button>`).join('')}${!last?`<button class="showall" data-goto="${steps.length-1}">Show the whole picture</button>`:''}</div>${si===0?`<p class="stephint">This lesson builds up the picture one piece at a time. Read each step, then press <b>Next step</b> under the drawing.</p>`:''}`:''}${texts.map(t=>`<p class="ltext">${t}</p>`).join('')}${SH&&SH.flow?flowPanel(ex,info):''}

 
 <p class="readback">Reads back as: <code>${esc(back)}</code></p>
 ${last?`<div class="tryit"><b>Try this:</b> ${L.tryit}</div>
 <div class="quiz"><p><b>Check:</b> ${q.q}</p><div class="qopts">${q.opts.map((o,i)=>`<button data-q="${i}" class="${ans===undefined?'':i===q.a?'right':ans===i?'wrong':''}">${o}</button>`).join('')}</div>${ans===undefined?'':`<p class="qfb ${ans===q.a?'ok':'no'}">${ans===q.a?'Right.':'Not quite.'} ${q.why}</p>`}</div>`:''}</div><div class="lf"><div class="block">${pic}</div>${L.space?'':(!SH||SH.worlds?wctl:'')}${motion}${L.validity&&(last||(steps&&steps[si].validity))?validityPanel(ex,defs):''}</div></div>`;}
function renderLesson(){const L=LESSONS[LI];const SHnow=L.steps?L.steps[Math.min(STEP[LI]||0,L.steps.length-1)].show:null;const el=document.getElementById('lesson');el.innerHTML=lessonHTML(L,LI);const ex=byId(L.ex);
 el.querySelectorAll('button[data-w]').forEach(b=>b.onclick=()=>{const w=WS[LI][+b.dataset.wi];w[b.dataset.w]=!w[b.dataset.w];delete MOT[ex.id];renderLesson();});
 el.querySelectorAll('button[data-focus]').forEach(b=>b.onclick=()=>{FOCUS[LI]=+b.dataset.focus;delete MOT[ex.id];renderLesson();});
 el.querySelectorAll('.wpanel').forEach(g=>{const go=()=>{FOCUS[LI]=+g.dataset.wi;delete MOT[ex.id];renderLesson();};g.onclick=go;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}};});
 el.querySelectorAll('button[data-t]').forEach(b=>b.onclick=()=>{THEORY=b.dataset.t;delete MOT[ex.id];renderLesson();});
 const st=el.querySelector('[data-act="mstep"]');if(st)st.onclick=()=>{MOT[ex.id]=MOT[ex.id]===undefined?0:MOT[ex.id]+1;ANIM[ex.id]=MOT[ex.id]>0&&!matchMedia('(prefers-reduced-motion: reduce)').matches;renderLesson();ANIM[ex.id]=false;};
 const rs=el.querySelector('[data-act="mreset"]');if(rs)rs.onclick=()=>{delete MOT[ex.id];renderLesson();};
 el.querySelectorAll('button[data-nav]').forEach(b=>{if(!b.textContent.trim()){b.style.visibility='hidden';return;}b.onclick=()=>{const d=+b.dataset.nav;if(!stepTo(d))go(LI+d);keepInView();};});
 el.querySelectorAll('button[data-step]').forEach(b=>b.onclick=()=>{STEP[LI]=Math.max(0,(STEP[LI]||0)+(+b.dataset.step));const st=LESSONS[LI].steps[STEP[LI]];if(st&&st.focus!==undefined)FOCUS[LI]=st.focus;if(st&&st.theory)THEORY=st.theory;renderLesson();});
 el.querySelectorAll('button[data-goto]').forEach(b=>b.onclick=()=>{STEP[LI]=+b.dataset.goto;const st=LESSONS[LI].steps[STEP[LI]];if(st.focus!==undefined)FOCUS[LI]=st.focus;if(st.theory)THEORY=st.theory;renderLesson();});
 el.querySelectorAll('button[data-flow]').forEach(b=>b.onclick=()=>{const exx=byId(LESSONS[LI].ex);const d=readBack(exx);const inf=d.__info;const lesson=LI;
  const one=()=>{if(FLOWBUSY)return;FLOWBUSY=true;el.querySelectorAll('button[data-flow="go"]').forEach(x=>x.disabled=true);flowAnimate(exx,inf,()=>{FLOWBUSY=false;if(LI!==lesson){FLOWAUTO=false;return;}renderLesson();if(FLOWAUTO&&FLOW[exx.id]&&FLOW[exx.id].pass<40)setTimeout(()=>{if(FLOWAUTO&&LI===lesson)one();},350);else FLOWAUTO=false;});};
  if(b.dataset.flow==='reset'){FLOWAUTO=false;delete FLOW[exx.id];renderLesson();}
  else if(b.dataset.flow==='auto'){FLOWAUTO=!FLOWAUTO;renderLesson();if(FLOWAUTO)one();}
  else one();});
 el.querySelectorAll('button[data-q]').forEach(b=>b.onclick=()=>{ANS[LI]=+b.dataset.q;renderLesson();});

 document.querySelectorAll('#dots button').forEach((d,i)=>{d.setAttribute('aria-current',i===LI?'step':'false');d.classList.toggle('done',ANS[i]===LESSONS[i].quiz.a);});
 syncLogic();if(SHnow&&SHnow.flow){const exx=byId(LESSONS[LI].ex);const d=readBack(exx);flowStart(exx,d.__info);}else FLOWRUN++;updateNavbar();history.replaceState(null,'','#lesson-'+(LI+1));}
function updateNavbar(){const Ls=LESSONS[LI].steps;const si=Ls?Math.min(STEP[LI]||0,Ls.length-1):0;const last=!Ls||si===Ls.length-1;const nx=document.getElementById('navnext'),bk=document.getElementById('navback');
 nx.textContent=last?(LI<LESSONS.length-1?'Next lesson →':'End of the tutorial'):'Next step →';nx.disabled=last&&LI===LESSONS.length-1;
 bk.textContent=si>0?'← Back a step':'← Previous lesson';bk.disabled=LI===0&&si===0;
 document.getElementById('navinfo').textContent=`Lesson ${LI+1} of ${LESSONS.length}${Ls?` · step ${si+1} of ${Ls.length}`:''}${last&&LI<LESSONS.length-1?' · try the check before moving on':''}`;}
document.getElementById('navnext').onclick=()=>{if(!stepTo(1))go(LI+1);keepInView();};
document.getElementById('navback').onclick=()=>{if(!stepTo(-1)){if(LI>0){go(LI-1);const Lp=LESSONS[LI].steps;if(Lp){STEP[LI]=Lp.length-1;renderLesson();}}}keepInView();};
function go(i){FLOWAUTO=false;LI=Math.max(0,Math.min(LESSONS.length-1,i));renderLesson();keepInView();}
function keepInView(){const el=document.getElementById('lesson');if(window.matchMedia('(min-width: 981px)').matches){el.scrollIntoView({block:'start',behavior:'instant'});}else{const r=el.getBoundingClientRect();if(r.top<0)el.scrollIntoView({block:'start',behavior:'instant'});}}
function syncLogic(){document.querySelectorAll('#logic button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.l===THEORY));document.getElementById('logicdesc').textContent=LOGICDESC[THEORY];}
const LOGICDESC={classical:'Two values, true and false. Every world settles every claim.',kripke:'Three values: true, false, or neither. A world may leave a claim unsettled (Kleene), and a sentence that never gets grounded in the facts has no value (Kripke).',gaifman:'Gaifman’s pointer semantics for sentences about truth: a closed loop gets a gap, and a sentence that correctly calls a gap “not true” is true. Worlds stay classical.'};
document.querySelectorAll('#logic button').forEach(b=>b.onclick=()=>{THEORY=b.dataset.l;Object.keys(MOT).forEach(k=>delete MOT[k]);renderLesson();});
const dots=document.getElementById('dots');LESSONS.forEach((L,i)=>{const b=document.createElement('button');b.textContent=i+1;b.title=L.title;b.onclick=()=>go(i);dots.appendChild(b);});
function stepTo(d){FLOWAUTO=false;const Ls=LESSONS[LI].steps;const si=Ls?Math.min(STEP[LI]||0,Ls.length-1):0;if(Ls&&si+d>=0&&si+d<Ls.length){STEP[LI]=si+d;const st=Ls[STEP[LI]];if(st.focus!==undefined)FOCUS[LI]=st.focus;renderLesson();return true;}return false;}

const m=location.hash.match(/lesson-(\d+)/);go(m?+m[1]-1:0);
