"""Generate review pictures from checked evidence; no changes to the live notation.

python3 research/diagram-demo/draw.py
"""
import html
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from kernel import candidates, holds, propagate, zoo
from check import main as check

HERE = Path(__file__).resolve().parent
INK, MUTED, LINE = '#14283e', '#536477', '#8190a0'
TRUE, FALSE = '#126b4b', '#a24e13'


def esc(x):
    return html.escape(str(x), quote=True)


class Picture:
    def __init__(self, width, height, title):
        self.width, self.height = width, height
        self.parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-label="{esc(title)}">',
                      '<style>text{font-family:Arial,Helvetica,sans-serif;fill:#14283e} .small{font-size:13px} .body{font-size:16px} .title{font-size:23px;font-weight:700} .var{font-size:17px;font-weight:700} .label{font-size:12px;fill:#536477}</style>',
                      f'<rect width="{width}" height="{height}" fill="#f7f9fc"/>']

    def text(self, x, y, text, cls='body', anchor='start', color=None):
        self.parts.append(f'<text x="{x}" y="{y}" class="{cls}" text-anchor="{anchor}"' +
                          (f' style="fill:{color}"' if color else '') + f'>{esc(text)}</text>')

    def line(self, a, b, label=None, color=LINE, dash=False, data=''):
        self.parts.append(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="{color}" stroke-width="2"' +
                          (' stroke-dasharray="5 5"' if dash else '') + f' {data}/>')
        if label:
            self.text((a[0]+b[0])/2, (a[1]+b[1])/2-9, label, 'small', 'middle')

    def card(self, x, y, w, h, title=None):
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="white" stroke="#d6dfe8"/>')
        if title:
            self.text(x+20, y+30, title, 'var')

    def variable(self, x, y, name, value=None, data=''):
        fill = '#ffffff'
        self.parts.append(f'<g {data}><circle cx="{x}" cy="{y}" r="27" fill="{fill}" stroke="{INK}" stroke-width="2"/>')
        self.text(x, y+6, name, 'var', 'middle')
        if value is not None:
            t = ('T' if value else 'F') if type(value) is bool else value
            width = max(20, len(str(t))*9+8)
            self.parts.append(f'<rect x="{x-width/2}" y="{y+33}" width="{width}" height="20" fill="white"/>')
            self.text(x, y+48, t, 'var', 'middle', TRUE if value is True else FALSE if value is False else MUTED)
        self.parts.append('</g>')

    def factor(self, x, y, label, subtitle='', failed=False, data=''):
        self.parts.append(f'<g {data}><rect x="{x-29}" y="{y-22}" width="58" height="44" rx="2" fill="#edf2f7" stroke="{INK}" stroke-width="{4 if failed else 2}"' +
                          (' stroke-dasharray="4 3"' if failed else '') + '/>')
        self.text(x, y+6, label, 'var', 'middle')
        if subtitle:
            self.text(x, y+43, subtitle, 'label', 'middle')
        self.parts.append('</g>')

    def finish(self):
        return '\n'.join(self.parts + ['</svg>'])


def reduced_graph(obj):
    """Collapse only fact/reference copy equalities; retain body agreement.

    The returned aliases record each hidden syntax occurrence. This is a
    reversible display collapse using the full object, not syntax identification.
    """
    aliases = {x: x for x in obj['variables']}
    hidden = []
    for path, occ in obj['occurrences'].items():
        if occ['op'] in ('fact', 'ref'):
            aliases[occ['value']] = occ['target']
            hidden.append('f:' + path)
    factors = []
    for f in obj['factors']:
        if f['id'] not in hidden:
            factors.append(dict(f, visible_scope=list(dict.fromkeys(aliases[x] for x in f['scope']))))
    return {'aliases': aliases, 'hidden_factors': hidden, 'factors': factors}


