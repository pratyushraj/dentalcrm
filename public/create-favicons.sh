#!/bin/bash
# Export official Clinaza artwork with the shared macOS asset generator.
# Usage: bash public/create-favicons.sh [logo-image-file]
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
node "$SCRIPT_DIR/../scripts/export-brand-assets.mjs" "$@"

