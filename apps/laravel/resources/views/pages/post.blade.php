<x-layout :path="'/blog/'.$post->slug" :title="$post->title" :description="$post->summary" :image="$post->cover" type="article" current="/blog">
<article class="post">
<header class="post-header">
<p class="post-meta"><time datetime="{{ $post->date }}">{{ $post->date_label }}</time> · {{ $post->reading_minutes }} min read</p>
<h1>{{ $post->title }}</h1>
<p class="post-summary">{{ $post->summary }}</p>
<x-tag-list :post="$post" />
</header>
<img class="post-cover" src="{{ $post->cover }}" alt="{{ $post->cover_alt }}" width="{{ $post->cover_width }}" height="{{ $post->cover_height }}" fetchpriority="high">
<div class="post-body">
{!! $post->html !!}
</div>
</article>
<nav class="post-nav" aria-label="Adjacent posts">@if ($post->older)<a rel="prev" href="/blog/{{ $post->older->slug }}">← {{ $post->older->title }}</a>@endif @if ($post->newer)<a rel="next" href="/blog/{{ $post->newer->slug }}">{{ $post->newer->title }} →</a>@endif</nav>
<section class="related" aria-labelledby="related-heading">
<h2 id="related-heading">Related posts</h2>
<div class="card-grid">
@foreach ($post->related as $related)
<x-card :post="$related" />
@endforeach
</div>
</section>
</x-layout>
