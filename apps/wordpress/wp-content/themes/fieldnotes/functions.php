<?php
/**
 * Field Notes theme: assets, content filters and the helpers the templates share.
 */

defined( 'ABSPATH' ) || exit;

/*
 * The shared stylesheet and the vanilla island (app.js) are served by nginx from shared/public at /style.css and
 * /app.js. No version query string, and root-relative URLs so the site works on any host.
 */
add_action(
	'wp_enqueue_scripts',
	static function () {
		wp_enqueue_style( 'fieldnotes', '/style.css', array(), null );
		wp_enqueue_script( 'fieldnotes', '/app.js', array(), null, array( 'strategy' => 'defer' ) );

		// Nothing on the front end uses these.
		wp_dequeue_style( 'wp-block-library' );
		wp_dequeue_style( 'wp-block-library-theme' );
		wp_dequeue_style( 'classic-theme-styles' );
		wp_dequeue_style( 'global-styles' );
		wp_deregister_script( 'jquery' );
		wp_deregister_script( 'wp-embed' );
	},
	100
);
remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles' );
remove_action( 'wp_enqueue_scripts', 'wp_enqueue_classic_theme_styles' );
remove_action( 'wp_footer', 'wp_enqueue_global_styles', 1 );
remove_action( 'wp_body_open', 'wp_global_styles_render_svg_filters' );
add_filter( 'should_load_separate_core_block_assets', '__return_true' );
add_filter( 'script_loader_src', 'wp_make_link_relative' );
add_filter( 'style_loader_src', 'wp_make_link_relative' );

/*
 * Post bodies are imported as finished HTML (rendered from Markdown), so the filters that rewrite text or add
 * paragraphs stay off: wpautop, wptexturize (curly quotes, dashes), smilies and capital_P_dangit.
 */
foreach ( array( 'wpautop', 'wptexturize', 'convert_smilies', 'capital_P_dangit' ) as $fieldnotes_filter ) {
	remove_filter( 'the_content', $fieldnotes_filter );
}
unset( $fieldnotes_filter );

/**
 * Site settings the seeder stores alongside the core options (author, hero title and text).
 */
function fieldnotes_site( $key ) {
	$site = get_option( 'fieldnotes_site', array() );
	return $site[ $key ] ?? '';
}

/**
 * The card and post fields for one post, from the post row, its meta and its tags (all primed by WP_Query).
 */
function fieldnotes_post( WP_Post $post ) {
	$meta = get_post_meta( $post->ID );
	$one  = static fn( $key ) => $meta[ $key ][0] ?? '';
	$tags = array();
	foreach ( get_the_terms( $post, 'post_tag' ) ?: array() as $term ) {
		$tags[ $term->slug ] = $term->name;
	}
	return array(
		'slug'        => $post->post_name,
		'title'       => $post->post_title,
		'summary'     => $post->post_excerpt,
		'date'        => substr( $post->post_date, 0, 10 ),
		'date_label'  => $one( 'date_label' ),
		'minutes'     => $one( 'reading_minutes' ),
		'cover'       => $one( 'cover_src' ),
		'cover_alt'   => $one( 'cover_alt' ),
		'cover_w'     => $one( 'cover_width' ),
		'cover_h'     => $one( 'cover_height' ),
		'thumb'       => $one( 'cover_thumb' ),
		'thumb_w'     => $one( 'cover_thumb_width' ),
		'thumb_h'     => $one( 'cover_thumb_height' ),
		'prev'        => $one( 'prev' ),
		'next'        => $one( 'next' ),
		'related'     => array_filter( explode( ',', $one( 'related' ) ) ),
		'tags'        => $tags,
	);
}

/**
 * The tag list shared by cards and the post header.
 */
function fieldnotes_tag_list( array $tags ) {
	$items = '';
	foreach ( $tags as $slug => $name ) {
		$items .= '<li><a class="tag" href="/blog?tag=' . esc_attr( $slug ) . '">' . esc_html( $name ) . '</a></li>';
	}
	return '<ul class="tag-list">' . $items . '</ul>';
}

/**
 * Posts by slug, in the order given, with meta and tags primed in one query each.
 */
function fieldnotes_posts_by_slug( array $slugs ) {
	$slugs = array_values( array_filter( $slugs ) );
	if ( ! $slugs ) {
		return array();
	}
	$query = new WP_Query(
		array(
			'post_type'           => 'post',
			'post_name__in'       => $slugs,
			'orderby'             => 'post_name__in',
			'posts_per_page'      => count( $slugs ),
			'no_found_rows'       => true,
			'ignore_sticky_posts' => true,
		)
	);
	$by_slug = array();
	foreach ( $query->posts as $post ) {
		$by_slug[ $post->post_name ] = $post;
	}
	return $by_slug;
}
