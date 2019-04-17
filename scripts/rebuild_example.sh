#!/bin/bash
set -eu

toplevel="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
yarn build --output-path "${toplevel}/docs"
