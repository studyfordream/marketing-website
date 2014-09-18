#!/bin/bash

command -v nvm >/dev/null 2>&1 || { echo >&2 "NVM required. Aborting."; exit 1; }

required_version=`cat .nvmrc`

echo "$required_version"

. ~/.nvm/nvm.sh

installed_versions=`nvm list`

echo "$installed_versions"

if [[ ! $installed_versions == *$required_version* ]]
then
  echo "You need node v$required_version installed through NVM. Aborting."
  exit 1
fi

ln -s -f ./hooks/check-node-version.sh ./.git/hooks/post-merge

ln -s -f ./hooks/check-node-version.sh ./.git/hooks/post-checkout

nvm use
