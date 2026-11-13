<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Response;

class FeedController
{
    public function rss(): Response
    {
        return response()->view('feeds.rss', ['posts' => Post::summary()->newestFirst()->get()])
            ->header('Content-Type', 'application/rss+xml; charset=UTF-8');
    }

    public function sitemap(): Response
    {
        return response()->view('feeds.sitemap', ['posts' => Post::summary()->newestFirst()->get()])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
