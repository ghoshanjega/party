# Party games

## Explorations

- Monorepo with turborepo
- Three JS
- Node JS based server
- Docker 
- Azure ACI

## What's inside?

This turborepo uses [npm](https://www.npmjs.com/) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `api`: a [Fastify](https://www.fastify.io/) server with [Socket.IO](https://socket.io/)
- `games`: a [Next.js](https://nextjs.org) app
- `interface`: utility interface shared by `games` and `api` applications
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Build

To build all apps and packages, run the following command:

```
cd party
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```
cd party
npm run dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turborepo.org/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd party
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your turborepo:

```
npx turbo link
```

### Docker

This repo is configured to be built with Docker, and Docker compose. To build all apps in this repo:

```
# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname
docker network create app_network

# Build prod using new BuildKit engine
DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build --parallel

# Start prod in detached mode
docker-compose -f docker-compose.yml up -d
```

Open http://localhost:3000.
Open http://localhost:8080.

To shutdown all running containers:

```
# Stop all running containers
docker kill $(docker ps -q) && docker rm $(docker ps -a -q)
```

## Azure deployment using ACI
https://learn.microsoft.com/en-us/azure/container-instances/tutorial-docker-compose

```shell
az login
az group create --name myResourceGroup --location eastus
az acr create --resource-group myResourceGroup --name ghoshanjega --sku Basic
az acr login --name ghoshanjega

DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build --parallel
docker-compose push

docker login azure

docker context create aci partycontext
docker context use partycontext

docker-compose -f docker-compose.yml up -d
```

## Useful Links

Learn more about the power of Turborepo:

- [Pipelines](https://turborepo.org/docs/core-concepts/pipelines)
- [Caching](https://turborepo.org/docs/core-concepts/caching)
- [Remote Caching](https://turborepo.org/docs/core-concepts/remote-caching)
- [Scoped Tasks](https://turborepo.org/docs/core-concepts/scopes)
- [Configuration Options](https://turborepo.org/docs/reference/configuration)
- [CLI Usage](https://turborepo.org/docs/reference/command-line-reference)

,
    // "nohoist": [
    //   "**/games",
    //   "**/games/**"
    // ]