#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
./build-combined.sh
node test.js
node test2.js
node test3.js
node test-readers.js
node test-reasoning-object.js
node test-snow-review.js


