#!/bin/sh
set -e

# Accept empty = root
VUE_APP_PUBLIC_PATH="${VUE_APP_PUBLIC_PATH:-}"

# Normalize: allow "", "/" (root) or "/subpath"
case "$VUE_APP_PUBLIC_PATH" in
  ""|"/") NORMALIZED_PATH="" ;;   # empty or "/" means root
  /*)     NORMALIZED_PATH="$VUE_APP_PUBLIC_PATH" ;;  # already starts with /
  *)      NORMALIZED_PATH="/$VUE_APP_PUBLIC_PATH" ;; # prepend /
esac

echo "Using VUE_APP_PUBLIC_PATH='${VUE_APP_PUBLIC_PATH}' (normalized='${NORMALIZED_PATH}')"

# Runtime value for replacing placeholders in built files
RUNTIME_PUBLIC_PATH="${NORMALIZED_PATH:-/}"

# Create symlink for subpath so /demo works by pointing to /
if [ -n "$NORMALIZED_PATH" ]; then
  ln -snf /usr/share/nginx/html "/usr/share/nginx/html$NORMALIZED_PATH"
fi

# Flag for nginx logic
HAS_SUBPATH=0
[ -n "$NORMALIZED_PATH" ] && HAS_SUBPATH=1

# Write variables for nginx to include
PP="$NORMALIZED_PATH"
[ -z "$PP" ] && PP='""'  # explicit empty for nginx set

cat > /GH_OAUTH_CLIENT.conf <<EOT
set \$PUBLIC_PATH $PP;
set \$HAS_SUBPATH $HAS_SUBPATH;
EOT

# ---- Replace placeholders in built files ----
PLACEHOLDER="/myAppPlaceholder"
RP="${RUNTIME_PUBLIC_PATH}"   # "/" or "/subpath"
RP_DIR="${RP%/}/"             # ensures single trailing slash

find /usr/share/nginx/html \
  -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" \) -print0 \
| while IFS= read -r -d '' f; do
  sed -i "s|${PLACEHOLDER}/|${RP_DIR}|g" "$f"
  sed -i "s|${PLACEHOLDER}|${RP}|g" "$f"
  sed -i 's|src="//|src="/|g'   "$f"
  sed -i 's|href="//|href="/|g' "$f"
  sed -i 's|url(//|url(/|g'     "$f"
done
