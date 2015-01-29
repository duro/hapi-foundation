#!/usr/bin/env bash

# move our node_modules into place, since we are in dev mode,
# the project folder was mounted as a volume, so it probably wiped out
# the copy of node_modules that the Dockerfile build performed
cp -a /tmp/app/node_modules $PROJECT_ROOT

# start app (with debugging)
# nodemon -V --web-host 0.0.0.0 --exec node-debug index.js

# start app (no debugging)
nodemon -V index.js
