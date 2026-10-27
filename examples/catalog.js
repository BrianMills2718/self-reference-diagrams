// Named fixtures in the engine's existing area syntax. No new visual marks.
const area=(...items)=>({lines:[],items});
const claim=(pred,...fill)=>({t:'claim',pred,fill});
const name=v=>({kind:'name',v}),sentence=v=>({kind:'sent',v}),variable=v=>({kind:'var',v});
const not=a=>({t:'enc',area:a});
const truth=s=>claim('IsTrue',sentence(s));
const snow=()=>claim('Falling',name('Snow')),wind=()=>claim('Blowing',name('Wind'));
const definition=(name,body)=>({name,area:body});
const P={id:'p',pred:'Falling',args:['Snow']},Q={id:'q',pred:'Blowing',args:['Wind']};
const row=(world,...models)=>({world,models});
const teaching=[
 {id:'E01',title:'An ordinary fact',atoms:[P],text:[definition('S',area(snow()))],
  expected:[row({p:false},{S:false}),row({p:true},{S:true})]},
 {id:'E02a',title:'Negation',atoms:[P],text:[definition('S',area(not(area(snow()))))],
  expected:[row({p:false},{S:true}),row({p:true},{S:false})]},
 {id:'E02b',title:'Conjunction',atoms:[P,Q],text:[definition('S',area(snow(),wind()))],
  expected:[row({p:false,q:false},{S:false}),row({p:false,q:true},{S:false}),row({p:true,q:false},{S:false}),row({p:true,q:true},{S:true})]},
 {id:'E03',title:'Truth-teller',atoms:[],text:[definition('S',area(truth('S')))],
  expected:[row({},{S:false},{S:true})]},
 {id:'E04',title:'Liar',atoms:[],text:[definition('S',area(not(area(truth('S')))))],
  expected:[row({})]},
 {id:'E05',title:'When the world decides',atoms:[P],text:[definition('S',area(snow(),not(area(truth('S')))))],
  expected:[row({p:false},{S:false}),row({p:true})]},
 {id:'E06a',title:'Distributed liar',atoms:[],text:[definition('A',area(not(area(truth('B'))))),definition('B',area(truth('A')))],
  expected:[row({})]},
 {id:'E06b',title:'Two negations around a cycle',atoms:[],text:[definition('A',area(not(area(truth('B'))))),definition('B',area(not(area(truth('A')))))],
  expected:[row({},{A:false,B:true},{A:true,B:false})]}
];
function size(n){if(!Number.isSafeInteger(n)||n<1)throw Error('Size must be a positive safe integer');}
function cycle(n,negativeEdges=[]){
 size(n);if(new Set(negativeEdges).size!==negativeEdges.length||negativeEdges.some(i=>!Number.isInteger(i)||i<0||i>=n))throw Error('Invalid negative edge indices');
 return Array.from({length:n},(_,i)=>definition('S'+i,negativeEdges.includes(i)?area(not(area(truth('S'+((i+1)%n))))):area(truth('S'+((i+1)%n)))));
}
function truthTellers(n){size(n);return Array.from({length:n},(_,i)=>definition('S'+i,area(truth('S'+i))));}
// One block: A = not(B and C), B = A, C = ordinary fact p.
// p false gives (A,B,C)=(true,true,false); p true gives no model.
function branching(objects){
 if(!objects.length||new Set(objects).size!==objects.length)throw Error('Distinct world objects required');
 return {atoms:objects.map((object,i)=>({id:'p'+i,pred:'Falling',args:[object]})),
  text:objects.flatMap((object,i)=>[
   definition('A'+i,area(not(area(truth('B'+i),truth('C'+i))))),
   definition('B'+i,area(truth('A'+i))),
   definition('C'+i,area(claim('Falling',name(object))))
  ])};
}
const loves=(a,b)=>claim('Loves',variable(a),variable(b));
const exists=(id,body)=>({lines:[{id,sort:'thing'}],items:body.items});
const every=(id,body)=>area(not(exists(id,area(not(body)))));
const quantifiers=[
 definition('EachSome',every('x',exists('y',area(loves('x','y'))))),
 definition('SomeAll',exists('y',every('x',area(loves('x','y')))))
];
const disconnected=[definition('L',area(not(area(truth('L'))))),definition('Q',area(snow()))];
module.exports={teaching,cycle,truthTellers,branching,quantifiers,disconnected};
