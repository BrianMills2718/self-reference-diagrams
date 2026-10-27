const assert=require('node:assert/strict');
const E=require('./combined.js');
const copy=x=>JSON.parse(JSON.stringify(x));
const sentence=(name,pred,kind,v)=>({name,area:{lines:[],items:[{t:'claim',pred,fill:[{kind,v}]}]}});
const examples=[
 [sentence('S','Falling','name','Snow')],
 [sentence('S','IsTrue','sent','S')],
 [sentence('S','IsTrue','sent','Q'),sentence('Q','Falling','name','Snow')]
];
let checked=0;
function rejects(read,picture,rule){assert.throws(()=>read(picture),e=>e.rule===rule);checked++;}
for(const text of examples){
 const shapes=E.layout(text),graph=E.graphLayout(text);
 assert.equal(E.printText(E.readBack(shapes)),E.printText(text));
 assert.equal(E.printText(E.graphReadBack(graph)),E.printText(text));
 const key=shapes.refArrows.length?'refArrows':'roleArrows';
 let bad=copy(shapes);bad[key][0].from=[-999,-999];rejects(E.readBack,bad,'D3');
 bad=copy(shapes);bad[key][0].cap='missing';rejects(E.readBack,bad,'D3');
 bad=copy(shapes);bad[key].push(copy(bad[key][0]));rejects(E.readBack,bad,'D3');
 bad=copy(shapes);bad[key][0].role='unknown';rejects(E.readBack,bad,'D3');
 let broken=copy(graph);broken.edges.push(copy(broken.edges.find(e=>e.kind==='role')));rejects(E.graphReadBack,broken,'G3');
 broken=copy(graph);broken.edges.find(e=>e.kind==='role').label='unknown';rejects(E.graphReadBack,broken,'G3');
}
// A valid origin on the wrong claim must not be accepted via the hidden ID.
const pair=E.layout([sentence('S','Falling','name','Snow'),sentence('Q','Falling','name','Wind')]);
pair.roleArrows[0].from=copy(pair.roleArrows[1].from);rejects(E.readBack,pair,'D3');
// A second, conflicting filler must not be silently selected or overwritten.
const graph=E.graphLayout([sentence('S','Falling','name','Snow'),sentence('Q','Falling','name','Wind')]);
const roles=graph.edges.filter(e=>e.kind==='role');graph.edges.push({...copy(roles[0]),to:copy(roles[1].to)});rejects(E.graphReadBack,graph,'G3');
console.log('reader regression cases rejected',checked);
