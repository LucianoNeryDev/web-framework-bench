<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('summary');
            $table->string('date')->index();
            $table->string('date_label');
            $table->unsignedSmallInteger('reading_minutes');
            $table->string('cover');
            $table->string('cover_alt');
            $table->unsignedSmallInteger('cover_width');
            $table->unsignedSmallInteger('cover_height');
            $table->string('thumb');
            $table->unsignedSmallInteger('thumb_width');
            $table->unsignedSmallInteger('thumb_height');
            $table->longText('html');
            $table->string('prev_slug')->nullable();
            $table->string('next_slug')->nullable();
        });

        Schema::create('post_tag', function (Blueprint $table) {
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('position');
            $table->primary(['post_id', 'tag_id']);
            $table->index('tag_id');
        });

        Schema::create('post_related', function (Blueprint $table) {
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('related_id')->constrained('posts')->cascadeOnDelete();
            $table->unsignedTinyInteger('position');
            $table->primary(['post_id', 'related_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_related');
        Schema::dropIfExists('post_tag');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('tags');
    }
};
