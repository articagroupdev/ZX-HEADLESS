<?php
/**
 * ZX Thank You — confirmación de pedido.
 */
defined( 'ABSPATH' ) || exit;
$logo_url = home_url( '/img/logo.webp' );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex,nofollow">
	<title><?php esc_html_e( 'Order Confirmed', 'woocommerce' ); ?> — <?php bloginfo( 'name' ); ?></title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
	<?php wp_head(); ?>
</head>
<body class="woocommerce-checkout woocommerce-order-received zx-checkout-page">
<?php wp_body_open(); ?>

<?php $zxcs_step = 3; include __DIR__ . '/part-header.php'; ?>

<main class="zx-main zx-thankyou-main">
	<div class="zx-thankyou">
		<div class="zx-thankyou__icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
		</div>
		<h1 class="zx-thankyou__title">Order Confirmed!</h1>
		<p class="zx-thankyou__sub">Thank you for your purchase. A confirmation email has been sent to you.</p>

		<div class="zx-woo-content">
			<?php wc_print_notices(); ?>
			<?php while ( have_posts() ) { the_post(); the_content(); } ?>
		</div>

		<div class="zx-thankyou__actions">
			<a href="<?php echo esc_url( home_url( '/shop' ) ); ?>" class="zx-btn zx-btn--primary">
				Continue Shopping
			</a>
			<?php if ( is_user_logged_in() ) : ?>
			<a href="<?php echo esc_url( home_url( '/account/orders/' ) ); ?>" class="zx-btn zx-btn--outline">
				View My Orders
			</a>
			<?php endif; ?>
		</div>
	</div>
</main>

<?php include __DIR__ . '/part-footer.php'; ?>

<?php wp_footer(); ?>
</body>
</html>
