<x-layout path="/blog" title="Blog" :description="'All '.count($posts).' posts on '.config('site.title').'.'" image="/images/hero.webp" current="/blog">
<h1>Blog</h1>
<p>Everything I have written, newest first. Search titles and summaries, or narrow by tag.</p>
<form class="filters" role="search" action="/blog" method="get" data-filters>
<label for="q">Search posts</label>
<input id="q" name="q" type="search" placeholder="Search titles and summaries" autocomplete="off"@if ($q !== '') value="{{ $q }}"@endif>
<div class="tag-filter" role="group" aria-label="Filter by tag">
<button type="button" class="chip" data-tag="" aria-pressed="{{ $tag === '' ? 'true' : 'false' }}">All</button>
@foreach ($tags as $t)
<button type="button" class="chip" data-tag="{{ $t->slug }}" aria-pressed="{{ $tag === $t->slug ? 'true' : 'false' }}">{{ $t->name }}</button>
@endforeach
</div>
</form>
<h2 class="visually-hidden">Posts</h2>
<p class="result-count" aria-live="polite" data-result-count>Showing {{ $matching->count() }} of {{ $posts->count() }} posts</p>
<div class="card-grid" data-post-list>
@foreach ($posts as $post)
<x-card :post="$post" :eager="$loop->index < 3" :hidden="! $matching->has($post->id)" />
@endforeach
</div>
<p class="empty" data-empty{!! $matching->isNotEmpty() ? ' hidden' : '' !!}>No posts match.</p>
</x-layout>
