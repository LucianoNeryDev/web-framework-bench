<?php
/**
 * /blog/<slug>: one post, its older/newer neighbours and three related posts (all slugs from post meta).
 */

the_post();
$fieldnotes_p     = fieldnotes_post( get_post() );
$fieldnotes_other = fieldnotes_posts_by_slug( array_merge( array( $fieldnotes_p['prev'], $fieldnotes_p['next'] ), $fieldnotes_p['related'] ) );
$fieldnotes_prev  = $fieldnotes_other[ $fieldnotes_p['prev'] ] ?? null;
$fieldnotes_next  = $fieldnotes_other[ $fieldnotes_p['next'] ] ?? null;

get_header(
	null,
	array(
		'title'       => $fieldnotes_p['title'],
		'description' => $fieldnotes_p['summary'],
		'path'        => '/blog/' . $fieldnotes_p['slug'],
		'image'       => $fieldnotes_p['cover'],
		'type'        => 'article',
		'current'     => '/blog',
	)
);
?>
<article class="post">
<header class="post-header">
<p class="post-meta"><time datetime="<?php echo esc_attr( $fieldnotes_p['date'] ); ?>"><?php echo esc_html( $fieldnotes_p['date_label'] ); ?></time> · <?php echo esc_html( $fieldnotes_p['minutes'] ); ?> min read</p>
<h1><?php echo esc_html( $fieldnotes_p['title'] ); ?></h1>
<p class="post-summary"><?php echo esc_html( $fieldnotes_p['summary'] ); ?></p>
<?php echo fieldnotes_tag_list( $fieldnotes_p['tags'] ); // phpcs:ignore WordPress.Security.EscapeOutput ?>

</header>
<img class="post-cover" src="<?php echo esc_attr( $fieldnotes_p['cover'] ); ?>" alt="<?php echo esc_attr( $fieldnotes_p['cover_alt'] ); ?>" width="<?php echo esc_attr( $fieldnotes_p['cover_w'] ); ?>" height="<?php echo esc_attr( $fieldnotes_p['cover_h'] ); ?>" fetchpriority="high">
<div class="post-body">
<?php the_content(); ?>

</div>
</article>
<nav class="post-nav" aria-label="Adjacent posts"><?php
if ( $fieldnotes_prev ) {
	echo '<a rel="prev" href="/blog/' . esc_attr( $fieldnotes_prev->post_name ) . '">← ' . esc_html( $fieldnotes_prev->post_title ) . '</a>';
}
if ( $fieldnotes_next ) {
	echo '<a rel="next" href="/blog/' . esc_attr( $fieldnotes_next->post_name ) . '">' . esc_html( $fieldnotes_next->post_title ) . ' →</a>';
}
?></nav>
<section class="related" aria-labelledby="related-heading">
<h2 id="related-heading">Related posts</h2>
<div class="card-grid">
<?php
foreach ( $fieldnotes_p['related'] as $fieldnotes_slug ) {
	if ( isset( $fieldnotes_other[ $fieldnotes_slug ] ) ) {
		get_template_part( 'parts/card', null, array( 'post' => fieldnotes_post( $fieldnotes_other[ $fieldnotes_slug ] ) ) );
	}
}
?>
</div>
</section>
<?php
get_footer();
