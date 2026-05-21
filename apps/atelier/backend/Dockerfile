FROM node:24-alpine AS base

WORKDIR /app

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH" 
ENV MOON_TOOLCHAIN_FORCE_GLOBALS=true
RUN corepack enable

RUN pnpm install -g @moonrepo/cli

COPY ./.moon/docker/configs ./

# moon cli seems to need git for some reason
RUN apk add --no-cache git
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

EXPOSE 3000
#test

CMD ["node", "dist/main.js"]
