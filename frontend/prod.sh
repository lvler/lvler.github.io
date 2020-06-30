#!/bin/bash

rm -rf dist && npm run prod && rm -rf ../backend/src/main/resources/static/* && cp -r ./dist/* ../backend/src/main/resources/static/
