#!/bin/sh
set -eu

# --- Always create both include files ---
: > /GH_OAUTH_CLIENT.conf
: > /APP_PUBLIC_PATH.conf

# --- OAuth vars for nginx (safe if envs are empty) ---
cat > /GH_OAUTH_CLIENT.conf <<EOF
set \$CLIENT_ID "${CLIENT_ID:-}";
set \$CLIENT_SECRET "${CLIENT_SECRET:-}";
set \$CALL_BACK "${CALL_BACK:-}";
EOF

# --- Optional runtime subpath (VUE_APP_PUBLIC_PATH) ---
RAW="${VUE_APP_PUBLIC_PATH:-}"
# strip leading/trailing slashes adn spaces
CLEAN=$(printf '%s' "$RAW" | sed 's#^[[:space:]]*/\{0,1\}##; s#/\{0,1\}[[:space:]]*$##')

if [ -n "$CLEAN" ]; then
  PUB="/$CLEAN"
  cat > /APP_PUBLIC_PATH.conf <<EOF
# Redirect bare path to trailing slash
location = ${PUB} { return 301 ${PUB}/; }

# Mount at ${PUB}/ but serve from the build base (/myAppPlaceholder/)
location ^~ ${PUB}/ {
  rewrite ^${PUB}/(.*)$ /myAppPlaceholder/\$1 break;
  try_files \$uri \$uri/ /myAppPlaceholder/index.html;
}
EOF
else
  : > /APP_PUBLIC_PATH.conf
fi
