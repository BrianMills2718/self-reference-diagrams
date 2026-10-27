import os
SRC=os.path.dirname(os.path.abspath(__file__))
ROOT=os.path.dirname(SRC)
# Builds ../tutorial.html from ../reference.html (which supplies the shared drawing engine and styles) and the files in this folder.
v=open(os.path.join(ROOT,'reference.html')).read()
style=v[v.index('<style>')+7:v.index('</style>')]
head=v[:v.index('<style>')]
script=v[v.index('<script>')+8:v.index('// ---------- page ----------')]
def rep(s,a,b):
    assert a in s, a[:80]; return s.replace(a,b,1)
script=rep(script,"const t=f.args[0][1];const d=t.kind==='var'?env[t.name]:M.ent[t.name];return d!==undefined&&M.holds[f.p](d)?'T':'F';}}}","const t=f.args[0][1];const d=t.kind==='var'?env[t.name]:M.ent[t.name];if(d!==undefined&&M.unk&&M.unk[f.p]&&M.unk[f.p](d))return 'U';return d!==undefined&&M.holds[f.p](d)?'T':'F';}}}")
# only "−" signs, and only on loop arrows
script=rep(script,"text-anchor=\"middle\">${TYPES?'role: ':''}${a.role}</text>${sg?`","text-anchor=\"middle\">${TYPES?'role: ':''}${a.role}</text>${sg==='−'&&lp?`")
tut_ex=open(os.path.join(SRC,'tut_ex.js')).read()
tut_ex=tut_ex[:tut_ex.index('const LESSONS=[')]
lessons=open(os.path.join(SRC,'tut_lessons2.js')).read(); page=open(os.path.join(SRC,'space3.js')).read()+open(os.path.join(SRC,'flow.js')).read()+open(os.path.join(SRC,'tut_page2.js')).read()
css=style+open(os.path.join(SRC,'tut2.css')).read()+open(os.path.join(SRC,'space.css')).read()+"""
.lnav{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 18px}
#dots{display:flex;gap:6px;flex-wrap:wrap}
#dots button{width:34px;height:34px;padding:0;border-radius:50%}
#dots button[aria-current="step"]{border-color:var(--ref);box-shadow:inset 0 0 0 2px var(--ref)}
#dots button.done{background:color-mix(in srgb,var(--ok) 16%,var(--card))}
.lpart{color:var(--quiet);font-size:14.5px;margin:0 0 2px}
.ltext{max-width:72ch;margin:8px 0}
.tryit{margin:14px 0 0;padding:10px 14px;border-left:3px solid var(--ref);background:color-mix(in srgb,var(--ref) 7%,transparent)}
.quiz{margin:14px 0 0;padding:12px 14px;border:1px solid var(--hair);border-radius:10px}
.quiz p{margin:0 0 8px}.qopts{display:flex;flex-wrap:wrap;gap:8px}
.qopts button.right{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 14%,var(--card))}
.qopts button.wrong{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 12%,var(--card))}
.qfb{margin:10px 0 0}.qfb.ok{color:var(--ok)}.qfb.no{color:var(--bad)}
.readback{color:var(--quiet);font-size:14.5px;margin:10px 0 0}
.pager{display:flex;justify-content:space-between;margin:22px 0 0}
"""
body="""<body>
<main>
<h1>Reading self-reference diagrams: a step-by-step tutorial</h1>
<p class="lede">Thirteen short lessons, from one sentence about the weather up to paradoxes, other logics and valid arguments. Every lesson uses the same few marks: a <b>sentence</b> box; its two suppositions, <b>T</b> (suppose it is true) and <b>F</b> (suppose it is false); and the <b>possible worlds</b>, where each supposition leads to a region. When sentences talk about other sentences, arrows show how one supposition leads to another.</p>
<div class="logic" id="logic" role="group" aria-label="Which logic">Logic: <button data-l="classical">Classical</button><button data-l="kripke">Three-valued (Kleene and Kripke)</button><button data-l="gaifman">Gaifman</button><span id="logicdesc"></span></div>
<div class="lnav"><div id="dots" role="navigation" aria-label="Lessons"></div></div>
<section id="lesson" aria-live="polite"></section>
<div id="navbar" role="navigation" aria-label="Step navigation"><button id="navback">← Back a step</button><span id="navinfo"></span><button id="navnext" class="primary big">Next step →</button></div>

</main>
<script>
"""+script+tut_ex+lessons+page+"""
</script>
</body>
</html>"""
html=head.replace('<title>Self-reference diagrams v0.2: see it work</title>','<title>Reading self-reference diagrams: a tutorial</title>')+'<style>'+css+'</style>\n</head>\n'+body
open(os.path.join(ROOT,'tutorial.html'),'w').write(html); print(len(html))
