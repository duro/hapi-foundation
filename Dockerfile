FROM node:0.10.36

## set some ENV vars
ENV HOME /root
ENV TERM dumb
ENV PROJECT_ROOT /opt/app

# use changes to dependency files to force Docker not to use the cache
# when we change our application's dependencies:
RUN mkdir -p /tmp/app

# install some global node modules
RUN npm install -g nodemon@1.3.2 node-inspector@0.8.3

# add our dependency files to a /tmp location
ADD package.json /tmp/app/package.json

# install dependencies
RUN cd /tmp/app/ && npm install

# create app log folder
RUN mkdir -p /var/log/vt-api

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/vt-api/vt-api.log

# add our app files
RUN mkdir -p $PROJECT_ROOT
ADD . $PROJECT_ROOT
WORKDIR $PROJECT_ROOT

## move our node_modules back into app
RUN cp -a /tmp/app/node_modules $PROJECT_ROOT

CMD ["/bin/bash"]