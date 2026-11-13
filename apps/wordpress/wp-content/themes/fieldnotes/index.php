<?php
/**
 * Required fallback of the template hierarchy. Every real route has its own template and the mu-plugin turns any
 * other route into a 404, so this only renders the not-found page.
 */

status_header( 404 );
require __DIR__ . '/404.php';
