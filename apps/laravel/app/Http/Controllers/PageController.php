<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Contracts\View\View;

class PageController
{
    public function home(): View
    {
        $posts = Post::summary()->with('tags')->newestFirst()->limit(6)->get();

        return view('pages.home', ['posts' => $posts]);
    }

    public function about(): View
    {
        return view('pages.about');
    }
}
