<?php
/**
 * ZX Checkout — template propio del checkout de WooCommerce (logo, pasos, miniaturas).
 */
defined( 'ABSPATH' ) || exit;

$cart       = WC()->cart;
$cart_count = $cart ? $cart->get_cart_contents_count() : 0;
$cart_total = $cart ? $cart->get_total() : '';
$site_url   = home_url( '/' );
$logo_url   = home_url( '/img/logo.webp' );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex,nofollow">
	<title><?php esc_html_e( 'Checkout', 'woocommerce' ); ?> — <?php bloginfo( 'name' ); ?></title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
	<?php wp_head(); ?>
</head>
<body class="woocommerce-checkout zx-checkout-page">
<?php wp_body_open(); ?>

<!-- ────────────────── PROCESSING OVERLAY ────────────────── -->
<div id="zxProcessingOverlay" class="zx-processing-overlay" aria-hidden="true" aria-live="assertive">
	<div class="zx-processing-card">
		<div class="zx-processing-spinner">
			<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
				<circle cx="25" cy="25" r="20" fill="none" stroke-width="4"/>
			</svg>
		</div>
		<p class="zx-processing-title">Processing your order…</p>
		<p class="zx-processing-sub">Please don't close this window</p>
	</div>
</div>

<?php include __DIR__ . '/part-header.php'; ?>

<!-- ────────────────── MOBILE SUMMARY ────────────────────── -->
<div class="zx-mobile-bar" id="zxMobileBar">
	<button type="button" class="zx-mobile-bar__btn" id="zxMobileToggle" aria-expanded="false">
		<span class="zx-mobile-bar__left">
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
			<span>Order summary</span>
			<span class="zx-pill"><?php echo intval( $cart_count ); ?> <?php echo $cart_count === 1 ? 'item' : 'items'; ?></span>
		</span>
		<span class="zx-mobile-bar__right">
			<strong id="zxMobileTotal"><?php echo wp_kses_post( $cart_total ); ?></strong>
			<svg class="zx-caret" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
		</span>
	</button>
	<div class="zx-mobile-bar__body" id="zxMobileBody" style="display:none">
		<div id="zxMobileSummaryClone"></div>
	</div>
</div>

<!-- ────────────────── FORM WRAPS BOTH COLUMNS ───────────── -->
<form name="checkout" method="post" class="checkout woocommerce-checkout" action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data">

<main class="zx-main">
<div class="zx-container">

	<?php wc_print_notices(); ?>

	<div class="zx-layout">

		<!-- ── LEFT: billing + shipping + order notes + payment ── -->
		<div class="zx-left">
			<p class="zx-page-eyebrow">Secure</p>
			<h1 class="zx-page-title">Checkout</h1>

			<?php do_action( 'woocommerce_checkout_before_customer_details' ); ?>
			<?php
			/* El tema (Spexo) puede quitar los callbacks de estos hooks y dejar el
			 * formulario sin campos: se llama directo al render nativo de WooCommerce. */
			$zxcs_checkout = WC()->checkout();
			if ( $zxcs_checkout->get_checkout_fields() ) :
			?>
			<div id="customer_details" class="zx-customer-details">
				<?php $zxcs_checkout->checkout_form_billing(); ?>
				<?php $zxcs_checkout->checkout_form_shipping(); ?>
			</div>
			<?php endif; ?>
			<?php do_action( 'woocommerce_checkout_after_customer_details' ); ?>

			<!-- ── Payment methods card ───────────────────────── -->
			<div class="zx-payment-card">
				<div class="zx-payment-card__head">
					<span class="zx-payment-card__title">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
						Payment Method
					</span>
					<span class="zx-payment-card__secure">
						<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
						SSL Secure
					</span>
				</div>
				<?php woocommerce_checkout_payment(); ?>
			</div>

		</div>

		<!-- ── RIGHT: order summary only (products + totals) ──── -->
		<aside class="zx-right">

			<div class="zx-summary-card">
				<!-- Head -->
				<div class="zx-summary-card__head">
					<span class="zx-summary-card__title">
						<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
						Order Summary
					</span>
					<span class="zx-pill"><?php echo intval( $cart_count ); ?> <?php echo $cart_count === 1 ? 'item' : 'items'; ?></span>
				</div>

				<!-- WooCommerce: products + totals only (no payment) -->
				<?php do_action( 'woocommerce_checkout_before_order_review' ); ?>
				<div id="order_review" class="woocommerce-checkout-review-order">
					<?php woocommerce_order_review(); ?>
				</div>
				<?php do_action( 'woocommerce_checkout_after_order_review' ); ?>

				<!-- Back link -->
				<div class="zx-back-wrap">
					<a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="zx-back-link">
						<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
						Return to cart
					</a>
				</div>
			</div>

			<!-- Trust row -->
			<div class="zx-trust">
				<span class="zx-trust__item">
					<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
					SSL Encrypted
				</span>
				<span class="zx-trust__sep">·</span>
				<span class="zx-trust__item">
					<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
					Safe Payment
				</span>
				<span class="zx-trust__sep">·</span>
				<span class="zx-trust__item">
					<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
					Free Returns
				</span>
			</div>

		</aside>
	</div>
</div>
</main>

</form>

<?php include __DIR__ . '/part-footer.php'; ?>

<?php wp_footer(); ?>
</body>
</html>
