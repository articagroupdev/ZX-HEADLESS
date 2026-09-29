<?php
/**
 * Plugin Name: ZX Checkout Style
 * Description: Checkout de WooCommerce para ZX LINE (headless): template propio, estilos de marca e imágenes de producto.
 * Version:     1.0.5
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Requires Plugins: woocommerce
 */

defined( 'ABSPATH' ) || exit;

/* ── Template override ────────────────────────────────────── */

add_filter( 'template_include', 'zxcs_checkout_template_override', 99 );

function zxcs_checkout_template_override( $template ) {
	if ( is_checkout() && ! is_order_received_page() && ! is_checkout_pay_page() ) {
		return plugin_dir_path( __FILE__ ) . 'template-checkout.php';
	}
	if ( is_order_received_page() ) {
		return plugin_dir_path( __FILE__ ) . 'template-thankyou.php';
	}
	return $template;
}

/* ── Inject product thumbnail into order review table ─────── */

add_filter( 'woocommerce_cart_item_name', 'zxcs_inject_item_thumbnail', 10, 3 );

function zxcs_inject_item_thumbnail( $name, $cart_item, $cart_item_key ) {
	// Skip during the actual checkout submission AJAX (would corrupt JSON response),
	// but allow during order-review update AJAX so thumbnails persist after WC refreshes.
	if ( ! is_checkout() ) return $name;
	if ( wp_doing_ajax() && isset( $_POST['action'] ) && $_POST['action'] === 'woocommerce_checkout' ) return $name;

	$product  = $cart_item['data'];
	$qty      = $cart_item['quantity'];
	$image_id = $product->get_image_id();

	if ( $image_id ) {
		$img_url = wp_get_attachment_image_url( $image_id, array( 80, 80 ) );
	} else {
		$img_url = wc_placeholder_img_src( 'thumbnail' );
	}

	$img   = '<img src="' . esc_url( $img_url ) . '" alt="" class="zx-item-thumb" width="64" height="64" loading="lazy">';
	$badge = '<span class="zx-item-qty">' . intval( $qty ) . '</span>';

	return '<span class="zx-item-wrap">'
		. '<span class="zx-item-img-wrap">' . $img . $badge . '</span>'
		. '<span class="zx-item-name">' . $name . '</span>'
		. '</span>';
}

/* ── Enqueue assets ───────────────────────────────────────── */

add_action( 'wp_enqueue_scripts', 'zxcs_checkout_assets' );

function zxcs_checkout_assets() {
	if ( ! is_checkout() ) return;

	wp_enqueue_style(
		'zxcs-checkout',
		plugin_dir_url( __FILE__ ) . 'checkout.css',
		array( 'woocommerce-layout', 'woocommerce-general' ),
		'1.0.5'
	);

	wp_enqueue_script(
		'zxcs-checkout-js',
		plugin_dir_url( __FILE__ ) . 'checkout.js',
		array( 'jquery', 'wc-checkout' ),
		'1.0.5',
		true
	);
}

/* ── Enlaces viejos: /checkout-2-2/ → checkout actual ─────── */

add_action( 'template_redirect', 'zxcs_redirect_old_checkout_slug', 1 );

function zxcs_redirect_old_checkout_slug() {
	if ( ! is_404() ) {
		return;
	}
	$path = trim( (string) wp_parse_url( isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '', PHP_URL_PATH ), '/' );
	if ( in_array( $path, array( 'checkout-2-2', 'checkout-2' ), true ) ) {
		wp_safe_redirect( wc_get_checkout_url(), 301 );
		exit;
	}
}

/* ── WooCommerce AJAX vía la URL del checkout ─────────────── */

/**
 * En este sitio Apache manda "/" (y todo lo que no es archivo) a Next.js, así que
 * las peticiones POST a "/?wc-ajax=..." las recibe Next.js y responde 405 en vez
 * de WordPress. Eso rompe update_order_review (envío y totales), el envío del
 * pedido (?wc-ajax=checkout) y los AJAX de Stripe y PayPal.
 * La URL del checkout sí la sirve WordPress, así que el endpoint AJAX
 * se apunta ahí. Se puede desactivar con el filtro zxcs_ajax_via_checkout.
 */
add_filter( 'woocommerce_ajax_get_endpoint', 'zxcs_ajax_via_checkout', 20, 2 );

function zxcs_ajax_via_checkout( $url, $request ) {
	if ( is_admin() || ! apply_filters( 'zxcs_ajax_via_checkout', true ) ) {
		return $url;
	}
	$checkout = wc_get_checkout_url();
	if ( ! $checkout ) {
		return $url;
	}
	return esc_url_raw( add_query_arg( 'wc-ajax', $request, wp_make_link_relative( $checkout ) ) );
}

/* ── Etiqueta de envío sin ":" (el precio va alineado a la derecha) ── */

add_filter( 'woocommerce_cart_shipping_method_full_label', 'zxcs_shipping_label_no_colon', 20 );

function zxcs_shipping_label_no_colon( $label ) {
	return is_checkout() ? preg_replace( '/:\s*(?=<span)/', ' ', $label, 1 ) : $label;
}

/* ── Shipping phone must never block the order ────────────── */

add_filter( 'woocommerce_checkout_fields', 'zxcs_optional_shipping_phone', 99 );

function zxcs_optional_shipping_phone( $fields ) {
	if ( isset( $fields['shipping']['shipping_phone'] ) ) {
		$fields['shipping']['shipping_phone']['required'] = false;
	}
	return $fields;
}
