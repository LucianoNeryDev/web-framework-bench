// Field Notes on the Go standard library: net/http, the Go 1.22+ ServeMux patterns and html/template.
// Every page is rendered per request; only the templates and posts.json are loaded once at start-up.
package main

import (
	"context"
	"embed"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

//go:embed templates
var templateFS embed.FS

// The vendored htmx 2.x build, served from the same origin (no CDN).
//
//go:embed static/htmx.min.js
var htmxJS []byte

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func main() {
	mode := env("WFB_INTERACTIVITY", "vanilla")
	if mode != "vanilla" && mode != "htmx" {
		log.Fatalf("WFB_INTERACTIVITY must be vanilla or htmx, got %q", mode)
	}
	data, err := loadData(env("WFB_DATA", "/app/posts.json"))
	if err != nil {
		log.Fatal(err)
	}
	srv, err := newServer(data, mode == "htmx", env("WFB_PUBLIC", "/public"))
	if err != nil {
		log.Fatal(err)
	}

	httpServer := &http.Server{
		Addr:              env("WFB_ADDR", ":8080"),
		Handler:           srv.routes(),
		ReadHeaderTimeout: 5 * time.Second,
		IdleTimeout:       60 * time.Second,
	}
	go func() {
		stop := make(chan os.Signal, 1)
		signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
		<-stop
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = httpServer.Shutdown(ctx)
	}()
	log.Printf("field notes (%s) listening on %s, %d posts", mode, httpServer.Addr, len(data.Posts))
	if err := httpServer.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
