FROM node:24 AS base

WORKDIR /app

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV MOON_TOOLCHAIN_FORCE_GLOBALS=true
RUN corepack enable

RUN pnpm install -g @moonrepo/cli

COPY ./.moon/docker/configs ./

RUN moon docker setup

COPY ./.moon/docker/sources ./

RUN moon run atelier/backend:build

RUN pnpm deploy --filter=@atelier/backend --prod /prod/atelier/backend

FROM node:24-alpine

WORKDIR /app

RUN adduser -D -H service

COPY --chown=service:service --from=base /prod/atelier/backend/node_modules ./node_modules
COPY --chown=service:service --from=base /prod/atelier/backend/dist ./dist

USER service

# entrypoint of the container. Change to whatever suites the app
CMD ["node", "dist/main.js"]
