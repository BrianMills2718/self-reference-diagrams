"""Finite Boolean research checker. Standard library only; no legacy engine imports.

Run: python3 research/diagram-demo/check.py
"""
from itertools import product
import re


def assignments(names):
    return (dict(zip(names, bits)) for bits in product((False, True), repeat=len(names)))


def evaluate(node, world, values):
    op = node[0]
    if op == 'fact':
        return world[node[1]]
    if op == 'ref':
        return values[node[1]]
    if op == 'not':
        return not evaluate(node[1], world, values)
    if op == 'and':
        return all(evaluate(n, world, values) for n in node[1:])
    raise ValueError(op)


def oracle(facts, definitions):
    """Direct compositional semantics, with no compiled constraints."""
    return [w | v for w in assignments(facts) for v in assignments(list(definitions))
            if all(v[s] == evaluate(body, w, v) for s, body in definitions.items())]


def factor(fid, variables, predicate, source):
    """An extensional relation: an explicit set of permitted tuples."""
    scope = list(dict.fromkeys(variables))
    return {'id': fid, 'scope': scope, 'source': source,
            'rows': [list(a[x] for x in scope) for a in assignments(scope) if predicate(a)]}


def compile_object(oid, facts, definitions):
    """Tseitin-style relational encoding, retaining occurrence and reference identities.

    Each constructor gets a fresh auxiliary variable. A reference occurrence gets
    an equality constraint; it is never replaced by recursive unfolding.
    """
    if set(facts) & set(definitions) or len(facts) != len(set(facts)):
        raise ValueError('Facts and sentence identifiers must be distinct')
    if not all(isinstance(x, str) and re.fullmatch(r'[A-Za-z][A-Za-z0-9_]*', x)
               for x in list(facts) + list(definitions)):
        raise ValueError('Identifiers must be simple names, disjoint from occurrence paths')
    obj = {'id': oid, 'profile': 'finite-classical-agreement', 'facts': facts,
           'definitions': definitions, 'variables': list(facts) + list(definitions),
           'occurrences': {}, 'factors': [],
           'world_scope': {'vary': facts, 'cases': list(assignments(facts)),
                           'policy': 'All Boolean combinations of listed observations; other facts ignored'},
           'ordinary_signature': {
               'entities': ['entity:snow', 'entity:wind'],
               'names': {'Snow': 'entity:snow', 'Wind': 'entity:wind'},
               'observations': {'p': {'predicate': 'Falling', 'arguments': ['Snow']},
                                'q': {'predicate': 'Blowing', 'arguments': ['Wind']}}}}

    def visit(node, path):
        if not isinstance(node, (tuple, list)) or not node:
            raise ValueError('Expected a nonempty expression')
        op = node[0]
        out = '@' + path
        obj['variables'].append(out)
        obj['occurrences'][path] = {'op': op, 'value': out, 'children': []}
        if op in ('fact', 'ref'):
            if len(node) != 2:
                raise ValueError('Leaf constructors take exactly one identifier')
            target = node[1]
            if target not in (facts if op == 'fact' else definitions):
                raise ValueError('Unknown ' + op + ': ' + target)
            obj['occurrences'][path]['target'] = target
            f = factor('f:' + path, [out, target], lambda a: a[out] == a[target], path)
        else:
            if op not in ('not', 'and') or (op == 'not' and len(node) != 2):
                raise ValueError('Malformed constructor')
            childpaths = [path + '/' + str(i) for i in range(len(node) - 1)]
            args = [visit(n, p) for n, p in zip(node[1:], childpaths)]
            obj['occurrences'][path]['children'] = childpaths
            if op == 'not':
                f = factor('f:' + path, [out] + args,
                           lambda a: a[out] != a[args[0]], path)
            else:
                f = factor('f:' + path, [out] + args,
                           lambda a: a[out] == all(a[x] for x in args), path)
        obj['factors'].append(f)
        return out

    for sentence, body in definitions.items():
        root = visit(body, sentence + '/body')
        obj['factors'].append(factor('agree:' + sentence, [sentence, root],
                                    lambda a, s=sentence, r=root: a[s] == a[r], sentence))
    return obj


