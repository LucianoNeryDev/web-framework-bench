<?php
/**
 * Seeds Field Notes from content/posts.json. Run by the entrypoint on every start:
 *   wp eval-file seed.php /usr/src/wfb/posts.json
 * Idempotent: every page, tag and post is upserted by slug, and the whole run is skipped when the data and this
 * script are unchanged since the last successful run (option wfb_seed_hash).
 */

$file = $args[0] ?? '/usr/src/wfb/posts.json';
$json = file_get_contents( $file );
$hash = sha1( $json . file_get_contents( __FILE__ ) );
if ( get_option( 'wfb_seed_hash' ) === $hash ) {
	WP_CLI::log( 'Field Notes content is up to date.' );
	return;
}
$data = json_decode( $json, true, 512, JSON_THROW_ON_ERROR );

// The imported HTML is trusted and final: no kses on save.
kses_remove_filters();

// Core install's sample content.
foreach ( array( 'hello-world' => 'post', 'sample-page' => 'page', 'privacy-policy' => 'page' ) as $slug => $type ) {
	$sample = get_page_by_path( $slug, OBJECT, $type );
	if ( $sample ) {
		wp_delete_post( $sample->ID, true );
	}
}
update_option( 'wp_page_for_privacy_policy', 0 );

// Site options.
$site = $data['site'];
update_option( 'blogname', $site['title'] );
update_option( 'blogdescription', $site['description'] );
update_option(
	'fieldnotes_site',
	array(
		'author'    => $site['author'],
		'heroTitle' => $site['heroTitle'],
		'heroText'  => $site['heroText'],
	)
);
update_option( 'blog_public', '1' );
update_option( 'posts_per_rss', count( $data['posts'] ) );
update_option( 'rss_use_excerpt', '1' );
update_option( 'default_comment_status', 'closed' );
update_option( 'default_ping_status', 'closed' );
update_option( 'default_pingback_flag', '0' );
update_option( 'timezone_string', 'UTC' );
update_option( 'gmt_offset', 0 );

/**
 * Inserts or updates one row by slug and type; returns its ID.
 */
$upsert = static function ( array $postarr ) {
	$existing = get_posts(
		array(
			'name'           => $postarr['post_name'],
			'post_type'      => $postarr['post_type'],
			'post_status'    => 'any',
			'posts_per_page' => 1,
			'fields'         => 'ids',
		)
	);
	if ( $existing ) {
		$postarr['ID'] = $existing[0];
	}
	$id = wp_insert_post( wp_slash( $postarr ), true );
	if ( is_wp_error( $id ) ) {
		WP_CLI::error( $postarr['post_name'] . ': ' . $id->get_error_message() );
	}
	return $id;
};

// Pages: the static front page, /blog and /about.
$page = static fn( $slug, $title, $content ) => $upsert(
	array(
		'post_type'      => 'page',
		'post_status'    => 'publish',
		'post_name'      => $slug,
		'post_title'     => $title,
		'post_content'   => $content,
		'comment_status' => 'closed',
		'ping_status'    => 'closed',
		'post_author'    => 1,
	)
);
$home_id = $page( 'home', 'Home', '' );
$page( 'blog', 'Blog', '<p>Everything I have written, newest first. Search titles and summaries, or narrow by tag.</p>' );
$page( 'about', 'About', $site['aboutHtml'] );
update_option( 'show_on_front', 'page' );
update_option( 'page_on_front', $home_id );
update_option( 'page_for_posts', 0 );

// Tags, created in the dataset's order (the /blog chips list them by term_id).
$term_ids = array();
foreach ( $data['tags'] as $tag ) {
	$term = get_term_by( 'slug', $tag['slug'], 'post_tag' );
	if ( $term ) {
		wp_update_term( $term->term_id, 'post_tag', array( 'name' => $tag['name'] ) );
		$term_ids[ $tag['slug'] ] = (int) $term->term_id;
	} else {
		$new = wp_insert_term( $tag['name'], 'post_tag', array( 'slug' => $tag['slug'] ) );
		if ( is_wp_error( $new ) ) {
			WP_CLI::error( $tag['slug'] . ': ' . $new->get_error_message() );
		}
		$term_ids[ $tag['slug'] ] = (int) $new['term_id'];
	}
}

// Posts, oldest first so IDs grow with the date.
foreach ( array_reverse( $data['posts'] ) as $post ) {
	$date = $post['date'] . ' 00:00:00';
	$id   = $upsert(
		array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'post_name'      => $post['slug'],
			'post_title'     => $post['title'],
			'post_excerpt'   => $post['summary'],
			'post_content'   => $post['html'],
			'post_date'      => $date,
			'post_date_gmt'  => $date,
			'comment_status' => 'closed',
			'ping_status'    => 'closed',
			'post_author'    => 1,
			'meta_input'     => array(
				'date_label'         => $post['dateLabel'],
				'reading_minutes'    => $post['readingMinutes'],
				'cover_src'          => $post['cover']['src'],
				'cover_thumb'        => $post['cover']['thumb'],
				'cover_alt'          => $post['cover']['alt'],
				'cover_width'        => $post['cover']['width'],
				'cover_height'       => $post['cover']['height'],
				'cover_thumb_width'  => $post['cover']['thumbWidth'],
				'cover_thumb_height' => $post['cover']['thumbHeight'],
				'prev'               => $post['prev'] ?? '',
				'next'               => $post['next'] ?? '',
				'related'            => implode( ',', $post['related'] ),
			),
		)
	);
	$set = wp_set_object_terms( $id, array_map( static fn( $slug ) => $term_ids[ $slug ], $post['tags'] ), 'post_tag' );
	if ( is_wp_error( $set ) ) {
		WP_CLI::error( $post['slug'] . ': ' . $set->get_error_message() );
	}
}

switch_theme( 'fieldnotes' );

// Posts at /blog/<slug>, no trailing slash; the mu-plugin adds /rss.xml and /sitemap.xml.
global $wp_rewrite;
$wp_rewrite->set_permalink_structure( '/blog/%postname%' );
flush_rewrite_rules( false );

update_option( 'wfb_seed_hash', $hash );
WP_CLI::success( sprintf( 'Seeded %d posts, %d tags and 3 pages.', count( $data['posts'] ), count( $data['tags'] ) ) );
