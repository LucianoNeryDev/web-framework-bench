<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class PostController
{
    /** The full list, with the posts that miss ?q= and ?tag= marked hidden so app.js keeps its counts right. */
    public function index(Request $request): View
    {
        $q = $request->query('q');
        $tag = $request->query('tag');
        $q = is_string($q) ? $q : '';
        $tag = is_string($tag) ? $tag : '';
        $needle = mb_strtolower(trim($q));

        $posts = Post::summary()->with('tags')->newestFirst()->get();

        $matching = Post::query()
            ->when($tag !== '', fn ($query) => $query->whereHas('tags', fn ($tags) => $tags->where('slug', $tag)))
            ->when($needle !== '', fn ($query) => $query->whereRaw("instr(lower(title || ' ' || summary), ?) > 0", [$needle]))
            ->pluck('id')
            ->flip();

        return view('pages.blog', [
            'q' => $q,
            'tag' => $tag,
            'tags' => Tag::orderBy('id')->get(),
            'posts' => $posts,
            'matching' => $matching,
        ]);
    }

    public function show(Post $post): View
    {
        $post->load(['tags', 'older:slug,title', 'newer:slug,title', 'related.tags']);

        return view('pages.post', ['post' => $post]);
    }
}
