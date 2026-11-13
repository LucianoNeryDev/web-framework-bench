<?php
/**
 * One post card. $args: post (fieldnotes_post() array), eager (no lazy loading), hidden (filtered out on the server).
 */
$fieldnotes_p = $args['post'];
?>
<article class="card" data-post data-tags="<?php echo esc_attr( implode( ' ', array_keys( $fieldnotes_p['tags'] ) ) ); ?>" data-search="<?php echo esc_attr( mb_strtolower( $fieldnotes_p['title'] . ' ' . $fieldnotes_p['summary'] ) ); ?>"<?php echo empty( $args['hidden'] ) ? '' : ' hidden'; ?>>
<a class="card-link" href="/blog/<?php echo esc_attr( $fieldnotes_p['slug'] ); ?>"><img class="card-image" src="<?php echo esc_attr( $fieldnotes_p['thumb'] ); ?>" alt="" width="<?php echo esc_attr( $fieldnotes_p['thumb_w'] ); ?>" height="<?php echo esc_attr( $fieldnotes_p['thumb_h'] ); ?>"<?php echo empty( $args['eager'] ) ? ' loading="lazy"' : ''; ?> decoding="async"><h3 class="card-title"><?php echo esc_html( $fieldnotes_p['title'] ); ?></h3></a>
<p class="card-meta"><time datetime="<?php echo esc_attr( $fieldnotes_p['date'] ); ?>"><?php echo esc_html( $fieldnotes_p['date_label'] ); ?></time> · <?php echo esc_html( $fieldnotes_p['minutes'] ); ?> min read</p>
<p class="card-summary"><?php echo esc_html( $fieldnotes_p['summary'] ); ?></p>
<?php echo fieldnotes_tag_list( $fieldnotes_p['tags'] ); // phpcs:ignore WordPress.Security.EscapeOutput ?>

</article>
