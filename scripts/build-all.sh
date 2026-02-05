#!/usr/bin/env bash
set -euo pipefail

PACKAGES=("appeal-form" "chatban")

for p in "${PACKAGES[@]}"; do
  echo "\n=== Installing for $p ==="
  (cd "$p" && npm install)
  echo "=== Building $p ==="
  (cd "$p" && npm run build)
done

echo "\nAll builds completed successfully."