def holds(f, a):
    return [a[x] for x in f['scope']] in f['rows']


def extend(obj, base):
    """Unique syntax-directed extension of an ordinary candidate, even if it fails agreement."""
    a = dict(base)
    for path, occ in sorted(obj['occurrences'].items(), key=lambda p: -p[0].count('/')):
        op = occ['op']
        if op in ('fact', 'ref'):
            a[occ['value']] = a[occ['target']]
        else:
            vals = [a[obj['occurrences'][c]['value']] for c in occ['children']]
            a[occ['value']] = (not vals[0]) if op == 'not' else all(vals)
    return a


def candidates(obj):
    out = []
    for i, base in enumerate(assignments(obj['facts'] + list(obj['definitions']))):
        a = extend(obj, base)
        failed = [f['id'] for f in obj['factors'] if not holds(f, a)]
        out.append({'id': obj['id'] + ':case:' + str(i), 'assignment': a,
                    'failed': failed, 'consistent': not failed})
    return out


def brute_models(obj):
    """Enumerate ALL compiled variables, independently of extend/evaluate."""
    return [a for a in assignments(obj['variables']) if all(holds(f, a) for f in obj['factors'])]


def propagate(obj, assumptions):
    """Generalized arc consistency: remove values unsupported at one incident relation.

    Trace entries give the exact pre-step domains and referenced factor. This is
    local propagation, not a complete global solver; an unchanged state is OPEN.
    """
    domains = {x: [False, True] for x in obj['variables']}
    for x, value in assumptions.items():
        if x not in domains or type(value) is not bool:
            raise ValueError('Malformed assumption')
        domains[x] = [value]
    trace = []
    while True:
        changed = False
        for f in obj['factors']:
            for x in f['scope']:
                compatible = [row for row in f['rows']
                              if all(v in domains[y] for y, v in zip(f['scope'], row))]
                keep = [v for v in domains[x] if any(row[f['scope'].index(x)] == v
                                                    for row in compatible)]
                if keep != domains[x]:
                    trace.append({'factor': f['id'], 'variable': x,
                                  'before': {y: list(domains[y]) for y in f['scope']},
                                  'after': keep})
                    domains[x] = keep
                    changed = True
                    if not keep:
                        return {'assumptions': assumptions, 'steps': trace,
                                'domains': domains, 'status': 'conflict'}
        if not changed:
            return {'assumptions': assumptions, 'steps': trace,
                    'domains': domains, 'status': 'open'}


def verify_trace(obj, result):
    """Replay local finite certificates. Does not call the trace producer."""
    d = {x: {False, True} for x in obj['variables']}
    for x, v in result['assumptions'].items():
        assert x in d and type(v) is bool
        d[x] = {v}
    fs = {f['id']: f for f in obj['factors']}
    for step in result['steps']:
        assert all(d.values()), 'Steps after a closed branch are forbidden'
        f, x = fs[step['factor']], step['variable']
        assert x in f['scope']
        assert step['before'] == {y: sorted(d[y]) for y in f['scope']}
        supported = set()
        for row in f['rows']:
            if all(v in d[y] for y, v in zip(f['scope'], row)):
                supported.add(row[f['scope'].index(x)])
        wanted = d[x] & supported
        assert wanted != d[x] and len(step['after']) == len(set(step['after']))
        assert set(step['after']) == wanted
        d[x] = wanted
    assert {x: sorted(v) for x, v in d.items()} == result['domains']
    assert result['status'] == ('conflict' if any(not v for v in d.values()) else 'open')
    return True


def project(cases, visible, condition=lambda c: True):
    """Exact joint projection with reconstructible witnesses, retaining case identity."""
    groups = {}
    for c in cases:
        if condition(c):
            key = tuple(c['assignment'][x] for x in visible)
            groups.setdefault(key, []).append(c['id'])
    return [{'values': dict(zip(visible, k)), 'witnesses': v} for k, v in sorted(groups.items())]


