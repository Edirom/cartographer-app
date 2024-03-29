#!/bin/sh
# create nginx config from environment
# *prevent envsubst from killing nginx vars with 'tr' and '@'*
cat << EOT | envsubst | tr '@' '$' > GH_OAUTH_CLIENT.conf
set @CLIENT_ID $CLIENT_ID;
set @CLIENT_SECRET $CLIENT_SECRET;
EOT
