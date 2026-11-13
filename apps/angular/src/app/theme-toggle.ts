import { Component, afterNextRender, signal } from '@angular/core';

@Component({
  selector: 'button[appThemeToggle]',
  host: {
    class: 'theme-toggle',
    type: 'button',
    'aria-label': 'Toggle dark mode',
    '(click)': 'toggle()',
  },
  template: '◐',
})
export class ThemeToggle {
  protected readonly theme = signal<'light' | 'dark'>('light');

  constructor() {
    // The inline <head> snippet has already applied the stored or preferred theme; read it back.
    afterNextRender(() => this.theme.set(document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light'));
  }

  protected toggle(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    document.documentElement.dataset['theme'] = next;
    try {
      localStorage.setItem('theme', next);
    } catch {}
  }
}
