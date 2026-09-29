<?php defined( 'ABSPATH' ) || exit; $site_url = home_url( '/' ); $logo_url = home_url( '/img/logo.webp' ); ?>
<!-- ────────────────── TOP BAR + HEADER ─────────────────── -->
<div class="zx-topbar">
	<div class="zx-topbar__inner">
		<a href="https://www.instagram.com/zxline.us" target="_blank" rel="noopener" aria-label="Instagram">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
		</a>
		<a href="https://www.tiktok.com/@zxline.us" target="_blank" rel="noopener" aria-label="TikTok">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 6.7a4.8 4.8 0 0 1-3.8-4.2h-3.4v13.4a2.8 2.8 0 1 1-2-2.7V9.7a6.2 6.2 0 1 0 5.4 6.2V9.4a8.1 8.1 0 0 0 3.8 1V7a4.8 4.8 0 0 1 0-.3z"/></svg>
		</a>
		<a href="mailto:info@zxline.us" aria-label="Email">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
		</a>
	</div>
</div>

<header class="zx-header">
	<div class="zx-header__inner">

		<a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="zx-header__back" <?php echo ( isset( $zxcs_step ) && 3 === (int) $zxcs_step ) ? 'style="visibility:hidden"' : ''; ?>>
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
			<span>Back to cart</span>
		</a>

		<a href="<?php echo esc_url( $site_url ); ?>" class="zx-logo-link" aria-label="ZX LINE">
			<img src="<?php echo esc_url( $logo_url ); ?>" alt="ZX LINE" class="zx-logo-img">
		</a>

		<div class="zx-header__secure">
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
			Secure checkout
		</div>

	</div>
</header>

<?php
$zxcs_step  = isset( $zxcs_step ) ? (int) $zxcs_step : 2;
$zxcs_items = array( 1 => 'Cart', 2 => 'Details', 3 => 'Confirm' );
?>
<nav class="zx-steps" aria-label="Checkout progress">
	<?php foreach ( $zxcs_items as $i => $label ) :
		$state = $i < $zxcs_step ? 'done' : ( $i === $zxcs_step ? 'active' : '' );
		?>
		<?php if ( $i > 1 ) : ?><span class="zx-step__line"></span><?php endif; ?>
		<span class="zx-step<?php echo $state ? ' zx-step--' . esc_attr( $state ) : ''; ?>">
			<span class="zx-step__dot"><?php if ( 'done' === $state ) : ?><svg width="9" height="9" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg><?php endif; ?></span>
			<span class="zx-step__label"><?php echo esc_html( $label ); ?></span>
		</span>
	<?php endforeach; ?>
</nav>