def network(pic, obj, positions, labels, values=None, offset=(0, 0), failed=()):
    g = reduced_graph(obj)
    dx, dy = offset
    pos = {k: (x+dx, y+dy) for k, (x, y) in positions.items()}
    # Draw lines before nodes; clip endpoints to the variable circle/factor box.
    import math
    for f in g['factors']:
        for var in f['visible_scope']:
            a, b = pos[var], pos[f['id']]
            vx, vy = b[0]-a[0], b[1]-a[1]
            d = math.hypot(vx, vy)
            start = (a[0]+vx/d*27, a[1]+vy/d*27)
            scale = min(29/abs(vx) if vx else float('inf'), 22/abs(vy) if vy else float('inf'))
            end = (b[0]-vx*scale, b[1]-vy*scale)
            pic.line(start, end, data=f'data-object="{obj["id"]}" data-factor="{f["id"]}" data-variable="{esc(var)}"')
    variables = list(dict.fromkeys(g['aliases'].values()))
    for var in variables:
        pic.variable(*pos[var], labels.get(var, var), (values or {}).get(var),
                     data=f'data-object="{obj["id"]}" data-variable-node="{esc(var)}"')
    for f in g['factors']:
        op = 'agree' if f['id'].startswith('agree:') else obj['occurrences'][f['source']]['op']
        pic.factor(*pos[f['id']], {'agree': '=', 'not': 'NOT', 'and': 'AND'}[op],
                   failed=f['id'] in failed,
                   data=f'data-object="{obj["id"]}" data-factor-node="{f["id"]}"')


SNOW_POS = {'p': (55, 75), 'S': (235, 225), '@S/body': (400, 75),
            '@S/body/1': (55, 225), 'f:S/body': (235, 75),
            'f:S/body/1': (140, 225), 'agree:S': (400, 225)}
SNOW_LABELS = {'@S/body': 'b', '@S/body/1': 'n', 'S': 's'}


