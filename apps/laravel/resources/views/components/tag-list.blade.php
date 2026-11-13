@props(['post'])
<ul class="tag-list">@foreach ($post->tags as $tag)<li><a class="tag" href="/blog?tag={{ $tag->slug }}">{{ $tag->name }}</a></li>@endforeach</ul>
