"""Independent finite oracles, certificate replay, and adversarial view checks."""
import copy
import json
import sys
from pathlib import Path
from itertools import product
from kernel import (AND, NOT, P, Q, REF, assignments, brute_models, candidates,
                    compile_object, lift_components, oracle, project, propagate,
                    pure_cycle, search, verify_search, verify_trace, zoo)

HERE = Path(__file__).resolve().parent
if not __debug__:
    raise RuntimeError('Certificate verification requires assertions: do not use Python -O')


def relation(rows, keys):
    return {tuple(row[k] for k in keys) for row in rows}


def reject(call):
    try:
        call()
    except (AssertionError, KeyError, ValueError):
        return
    raise AssertionError('Invalid certificate accepted')


def main(write=True):
    counts = {'objects': 0, 'compiled_assignments': 0, 'traces': 0,
              'cycle_patterns': 0, 'cycle_candidates': 0, 'view_checks': 0,
              'rejected_mutations': 0}
    objects, casebook, proofs = {}, {}, {}
    reject(lambda: compile_object('malformed', ['p'], {'S': ('fact', 'p', 'extra')}))
    reject(lambda: compile_object('collision', [], {'@S/body': AND()}))
    reject(lambda: compile_object('unresolved', [], {'S': REF('Unknown')}))
    for obj in zoo():
        oid = obj['id']
        objects[oid] = obj
        base = obj['facts'] + list(obj['definitions'])
        direct = oracle(obj['facts'], obj['definitions'])
        compiled = brute_models(obj)
        counts['compiled_assignments'] += 2 ** len(obj['variables'])
        assert relation(direct, base) == relation(compiled, base)
        # Existence AND unique extension: auxiliary variables add no spurious models.
        assert len(compiled) == len(direct)
        cs = candidates(obj)
        assert relation([c['assignment'] for c in cs if c['consistent']], base) == relation(direct, base)
        casebook[oid] = cs
        # Every partial assignment to base coordinates; entailment under local
        # reductions must preserve every full model extending those assumptions.
        for values in product((None, False, True), repeat=len(base)):
            h = {x: v for x, v in zip(base, values) if v is not None}
            t = propagate(obj, h)
            verify_trace(obj, t)
            compatible = [a for a in compiled if all(a[x] == v for x, v in h.items())]
            assert all(all(a[x] in ds for x, ds in t['domains'].items()) for a in compatible)
            if t['status'] == 'conflict':
                assert not compatible
            counts['traces'] += 1
        tree = search(obj)
        recovered = verify_search(obj, tree)
        assert relation(recovered, obj['variables']) == relation(compiled, obj['variables'])
        proofs[oid] = tree
        counts['objects'] += 1

    snow = objects['snow']
    for title, h in [('s-true', {'S': True}), ('s-false', {'S': False}),
                     ('p-false', {'p': False}), ('p-true', {'p': True})]:
        tree = search(snow, h)
        result = verify_search(snow, tree, h)
        proofs['snow:' + title] = tree
        assert len(result) == (1 if title in ('s-false', 'p-false') else 0)
    assert propagate(snow, {'S': False})['domains']['p'] == [False]
    assert propagate(snow, {'p': True})['status'] == 'open'
    assert not verify_search(snow, proofs['snow:p-true'], {'p': True})
    # Corrupt the evidence itself, not merely its printed verdict.
    bad = copy.deepcopy(proofs['snow:s-false']['trace'])
    bad['steps'][0]['after'] = [False, True]
    reject(lambda: verify_trace(snow, bad))
    counts['rejected_mutations'] += 1
    bad = copy.deepcopy(proofs['snow:p-true'])
    bad['children'].pop()
    reject(lambda: verify_search(snow, bad, {'p': True}))
    counts['rejected_mutations'] += 1
    bad = copy.deepcopy(proofs['snow:p-true'])
    bad['children'][0]['trace']['assumptions']['p'] = False
    reject(lambda: verify_search(snow, bad, {'p': True}))
    counts['rejected_mutations'] += 1

    for n in range(1, 9):
        for neg in product((0, 1), repeat=n):
            definitions = pure_cycle(neg)
            expected = 0 if sum(neg) % 2 else 2
            assert len(oracle([], definitions)) == expected
            components = lift_components(neg)
            assert len(components) == (1 if sum(neg) % 2 else 2)
            mixed = any((0, 0) in c and (0, 1) in c for c in components)
            assert mixed == (expected == 0)
            counts['cycle_patterns'] += 1
            counts['cycle_candidates'] += 2**n
    # A large structural test does not enumerate its candidate space.
    assert len(lift_components([1] + [0] * 127)) == 1
    # A negative self-reference is not a general inconsistency test with conjunctions.
    assert len(oracle(['p'], {'S': AND(P, NOT(REF('S')))})) == 1
    assert len(oracle(['p'], {'S': NOT(AND(P, REF('S')))})) == 1
    assert oracle([], {'S': AND(AND(), NOT(REF('S')))}) == []  # true AND not S
    # A negative self-reference in S = NOT(S AND NOT S) is satisfiable.
    assert oracle([], {'S': NOT(AND(REF('S'), NOT(REF('S'))))}) == [{'S': True}]

    views = {}
    for oid, cs in casebook.items():
        base = objects[oid]['facts'] + list(objects[oid]['definitions'])
        for mask in product((False, True), repeat=len(base)):
            visible = [x for x, show in zip(base, mask) if show]
            for only_consistent in (False, True):
                groups = project(cs, visible, lambda c: c['consistent'] or not only_consistent)
                expected_ids = {c['id'] for c in cs if c['consistent'] or not only_consistent}
                assert {wid for g in groups for wid in g['witnesses']} == expected_ids
                for g in groups:
                    assert g['witnesses'] == [c['id'] for c in cs
                        if c['id'] in expected_ids and all(c['assignment'][k] == v
                                                        for k, v in g['values'].items())]
                counts['view_checks'] += 1
        views[oid] = project(cs, list(objects[oid]['definitions']), lambda c: c['consistent'])
    opposite = views['opposite']
    assert [g['values'] for g in opposite] == [{'A': False, 'B': True}, {'A': True, 'B': False}]
    assert len({g['values']['A'] for g in opposite}) * len({g['values']['B'] for g in opposite}) == 4
    assert views['hidden-liar'] == []
    local = compile_object('local-Q', ['p'], {'Q': P})
    assert len(oracle(local['facts'], local['definitions'])) == 2
    # Hide p in ALL snow candidates, preserving both failed and successful witnesses.
    views['snow:all-hide-p'] = project(casebook['snow'], ['S'])
    assert [len(g['witnesses']) for g in views['snow:all-hide-p']] == [2, 2]
    assert views['snow'][0]['values'] == {'S': False}
    # Count the independent teller family analytically; enumerate only n <= 10.
    for n in range(1, 11):
        ds = {f'S{i}': REF(f'S{i}') for i in range(n)}
        assert len(oracle([], ds)) == 2**n
    result = {'scope': '10 finite fixtures; all signed cycles length 1..8; tellers 1..10',
              'counts': counts, 'objects': objects, 'candidates': casebook,
              'proofs': proofs, 'views': views}
    if write:
        (HERE / 'evidence.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(counts, sort_keys=True))
    return result


def verify_saved(path):
    """Check persisted evidence, rebuilding constraint relations from its syntax.

    This prevents a modified truth table from silently redefining the object
    whose certificates are checked. Use ordinary Python, without -O.
    """
    data = json.loads(Path(path).read_text())
    for oid, obj in data['objects'].items():
        assert obj == compile_object(oid, obj['facts'], obj['definitions'])
        assert data['candidates'][oid] == candidates(obj)
        verify_search(obj, data['proofs'][oid])
        assert data['views'][oid] == project(data['candidates'][oid], list(obj['definitions']),
                                             lambda c: c['consistent'])
    expected = {'s-true': {'S': True}, 's-false': {'S': False},
                'p-false': {'p': False}, 'p-true': {'p': True}}
    for name, h in expected.items():
        result = verify_search(data['objects']['snow'], data['proofs']['snow:'+name], h)
        assert len(result) == (1 if name in ('s-false', 'p-false') else 0)
    assert data['views']['snow:all-hide-p'] == project(data['candidates']['snow'], ['S'])
    print('Saved encodings, candidates, scoped certificates, and view witnesses verified.')


if __name__ == '__main__':
    if len(sys.argv) == 3 and sys.argv[1] == '--verify':
        verify_saved(sys.argv[2])
    else:
        main()
