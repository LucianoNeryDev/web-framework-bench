package main

import (
	"bytes"
	"encoding/xml"
	"fmt"
	"html/template"
	"io/fs"
	"net/http"
	"os"
	"path"
	"strings"
	texttemplate "text/template"
)

type Server struct {
	data   *Data
	htmx   bool
	public fs.FS
	pages  map[string]*template.Template
	rss    *texttemplate.Template
	smap   *texttemplate.Template
}

// Meta is what the shared layout needs for <head> and the navigation.
type Meta struct {
	Title       string // full <title>
	Description string
	Path        string // canonical path
	Image       string
	Type        string // og:type
	Current     string // nav entry marked aria-current="page"
}

type NavItem struct{ Href, Label string }

// Page is the template data for every HTML page.
type Page struct {
	Site  Site
	Meta  Meta
	HTMX  bool
	Nav   []NavItem
	Cards []Card // home: latest posts
	Post  *Post
	Blog  Blog
}

// Card is one post card; Eager drops loading="lazy", Hidden marks a filtered-out card.
type Card struct {
	*Post
	Eager  bool
	Hidden bool
}

// Blog is the state of the /blog listing.
type Blog struct {
	Q     string // raw query as typed
	Tag   string
	Tags  []Tag
	Count int // matching posts
	Total int
	Cards []Card
	HTMX  bool
}

var nav = []NavItem{{"/", "Home"}, {"/blog", "Blog"}, {"/about", "About"}}

func newServer(data *Data, htmx bool, publicDir string) (*Server, error) {
	s := &Server{data: data, htmx: htmx, public: os.DirFS(publicDir), pages: map[string]*template.Template{}}
	for name, files := range map[string][]string{
		"home":     {"home.html", "card.html"},
		"blog":     {"blog.html", "card.html"},
		"post":     {"post.html", "card.html"},
		"about":    {"about.html"},
		"notfound": {"notfound.html"},
	} {
		patterns := []string{"templates/layout.html"}
		for _, f := range files {
			patterns = append(patterns, "templates/"+f)
		}
		t, err := template.New(name).Funcs(template.FuncMap{"card": func(p *Post) Card { return Card{Post: p} }}).ParseFS(templateFS, patterns...)
		if err != nil {
			return nil, err
		}
		s.pages[name] = t
	}
	funcs := texttemplate.FuncMap{"xml": func(v string) (string, error) {
		var b bytes.Buffer
		err := xml.EscapeText(&b, []byte(v))
		return b.String(), err
	}}
	var err error
	if s.rss, err = texttemplate.New("rss.xml").Funcs(funcs).ParseFS(templateFS, "templates/rss.xml"); err != nil {
		return nil, err
	}
	if s.smap, err = texttemplate.New("sitemap.xml").Funcs(funcs).ParseFS(templateFS, "templates/sitemap.xml"); err != nil {
		return nil, err
	}
	return s, nil
}

func (s *Server) routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /{$}", s.home)
	mux.HandleFunc("GET /blog", s.blog)
	mux.HandleFunc("GET /blog/{slug}", s.post)
	mux.HandleFunc("GET /about", s.about)
	mux.HandleFunc("GET /rss.xml", s.feed(s.rss, "application/rss+xml; charset=utf-8"))
	mux.HandleFunc("GET /sitemap.xml", s.feed(s.smap, "application/xml; charset=utf-8"))
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		fmt.Fprintln(w, "ok")
	})
	mux.HandleFunc("GET /style.css", s.static)
	mux.HandleFunc("GET /app.js", s.static)
	mux.HandleFunc("GET /favicon.svg", s.static)
	mux.HandleFunc("GET /images/{file...}", s.static)
	mux.HandleFunc("GET /htmx.min.js", func(w http.ResponseWriter, r *http.Request) {
		if !s.htmx {
			s.notFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "text/javascript; charset=utf-8")
		w.Write(htmxJS)
	})
	mux.HandleFunc("/", s.notFound)
	return mux
}

func (s *Server) base(m Meta) Page {
	return Page{Site: s.data.Site, Meta: m, HTMX: s.htmx, Nav: nav}
}

