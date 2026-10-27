// Finite classical fixed points, independent of the unfolding demonstration.
// The domain contains named objects; truth assignments must satisfy ALL definitions.
// A limit or unsupported input never supplies a semantic verdict.
(function(root){
 const vocabulary=typeof module!=='undefined'?require('./engine.js'):{PREDS,THINGS};
 function solveClassical(text,world,options={}){
  const domain=options.domain||vocabulary.THINGS;
  const maxAssignments=options.maxAssignments??65536,maxWork=options.maxWork??1000000;
  let work=0;
  class Stop extends Error{constructor(status,message){super(message);this.status=status;}}
  const unsupported=message=>{throw new Stop('unsupported',message);};
  const tick=()=>{if(++work>maxWork)throw new Stop('limit','Evaluation work limit reached');};
  try{
   if(!Number.isSafeInteger(maxWork)||maxWork<1||!Number.isSafeInteger(maxAssignments)||maxAssignments<1)unsupported('Limits must be positive safe integers');
   if(!Array.isArray(domain)||!domain.length||domain.some(x=>typeof x!=='string')||new Set(domain).size!==domain.length)unsupported('Use a nonempty finite domain of distinct named objects');
   if(!Array.isArray(text)||!text.length||!world)unsupported('Supply sentence definitions and a world');
   const names=text.map(d=>d&&d.name);
   if(names.some(n=>typeof n!=='string'||!n)||new Set(names).size!==names.length)unsupported('Sentence names must be distinct nonempty strings');
   function validate(area,scope,depth){
    tick();if(depth>128)unsupported('Maximum supported nesting depth is 128');
    if(!area||!Array.isArray(area.lines)||!Array.isArray(area.items))unsupported('Malformed area');
    const local=new Set(scope);
    for(const line of area.lines){
     if(!line||line.sort!=='thing'||!['string','number'].includes(typeof line.id)||local.has(line.id))unsupported('Use distinct thing variables in each scope');
     local.add(line.id);
    }
    for(const item of area.items){
     tick();if(item&&item.t==='enc'){validate(item.area,local,depth+1);continue;}
     const roles=item&&Object.hasOwn(vocabulary.PREDS,item.pred)&&vocabulary.PREDS[item.pred];
     if(!item||item.t!=='claim'||!roles||!Array.isArray(item.fill)||item.fill.length!==roles.length)unsupported('Unsupported predicate or malformed claim');
     if(item.pred!=='IsTrue'&&!(world[item.pred] instanceof Set))unsupported('World must supply a fact set for '+item.pred);
     item.fill.forEach((f,i)=>{
      if(!f)unsupported('Missing role filler');
      if(roles[i][1]==='sentence'){
       if(f.kind!=='sent'||!names.includes(f.v))unsupported('Truth must refer to a defined sentence');
      }else if(f.kind==='var'){
       if(!local.has(f.v))unsupported('Variable is outside its scope');
      }else if(f.kind!=='name'||!domain.includes(f.v))unsupported('Name is outside the finite domain');
     });
    }
   }
   text.forEach(d=>validate(d.area,new Set(),0));
   const total=2**names.length;
   if(!Number.isSafeInteger(total)||total>maxAssignments)throw new Stop('limit','Assignment limit reached');
   const fixedPoints=[],candidates=[];
   function value(area,assignment,env){
    tick();
    function quantify(i,bindings){
     tick();if(i<area.lines.length)return domain.some(object=>{const next=new Map(bindings);next.set(area.lines[i].id,object);return quantify(i+1,next);});
     return area.items.every(item=>{
      tick();if(item.t==='enc')return !value(item.area,assignment,bindings);
      if(item.pred==='IsTrue')return assignment[item.fill[0].v];
      return world[item.pred].has(item.fill.map(f=>f.kind==='var'?bindings.get(f.v):f.v).join('|'));
     });
    }
    return quantify(0,env);
   }
   for(let mask=0;mask<total;mask++){
    tick();const assignment=Object.fromEntries(names.map((name,i)=>[name,Math.floor(mask/2**i)%2===1]));
    const values=Object.fromEntries(text.map(d=>[d.name,value(d.area,assignment,new Map())]));
    const consistent=names.every(n=>assignment[n]===values[n]);
    if(consistent)fixedPoints.push(assignment);
    if(total<=256)candidates.push({assignment,values,consistent});
   }
   const verdicts=Object.fromEntries(names.map(n=>[n,!fixedPoints.length?'no-model':fixedPoints.every(a=>a[n])?'true':fixedPoints.every(a=>!a[n])?'false':'either']));
   return {status:'complete',verdicts,fixedPoints,candidates,checked:total,work};
  }catch(error){if(error instanceof Stop)return {status:error.status,reason:error.message};throw error;}
 }
 if(typeof module!=='undefined')module.exports={solveClassical};else root.solveClassical=solveClassical;
})(globalThis);
