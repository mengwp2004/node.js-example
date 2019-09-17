#!/bin/sh
node_modules/.bin/babel quark.js -d dist && node dist/quark.js
