#!/bin/sh
set -e

# Accept empty = root
VUE_APP_PUBLIC_PATH="${VUE_APP_PUBLIC_PATH:-}"

# Normalize: allow "", "/" (root) or "/subpath"
case "$VUE_APP_PUBLIC_PATH" in
  ""|"/") NORMALIZED_PATH="/" ;;   # empty or "/" means root
  /*)     NORMALIZED_PATH="${VUE_APP_PUBLIC_PATH%/}" ;;  # already starts with / but strip off trailing /
  *)      NORMALIZED_PATH="/${VUE_APP_PUBLIC_PATH%/}" ;; # prepend / and strip off trailing /
esac


echo "Using VUE_APP_PUBLIC_PATH='${VUE_APP_PUBLIC_PATH}' (normalized='${NORMALIZED_PATH}')"

# Create symlink for subpath so /demo works by pointing to /
if [ "$NORMALIZED_PATH" != "/" ]; then
  # create parent directories if needed for subsubpaths like /foo/bar/buz
  mkdir -p /usr/share/nginx/html`dirname $NORMALIZED_PATH`
  ln -snf /usr/share/nginx/html "/usr/share/nginx/html$NORMALIZED_PATH"
fi

cat > /GH_OAUTH_CLIENT.conf <<EOT
set \$PUBLIC_PATH $NORMALIZED_PATH;
EOT

# ---- Replace placeholders in built files ----
PLACEHOLDER="/myAppPlaceholder"          # ensures single trailing slash

find /usr/share/nginx/html \
  -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" \) -print0 \
| while IFS= read -r -d '' f; do
  sed -i "s|${PLACEHOLDER}/|${NORMALIZED_PATH%/}/|g" "$f" # %/ removes trailing slash for correct replacement
  sed -i "s|${PLACEHOLDER}|${NORMALIZED_PATH}|g" "$f"
done

# replace myAppPlaceholder in nginx configuration
sed -i "s|${PLACEHOLDER}/|${NORMALIZED_PATH%/}/|g" /etc/nginx/nginx.conf # %/ removes trailing slash for correct replacement
sed -i "s|${PLACEHOLDER}|${NORMALIZED_PATH}|g" /etc/nginx/nginx.conf


# ---- Imprint override (optional) ----
# Pass -e APP_IMPRINT='<p>Your institution<br />Street 1<br />City</p>'
# If unset, the placeholder stays and the app shows the built-in default.
APP_IMPRINT="${APP_IMPRINT:-}"
if [ -n "$APP_IMPRINT" ]; then
  # escape sed-special characters (&, |, \) and flatten newlines
  IMPRINT_ESCAPED=$(printf '%s' "$APP_IMPRINT" | sed -e 's/[&|\\]/\\&/g' | tr '\n' ' ')
  find /usr/share/nginx/html \
    -type f -name "*.js" -print0 \
  | while IFS= read -r -d '' f; do
    sed -i "s|__APP_IMPRINT__|${IMPRINT_ESCAPED}|g" "$f"
  done
  echo "Injecting custom imprint"
fi