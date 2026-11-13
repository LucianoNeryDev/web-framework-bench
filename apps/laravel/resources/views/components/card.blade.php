@props(['post', 'eager' => false, 'hidden' => false])
<article class="card" data-post data-tags="{{ $post->tags->pluck('slug')->implode(' ') }}" data-search="{{ mb_strtolower($post->title.' '.$post->summary) }}"{!! $hidden ? ' hidden' : '' !!}>
<a class="card-link" href="/blog/{{ $post->slug }}"><img class="card-image" src="{{ $post->thumb }}" alt="" width="{{ $post->thumb_width }}" height="{{ $post->thumb_height }}"@unless ($eager) loading="lazy"@endunless decoding="async"><h3 class="card-title">{{ $post->title }}</h3></a>
<p class="card-meta"><time datetime="{{ $post->date }}">{{ $post->date_label }}</time> · {{ $post->reading_minutes }} min read</p>
<p class="card-summary">{{ $post->summary }}</p>
<x-tag-list :post="$post" />
</article>
