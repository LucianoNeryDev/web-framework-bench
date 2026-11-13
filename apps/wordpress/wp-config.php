<?php
/**
 * WordPress configuration for the Field Notes benchmark target. Baked into the image; the database settings come
 * from the compose environment.
 */

define( 'DB_NAME', getenv( 'WORDPRESS_DB_NAME' ) ?: 'wordpress' );
define( 'DB_USER', getenv( 'WORDPRESS_DB_USER' ) ?: 'wordpress' );
define( 'DB_PASSWORD', getenv( 'WORDPRESS_DB_PASSWORD' ) ?: 'wordpress' );
define( 'DB_HOST', getenv( 'WORDPRESS_DB_HOST' ) ?: 'db' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );

// Random per image build (generated in the Dockerfile).
require __DIR__ . '/wp-salts.php';

$table_prefix = 'wp_';

/*
 * The public URL is fixed: canonical, Open Graph, feed and sitemap URLs use https://bench.example, while the theme
 * prints root-relative links and the mu-plugin removes redirect_canonical, so the site answers on any Host
 * (localhost:<port>, wfb-run:8080) without redirecting to this one.
 */
define( 'WP_HOME', 'https://bench.example' );
define( 'WP_SITEURL', 'https://bench.example' );
define( 'WP_DEFAULT_THEME', 'fieldnotes' );
define( 'WP_ENVIRONMENT_TYPE', 'production' );
define( 'WP_DEBUG', false );

// Self-contained at run time: no loopback cron, no update checks, no outbound HTTP.
define( 'DISABLE_WP_CRON', true );
define( 'AUTOMATIC_UPDATER_DISABLED', true );
define( 'WP_AUTO_UPDATE_CORE', false );
define( 'WP_HTTP_BLOCK_EXTERNAL', true );
define( 'DISALLOW_FILE_MODS', true );

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
require_once ABSPATH . 'wp-settings.php';
