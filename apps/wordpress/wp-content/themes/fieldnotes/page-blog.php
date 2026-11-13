<?php
/**
 * /blog: every post, with the search box and tag chips. ?q= and ?tag= are applied on the server: a second WP_Query
 * (tag via tax query, text via the fieldnotes_text posts_where filter in the mu-plugin) returns the matching IDs, and
 * the cards that do not match are rendered with `hidden`, so app.js keeps counting against the full list.
 */

the_post();

$fieldnotes_q   = isset( $_GET['q'] ) && is_string( $_GET['q'] ) ? trim( wp_unslash( $_GET['q'] ) ) : ''; // phpcs:ignore WordPress.Security
$fieldnotes_tag = isset( $_GET['tag'] ) && is_string( $_GET['tag'] ) ? sanitize_title( wp_unslash( $_GET['tag'] ) ) : ''; // phpcs:ignore WordPress.Security

$fieldnotes_all = new WP_Query(
	array(
		'post_type'           => 'post',
		'posts_per_page'      => -1,
		'no_found_rows'       => true,
		'ignore_sticky_posts' => true,
	)
);
$fieldnotes_total = count( $fieldnotes_all->posts );

$fieldnotes_match = null;
if ( '' !== $fieldnotes_q || '' !== $fieldnotes_tag ) {
	$fieldnotes_filtered = new WP_Query(
		array(
			'post_type'           => 'post',
			'posts_per_page'      => -1,
			'no_found_rows'       => true,
			'ignore_sticky_posts' => true,
			'fields'              => 'ids',
			'tag'                 => $fieldnotes_tag,
			'fieldnotes_text'     => $fieldnotes_q,
		)
	);
	$fieldnotes_match = array_flip( $fieldnotes_filtered->posts );
}
$fieldnotes_shown = null === $fieldnotes_match ? $fieldnotes_total : count( $fieldnotes_match );

$fieldnotes_tags = get_terms(
	array(
		'taxonomy'   => 'post_tag',
		'hide_empty' => false,
		'orderby'    => 'term_id',
	)
);

get_header(
	null,
	array(
		'title'       => get_post()->post_title,
		'description' => sprintf( 'All %d posts on %s.', $fieldnotes_total, get_bloginfo( 'name' ) ),
		'path'        => '/blog',
		'image'       => '/images/hero.webp',
		'current'     => '/blog',
	)
);
?>
<h1><?php echo esc_html( get_post()->post_title ); ?></h1>
<?php the_content(); ?>

<form class="filters" role="search" action="/blog" method="get" data-filters>
<label for="q">Search posts</label>
<input id="q" name="q" type="search" placeholder="Search titles and summaries" autocomplete="off"<?php echo '' === $fieldnotes_q ? '' : ' value="' . esc_attr( $fieldnotes_q ) . '"'; ?>>
<div class="tag-filter" role="group" aria-label="Filter by tag">
<button type="button" class="chip" data-tag="" aria-pressed="<?php echo '' === $fieldnotes_tag ? 'true' : 'false'; ?>">All</button>
<?php foreach ( $fieldnotes_tags as $fieldnotes_term ) : ?>
<button type="button" class="chip" data-tag="<?php echo esc_attr( $fieldnotes_term->slug ); ?>" aria-pressed="<?php echo $fieldnotes_term->slug === $fieldnotes_tag ? 'true' : 'false'; ?>"><?php echo esc_html( $fieldnotes_term->name ); ?></button>
<?php endforeach; ?>
</div>
</form>
<h2 class="visually-hidden">Posts</h2>
<p class="result-count" aria-live="polite" data-result-count>Showing <?php echo (int) $fieldnotes_shown; ?> of <?php echo (int) $fieldnotes_total; ?> posts</p>
<div class="card-grid" data-post-list>
<?php
foreach ( $fieldnotes_all->posts as $fieldnotes_i => $fieldnotes_post ) {
	get_template_part(
		'parts/card',
		null,
		array(
			'post'   => fieldnotes_post( $fieldnotes_post ),
			'eager'  => $fieldnotes_i < 3,
			'hidden' => null !== $fieldnotes_match && ! isset( $fieldnotes_match[ $fieldnotes_post->ID ] ),
		)
	);
}
?>
</div>
<p class="empty" data-empty<?php echo $fieldnotes_shown ? ' hidden' : ''; ?>>No posts match.</p>
<?php
get_footer();
