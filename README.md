# Authorization Service

The authorization microservice for the [Distributed Spotify Web App](https://github.com/mborhi/Distributed-Spotify-Quick-Discover)

## Table of Contents

* [Quick Start](#quick-start)
    + [Docker](#docker)
    + [GitHub](#github)
* [Service Architecture](#service-architecture)
    + [Authorization](#authorization)
    + [Token Storage](#token-storage)
* [Testing](#testing)

---

# Quick Start

This section describes how to run this service locally on your machine.

## Docker 

You may pull the latest docker image from the DockerHub Repository:


```
docker --version
```

If you get an error, you can install it on the official [Docker page](https://www.docker.com/get-started/).

Pull the image by entering the following command:

```
docker pull mborhi/spotify-quick-discover-retrieval-svc 
```

You now have the Docker image installed. If you have the Docker desktop app installed you can simply head over to the Images section and click run beside the image you just pulled. Otherwise, you can run the image using the `run` command:

```
docker run --rm -dp 3000:3000 mborhi/spotify-quick-discover-retrieval-svc
```

Verify that the image is successfully running by visiting http://localhost:3000 in your preferred browser.

To stop the container, use the command: 

```
docker stop mborhi/spotify-quick-discover-retrieval-svc
```

## GitHub

Alternatively, you can clone this repository from GitHub and use the following commands to run the application on your local machine:

First install the necessary dependencies by running: `npm install`. Then, make sure to configure a `.env` file in the root of the directory, if you want to run the server on port different than 3000.

You are now ready to transpile and build the TypeScript files:

```
npm run tsc
```

Launch the server by using:

```
npm run start:prod
```

Verify that the server is live by visiting http://localhost:3000 in your preferred browser.

Simply press control-C in the terminal window running the server to stop the application.

---

# Service Architecture

This section outlines the architecture of this microservice, as well as its capabilities.

## Authorization

This microservice exposes two HTTP endpoints for authorization:

* __'/login/'__ for handling the incoming request to login in to Spotify
* __'/login/callback'__ for handling the callback made by Spotify

This follows the OAuth2 Authorization Code Flow specified for logging into Spotify: [Authorization Code Flow](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/).

Upon a successful login, a session-id is generated, which is stored along with the newly recieved token. The session-id is sent back via a redirect to the home page of specified url. You can read more about this in the following [section](#token-storage)

## Token Storage

Tokens are stored in a Redis cache. The session-ids generated upon a successful login are used as keys to store the tokens. These session-id - token key-pairs are set to have an expiration of one day in the Redis cache. This is improves the safety of the application by making users login more frequently, while still allowing for a good user experience for extended use of the Web App.