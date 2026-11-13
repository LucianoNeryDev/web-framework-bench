<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
    public $timestamps = false;

    protected $guarded = [];

    /** Cards and feeds never need the post body, which is the bulk of each row. */
    public function scopeSummary(Builder $query): void
    {
        $query->select([
            'id', 'slug', 'title', 'summary', 'date', 'date_label', 'reading_minutes',
            'thumb', 'thumb_width', 'thumb_height',
        ]);
    }

    public function scopeNewestFirst(Builder $query): void
    {
        $query->orderByDesc('date')->orderBy('id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withPivot('position')->orderByPivot('position');
    }

    /** The three related posts, in the order the dataset gives them. */
    public function related(): BelongsToMany
    {
        return $this->belongsToMany(self::class, 'post_related', 'post_id', 'related_id')
            ->withPivot('position')
            ->orderByPivot('position');
    }

    /** The previous, older post. */
    public function older(): BelongsTo
    {
        return $this->belongsTo(self::class, 'prev_slug', 'slug');
    }

    /** The next, newer post. */
    public function newer(): BelongsTo
    {
        return $this->belongsTo(self::class, 'next_slug', 'slug');
    }
}
