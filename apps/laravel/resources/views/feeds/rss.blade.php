{!! '<?xml version="1.0" encoding="UTF-8"?>' !!}
<rss version="2.0">
<channel>
<title>{{ config('site.title') }}</title>
<link>{{ config('site.url') }}/</link>
<description>{{ config('site.description') }}</description>
<language>en</language>
@foreach ($posts as $post)
<item>
<title>{{ $post->title }}</title>
<link>{{ config('site.url') }}/blog/{{ $post->slug }}</link>
<guid>{{ config('site.url') }}/blog/{{ $post->slug }}</guid>
<pubDate>{{ gmdate(DATE_RFC7231, strtotime($post->date.' UTC')) }}</pubDate>
<description>{{ $post->summary }}</description>
</item>
@endforeach
</channel>
</rss>
