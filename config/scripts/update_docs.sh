#!/usr/bin/env bash

scriptdir=$(dirname "$0")
# shellcheck source=./setup_git.sh
source "$scriptdir/setup_git.sh"
# shellcheck source=./setup_ssh.sh
source "$scriptdir/setup_ssh.sh"

echo "Setting up git"
setup_git

setup_ssh "$SSH_PRIVATE_KEY"

echo "Add the docs"
git add "docs/"

git commit -m "docs: updated the docs"
echo "$GITHUB_REF"
git push origin main
