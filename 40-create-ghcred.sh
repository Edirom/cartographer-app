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


# ---- Imprint override (optional, structured) ----
# Pass any of: APP_IMPRINT_INSTITUTION, APP_IMPRINT_ADDRESS, APP_IMPRINT_PHONE,
# APP_IMPRINT_CONTACT_PERSON, APP_IMPRINT_EMAIL, APP_IMPRINT_LINK
# If none is set, the placeholders remain and the app shows its built-in
# default imprint.
replace_imprint_var () {
  # $1 = placeholder, $2 = value
  [ -z "$2" ] && return 0
  ESCAPED=$(printf '%s' "$2" | sed -e 's/[&|\\"]/\\&/g' | tr '\n' ' ')
  find /usr/share/nginx/html -type f -name "*.js" -print0 \
  | while IFS= read -r -d '' f; do
    sed -i "s|$1|${ESCAPED}|g" "$f"
  done
}
replace_imprint_var '__APP_IMPRINT_INSTITUTION__'    "${APP_IMPRINT_INSTITUTION:-}"
replace_imprint_var '__APP_IMPRINT_STREET__'         "${APP_IMPRINT_STREET:-}"
replace_imprint_var '__APP_IMPRINT_ZIP__'            "${APP_IMPRINT_ZIP:-}"
replace_imprint_var '__APP_IMPRINT_CITY__'           "${APP_IMPRINT_CITY:-}"
replace_imprint_var '__APP_IMPRINT_COUNTRY__'        "${APP_IMPRINT_COUNTRY:-}"
replace_imprint_var '__APP_IMPRINT_PHONE__'          "${APP_IMPRINT_PHONE:-}"
replace_imprint_var '__APP_IMPRINT_CONTACT_PERSON__' "${APP_IMPRINT_CONTACT_PERSON:-}"
replace_imprint_var '__APP_IMPRINT_EMAIL__'          "${APP_IMPRINT_EMAIL:-}"
replace_imprint_var '__APP_IMPRINT_LINK__'           "${APP_IMPRINT_LINK:-}"

if [ -n "${APP_IMPRINT_INSTITUTION:-}${APP_IMPRINT_STREET:-}${APP_IMPRINT_ZIP:-}${APP_IMPRINT_CITY:-}${APP_IMPRINT_COUNTRY:-}${APP_IMPRINT_PHONE:-}${APP_IMPRINT_CONTACT_PERSON:-}${APP_IMPRINT_EMAIL:-}${APP_IMPRINT_LINK:-}" ]; then
  echo "Injecting custom imprint"
fi