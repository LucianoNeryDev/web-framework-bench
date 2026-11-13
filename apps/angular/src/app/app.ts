import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { site } from './data';
import { ThemeToggle } from './theme-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggle],
  template: `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="container">
        <a class="brand" routerLink="/">{{ site.title }}</a>
        <nav class="site-nav" aria-label="Main">
          <a routerLink="/" routerLinkActive ariaCurrentWhenActive="page" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/blog" routerLinkActive ariaCurrentWhenActive="page">Blog</a>
          <a routerLink="/about" routerLinkActive ariaCurrentWhenActive="page">About</a>
        </nav>
        <button appThemeToggle></button>
      </div>
    </header>
    <main id="main" class="container"><router-outlet /></main>
    <footer class="site-footer">
      <div class="container">
        <p>© 2026 {{ site.author }} · <a href="/rss.xml">RSS</a></p>
      </div>
    </footer>
  `,
})
export class App {
  protected readonly site = site;
}
