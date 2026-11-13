<x-layout path="/about" title="About" :description="'About '.config('site.author').' and '.config('site.title').'.'" image="/images/avatar.webp" current="/about">
<section class="about">
<h1>About</h1>
<img class="about-avatar" src="/images/avatar.webp" alt="Portrait of {{ config('site.author') }}" width="160" height="160">
{!! config('site.aboutHtml') !!}
</section>
</x-layout>
