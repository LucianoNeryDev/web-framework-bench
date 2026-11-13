<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/** Loads content/posts.json (shared by every target) into SQLite. */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(file_get_contents(config('site.content')), true, flags: JSON_THROW_ON_ERROR);

        DB::transaction(function () use ($data) {
            $tagIds = [];
            foreach ($data['tags'] as $tag) {
                $tagIds[$tag['slug']] = Tag::create($tag)->id;
            }

            $postIds = [];
            foreach ($data['posts'] as $post) {
                $row = Post::create([
                    'slug' => $post['slug'],
                    'title' => $post['title'],
                    'summary' => $post['summary'],
                    'date' => $post['date'],
                    'date_label' => $post['dateLabel'],
                    'reading_minutes' => $post['readingMinutes'],
                    'cover' => $post['cover']['src'],
                    'cover_alt' => $post['cover']['alt'],
                    'cover_width' => $post['cover']['width'],
                    'cover_height' => $post['cover']['height'],
                    'thumb' => $post['cover']['thumb'],
                    'thumb_width' => $post['cover']['thumbWidth'],
                    'thumb_height' => $post['cover']['thumbHeight'],
                    'html' => $post['html'],
                    'prev_slug' => $post['prev'],
                    'next_slug' => $post['next'],
                ]);
                $postIds[$post['slug']] = $row->id;

                foreach ($post['tags'] as $position => $slug) {
                    $row->tags()->attach($tagIds[$slug], ['position' => $position]);
                }
            }

            foreach ($data['posts'] as $post) {
                foreach ($post['related'] as $position => $slug) {
                    Post::find($postIds[$post['slug']])->related()->attach($postIds[$slug], ['position' => $position]);
                }
            }
        });
    }
}
