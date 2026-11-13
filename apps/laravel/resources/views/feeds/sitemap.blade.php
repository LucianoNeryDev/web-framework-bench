{!! '<?xml version="1.0" encoding="UTF-8"?>' !!}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>{{ config('site.url') }}/</loc><lastmod>{{ $posts->first()->date }}</lastmod></url>
<url><loc>{{ config('site.url') }}/blog</loc><lastmod>{{ $posts->first()->date }}</lastmod></url>
<url><loc>{{ config('site.url') }}/about</loc></url>
@foreach ($posts as $post)
<url><loc>{{ config('site.url') }}/blog/{{ $post->slug }}</loc><lastmod>{{ $post->date }}</lastmod></url>
@endforeach
</urlset>
