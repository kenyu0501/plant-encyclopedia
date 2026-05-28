#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
NODE_DIR="$ROOT_DIR/.tools/node-v24.14.0-darwin-arm64"

if [ ! -x "$NODE_DIR/bin/npm" ]; then
  echo "Node.js 24 local runtime was not found at $NODE_DIR" >&2
  echo "Install Node.js 24, or place the official Node.js tarball under .tools." >&2
  exit 1
fi

PATH="$NODE_DIR/bin:$PATH"
cd "$ROOT_DIR"
npm run dev
