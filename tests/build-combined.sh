#!/usr/bin/env bash
set -euo pipefail
# Joins the engine and the graph code into one module for tests/test3.js
cd "$(dirname "$0")"
(sed "s/^if(typeof module!=='undefined')module.exports=.*$//" ../src/engine.js; sed "s/^if(typeof module!=='undefined')module.exports=.*$//" ../src/graph.js; sed "s/^if(typeof module!=='undefined')module.exports=.*$//" ../src/layers.js; echo "module.exports={genText,printText,layout,readBack,graphLayout,graphReadBack,valueLayers,pureLoop,hasConsistentValue,evaluate,rng,evalFormula,implication,fixedPoints};") > combined.js

