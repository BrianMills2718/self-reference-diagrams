// ===== drawing value layers: sentences in a row, true layer above, false layer below; a crossing at each "not" =====
function drawLayers(text,opt){opt=opt||{};const imp=implication(text);const names=imp.names;const n=names.length;const T='#1D9E75',F='#D85A30';
 const X=i=>120+i*150,YT=90,YF=210,Y=v=>v?YT:YF;const W=X(n-1)+110,H=300;
 const s=sel('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':opt.label||'Value layers',class:'lsvg'});
 const lt=stext(s,14,YT-58,'true layer',{'font-size':12,fill:T,'font-weight':700});const lf=stext(s,14,YF+70,'false layer',{'font-size':12,fill:F,'font-weight':700});
 const pos=k=>[X(names.indexOf(k.slice(0,-1))),Y(k.endsWith('T'))];
 const notMark=(x,y)=>{sel('rect',{x:x-17,y:y-11,width:34,height:22,rx:8,fill:'var(--card)',stroke:'var(--line)','stroke-width':1.2,'stroke-dasharray':'4 3'},s);stext(s,x,y+4,'not',{'font-size':10.5,'font-weight':700,fill:'var(--quiet)','text-anchor':'middle'});};
 const marks=[];
 const halves=(P0,P1,P2,P3)=>{const m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];const Q1=m(P0,P1),H=m(P1,P2),R2=m(P2,P3),Q2=m(Q1,H),R1=m(H,R2),M=m(Q2,R1);
  return [`M${P0[0]} ${P0[1]}C${Q1[0]} ${Q1[1]} ${Q2[0]} ${Q2[1]} ${M[0]} ${M[1]}`,`M${M[0]} ${M[1]}C${R1[0]} ${R1[1]} ${R2[0]} ${R2[1]} ${P3[0]} ${P3[1]}`,M];};
 const route=(from,to,vFrom,vTo,lane)=>{const [ax,ay]=from,[bx,by]=to;const flip=vFrom!==vTo;const cA=vFrom?T:F,cB=vTo?T:F;
  if(bx>ax){const mx=(ax+bx)/2;const [d1,d2,M]=halves([ax+16,ay],[mx,ay],[mx,by],[bx-16,by]);if(!flip)return [[d1,cA],[d2,cA]];marks.push(M);return [[d1,cA],[d2,cB]];}
  // wrap-around: right, round the outside of the target's layer, in from the left; split at the "not" only when the value flips
  const rx=X(n-1)+60+lane*16,outer=vTo?YT-44-lane*12:YF+44+lane*12,lx=X(0)-58-lane*12,r=12;const up=outer<ay?-1:1,dn=by<outer?-1:1;const my=(YT+YF)/2;
  const tail=`Q${rx} ${outer} ${rx-r} ${outer}H${lx+r}Q${lx} ${outer} ${lx} ${outer+dn*r}V${by-dn*r}Q${lx} ${by} ${lx+r} ${by}H${bx-16}`;
  if(!flip)return [[`M${ax+16} ${ay}H${rx-r}Q${rx} ${ay} ${rx} ${ay+up*r}V${outer-up*r}`+tail,cA]];
  marks.push([rx,my]);return [[`M${ax+16} ${ay}H${rx-r}Q${rx} ${ay} ${rx} ${ay+up*r}V${my}`,cA],[`M${rx} ${my}V${outer-up*r}`+tail,cB]];};
 let lane=0;
 Object.entries(imp.out).forEach(([k,e])=>{const from=pos(k),vFrom=k.endsWith('T');
  if(e.to.length===1){const tk=e.to[0];const to=pos(tk);const wrap=to[0]<=from[0];route(from,to,vFrom,tk.endsWith('T'),wrap?lane++:0).forEach(([d,c])=>sel('path',{d,fill:'none',stroke:c,'stroke-width':3.2,opacity:0.9},s));}
  else{const jx=from[0]+42,jy=from[1]+(vFrom?24:-24);sel('path',{d:`M${from[0]} ${from[1]+(vFrom?14:-14)}L${jx} ${jy}`,stroke:vFrom?T:F,'stroke-width':3,fill:'none'},s);
   sel('circle',{cx:jx,cy:jy,r:6,fill:e.kind==='both'?(vFrom?T:F):'var(--card)',stroke:vFrom?T:F,'stroke-width':2},s);stext(s,jx+9,jy+(vFrom?14:-6),e.kind==='both'?'both':'one of',{'font-size':10,fill:'var(--quiet)'});
   e.to.forEach(tk=>{const to=pos(tk);const self=to[0]===from[0]&&to[1]===from[1];const flip=vFrom!==tk.endsWith('T');
    const d=self?`M${jx} ${jy}C${jx+50} ${jy} ${to[0]+50} ${to[1]} ${to[0]+16} ${to[1]}`:`M${jx} ${jy}C${(jx+to[0])/2} ${jy} ${(jx+to[0])/2} ${to[1]} ${to[0]+(to[0]<jx?16:-16)} ${to[1]}`;
    const mx=(jx+to[0])/2;const end=to[0]+(to[0]<jx?16:-16);const [h1,h2,M]=halves([jx,jy],[mx,jy],[mx,to[1]],[end,to[1]]);if(flip&&!self)marks.push(M);const d1=self?d:h1,d2=h2;sel('path',{d:d1,fill:'none',stroke:vFrom?T:F,'stroke-width':2.4,opacity:0.85},s);if(!self)sel('path',{d:d2,fill:'none',stroke:tk.endsWith('T')?T:F,'stroke-width':2.4,opacity:0.85},s);});}});
 const merged=[];marks.forEach(m=>{if(!merged.some(q=>Math.abs(q[0]-m[0])<40&&Math.abs(q[1]-m[1])<30))merged.push(m);});merged.forEach(([x,y])=>notMark(x,y));
 const fps=opt.fps||[];
 names.forEach((nm,i)=>[true,false].forEach(v=>{const chosen=fps.length===1&&fps[0][nm]===v;sel('circle',{cx:X(i),cy:Y(v),r:16,fill:'var(--card)',stroke:v?T:F,'stroke-width':chosen?5:2},s);stext(s,X(i),Y(v)+4,nm,{'font-size':12,'font-weight':700,'text-anchor':'middle'});}));
 return s;}
