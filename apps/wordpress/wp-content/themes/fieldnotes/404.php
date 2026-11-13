<?php
/**
 * Not found. WordPress (or the route guard in the mu-plugin) has already set the 404 status.
 */

get_header(
	null,
	array(
		'title'       => 'Page not found',
		'description' => 'This page does not exist.',
		'path'        => '/404',
		'image'       => '/images/hero.webp',
		'current'     => '',
	)
);
?>
<section class="not-found">
<h1>Page not found</h1>
<p>The page you asked for does not exist or has moved.</p>
<p><a class="button" href="/">Back to the home page</a></p>
</section>
<?php
get_footer();
