#!/usr/bin/env sh
set -euxo pipefail

nix-shell --pure --keep VSCE_PAT --keep GA_API_SECRET --keep GA_MEASUREMENT_ID --keep GHAPI_PAT --command  "$(cat <<NIXCMD
  cd /workspace
  npm ci --loglevel error
  npm run build && npm run publish-extensions pre-release
  publish_status=\$?
  echo DEBUG PUBLISH-EXTENSION STATUS \$publish_status
  exit \$publish_status
NIXCMD
)"
