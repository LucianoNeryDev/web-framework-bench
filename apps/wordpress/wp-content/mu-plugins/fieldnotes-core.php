<?php
/**
 * Plugin Name: Field Notes core
 * Description: Routing, feeds, sitemap and head cleanup for the Field Notes benchmark site. Loaded as a must-use
 *              plugin so it applies in WP-CLI (seeding, rewrite flush) as well as on the front end.
 */

defined( 'ABSPATH' ) || exit;

/*
 * Tags keep the order given in content/posts.json: a sortable taxonomy stores term_order in
 * wp_term_relationships, and wp_get_object_terms() orders by it.
 */
add_filter(
	'register_taxonomy_args',
	static function ( $args, $taxonomy ) {
		if ( 'post_tag' === $taxonomy ) {
			$args['sort'] = true;
			$args['args'] = array( 'orderby' => 'term_order' );
		}
		return $args;
	},
	10,
	2
);

/*
 * Routes. Posts live at /blog/<slug> through the permalink structure /blog/%postname% (set by the seeder); /blog and
 * /about are pages. /rss.xml and /sitemap.xml are rewrites onto a custom feed and the core sitemap index.
 */
add_action(
	'init',
	static function () {
		add_feed( 'fieldnotes', 'fieldnotes_render_rss' );
		add_rewrite_rule( '^rss\.xml$', 'index.php?feed=fieldnotes', 'top' );
		add_rewrite_rule( '^sitemap\.xml$', 'index.php?sitemap=index', 'top' );
	}
);

add_filter(
	'feed_content_type',
	static fn( $type, $feed ) => 'fieldnotes' === $feed ? 'application/rss+xml' : $type,
	10,
	2
);

// /blog?tag=<slug> is the contract's filter parameter, not WordPress's tag archive; keep it out of the main query.
add_filter(
	'request',
	static function ( $vars ) {
		if ( isset( $vars['pagename'] ) && 'blog' === $vars['pagename'] ) {
			unset( $vars['tag'] );
		}
		return $vars;
	}
);

/*
 * Server-side blog filter: a WP_Query arg `fieldnotes_text` matches a case-insensitive substring of
 * title + " " + excerpt (the summary), which is the contract's rule. Core search (`s`) would also search the body.
 */
add_filter(
	'posts_where',
	static function ( $where, $query ) {
		$text = $query->get( 'fieldnotes_text' );
		if ( is_string( $text ) && '' !== $text ) {
			global $wpdb;
			$where .= $wpdb->prepare(
				" AND CONCAT({$wpdb->posts}.post_title, ' ', {$wpdb->posts}.post_excerpt) LIKE %s",
				'%' . $wpdb->esc_like( $text ) . '%'
			);
		}
		return $where;
	},
	10,
	2
);

// No redirects: no canonical redirect (it would add trailing slashes, move hosts and guess 404s), no old-slug lookups.
remove_action( 'template_redirect', 'redirect_canonical' );
remove_action( 'template_redirect', 'wp_old_slug_redirect' );
add_filter( 'user_trailingslashit', static fn( $url ) => '/' === $url ? $url : untrailingslashit( $url ) );

/*
 * Only the contract's routes exist. Everything else WordPress would answer (archives, search, attachments, core feeds,
 * /favicon.ico, the front page under its own slug) gets the 404 template with a real 404 status.
 */
add_action(
	'template_redirect',
	static function () {
		global $wp_query;
		if ( is_404() || get_query_var( 'sitemap' ) || get_query_var( 'sitemap-stylesheet' ) || is_robots() ) {
			return;
		}
		$path = (string) wp_parse_url( $_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH );
		$ok   = is_feed()
			? 'fieldnotes' === get_query_var( 'feed' )
			: is_singular( 'post' )
				|| ( is_front_page() && '/' === $path )
				|| ( ! is_front_page() && is_page( array( 'blog', 'about' ) ) );
		if ( ! $ok ) {
			$wp_query->set_404();
			$wp_query->is_feed = false; // set_404() keeps is_feed, which would still render a core feed.
			status_header( 404 );
			nocache_headers();
			header( 'Content-Type: text/html; charset=UTF-8' ); // WP::send_headers() already sent a feed type for feeds.
		}
	},
	0
);

// Core sitemap: posts and pages only, no users or tag archives (those routes are 404 here).
add_filter(
	'wp_sitemaps_add_provider',
	static fn( $provider, $name ) => in_array( $name, array( 'users', 'taxonomies' ), true ) ? false : $provider,
	10,
	2
);

/**
 * RSS 2.0 for /rss.xml, matching the reference feed. The main query is the posts feed (posts_per_rss = 40).
 */
function fieldnotes_render_rss() {
	header( 'Content-Type: application/rss+xml; charset=UTF-8' );
	echo '<?xml version="1.0" encoding="UTF-8"?>', "\n";
	echo "<rss version=\"2.0\">\n<channel>\n";
	echo '<title>', esc_xml( get_bloginfo( 'name' ) ), "</title>\n";
	echo '<link>', esc_url( home_url( '/' ) ), "</link>\n";
	echo '<description>', esc_xml( get_option( 'blogdescription' ) ), "</description>\n";
	echo "<language>en</language>\n";
	while ( have_posts() ) {
		the_post();
		$post = get_post();
		$link = esc_url( get_permalink( $post ) );
		echo "<item>\n";
		echo '<title>', esc_xml( $post->post_title ), "</title>\n";
		echo '<link>', $link, "</link>\n"; // phpcs:ignore WordPress.Security.EscapeOutput
		echo '<guid>', $link, "</guid>\n"; // phpcs:ignore WordPress.Security.EscapeOutput
		echo '<pubDate>', esc_xml( mysql2date( 'D, d M Y H:i:s', $post->post_date_gmt, false ) ), " GMT</pubDate>\n";
		echo '<description>', esc_xml( $post->post_excerpt ), "</description>\n";
		echo "</item>\n";
	}
	echo "</channel>\n</rss>\n";
}

/*
 * What a clean custom theme normally disables: emoji script and styles, oEmbed discovery and the wp-embed host script,
 * the generator meta, REST/shortlink/RSD links and headers, core feed links, adjacent-post links, the robots meta,
 * speculative-loading rules and the img auto-sizes CSS fix.
 */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'wp_enqueue_scripts', 'wp_enqueue_emoji_styles' );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );
remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
add_filter( 'emoji_svg_url', '__return_false' );

remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
remove_action( 'wp_head', 'wp_oembed_add_host_js' );
remove_action( 'wp_head', 'wp_generator' );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'feed_links', 2 );
remove_action( 'wp_head', 'feed_links_extra', 3 );
remove_action( 'wp_head', 'rest_output_link_wp_head' );
remove_action( 'wp_head', 'wp_shortlink_wp_head' );
remove_action( 'wp_head', 'rel_canonical' );
remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );
remove_action( 'wp_head', 'wp_robots', 1 );
remove_action( 'wp_head', 'wp_print_auto_sizes_contain_css_fix', 1 );
remove_action( 'wp_footer', 'wp_print_speculation_rules' );
remove_action( 'template_redirect', 'rest_output_link_header', 11 );
remove_action( 'template_redirect', 'wp_shortlink_header', 11 );
add_filter( 'the_generator', '__return_empty_string' );
add_filter(
	'wp_headers',
	static function ( $headers ) {
		unset( $headers['X-Pingback'] );
		return $headers;
	}
);
