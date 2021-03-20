# syntax = docker/dockerfile:experimental

FROM electronuserland/builder:wine AS builder
WORKDIR /app
COPY . .
RUN --mount=type=cache,target=/app/build \
    yarn build
RUN --mount=type=cache,target=/app/build \
    yarn electron-builder --linux --win


FROM scratch AS bin
COPY --from=builder /app/dist /
