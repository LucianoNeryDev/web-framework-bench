@props(['path', 'title' => null, 'description', 'image', 'type' => 'website', 'current' => null])
@php
    $site = config('site');
    $fullTitle = $path === '/' ? $site['title'] : $title.' · '.$site['title'];
    $nav = ['/' => 'Home', '/blog' => 'Blog', '/about' => 'About'];
@endphp
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ $fullTitle }}</title>
<meta name="description" content="{{ $description }}">
<link rel="canonical" href="{{ $site['url'].$path }}">
<meta property="og:type" content="{{ $type }}">
<meta property="og:title" content="{{ $fullTitle }}">
<meta property="og:description" content="{{ $description }}">
<meta property="og:image" content="{{ $site['url'].$image }}">
<link rel="alternate" type="application/rss+xml" title="{{ $site['title'] }}" href="/rss.xml">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t;else if(matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.dataset.theme="dark"}catch(e){}</script>
<link rel="stylesheet" href="/style.css">
<script src="/app.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="container"><a class="brand" href="/">{{ $site['title'] }}</a><nav class="site-nav" aria-label="Main">@foreach ($nav as $href => $label)<a href="{{ $href }}"@if ($current === $href) aria-current="page"@endif>{{ $label }}</a>@endforeach</nav><button class="theme-toggle" type="button" aria-label="Toggle dark mode" data-theme-toggle>◐</button></div></header>
<main id="main" class="container">
{{ $slot }}
</main>
<footer class="site-footer"><div class="container"><p>© 2026 {{ $site['author'] }} · <a href="/rss.xml">RSS</a></p></div></footer>
</body>
</html>
