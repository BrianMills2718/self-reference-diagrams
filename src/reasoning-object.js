/* Experimental finite Boolean reasoning objects. No dependency on legacy UI. */
'use strict';
const ReasoningObject = (() => {
  const fail = message => { throw new Error(message); };
  const bits = n => Array.from({length: 2 ** n}, (_, k) =>
    Array.from({length:n}, (_, i) => Boolean(k & (1 << i))));
  const tables = {
    equal: [[false,false],[true,true]],
    not: [[false,true],[true,false]],
    and: [[false,false,false],[false,true,false],[true,false,false],[true,true,true]]
  };
  const freeze = x => { if (x && typeof x === 'object') { Object.values(x).forEach(freeze); Object.freeze(x); } return x; };
  function compile(source) {
    const syntax = JSON.parse(JSON.stringify(source));
    if (syntax.version !== 1 || !Array.isArray(syntax.facts) || !Array.isArray(syntax.sentences) || !syntax.sentences.length) fail('Invalid syntax header');
    const variables = [], constraints = [], ids = new Set();
    function variable(id, kind, label) {
      if (typeof id !== 'string' || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(id) || ids.has(id)) fail('Invalid or duplicate ID');
      ids.add(id); variables.push({id,kind,label:label || id});
    }
    syntax.facts.forEach(f => variable(f.id, 'world-fact', f.label));
    syntax.sentences.forEach(s => variable(s.id, 'sentence-value', s.label));
    const facts = new Set(syntax.facts.map(f=>f.id));
    const sentences = new Set(syntax.sentences.map(s=>s.id));
    function relation(id, rule, vars, origin) { constraints.push({id,rule,vars,origin}); }
    function walk(node) {
      if (!node || typeof node !== 'object') fail('Missing expression');
      variable(node.id, 'expression-value', node.label);
      if (node.op === 'fact' || node.op === 'reference') {
        if (!(node.op === 'fact' ? facts : sentences).has(node.target)) fail('Unknown or incorrectly typed target');
        relation('c-'+node.id, 'equal', [node.target,node.id], node.id);
      } else if (node.op === 'not') {
        walk(node.arg); relation('c-'+node.id, 'not', [node.arg.id,node.id], node.id);
      } else if (node.op === 'and') {
        walk(node.left); walk(node.right);
        relation('c-'+node.id, 'and', [node.left.id,node.right.id,node.id], node.id);
      } else fail('Unsupported expression operator');
    }
    syntax.sentences.forEach(s => { walk(s.body); relation('definition-'+s.id,'equal',[s.body.id,s.id],s.id); });
    if (variables.length > 16) fail('Unsupported size: at most 16 Boolean variables; no semantic verdict');
    return freeze({version:1,syntax,variables,constraints,worldScope:{kind:'all-boolean-fact-assignments',facts:[...facts]}});
  }
  function checkContext(object, context) {
    if (!context || typeof context.id !== 'string' || !context.id || !Array.isArray(context.assumptions)) fail('Invalid context');
    const vars = new Set(object.variables.map(v=>v.id)), seen = new Set();
    for (const a of context.assumptions) {
      if (!vars.has(a.variable) || typeof a.value !== 'boolean' || seen.has(a.variable)) fail('Invalid or repeated assumption');
      seen.add(a.variable);
    }
  }
  function compatibleRows(c, known) {
    return tables[c.rule].filter(row => c.vars.every((v,i)=>!known.has(v) || known.get(v).value === row[i]));
  }
  function explore(object, context) {
    checkContext(object,context);
    const records=[], known=new Map();
    function add(record) {
      record={id:'step-'+records.length,context:context.id,...record}; records.push(record);
      if (record.kind !== 'conflict') known.set(record.variable,record);
    }
    context.assumptions.forEach(a=>add({kind:'assumption',...a}));
    let changed=true;
    while (changed) {
      changed=false;
      for (const c of object.constraints) {
        const premises=c.vars.filter(v=>known.has(v)).map(v=>known.get(v).id);
        const rows=compatibleRows(c,known);
        if (!rows.length) {
          add({kind:'conflict',constraint:c.id,premises});
          return freeze({context,records,status:'conflict'});
        }
        const index=c.vars.findIndex((v,i)=>!known.has(v) && rows.every(r=>r[i]===rows[0][i]));
        if (index>=0) {
          add({kind:'inference',constraint:c.id,premises,variable:c.vars[index],value:rows[0][index]});
          changed=true;
        }
      }
    }
    return freeze({context,records,status:known.size===object.variables.length?'complete-assignment':'open'});
  }
  // Verify only cited premises against the named relation, never the generator's state.
  function verify(object, trace) {
    checkContext(object,trace.context);
    const previous=new Map(), assigned=new Set(); let assumptions=0, closed=false;
    for (const r of trace.records) {
      if (closed || typeof r.id!=='string' || !r.id || previous.has(r.id) || r.context!==trace.context.id) fail('Invalid record scope/order');
      if (r.kind==='assumption') {
        const a=trace.context.assumptions[assumptions++];
        if (previous.size!==assumptions-1 || !a || a.variable!==r.variable || a.value!==r.value) fail('Unlicensed assumption');
      } else {
        if (assumptions!==trace.context.assumptions.length) fail('Missing assumptions');
        const c=object.constraints.find(c=>c.id===r.constraint);
        if (!c || !Array.isArray(r.premises) || new Set(r.premises).size!==r.premises.length) fail('Invalid constraint/premises');
        const known=new Map();
        for (const id of r.premises) {
          const p=previous.get(id);
          if (!p || p.kind==='conflict' || !c.vars.includes(p.variable)) fail('Invalid premise reference');
          known.set(p.variable,p);
        }
        const rows=compatibleRows(c,known);
        if (r.kind==='conflict') {
          if (rows.length) fail('Unjustified conflict');
          closed=true;
        } else if (r.kind==='inference') {
          const i=c.vars.indexOf(r.variable);
          if (i<0 || !rows.length || typeof r.value!=='boolean' || !rows.every(row=>row[i]===r.value)) fail('Unsound inference');
        } else fail('Unknown record kind');
      }
      if (r.kind!=='conflict') {
        if (assigned.has(r.variable)) fail('Repeated assignment');
        assigned.add(r.variable);
      }
      previous.set(r.id,r);
    }
    if (assumptions!==trace.context.assumptions.length) fail('Missing assumptions');
    const expected=closed?'conflict':assigned.size===object.variables.length?'complete-assignment':'open';
    if (trace.status!==expected) fail('Incorrect status');
    if (expected==='complete-assignment') {
      const known=new Map([...previous.values()].map(r=>[r.variable,r]));
      if (object.constraints.some(c=>!compatibleRows(c,known).length)) fail('Inconsistent complete assignment');
    }
    return true;
  }
  function solve(object, context={id:'root',assumptions:[]}) {
    checkContext(object,context);
    const ids=object.variables.map(v=>v.id);
    return bits(ids.length).map(row=>Object.fromEntries(ids.map((id,i)=>[id,row[i]])))
      .filter(a=>context.assumptions.every(h=>a[h.variable]===h.value) && object.constraints.every(c=>
        tables[c.rule].some(row=>c.vars.every((v,i)=>a[v]===row[i]))));
  }
  function project(object, context, visible) {
    const ids=new Set(object.variables.map(v=>v.id));
    if (new Set(visible).size!==visible.length || visible.some(v=>!ids.has(v))) fail('Invalid projection');
    const groups=new Map();
    solve(object,context).forEach(witness=>{
      const values=Object.fromEntries(visible.map(v=>[v,witness[v]])), key=JSON.stringify(values);
      if (!groups.has(key)) groups.set(key,{values,witnesses:[]});
      groups.get(key).witnesses.push(witness);
    });
    return {kind:'exact-existential-projection',context,visible,groups:[...groups.values()]};
  }
  const snow=()=>compile({version:1,facts:[{id:'p',label:'Snow is falling'}],sentences:[{
    id:'S',label:'This sentence',body:{id:'body',op:'and',left:{id:'snow',op:'fact',target:'p'},
      right:{id:'negative',op:'not',arg:{id:'reference',op:'reference',target:'S'}}}
  }]});
  return {compile,explore,verify,solve,project,snow};
})();
if (typeof module !== 'undefined') module.exports = ReasoningObject;
