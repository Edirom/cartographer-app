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

PLACEHOLDER="/myAppPlaceholder"          # ensures single trailing slash

# ---- Step 1: GitHub OAuth values (from env) ----
# Pass these at docker run time:
#   -e VUE_APP_CLIENT_ID=your_client_id
#   -e CLIENT_SECRET=your_client_secret
#   -e VUE_APP_CALL_BACK=http://localhost:8080/myAppPlaceholder/callback
# Using /myAppPlaceholder in the callback URL allows the PUBLIC_PATH replacement
# below to rewrite it to the actual subpath automatically.
GH_CLIENT_ID="${VUE_APP_CLIENT_ID:-}"
GH_CLIENT_SECRET="${CLIENT_SECRET:-}"
GH_CALLBACK_URL="${VUE_APP_CALL_BACK:-}"

# Runtime nginx variables consumed by nginx.conf (PUBLIC_PATH + OAuth creds).
# The client secret lives only inside the container here — never in the SPA.
cat > /GH_OAUTH_CLIENT.conf <<EOT
set \$PUBLIC_PATH $NORMALIZED_PATH;
set \$CLIENT_ID $GH_CLIENT_ID;
set \$CLIENT_SECRET $GH_CLIENT_SECRET;
set \$CALLBACK_URL $GH_CALLBACK_URL;
EOT

CLIENT_ID_PREFIX=$(printf '%.4s' "$GH_CLIENT_ID")
echo "Injecting GitHub OAuth config: CLIENT_ID=${CLIENT_ID_PREFIX}**** CALLBACK=${GH_CALLBACK_URL}"

find /usr/share/nginx/html \
  -type f \( -name "*.js" -o -name "*.html" \) -print0 \
| while IFS= read -r -d '' f; do
  sed -i "s|__GH_CLIENT_ID__|${GH_CLIENT_ID}|g" "$f"
  sed -i "s|__GH_CALLBACK_URL__|${GH_CALLBACK_URL}|g" "$f"
done

# ---- Step 2: Replace PUBLIC_PATH placeholders (including any inside injected OAuth values) ----
find /usr/share/nginx/html \
  -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" \) -print0 \
| while IFS= read -r -d '' f; do
  sed -i "s|${PLACEHOLDER}/|${NORMALIZED_PATH%/}/|g" "$f"
  sed -i "s|${PLACEHOLDER}|${NORMALIZED_PATH}|g" "$f"
done

# replace myAppPlaceholder in nginx configuration
sed -i "s|${PLACEHOLDER}/|${NORMALIZED_PATH%/}/|g" /etc/nginx/nginx.conf
sed -i "s|${PLACEHOLDER}|${NORMALIZED_PATH}|g" /etc/nginx/nginx.conf

# also rewrite the placeholder inside the injected OAuth conf so $CALLBACK_URL
# matches the value baked into the SPA (e.g. /myAppPlaceholder/callback -> /callback)
sed -i "s|${PLACEHOLDER}/|${NORMALIZED_PATH%/}/|g" /GH_OAUTH_CLIENT.conf
sed -i "s|${PLACEHOLDER}|${NORMALIZED_PATH}|g" /GH_OAUTH_CLIENT.conf
