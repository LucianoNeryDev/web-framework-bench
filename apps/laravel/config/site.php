<?php

// Site-wide copy comes from the shared dataset. `php artisan optimize` bakes it into the config cache,
// so nothing reads the JSON file at request time. Posts and tags live in the database.
$path = env('SITE_CONTENT', database_path('content/posts.json'));

return [
    'content' => $path,
    ...(is_file($path) ? json_decode(file_get_contents($path), true)['site'] : []),
];
