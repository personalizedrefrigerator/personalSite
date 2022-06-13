#!/bin/sh
# Bundles editor.js and its dependencies
# Ref: https://codemirror.net/examples/bundle/
./node_modules/.bin/rollup editor.js -f iife -o editor.bundle.js -p @rollup/plugin-node-resolve

