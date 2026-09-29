<?php defined( 'ABSPATH' ) || exit; $site_url = home_url( '/' ); $logo_url = home_url( '/img/logo.webp' ); ?>
<a href="https://wa.me/584147931224" class="zx-whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp">
	<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
</a>

<footer class="zx-footer">
	<div class="zx-footer__inner">
		<div class="zx-footer__brand">
			<a href="<?php echo esc_url( $site_url ); ?>"><img src="<?php echo esc_url( $logo_url ); ?>" alt="ZX LINE" class="zx-footer__logo"></a>
			<p>Your trusted destination for premium lubricants and intimate wellness.</p>
		</div>
		<div class="zx-footer__col">
			<p class="zx-footer__title">Shop</p>
			<a href="<?php echo esc_url( home_url( '/account' ) ); ?>">My account</a>
			<a href="<?php echo esc_url( home_url( '/shop' ) ); ?>">Products</a>
			<a href="<?php echo esc_url( home_url( '/cart' ) ); ?>">Cart</a>
		</div>
		<div class="zx-footer__col">
			<p class="zx-footer__title">Links</p>
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
			<a href="<?php echo esc_url( home_url( '/shop' ) ); ?>">Shop</a>
			<a href="<?php echo esc_url( home_url( '/zx-line' ) ); ?>">ZX Line</a>
			<a href="<?php echo esc_url( home_url( '/contact' ) ); ?>">Contact</a>
		</div>
		<div class="zx-footer__col">
			<p class="zx-footer__title">Contact</p>
			<a href="mailto:info@zxline.us">info@zxline.us</a>
			<a href="tel:+584147931224">+58 414-7931224</a>
		</div>
	</div>
	<p class="zx-footer__copy">© <?php echo esc_html( gmdate( 'Y' ) ); ?> ZX LINE. All rights reserved.</p>
</footer>