def make_snow(data):
    obj = data['objects']['snow']
    p = Picture(1020, 865, 'All four snow candidates in the same factor network')
    p.text(30, 37, '03  |  One snow object, four candidate configurations', 'title')
    p.text(30, 66, 'p: Falling(Snow)     s: candidate value of S     n: NOT s     b: body value')
    p.text(30, 91, 'Each wire is an argument of a constraint. It has no input/output direction.', 'small')
    for i, c in enumerate(data['candidates']['snow']):
        x, y = 25+(i%2)*500, 115+(i//2)*350
        a = c['assignment']
        title = f'{c["id"]}   p={int(a["p"])}  s={int(a["S"])}'
        p.card(x, y, 480, 330, title)
        network(p, obj, SNOW_POS, SNOW_LABELS, a, (x+10, y+8), c['failed'])
        p.text(x+20, y+308, 'WITNESS: s = b' if c['consistent'] else 'REJECTED: s and b disagree at =', 'var')
    p.text(30, 840, 'Solid/dashed factor borders locate the failed condition; T/F text carries the values.', 'small')
    return p.finish()


def make_ordinary(data):
    obj = data['objects']['conjunction']
    p = Picture(1020, 650, 'Conjunction reasoning in Peirce and factor graph notation')
    p.text(30, 38, '01  |  Start with ordinary reasoning', 'title')
    p.text(30, 70, 'p means snow is falling; q means wind is blowing. S says p AND q.')
    p.card(25, 95, 970, 180, 'Peirce’s assertion sheet: juxtaposition means AND')
    p.parts.append('<rect x="70" y="155" width="260" height="70" fill="none" stroke="#8190a0"/>')
    p.text(140, 200, 'p', 'title'); p.text(255, 200, 'q', 'title')
    p.line((355, 190), (610, 190), 'erase q in a positive area')
    p.parts.append('<path d="M600 184 L610 190 L600 196" fill="none" stroke="#8190a0" stroke-width="2"/>')
    p.parts.append('<rect x="640" y="155" width="260" height="70" fill="none" stroke="#8190a0"/>')
    p.text(770, 200, 'p', 'title', 'middle')
    p.card(25, 295, 970, 265, 'Factor graph: circles hold variables; squares impose joint conditions')
    pos = {'p': (100, 115), 'q': (100, 200), '@S/body': (470, 150),
           'S': (825, 150), 'f:S/body': (285, 150), 'agree:S': (650, 150)}
    network(p, obj, pos, {'@S/body': 'b', 'S': 's'},
            {'S': True, '@S/body': True, 'p': True, 'q': True}, (30, 300))
    p.text(30, 596, 'Suppose s=T. The = constraint forces b=T; AND then forces both p=T and q=T.')
    p.text(30, 624, 'The sheet proof uses erasure. The network proof uses checked local relation reduction.', 'small')
    return p.finish()


def make_reference(data):
    p = Picture(1020, 530, 'Truth teller and liar: reference alone does not entail inconsistency')
    p.text(30, 38, '02  |  Self-reference and inconsistency are different', 'title')
    p.text(30, 70, 'A square is a relation, not a physical gate. Both candidate values must be considered.')
    for i, oid in enumerate(('teller', 'liar')):
        x = 25+i*500
        p.card(x, 100, 480, 340, 'S := Tr(S)' if oid == 'teller' else 'S := NOT Tr(S)')
        obj = data['objects'][oid]
        if oid == 'teller':
            pos = {'S': (110, 145), 'agree:S': (345, 145)}
        else:
            pos = {'S': (110, 115), '@S/body': (345, 115),
                   'f:S/body': (227, 205), 'agree:S': (227, 55)}
        network(p, obj, pos, {'S': 's', '@S/body': 'b'}, offset=(x, 110))
        if oid == 'teller':
            p.text(x+25, 385, '= checks s=s: T and F both survive.', 'body')
            p.text(x+25, 415, '2 consistent candidates. No joint truth-and-falsity.', 'small')
        else:
            p.text(x+25, 385, 'NOT requires b≠s; = requires b=s.', 'body')
            p.text(x+25, 415, '0 consistent candidates. Both trials fail.', 'small')
    p.text(30, 480, 'The reference occurrence is collapsed onto s; its source identity remains in evidence.json.', 'small')
    p.text(30, 507, 'No models here means no Boolean truth-agreement assignment in this declared profile.', 'small')
    return p.finish()


def make_paths(data):
    obj = data['objects']['snow']
    p = Picture(1020, 780, 'Four investigations with assumptions scoped to branches')
    p.text(30, 38, '04  |  Follow a supposition through the connected constraints', 'title')
    p.text(30, 70, 'Each panel starts a separate context (a scope in which the listed hypothesis applies).')
    stories = [({'S': True}, 'Suppose s=T', ['= forces b=T.', 'AND forces n=T and p=T.',
                                          'NOT forces s=F: conflict.']),
               ({'S': False}, 'Suppose s=F', ['= forces b=F.', 'NOT forces n=T.',
                                             'AND now forces p=F.']),
               ({'p': False}, 'Fix p=F', ['AND forces b=F.', '= forces s=F.',
                                          'NOT gives n=T: one witness.']),
               ({'p': True}, 'Fix p=T', ['Local reduction leaves {F,T}.', 'Split s=F and s=T.',
                                        'Both branches close: no witness.'])]
    for i, (h, title, lines) in enumerate(stories):
        x, y = 25+(i%2)*500, 95+(i//2)*330
        p.card(x, y, 480, 310, title)
        t = propagate(obj, h)
        vals = {v: ('∅' if not ds else 'T' if ds == [True] else 'F' if ds == [False] else '{F,T}')
                for v, ds in t['domains'].items()}
        # At a closed branch, show assumptions rather than an arbitrary final
        # scheduling snapshot. Text below gives a human route with cited factors.
        shown = h if t['status'] == 'conflict' else vals
        # Smaller network preserves exactly the same node and factor identities.
        scaled = {k: (v[0]*.95, v[1]*.60) for k, v in SNOW_POS.items()}
        network(p, obj, scaled, SNOW_LABELS, shown, (x+15, y+35))
        for j, line in enumerate(lines):
            p.text(x+20, y+235+j*24, line, 'small')
    p.text(30, 768, 'Only B: s ↔ (p ∧ ¬s) licenses these deductions. “S is false” alone says nothing about weather.', 'small')
    return p.finish()


def make_views(data):
    p = Picture(1020, 880, 'Exact projection retains joint alternatives and hidden inconsistency')
    p.text(30, 38, '05  |  Change the question; preserve the constraints', 'title')
    p.text(30, 70, 'Projection (hiding variables while retaining supported combinations) is existential quantification.')
    p.card(25, 95, 970, 275, 'A := NOT Tr(B); B := NOT Tr(A)')
    obj = data['objects']['opposite']
    pos = {'A': (95, 125), 'B': (825, 125), '@A/body': (335, 65), '@B/body': (585, 185),
           'f:A/body': (585, 65), 'agree:A': (215, 65),
           'f:B/body': (335, 185), 'agree:B': (705, 185)}
    network(p, obj, pos, {'@A/body': 'a', '@B/body': 'b'}, offset=(30, 105))
    p.text(45, 350, 'a and b are body values. Both equations together preserve A ≠ B.', 'small')
    p.card(25, 390, 470, 260, 'Joint view of A,B: exactly two witnesses')
    for i, (a, b) in enumerate(((False, True), (True, False))):
        y = 465+i*105
        p.variable(100, y, 'A', a); p.factor(245, y, '≠'); p.variable(390, y, 'B', b)
        p.line((127, y), (216, y)); p.line((274, y), (363, y))
    p.card(515, 390, 480, 260, 'Hide B: A has two supported values')
    p.variable(590, 485, 'A', '{F,T}'); p.factor(840, 485, '∃B')
    p.line((617, 485), (811, 485))
    p.text(535, 605, 'Witness links recover B=T for A=F; B=F for A=T.', 'small')
    p.card(25, 680, 970, 155, 'Hidden liar: the question must say whether consistency is global')
    p.variable(100, 760, 'p'); p.factor(240, 760, '='); p.variable(380, 760, 'Q')
    p.line((127, 760), (211, 760)); p.line((269, 760), (353, 760))
    p.parts.append('<rect x="470" y="728" width="220" height="65" fill="#edf2f7" stroke="#14283e" stroke-dasharray="5 4"/>')
    p.text(580, 755, 'collapsed L = NOT L', 'small', 'middle')
    p.text(580, 779, 'still has no extension', 'small', 'middle')
    p.text(730, 750, 'Global projection: ∅', 'var')
    p.text(730, 780, 'Local Q=p: 2 cases', 'body')
    p.text(45, 820, 'Local evaluation explicitly removes L’s constraint. Merely hiding L does not.', 'small')
    p.text(30, 870, 'Snow view: hiding p in all candidates retains 2 groups × 2 cases; restricting to consistent cases retains s=F only.', 'small')
    return p.finish()


def make_signature(data):
    p = Picture(1020, 680, 'Signed-cycle double covers distinguish even and odd negative parity')
    p.text(30, 38, '06  |  A structural signature with a precise domain', 'title')
    p.text(30, 70, 'Pure cycles only: each sentence refers to exactly one successor, with optional NOT.')
    from kernel import lift_components
    for i, neg in enumerate(([1, 1, 0], [1, 0, 0])):
        x = 25+i*500
        p.card(x, 95, 480, 410, 'Two negative references: 2 models' if i == 0 else 'One negative reference: 0 models')
        p.text(x+25, 155, 'S0 = ¬S1; S1 = ' + ('¬S2' if i == 0 else 'S2') + '; S2 = S0', 'body')
        p.text(x+25, 192, 'Lift each sentence to its F and T candidate copies:', 'small')
        positions = {(j, b): (x+75+j*155, 255+b*140) for j in range(3) for b in (0, 1)}
        for j, negative in enumerate(neg):
            for b in (0, 1):
                a, c = positions[(j, b)], positions[((j+1)%3, b ^ negative)]
                if j == 2:
                    y = 220 if b == 0 else 450
                    p.parts.append(f'<path d="M {a[0]} {a[1]-24 if b==0 else a[1]+24} V {y} H {c[0]} V {c[1]-24 if b==0 else c[1]+24}" fill="none" stroke="#8190a0" stroke-width="2"/>')
                else:
                    import math
                    vx, vy = c[0]-a[0], c[1]-a[1]; length = math.hypot(vx, vy)
                    p.line((a[0]+vx/length*27, a[1]+vy/length*27), (c[0]-vx/length*27, c[1]-vy/length*27))
        for (j, b), pos in positions.items():
            p.variable(*pos, 'S'+str(j), bool(b))
        comps = lift_components(neg)
        p.text(x+25, 484, '2 components: S0-F cannot reach S0-T' if len(comps)==2 else '1 component: S0-F reaches S0-T', 'small')
    p.text(30, 540, 'Proof: one circuit of references gives v0 = v0 XOR parity. Odd parity is impossible;')
    p.text(30, 566, 'even parity lets either initial value determine every other value. This holds for every length.')
    p.text(30, 602, 'Counterexample outside that class: s = p AND NOT s has a negative self-reference,')
    p.text(30, 628, 'but p=F admits s=F. Conjunction prevents treating the negative reference as an equality.')
    p.text(30, 660, 'Crossings are layout accidents. Connectivity and signed parity survive relabelling and redrawing.', 'small')
    return p.finish()


def validate_svg(svg, data):
    """Check picture edge incidence and semantic labels against source relations.

    Does not claim arbitrary-pixel read-back or verify text placement.
    """
    root = ET.fromstring(svg)
    for el in root.iter():
        if 'data-factor' in el.attrib:
            obj = data['objects'][el.attrib['data-object']]
            f = next(f for f in reduced_graph(obj)['factors'] if f['id'] == el.attrib['data-factor'])
            assert el.attrib['data-variable'] in f['visible_scope']
    # Every network instance in a card must have the exact incidence multiset.
    for oid, obj in data['objects'].items():
        edges = [(e.attrib['data-factor'], e.attrib['data-variable']) for e in root.iter()
                 if e.attrib.get('data-object') == oid and 'data-factor' in e.attrib]
        if not edges:
            continue
        from collections import Counter
        expected = Counter((f['id'], v) for f in reduced_graph(obj)['factors'] for v in f['visible_scope'])
        actual = Counter(edges)
        repeats = sum(1 for e in root.iter() if e.attrib.get('data-object') == oid and
                      e.attrib.get('data-factor-node') == reduced_graph(obj)['factors'][0]['id'])
        assert actual == Counter({k: v*repeats for k, v in expected.items()})


def main():
    data = check()
    plates = [('01-ordinary', make_ordinary), ('02-reference', make_reference),
              ('03-snow', make_snow), ('04-investigations', make_paths),
              ('05-views', make_views), ('06-signature', make_signature)]
    captions = [
        'Read the sheet as an assertion; read the network as a set of simultaneous constraints. The = square links a sentence’s candidate value to its body value.',
        'Tr(S) uses the registry entry S. Its value is the candidate s. The teller’s equality permits both choices; the liar’s two constraints permit neither.',
        'Every case keeps the same source identifiers. Only the assigned values differ. The four panels exhaust p and s; unmentioned world facts may vary freely.',
        'An unassigned domain {F,T} is a search status, not a third truth value. The p=T branch demonstrates that local propagation can stop before detecting a global conflict.',
        'The displayed ≠ relation summarizes an exact joint projection. Its two tuples carry source witness identifiers in the evidence. The collapsed liar remains part of the global query.',
        'The lower construction is the signed double cover (two value copies linked according to reference polarity). It is a different view from factor incidence; shared shape is not assumed.'
    ]
    sections = []
    for (name, render), caption in zip(plates, captions):
        svg = render(data)
        validate_svg(svg, data)
        (HERE / (name+'.svg')).write_text(svg+'\n')
        sections.append(f'<section id="{name}">{svg}<p>{esc(caption)}</p></section>')
    intro = '''<h1>Reasoning through constraints</h1><p class="lead">A review atlas: ordinary inference, self-reference, scoped investigations, and exact changes of view.</p>
<p><strong>Status:</strong> proposed drawings using established factor-graph and Peirce notation. The mathematical checks below do not establish human intelligibility. These are static review pictures; no live tutorial or notation has been adopted.</p>
<p><strong>Reading order:</strong> start with 01. T and F mean true and false; 0 and 1 abbreviate F and T. Circles name value variables. Squares name relations. Lines indicate which variables a relation constrains. Panel borders only group pictures.</p>
<p><strong>Ordinary meaning:</strong> Snow is a constant symbol; it names entity:snow in the declared two-entity domain. Falling is a unary predicate (a property of one entity). p records whether that entity belongs to Falling’s interpretation. The name, entity, predicate, sentence, and value have distinct records. q similarly records Blowing(Wind). “All worlds” below means all combinations of the listed observations, with other ordinary facts ignored.</p>
<nav><a href="#01-ordinary">01 Ordinary</a><a href="#02-reference">02 Reference</a><a href="#03-snow">03 Snow</a><a href="#04-investigations">04 Investigations</a><a href="#05-views">05 Views</a><a href="#06-signature">06 Signature</a></nav>'''
    ending = f'''<section class="notes"><h2>Evidence and remaining questions</h2><p>The independent checker compared direct formula evaluation with exhaustive assignments to compiled constraints: {data['counts']['objects']} fixtures, {data['counts']['compiled_assignments']:,} compiled assignments. It replayed {data['counts']['traces']} local traces and checked {data['counts']['view_checks']} finite views. All {data['counts']['cycle_patterns']} signed cycles of lengths 1–8 were checked against the parity criterion.</p><p>The next visual question is concrete: can you locate why snow:case:2 fails, then explain why supposing s=F excludes p=T? Can you distinguish the two supported A,B pairs from four independent recombinations? These are proposed review tasks, not reported user-study results.</p><p>Sources: <a href="https://www.jfsowa.com/peirce/ms514.htm">Peirce MS 514</a>; <a href="https://www.isiweb.ee.ethz.ch/papers/arch/aloe-2001-1.pdf">Kschischang, Frey &amp; Loeliger (2001), §II</a>; <a href="https://www.jfsowa.com/pubs/contexts.htm">Sowa, Semantic Foundations of Contexts, §§2,6</a>. The full assessment, mathematical arguments, coverage ledger, and commands are in README.md. Machine-readable objects, candidates, proofs, and witness links are in evidence.json.</p></section>'''
    style = '''body{margin:0;background:#eef2f7;color:#14283e;font:17px/1.6 system-ui,sans-serif}main{max-width:1060px;margin:auto;padding:44px 20px}h1{font-size:46px;line-height:1.15;margin:0 0 14px}h2{font-size:25px}.lead{font-size:23px;max-width:850px}nav{display:flex;flex-wrap:wrap;gap:20px;padding:22px 0}a{color:#215789}section{margin:28px 0 44px;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 10px #14283e0c}section>p{padding:0 26px 12px}svg{display:block;width:100%;height:auto}.notes{padding:6px 26px 20px}.notes>p{padding:0}@media print{main{max-width:none;padding:0}section{break-inside:avoid;box-shadow:none;border:1px solid #ddd}nav{display:none}h1{font-size:32px}}'''
    (HERE/'index.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reasoning through constraints — research review</title><style>'+style+'</style><main>'+intro+''.join(sections)+ending+'</main></html>\n')
    print('Built six source-linked SVG plates and self-contained review atlas.')


if __name__ == '__main__':
    main()
