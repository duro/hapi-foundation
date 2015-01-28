FROM node:0.10.35

## set some ENV vars
ENV HOME /root
ENV TERM dumb
ENV PROJECT_ROOT /opt/app

# use changes to dependency files to force Docker not to use the cache
# when we change our application's dependencies:
RUN mkdir -p /tmp/app

# add our dependency files to a /tmp location
ADD package.json /tmp/app/package.json

# install dependencies
RUN cd /tmp/app/ && npm install

# add our app files
RUN mkdir -p $PROJECT_ROOT
ADD . $PROJECT_ROOT
WORKDIR $PROJECT_ROOT

## move our node_modules back into app
RUN cp -a /tmp/app/node_modules $PROJECT_ROOT

## expose ports
EXPOSE 8000

CMD ["/bin/bash"]