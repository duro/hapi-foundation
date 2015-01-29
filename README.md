# Viite/Vyte API

## Development Environment

### Requirements

* Vagrant 1.7.2+
* Docker 1.4.1+
* VirtualBox 4.3.18+
* rsync

### Install Docker

You will want to get the docker client on your host machine

#### OS X

Use homebrew to install

```
$ brew update
$ brew install docker
```

### Docker Host

You need to have a Vagrant compatible Dockerhost setup on your machine. If you have not already done this for another ZG project, do the following

1. Copy the following Gist to `~/Workspace/docker/vagrant`

    https://gist.github.com/duro/a8ecbb620ea14a992c20

You can now configure this machine to work with your `docker` cli on your host machine by adding the following to your shell profile

```
export DOCKER_HOST=tcp://localhost:2375
```

### Getting Started

To build the dev environment, simply run `vagrant up` from the project root.

This will build two containers into your Dockerhost, an `app` container which will contain our node.js application, and a `mongodb` to contain our database.

You should now be able to connect to the app with the following URL:

http://192.168.100.100:8000/hello

### Syncing files to the Container

The Vagrant config will rsync the application to the Docker host, and mount the rsync'd folder to the container as a Volume.

To make sure that you file changes are sent to the Container, you should run `vagrant rsync-auto` and it will stay running, watching the project folder for changes and syncing them.

### Finding the current container's ID

To find the container ID run `docker ps`. You will get an output like this:

```
CONTAINER ID        IMAGE               COMMAND
46507a4e829e        vtapp/api:latest    "./bin/dev.sh"
2a6ff275a5af        mongo:2             "/entrypoint.sh mong
```

You are looking for the ID that is associated with the `vtapp/api:latest` image

### Getting the logs from your running application

With your container ID in hand ([see above](#finding-the-current-containers-id)), run `docker logs -f CONTAINER_ID`

### Shell access into the container

With your container ID in hand ([see above](#finding-the-current-containers-id)), run `docker exec -it CONTAINER_ID bash`

### Installing NPM Modules

Get a shell inside the container, and use `npm install --save MODULE` or `npm install --save-dev MODULE` to install it inside the container. After you are done installing, make sure you bring the modified `package.json` back to the host by copying the output of `cat package.json` and pasting it into your IDE so it can be comitted to Git.

### Debugging

A debugger is ready to go inside the container. In order to activate it, you will need to add a file to the root of the project folder named `.myenvvars` and add the following:

```
export DEBUGGER=true
```

Since the env var added to that file needs to be picked up by the container start script, you will need to make sure that the updated file was sent into the container via `vagrant rsync-auto` and then you can restart the container by running `docker restart CONTAINER_ID`

Once the app has been started with the Debugger turned on, you can connect connect to the debugger at the following URL:

http://192.168.100.100:8080/debug?port=5858

### Testing

The application is being tested using the [Lab](https://github.com/hapijs/lab) testing framework. All modules added to the app should have corrisponding tests produced for them.

To run tests, run the following command from inside the container:

```
npm test
```
