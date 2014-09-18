#!/bin/bash

command -v nvm >/dev/null 2>&1 || { echo >&2 "You must install NVM."; exit 1; }

source ~/.nvm/nvm.sh

nvm use || nvm install
