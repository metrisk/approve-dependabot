#!/usr/bin/env bash

function setup_git() {
  echo "Adding Bot Config"
  git config --global user.email "tech.accounts@metrisk.com"
  git config --global user.name "metrisk-bot"
  echo "Setting origin to the SSH version"
  git remote set-url origin git@github.com:"${GITHUB_REPOSITORY}".git
}