def search(obj, assumptions=None, context='root'):
    assumptions = dict(assumptions or {})
    trace = propagate(obj, assumptions)
    node = {'context': context, 'trace': trace}
    if trace['status'] == 'conflict':
        node['kind'] = 'closed'
        return node
    split = next((x for x in obj['variables'] if len(trace['domains'][x]) > 1), None)
    if split is None:
        witness = {x: vals[0] for x, vals in trace['domains'].items()}
        assert all(holds(f, witness) for f in obj['factors'])
        node.update(kind='witness', assignment=witness)
        return node
    node.update(kind='split', variable=split,
                children=[search(obj, assumptions | {split: v}, context + '/' + str(int(v)))
                          for v in (False, True)])
    return node


def verify_search(obj, node, assumptions=None, context='root'):
    assumptions = dict(assumptions or {})
    assert node['context'] == context and node['trace']['assumptions'] == assumptions
    verify_trace(obj, node['trace'])
    if node['kind'] == 'closed':
        assert node['trace']['status'] == 'conflict'
        return []
    assert node['trace']['status'] == 'open'
    if node['kind'] == 'witness':
        a = node['assignment']
        assert set(a) == set(obj['variables'])
        assert all(type(a[x]) is bool and a[x] in ds
                   for x, ds in node['trace']['domains'].items())
        assert all(len(ds) == 1 for ds in node['trace']['domains'].values())
        assert all(holds(f, a) for f in obj['factors'])
        return [a]
    assert node['kind'] == 'split' and len(node['children']) == 2
    x = node['variable']
    assert node['trace']['domains'][x] == [False, True] and x not in assumptions
    return [a for v, child in zip((False, True), node['children'])
            for a in verify_search(obj, child, assumptions | {x: v}, context + '/' + str(int(v)))]


def pure_cycle(negatives):
    n = len(negatives)
    assert n > 0
    return {f'S{i}': (('not', ('ref', f'S{(i+1)%n}')) if neg
                      else ('ref', f'S{(i+1)%n}')) for i, neg in enumerate(negatives)}


def lift_components(negatives):
    """Signed double cover: edge (i,b)--(i+1,b XOR negative_i)."""
    n = len(negatives)
    edges = [((i, b), ((i+1) % n, b ^ neg))
             for i, neg in enumerate(negatives) for b in (0, 1)]
    unseen = {(i, b) for i in range(n) for b in (0, 1)}
    components = []
    while unseen:
        todo = [min(unseen)]
        comp = set()
        while todo:
            node = todo.pop()
            if node in comp:
                continue
            comp.add(node)
            for a, b in edges:
                if a == node:
                    todo.append(b)
                if b == node:
                    todo.append(a)
        unseen -= comp
        components.append(sorted(comp))
    return components


P, Q = ('fact', 'p'), ('fact', 'q')
REF = lambda s: ('ref', s)
NOT = lambda a: ('not', a)
AND = lambda *a: ('and', *a)


def zoo():
    return [compile_object('ordinary', ['p'], {'S': P}),
            compile_object('negation', ['p'], {'S': NOT(P)}),
            compile_object('conjunction', ['p', 'q'], {'S': AND(P, Q)}),
            compile_object('teller', [], {'S': REF('S')}),
            compile_object('liar', [], {'S': NOT(REF('S'))}),
            compile_object('snow', ['p'], {'S': AND(P, NOT(REF('S')))}),
            compile_object('odd-pair', [], {'A': NOT(REF('B')), 'B': REF('A')}),
            compile_object('opposite', [], {'A': NOT(REF('B')), 'B': NOT(REF('A'))}),
            compile_object('hidden-liar', ['p'], {'Q': P, 'L': NOT(REF('L'))}),
            compile_object('branch', ['p'], {'A': NOT(AND(REF('B'), REF('C'))),
                                           'B': REF('A'), 'C': P})]
