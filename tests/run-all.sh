#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
./build-combined.sh
node test.js
node test2.js | grep -E "bad pictures|derivation steps"
node test3.js
