#!/bin/bash

ln -s -f ./hooks/check-node-version.sh ./.git/hooks/post-merge

ln -s -f ./hooks/check-node-version.sh ./.git/hooks/post-checkout