// render executes into a buffer first so a template error can still become a 500.
func (s *Server) render(w http.ResponseWriter, status int, page, block string, data any) {
	var buf bytes.Buffer
	if err := s.pages[page].ExecuteTemplate(&buf, block, data); err != nil {
		http.Error(w, "template error", http.StatusInternalServerError)
		fmt.Fprintln(os.Stderr, "render:", err)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(status)
	w.Write(buf.Bytes())
}

func cards(posts []*Post) []Card {
	out := make([]Card, len(posts))
	for i, p := range posts {
		out[i] = Card{Post: p}
	}
	return out
}

func (s *Server) home(w http.ResponseWriter, r *http.Request) {
	site := s.data.Site
	p := s.base(Meta{Title: site.Title, Description: site.Description, Path: "/", Image: "/images/hero.webp", Type: "website", Current: "/"})
	p.Cards = cards(s.data.Posts[:min(6, len(s.data.Posts))])
	s.render(w, http.StatusOK, "home", "layout", p)
}

func (s *Server) blog(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")
	tag := r.URL.Query().Get("tag")
	needle := strings.ToLower(strings.TrimSpace(q))

	b := Blog{Q: q, Tag: tag, Tags: s.data.Tags, Total: len(s.data.Posts), HTMX: s.htmx}
	for i, post := range s.data.Posts {
		match := s.data.matches(post, needle, tag)
		if match {
			b.Count++
		}
		switch {
		case s.htmx && match:
			// htmx mode: the server returns only the matching cards.
			b.Cards = append(b.Cards, Card{Post: post, Eager: len(b.Cards) < 3})
		case !s.htmx:
			// Vanilla mode: app.js filters the full list in the browser, so every card is rendered and
			// the ones that do not match are marked hidden, which keeps app.js's counts and chips right.
			b.Cards = append(b.Cards, Card{Post: post, Eager: i < 3, Hidden: !match})
		}
	}

	w.Header().Add("Vary", "HX-Request")
	if s.htmx && r.Header.Get("HX-Request") == "true" && r.Header.Get("HX-History-Restore-Request") != "true" {
		s.render(w, http.StatusOK, "blog", "fragment", b)
		return
	}
	p := s.base(Meta{Title: "Blog · " + s.data.Site.Title, Description: fmt.Sprintf("All %d posts on %s.", len(s.data.Posts), s.data.Site.Title), Path: "/blog", Image: "/images/hero.webp", Type: "website", Current: "/blog"})
	p.Blog = b
	s.render(w, http.StatusOK, "blog", "layout", p)
}

func (s *Server) post(w http.ResponseWriter, r *http.Request) {
	post := s.data.BySlug[r.PathValue("slug")]
	if post == nil {
		s.notFound(w, r)
		return
	}
	p := s.base(Meta{Title: post.Title + " · " + s.data.Site.Title, Description: post.Summary, Path: "/blog/" + post.Slug, Image: post.Cover.Src, Type: "article", Current: "/blog"})
	p.Post = post
	s.render(w, http.StatusOK, "post", "layout", p)
}

func (s *Server) about(w http.ResponseWriter, r *http.Request) {
	site := s.data.Site
	p := s.base(Meta{Title: "About · " + site.Title, Description: fmt.Sprintf("About %s and %s.", site.Author, site.Title), Path: "/about", Image: "/images/avatar.webp", Type: "website", Current: "/about"})
	s.render(w, http.StatusOK, "about", "layout", p)
}

func (s *Server) notFound(w http.ResponseWriter, r *http.Request) {
	p := s.base(Meta{Title: "Page not found · " + s.data.Site.Title, Description: "This page does not exist.", Path: "/404", Image: "/images/hero.webp", Type: "website"})
	s.render(w, http.StatusNotFound, "notfound", "layout", p)
}

// feed renders rss.xml or sitemap.xml per request.
func (s *Server) feed(t *texttemplate.Template, contentType string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var buf bytes.Buffer
		if err := t.Execute(&buf, s.data); err != nil {
			http.Error(w, "template error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", contentType)
		w.Write(buf.Bytes())
	}
}

// static serves shared/public (style.css, app.js, favicon.svg, images/). Anything that is not a
// regular file, including directories, gets the 404 page.
func (s *Server) static(w http.ResponseWriter, r *http.Request) {
	name := strings.TrimPrefix(path.Clean("/"+r.URL.Path), "/")
	info, err := fs.Stat(s.public, name)
	if err != nil || !info.Mode().IsRegular() {
		s.notFound(w, r)
		return
	}
	http.ServeFileFS(w, r, s.public, name)
}
