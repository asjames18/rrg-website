#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Checking for legacy entrypoint references..."

# Find all files except the ones we want to exclude
files=$(find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.mjs" \) \
  -not -path "./node_modules/*" \
  -not -path "./.vercel/*" \
  -not -path "./dist/*" \
  -not -path "./scripts/check-no-legacy.sh")

if echo "$files" | xargs grep -l "dist/server/entry.mjs" 2>/dev/null; then
  echo "❌ Legacy handler detected. Remove any references to 'dist/server/entry.mjs'"
  echo "   This usually means there's a vercel.json override or manual handler file."
  exit 1
fi

echo "✅ No legacy entrypoint references found"
