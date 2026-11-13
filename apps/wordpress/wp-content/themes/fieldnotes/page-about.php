<?php
/**
 * /about: the About page's content with the author's avatar.
 */

the_post();

get_header(
	null,
	array(
		'title'       => get_post()->post_title,
		'description' => sprintf( 'About %s and %s.', fieldnotes_site( 'author' ), get_bloginfo( 'name' ) ),
		'path'        => '/about',
		'image'       => '/images/avatar.webp',
		'current'     => '/about',
	)
);
?>
<section class="about">
<h1><?php echo esc_html( get_post()->post_title ); ?></h1>
<img class="about-avatar" src="/images/avatar.webp" alt="Portrait of <?php echo esc_attr( fieldnotes_site( 'author' ) ); ?>" width="160" height="160">
<?php the_content(); ?>

</section>
<?php
get_footer();
