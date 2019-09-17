#!/bin/sh
node_modules/.bin/babel quark.js -d services && node services/quark.js
