const LESSONS=[
{part:'Part 1 · Sentences and the world',title:'A sentence and its worlds',ex:'snow',space:true,
 steps:[
 {show:{atoms:[]},text:['This box is a <b>sentence</b>, named S.','Inside it, the blue capsule is the claim: <b>Falling</b>. The grey arrow says what fills the claim’s role: the thing that falls is <b>Snow</b>.','So S says: <i>snow is falling</i>. That is all a sentence box shows: what is said, not whether it is true.']},
 {show:{atoms:['snow']},text:['Below the sentence are <b>all the possible worlds</b>, as far as this one fact goes. There are only two: one where snow is falling, and one where it is not.','Each world is drawn with the same marks as a sentence. A claim that holds is drawn plainly; a claim that does not hold is drawn inside a red “not”. Every world settles every claim: one or the other.']},
 {show:{atoms:['snow'],T:true},text:['Now suppose S is true. The circle <b>T</b> stands for that supposition.','If S is true, then snow must be falling, so the world we are talking about must be one of the worlds where snow is falling. T’s arrow points straight at that <b>set of worlds</b>, outlined with a dashed line.','Those worlds are shaded green: they are exactly the worlds where S is true.']},
 {show:{atoms:['snow'],T:true,F:true},text:['The circle <b>F</b> stands for the other supposition: S is false.','If S is false, then snow must not be falling, so F’s arrow points at the set of worlds where snow is not falling, shaded orange.','Every possible world is in exactly one of the two sets. Logicians call the green set the sentence’s <b>truth conditions</b>: it is what S means.']},
 {show:{atoms:['snow','wind'],T:true,F:true},text:['Add a second fact, the wind. Now there are four possible worlds.','S says nothing about the wind, so its sets take in whole columns: snow falling, <i>with or without</i> wind, is green; no snow falling, with or without wind, is orange.']},
 {show:{atoms:['snow','wind'],T:true,F:true,points:[{label:'World 1',w:{snow:true,wind:true}},{label:'World 2',w:{snow:false,wind:true}}]},text:['Finally, particular worlds. A world is just one cell: World 1 is the one with snow and wind; World 2 has wind but no snow.','S is <b>true in World 1</b> because World 1 is one of the green worlds, and <b>false in World 2</b> because World 2 is one of the orange ones. That is all “true in a world” means.']}
 ],
 tryit:'Go back a step and forward again, and watch how adding the wind splits each region without changing which side a world falls on.',
 quiz:{q:'Which worlds make S (“snow is falling”) true?',opts:['Only World 1','Every world where snow is falling, whatever else is true there'],a:1,why:'S’s truth conditions are a region of possible worlds, not a single world. World 1 is one member of it.'}},
{part:'Part 1 · Sentences and the world',title:'Not',ex:'notsnow',space:true,
 steps:[
 {show:{atoms:[]},text:['One new mark: the red dashed enclosure tagged <b>not</b>. It denies everything inside it. So this S says: <i>it is not the case that snow is falling</i>.']},
 {show:{atoms:['snow'],T:true,F:true},text:['The two possible worlds again. If S is true, then snow must <i>not</i> be falling, so T’s arrow points at the no-snow world. If S is false, then snow must be falling, so F’s arrow points at the snow world.','The “not” simply swaps the two arrows compared with the last lesson.']},
 {show:{atoms:['snow'],T:true,F:true,points:[{label:'World 1',w:{snow:true}}]},text:['World 1, where snow is falling, is an orange world, so this S is <b>false in World 1</b>.']}
 ],
 tryit:'Compare with lesson 1: same two worlds, regions swapped.',
 quiz:{q:'Which region is F’s here (S is false)?',opts:['The worlds where snow is not falling','The worlds where snow is falling'],a:1,why:'S denies that snow is falling, so S is false exactly where snow is falling.'}},
{part:'Part 1 · Sentences and the world',title:'And',ex:'snowwind',space:true,
 steps:[
 {show:{atoms:[]},text:['Two claims in the same box are <b>both</b> asserted. That is how “and” is drawn: no separate mark, just sharing the area (Peirce’s convention).','So S says: <i>snow is falling, and the wind is blowing</i>.']},
 {show:{atoms:['snow','wind']},text:['S mentions two facts, so there are four possible worlds.']},
 {show:{atoms:['snow','wind'],sets:['snow:T']},text:['Before working out S, look at each fact on its own. Here, outlined in blue, are the <b>worlds where snow is falling</b>: the left column.']},
 {show:{atoms:['snow','wind'],sets:['snow:T','wind:T']},text:['And here, also outlined, are the <b>worlds with wind</b>: the top row.','Only one world is in both outlines: the top-left one, with snow <i>and</i> wind.']},
 {show:{atoms:['snow','wind'],T:true},text:['If S is true, then snow is falling <i>and</i> the wind is blowing, so the world must be in <i>both</i> sets: where they <b>overlap</b>.','T’s arrow points at that one world, shaded green.']},
 {show:{atoms:['snow','wind'],sets:['snow:F','wind:F']},text:['Now the false side. Outlined: the worlds <b>without</b> falling snow (the right column) and the worlds <b>without</b> wind (the bottom row).','Notice the bottom-right world, with neither snow nor wind: it is inside <i>both</i> outlines.']},
 {show:{atoms:['snow','wind'],T:true,F:true},text:['If S is false, then <i>at least one</i> fact fails, so the world must be in at least one of those two sets: anything either outline covers. That is three worlds, shaded orange, and it <b>includes</b> the world where both fail.','So “and” is the <b>overlap</b> of two sets, and “at least one fails” is everything the opposite sets <b>cover together</b>.']},
 {show:{atoms:['snow','wind'],T:true,F:true,points:[{label:'World 1',w:{snow:true,wind:true}},{label:'World 2',w:{snow:true,wind:false}}]},text:['World 1 has snow and wind: it is the green world, so S is <b>true in World 1</b>. World 2 has snow but no wind: it is orange, so S is <b>false in World 2</b>.']}
 ],
 tryit:'Go back through the steps and watch the two outlines turn into the green overlap and the orange combination.',
 quiz:{q:'S is false in the world with neither snow nor wind. Why?',opts:['It is not in either set','At least one fact fails there (in fact both do), so it is in the orange set'],a:1,why:'“False” only needs one fact to fail; a world where both fail certainly qualifies.'}},
{part:'Part 1 · Sentences and the world',title:'Other logics',ex:'snow',space:true,
 steps:[
 {show:{atoms:['snow'],T:true,F:true},theory:'classical',text:['So far, every world has settled every claim: snow is either falling or not. That is an assumption of <b>classical</b> logic, not a fact about logic itself.','Different logics make different assumptions, so the tutorial has a <b>Logic</b> switch at the top of the page. Everything you have seen so far was in Classical.']},
 {show:{atoms:['snow'],T:true,F:true},theory:'kripke',text:['Now the switch is on <b>Three-valued</b>. Here a world is allowed to leave a claim <b>unsettled</b> (Kleene’s logic, 1952). So there is a third world: one that says nothing about falling snow.','In that world S is neither true nor false: it lands in <b>neither</b> region, shown grey. True, false and neither are the three values.']},
 {show:{atoms:['snow'],T:true,F:true},theory:'gaifman',text:['The third setting is <b>Gaifman</b> (1992). It does not change the worlds at all: they stay classical, as you can see. What it changes is how sentences <i>about truth</i> get their values. It only makes a difference once sentences start talking about themselves, so you will meet it in lesson 6.']},
 {show:{atoms:['snow'],T:true,F:true},theory:'classical',text:['The switch is back on Classical, and the tutorial continues there.','But the switch stays available on every lesson. In lesson 6 you will see the same three-valued idea applied to a sentence about itself: Kripke gives it no value at all, much as the unsettled world here leaves S with none.']}
 ],
 tryit:'Use the Logic switch at the top on the lessons you have already done: lesson 3, “And”, gets nine possible worlds under Three-valued.',
 quiz:{q:'Under Three-valued logic, what is S (“snow is falling”) in a world that says nothing about falling snow?',opts:['False','Neither true nor false','True'],a:1,why:'Nothing in that world makes S true or false, so it lands in neither region.'}},
{part:'Part 2 · Sentences about sentences',title:'A sentence about a sentence',ex:'about',space:true,main:'S2',
 steps:[
 {show:{atoms:[]},text:['Two sentences. S1 says snow is falling.','S2’s claim is <b>IsTrue</b>, and its blue arrow lands on the <b>outline</b> of box S1. An arrow landing on a box outline means “this sentence”: S2 says <i>“S1 is true”</i>.']},
 {show:{atoms:[],arrows:true},text:['Suppose S2 is true. Then what S2 says must hold: S1 is true. So S2’s T has an arrow to S1’s T. Likewise, if S2 is false, then S1 is false: an arrow from S2’s F to S1’s F.','This is the one new thing in Part 2: an arrow can end at another sentence’s T or F, instead of at a set of worlds.']},
 {show:{atoms:['snow'],T:true,F:true,arrows:true},text:['Now follow the chain into the worlds. If S2 is true, then S1 is true; and if S1 is true, then the world must be one where snow is falling. So S2’s T leads, through S1, to the same set of worlds.','You can also start at S1: if S1 is true, the world is a snowy one, and in every snowy world S2 is true as well. So S1 and S2 pick out exactly the same set of worlds (its label names both): they are true together and false together. Logicians call such sentences <b>equivalent</b>.','Why is there an arrow from S2 to S1 but not back? An arrow means “this sentence’s own words require that”. S2’s words are about S1, so they require something of S1. S1’s words are only about snow, so they require nothing of S2; that S2 comes out true too is a <i>result</i>, shown by the shared set of worlds. Keeping arrows one-way shows who is talking about whom, which is what reveals the loops in the next lessons.','So the equivalence gets its own mark instead: the grey <b>≡</b> link between the two boxes, which appears only when two sentences turn out to be true in exactly the same worlds. It is a result, not a requirement, so it never counts as part of a loop. (A two-way magenta arrow here would draw a loop between S1 and S2, which would look just like a sentence holding itself up, even though nothing here refers to itself.)']},
 {show:{atoms:['snow'],T:true,F:true,arrows:true,points:[{label:'World 1',w:{snow:true}},{label:'World 2',w:{snow:false}}]},text:['So S2 is true in World 1 and false in World 2, for exactly the same reason as S1.']}
 ],
 tryit:'Switch the Logic at the top to Three-valued: in the unsettled world, S1 and S2 both get no value.',
 quiz:{q:'Why are S2’s regions the same as S1’s?',opts:['S2 is about the snow','Supposing S2 true leads to supposing S1 true, and the same for false'],a:1,why:'S2 only talks about S1, so its suppositions lead to S1’s, and from there to the world.'}},
{part:'Part 2 · Sentences about sentences',title:'A sentence about itself',ex:'truth',space:true,motion:true,
 steps:[
 {show:{atoms:[]},text:['Now the blue arrow lands on S’s <b>own</b> outline: S says <i>“S is true”</i>, about itself.']},
 {show:{atoms:[],arrows:true},text:['Suppose S is true: then what S says must hold, and what S says is that S is true. So T’s arrow leads back to T. Likewise F leads back to F.','Neither arrow ever reaches the worlds, and neither runs into a conflict: the <b>green dashed</b> loops mean “holds itself up”.']},
 {show:{flow:true},theory:'classical',text:['<b>Watch the dot.</b> The dot is the supposition being passed along. It starts at T: <i>suppose S is true</i>.','It follows what that implies: along the blue arrow into IsTrue, so IsTrue(S) is true, so what S says holds, and it arrives back at T. There is no “not” on the way, so nothing changes it: T leads to T, the green loop from the last step.']},
 {show:{atoms:[],status:true,T:true,F:true,arrows:true},theory:'classical',text:['S never mentions the facts, so which world we are in makes no difference: the single box below stands for <b>any world at all</b>. Since neither supposition says anything about the facts, nothing in any world can contradict either one, so both arrows point at that box, and it is shaded both green and orange.','In classical logic the verdict is <b>either</b>: S can be true or false, and nothing picks between them.']},
 {show:{atoms:[],status:true,T:true,F:true,arrows:true},theory:'kripke',text:['This is the first sentence the three logics disagree about, so the Logic switch from lesson 4 now matters. It has moved to <b>Three-valued</b>.','Kripke builds values up from the facts, one stage at a time. S only talks about itself, so no fact ever settles it: S is <b>never grounded</b>, and gets <b>no value</b> at all, in any world. Both arrows now end at “no value”.']},
 {show:{atoms:[],status:true,T:true,F:true,arrows:true},theory:'gaifman',text:['Now <b>Gaifman</b>. His first rule, the <b>closed-loop rule</b>: if a sentence only refers to itself (here, the arrow back to its own box), its evaluation can never finish, so it gets a <b>gap</b>.','So the truth-teller is “either” in classical logic, “no value” for Kripke, and a “gap” for Gaifman: one drawing, three verdicts.']},
 {show:{atoms:[],status:true,T:true,F:true,arrows:true},theory:'classical',text:['The switch is back on Classical. From here on, try the switch whenever a sentence talks about itself.']}
 ],
 tryit:'Press Step under “Watch it run”: S keeps whichever value it starts with.',
 quiz:{q:'Why is every world in both regions?',opts:['Because it is snowing','Because each supposition only leads back to itself, so neither meets a conflict'],a:1,why:'Nothing S says involves the world, and neither supposition contradicts itself.'}},
{part:'Part 2 · Sentences about sentences',title:'The liar',ex:'liar',space:true,motion:true,
 steps:[
 {show:{atoms:[]},text:['Put a “not” around the claim: S says <i>“S is not true”</i>. The <b>−</b> on the arrow marks that this loop of reference passes through a “not”.']},
 {show:{atoms:[],arrows:true},text:['Suppose S is true: then what S says holds, so S is <i>not</i> true. T leads to F.','Suppose S is false: then what S says fails, so S <i>is</i> true. F leads to T.','Each supposition leads to its own opposite: the <b>red loop</b>.']},
 {show:{flow:true},theory:'classical',text:['<b>Watch the dot.</b> The dot is the supposition being passed along. It starts at T: <i>suppose S is true</i>.','It follows what that implies, through the parts of the sentence. Along the blue arrow into IsTrue: then IsTrue(S) is true. Through the “not”: so S is <i>not</i> true. The dot turns into F there, and arrives at S’s F.','From F it sets off again, turns back into T at the “not”, and arrives at T. It is walking the red loop T → F → T from the last step, one implication at a time, forever.']},
 {show:{atoms:[],status:true,T:true,F:true,arrows:true},theory:'classical',text:['A supposition that leads to its own opposite contradicts itself, so no world can be like that: both arrows end at “no world fits”. The box for “any world” is grey: in neither set.','That is a <b>paradox</b>: no verdict in any world.']},
 {show:{atoms:[],status:true,T:true,F:true,arrows:true},theory:'kripke',text:['Under <b>Three-valued</b> (Kripke) the liar is treated exactly like the truth-teller: it is never grounded in the facts, so it simply has <b>no value</b>. No contradiction arises, because it is never made true or false in the first place.']},
 {show:{atoms:[],status:true,T:true,F:true,arrows:true},theory:'gaifman',text:['Under <b>Gaifman</b> it is again a closed loop, so it gets a <b>gap</b>.','Notice: Kripke and Gaifman treat the liar and the truth-teller the same way. Only classical logic tells them apart (“either” versus “paradox”).']},
 {show:{atoms:[],status:true,T:true,F:true,arrows:true},theory:'classical',text:['Back to Classical for the next lessons.']}
 ],
 tryit:'Press Step several times: the value flips every pass and never settles. Then try the Logic switch at the top.',
 quiz:{q:'Why are both regions empty?',opts:['Because it is not snowing','Because each supposition leads to its own opposite'],a:1,why:'A supposition that implies its own opposite cannot hold in any world.'}},
{part:'Part 2 · Sentences about sentences',title:'A hidden loop',ex:'ab',space:true,motion:true,main:'A',
 steps:[
 {show:{atoms:[]},text:['A says <i>“B is false”</i>; B says <i>“A is true”</i>. Neither mentions itself.','But follow the blue arrows: A → B → A is a loop, with one − on it. The symbols hide this loop; the drawing shows it.']},
 {show:{atoms:[],arrows:true},text:['Follow the suppositions: A true leads to B false, which leads to A false, which leads to B true, which leads back to A true. Round a red loop through all four, so each supposition eventually leads to its own opposite.']},
 {show:{atoms:[],status:true,T:true,F:true,arrows:true},text:['So no world fits either sentence: both are paradoxes, in every world.']}
 ],
 tryit:'Press Step: the two values go round four combinations, then repeat.',
 quiz:{q:'How many − marks are on the loop A → B → A?',opts:['None','One','Two'],a:1,why:'A’s arrow sits inside a “not”; B’s does not. One − makes the loop the liar’s pattern.'}},
{part:'Part 2 · Sentences about sentences',title:'When the world decides',ex:'mixed',space:true,motion:true,
 steps:[
 {show:{atoms:[]},text:['S says two things, side by side: <i>snow is falling</i>, and <i>S is not true</i>.']},
 {show:{atoms:['snow'],T:true,F:true},text:['Suppose S is true: then snow is falling <i>and</i> S is not true. The second part contradicts the supposition, so no world is in T’s region.','Suppose S is false: then at least one part fails. In a world without snow the first part fails, which is enough: those worlds are in F’s region. In a world with snow, only the liar part could fail, and that leads back round the loop.','So the snow world is grey: in neither region, a paradox there. The no-snow world is orange: S is simply false there.']},
 {show:{atoms:['snow'],T:true,F:true,points:[{label:'World 1',w:{snow:true}},{label:'World 2',w:{snow:false}}]},text:['In World 1 S is a paradox; in World 2 it is false. A sentence whose verdict depends on the world like this is called <b>contingent</b>.']}
 ],
 tryit:'Press Step in each world to compare: it flips forever with snow, and settles on false without.',
 quiz:{q:'In World 2, without snow, S is…',opts:['a paradox','false','true'],a:1,why:'S claims snow is falling; that fails in World 2, so S is false there whatever its second part says.'}},
{part:'Part 2 · Sentences about sentences',title:'One drawing, three logics',ex:'n5a',space:true,motion:true,main:'S',
 steps:[
 {show:{atoms:[]},theory:'classical',text:['Q is a liar, drawn inside S: Q says “Q is not true”. S says <i>“Q is false”</i>.','Logicians disagree about what the liar’s verdict should be, so this lesson uses the <b>Logic</b> switch from lesson 4. The drawing never changes; only the verdicts do.']},
 {show:{atoms:[],arrows:true,status:true},theory:'classical',text:['<b>Classical</b>: Q is the liar from lesson 7, with its red loop. S leads into Q’s loop, so S has no consistent verdict either: it <b>inherits</b> the paradox.']},
 {show:{atoms:[],arrows:true,status:true},theory:'kripke',text:['<b>Three-valued</b> (Kripke): values are built up from the facts, and the liar never gets one. Q is <b>neither</b>, and so is S, which depends on Q.']},
 {show:{atoms:[],arrows:true,status:true},theory:'gaifman',text:['<b>Gaifman</b>: first, the <b>closed-loop rule</b> from lesson 6. Q only refers to itself, so Q gets a <b>gap</b>. So far this matches Kripke.']},
 {show:{atoms:[],arrows:true,status:true},theory:'gaifman',text:['Now Gaifman’s second rule, the one that makes him differ from Kripke: the <b>jump rule</b>. S sits outside Q’s loop and says Q is not true. Q has a gap, so it is indeed not true: S is simply <b>true</b>.','This is Gaifman’s “two-line puzzle”: write “the sentence on line 1 is not true” on line 1, then write the same words on line 2. Line 1 is the liar and gets a gap; line 2 is about line 1, from outside, and is true. Same words, different verdicts, because they sit in different places.','Same drawing, three rulebooks, three answers.']}
 ],
 tryit:'Press Step under each logic to watch how it reaches its answer.',
 quiz:{q:'When you switch logics, what changes?',opts:['The drawing of the sentences','Only the verdicts and how they are worked out'],a:1,why:'What the sentences say is fixed; the logic is the rulebook for giving them values.'}},
{part:'Part 3 · “Every” and arguments',title:'“Every”',ex:'every',space:true,
 steps:[
 {show:{atoms:[]},theory:'classical',text:['Peirce has no symbol for “every”. Instead he says <i>there is nothing that is a man and not mortal</i>.','The heavy black line means <b>something</b>. Here it runs from Man, inside a “not”, into a second “not” around Mortal. Read from the outside in: <i>not (something is a man and not mortal)</i>, which is the same as <i>every man is mortal</i>.']},
 {show:{atoms:['man','mortal'],T:true,F:true},text:['The possible worlds here contain one thing, Socrates, and two facts about him: is he a man, is he mortal? That makes four worlds.','P1 fails only where there is a man who is not mortal: that single world is orange. Every other world, including the ones where Socrates is not a man at all, is green.']}
 ],
 tryit:'Notice the bottom-right world: Socrates is neither a man nor mortal, and P1 is still true there.',
 quiz:{q:'Which world makes “every man is mortal” false?',opts:['Socrates is a man and mortal','Socrates is a man and not mortal','Socrates is neither'],a:1,why:'P1 fails only if there is a man who is not mortal.'}},
{part:'Part 3 · “Every” and arguments',title:'A valid argument',ex:'soc-a',space:true,
 steps:[
 {show:{atoms:[]},theory:'classical',text:['An <b>argument</b>: two premises and a conclusion, each its own sentence. P1 is “every man is mortal”, drawn as in the last lesson. P2 says Socrates is a man. C, the conclusion, says Socrates is mortal.']},
 {show:{atoms:['man','mortal'],status:true},text:['The same four worlds, now showing all three sentences’ verdicts in each.']},
 {show:{atoms:['man','mortal'],argue:true},text:['An argument is <b>valid</b> if the conclusion is true in every world where all the premises are true.','Only one world has both premises true (green border), and C is true there too. So the argument is valid: there is no world where the premises hold and the conclusion fails.']}
 ],
 tryit:'Check each world’s three verdicts against the borders.',
 quiz:{q:'Why is this argument valid?',opts:['The conclusion is true in one world','In every world where both premises are true, the conclusion is true too'],a:1,why:'Validity is about every world, not just one.'}},
{part:'Part 3 · “Every” and arguments',title:'An invalid argument',ex:'soc-b',space:true,
 steps:[
 {show:{atoms:[]},theory:'classical',text:['The same first premise, but now: <i>Socrates is mortal, so Socrates is a man</i>.']},
 {show:{atoms:['man','mortal'],argue:true},text:['Two worlds have both premises true. In one, Socrates is a man and mortal, and C is true. In the other, Socrates is mortal but <i>not</i> a man: both premises are true there, but C is false. That world has a <b>red</b> border: it is a <b>counter-model</b>.','One counter-model is enough to show an argument is <b>invalid</b>.']}
 ],
 tryit:'Find the red-bordered world and read its three verdicts.',
 quiz:{q:'What is a counter-model?',opts:['A world where everything is false','A world where the premises are true and the conclusion false','A world the argument does not mention'],a:1,why:'If such a world exists, the premises do not guarantee the conclusion.'}}
];
