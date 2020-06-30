#!/bin/bash
rm -rf ../app.*.js && yarn prod && mv dist/* ../
