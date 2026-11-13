package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"strings"
	"time"
)

// Site, Tag and Post mirror content/posts.json. Values the contract says not to recompute
// (dateLabel, readingMinutes, prev, next, related) are used exactly as given.
type Site struct {
	Title       string        `json:"title"`
	Description string        `json:"description"`
	URL         string        `json:"url"`
	Author      string        `json:"author"`
	HeroTitle   string        `json:"heroTitle"`
	HeroText    string        `json:"heroText"`
	AboutHTML   template.HTML `json:"aboutHtml"`
}

type Tag struct {
	Slug string `json:"slug"`
	Name string `json:"name"`
}

type Cover struct {
	Src         string `json:"src"`
	Thumb       string `json:"thumb"`
	Alt         string `json:"alt"`
	Width       int    `json:"width"`
	Height      int    `json:"height"`
	ThumbWidth  int    `json:"thumbWidth"`
	ThumbHeight int    `json:"thumbHeight"`
}

type Post struct {
	Slug           string        `json:"slug"`
	Title          string        `json:"title"`
	Summary        string        `json:"summary"`
	Date           string        `json:"date"`
	DateLabel      string        `json:"dateLabel"`
	Tags           []string      `json:"tags"`
	ReadingMinutes int           `json:"readingMinutes"`
	Cover          Cover         `json:"cover"`
	HTML           template.HTML `json:"html"`
	Prev           string        `json:"prev"`
	Next           string        `json:"next"`
	Related        []string      `json:"related"`

	// Resolved once at start-up.
	TagViews    []Tag   `json:"-"`
	PrevPost    *Post   `json:"-"`
	NextPost    *Post   `json:"-"`
	RelatedPost []*Post `json:"-"`
	Search      string  `json:"-"` // lower-cased title + " " + summary
	PubDate     string  `json:"-"` // RFC 822 for the feed
}

type Data struct {
	Site   Site             `json:"site"`
	Tags   []Tag            `json:"tags"`
	Posts  []*Post          `json:"posts"`
	BySlug map[string]*Post `json:"-"`
}

func loadData(path string) (*Data, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var d Data
	if err := json.Unmarshal(raw, &d); err != nil {
		return nil, fmt.Errorf("%s: %w", path, err)
	}
	tagName := make(map[string]string, len(d.Tags))
	for _, t := range d.Tags {
		tagName[t.Slug] = t.Name
	}
	d.BySlug = make(map[string]*Post, len(d.Posts))
	for _, p := range d.Posts {
		d.BySlug[p.Slug] = p
	}
	for _, p := range d.Posts {
		for _, t := range p.Tags {
			p.TagViews = append(p.TagViews, Tag{Slug: t, Name: tagName[t]})
		}
		p.PrevPost = d.BySlug[p.Prev]
		p.NextPost = d.BySlug[p.Next]
		for _, s := range p.Related {
			if r := d.BySlug[s]; r != nil {
				p.RelatedPost = append(p.RelatedPost, r)
			}
		}
		p.Search = strings.ToLower(p.Title + " " + p.Summary)
		day, err := time.Parse("2006-01-02", p.Date)
		if err != nil {
			return nil, fmt.Errorf("post %s: %w", p.Slug, err)
		}
		p.PubDate = day.UTC().Format(http.TimeFormat)
	}
	return &d, nil
}

// filter applies the contract: the tag (if any) is in the post's tags and the query (if any)
// is a case-insensitive substring of title + " " + summary. Order is kept (newest first).
func (d *Data) matches(p *Post, needle, tag string) bool {
	if tag != "" {
		found := false
		for _, t := range p.Tags {
			if t == tag {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}
	return needle == "" || strings.Contains(p.Search, needle)
}
