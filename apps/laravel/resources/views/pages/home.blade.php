<x-layout path="/" :description="config('site.description')" image="/images/hero.webp" current="/">
<section class="hero">
<div class="hero-text"><h1>{{ config('site.heroTitle') }}</h1><p>{{ config('site.heroText') }}</p><p><a class="button" href="/blog">Read the blog</a></p></div>
<img class="hero-image" src="/images/hero.webp" alt="Abstract illustration of overlapping circles" width="1600" height="900" fetchpriority="high">
</section>
<section class="latest" aria-labelledby="latest-heading">
<h2 id="latest-heading">Latest posts</h2>
<div class="card-grid">
@foreach ($posts as $post)
<x-card :post="$post" />
@endforeach
</div>
<p class="section-footer"><a href="/blog">All posts →</a></p>
</section>
</x-layout>
