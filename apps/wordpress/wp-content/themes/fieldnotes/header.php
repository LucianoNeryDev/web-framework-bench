<?php
/**
 * Document head and site header. Templates pass the page's metadata through get_header( null, $args ):
 * title, description, path, image, type ("website" or "article") and current (the nav section, or '').
 */

$fieldnotes_name  = get_bloginfo( 'name' );
$fieldnotes_title = '/' === $args['path'] ? $fieldnotes_name : $args['title'] . ' · ' . $fieldnotes_name;
$fieldnotes_nav   = array(
	'/'      => 'Home',
	'/blog'  => 'Blog',
	'/about' => 'About',
);
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php echo esc_html( $fieldnotes_title ); ?></title>
<meta name="description" content="<?php echo esc_attr( $args['description'] ); ?>">
<link rel="canonical" href="<?php echo esc_url( home_url( $args['path'] ) ); ?>">
<meta property="og:type" content="<?php echo esc_attr( $args['type'] ?? 'website' ); ?>">
<meta property="og:title" content="<?php echo esc_attr( $fieldnotes_title ); ?>">
<meta property="og:description" content="<?php echo esc_attr( $args['description'] ); ?>">
<meta property="og:image" content="<?php echo esc_url( home_url( $args['image'] ) ); ?>">
<link rel="alternate" type="application/rss+xml" title="<?php echo esc_attr( $fieldnotes_name ); ?>" href="/rss.xml">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t;else if(matchMedia("(prefers-color-scheme: dark)").matches)document.documentElement.dataset.theme="dark"}catch(e){}</script>
<?php wp_head(); ?>
</head>
<body>
<?php wp_body_open(); ?>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="container"><a class="brand" href="/"><?php echo esc_html( $fieldnotes_name ); ?></a><nav class="site-nav" aria-label="Main"><?php
foreach ( $fieldnotes_nav as $fieldnotes_href => $fieldnotes_label ) {
	printf(
		'<a href="%s"%s>%s</a>',
		esc_attr( $fieldnotes_href ),
		( $args['current'] ?? '' ) === $fieldnotes_href ? ' aria-current="page"' : '',
		esc_html( $fieldnotes_label )
	);
}
?></nav><button class="theme-toggle" type="button" aria-label="Toggle dark mode" data-theme-toggle>◐</button></div></header>
<main id="main" class="container">
