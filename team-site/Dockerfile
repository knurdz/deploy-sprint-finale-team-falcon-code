
FROM node:20-alpine AS build

ARG COMMIT_SHA=container-build
ARG RELEASE_ID=container-build
ARG PUBLIC_URL=not-configured

ENV COMMIT_SHA=${COMMIT_SHA}
ENV RELEASE_ID=${RELEASE_ID}
ENV PUBLIC_URL=${PUBLIC_URL}

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime

ARG COMMIT_SHA=container-build

LABEL org.opencontainers.image.revision="${COMMIT_SHA}"
LABEL org.opencontainers.image.title="Falcon Code team site"
LABEL org.opencontainers.image.source="https://github.com/knurdz/deploy-sprint-finale-team-falcon-code"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health/ | grep -qx ok
