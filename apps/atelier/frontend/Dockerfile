FROM node:24-alpine AS base

WORKDIR /app

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
ENV MOON_TOOLCHAIN_FORCE_GLOBALS=true
RUN corepack enable

RUN pnpm install -g @moonrepo/cli

COPY ./.moon/docker/configs ./

RUN apk add --no-cache git
RUN moon docker setup

COPY ./.moon/docker/sources ./

RUN moon run atelier/frontend:build

RUN pnpm deploy --filter=@atelier/frontend --prod /prod/atelier/frontend

FROM node:24-alpine

WORKDIR /app

RUN adduser -D -H service

COPY --chown=service:service --from=base /prod/atelier/frontend/node_modules ./node_modules
COPY --chown=service:service --from=base /prod/atelier/frontend/dist/frontend ./dist

USER service

EXPOSE 4000

CMD ["node", "dist/server/server.mjs"]
