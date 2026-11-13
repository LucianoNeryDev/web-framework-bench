# Build context: repository root.
#   docker build -f apps/go/Dockerfile --target server -t wfb/go:server .
# One image, two benchmark targets:
#   docker run -e WFB_INTERACTIVITY=vanilla ...   -> target go
#   docker run -e WFB_INTERACTIVITY=htmx ...      -> target go-htmx
FROM golang:1.27.4-alpine AS build
WORKDIR /src
COPY apps/go/go.mod ./
RUN go mod download
COPY apps/go/ ./
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/server .
# Shared files are copied in, never committed under apps/go.
COPY shared/public/ /out/public/
COPY content/posts.json /out/posts.json
# The host umask is 077; make the copied files readable by the non-root runtime user.
RUN chmod -R a+rX /out

FROM gcr.io/distroless/static-debian12:nonroot AS server
COPY --from=build /out/server /app/server
COPY --from=build /out/posts.json /app/posts.json
COPY --from=build /out/public/ /public/
ENV WFB_INTERACTIVITY=vanilla WFB_DATA=/app/posts.json WFB_PUBLIC=/public
EXPOSE 8080
ENTRYPOINT ["/app/server"]
