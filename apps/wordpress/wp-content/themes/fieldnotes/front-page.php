<?php
/**
 * Home: hero and the six latest posts.
 */

$fieldnotes_latest = new WP_Query(
	array(
		'post_type'           => 'post',
		'posts_per_page'      => 6,
		'no_found_rows'       => true,
		'ignore_sticky_posts' => true,
	)
);

get_header(
	null,
	array(
		'title'       => get_bloginfo( 'name' ),
		'description' => get_option( 'blogdescription' ),
		'path'        => '/',
		'image'       => '/images/hero.webp',
		'current'     => '/',
	)
);
?>
<section class="hero">
<div class="hero-text"><h1><?php echo esc_html( fieldnotes_site( 'heroTitle' ) ); ?></h1><p><?php echo esc_html( fieldnotes_site( 'heroText' ) ); ?></p><p><a class="button" href="/blog">Read the blog</a></p></div>
<img class="hero-image" src="/images/hero.webp" alt="Abstract illustration of overlapping circles" width="1600" height="900" fetchpriority="high">
</section>
<section class="latest" aria-labelledby="latest-heading">
<h2 id="latest-heading">Latest posts</h2>
<div class="card-grid">
<?php
foreach ( $fieldnotes_latest->posts as $fieldnotes_post ) {
	get_template_part( 'parts/card', null, array( 'post' => fieldnotes_post( $fieldnotes_post ) ) );
}
?>
</div>
<p class="section-footer"><a href="/blog">All posts →</a></p>
</section>
<?php
get_footer();
