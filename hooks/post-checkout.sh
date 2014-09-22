#!/bin/bash

# Get submodules.
git submodule update --init --force

# "Install" nvm. https://github.com/creationix/nvm#manual-install
cd .nvm && git checkout `git describe --abbrev=0 --tags` && cd ..

source .nvm/nvm.sh

nvm use || nvm install
