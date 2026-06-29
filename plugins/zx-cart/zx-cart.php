<?php
/**
 * Plugin Name:  ZX Cart
 * Plugin URI:   https://zxline.us
 * Description:  Sincroniza el carrito headless de ZX (Next.js) con WooCommerce al llegar al checkout. Lee el cookie wc_cart_token de la Store API y puebla el carrito PHP nativo. También redirige páginas de producto de WP al frontend y envía URLs correctas a Meta/Facebook.
 * Version:      1.2.0
 * Author:       Artíca Group
 * Author URI:   https://zxline.us
 * Text Domain:  zx-cart
 * Requires PHP: 7.4
 * Requires at least: 5.8
 * WC requires at least: 6.0
 *
 * INSTALACIÓN:
 *   Subir esta carpeta a: wp-content/plugins/zx-cart/
 *   Activar en WP Admin → Plugins → ZX Cart
 */

defined( 'ABSPATH' ) || exit;

define( 'ZXC_VERSION',     '1.2.0' );
define( 'ZXC_CART_COOKIE', 'wc_cart_token' );

// ─────────────────────────────────────────────────────────────────────────────
// 1. Enviar URLs del frontend Next.js al catálogo de Meta/Facebook
// ─────────────────────────────────────────────────────────────────────────────

add_filter( 'wc_facebook_product_link', function ( $link, $product ) {
	if ( ! $product ) {
		return $link;
	}
	$slug = is_object( $product ) && method_exists( $product, 'get_slug' )
		? $product->get_slug()
		: get_post_field( 'post_name', is_object( $product ) ? $product->get_id() : intval( $product ) );
	if ( empty( $slug ) ) {
		return $link;
	}
	return home_url( '/producto/' . $slug );
}, 10, 2 );

// ─────────────────────────────────────────────────────────────────────────────
// 2. Redirigir páginas de producto de WordPress → /producto/{slug} en Next.js
//    (excepto bots de Meta/Facebook que necesitan el OG de WP)
// ─────────────────────────────────────────────────────────────────────────────

add_action( 'template_redirect', function () {
	if ( ! is_singular( 'product' ) ) {
		return;
	}

	$ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? strtolower( $_SERVER['HTTP_USER_AGENT'] ) : '';
	$social_bots = array( 'facebook', 'facebot', 'meta', 'instagram', 'twitterbot', 'pinterest' );

	foreach ( $social_bots as $bot ) {
		if ( strpos( $ua, $bot ) !== false ) {
			return;
		}
	}

	$slug = get_post_field( 'post_name', get_the_ID() );
	if ( empty( $slug ) ) {
		return;
	}

	wp_redirect( home_url( '/producto/' . $slug ), 301 );
	exit;
}, 1 );

// ─────────────────────────────────────────────────────────────────────────────
// 3. Sincronización automática al llegar al checkout / carrito de WordPress
// ─────────────────────────────────────────────────────────────────────────────

add_action( 'template_redirect', 'zxc_maybe_sync_cart', 5 );

function zxc_maybe_sync_cart() {
	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		return;
	}

	// Solo en páginas de checkout y carrito
	if ( ! is_checkout() && ! is_cart() ) {
		return;
	}

	// No sincronizar en la página de agradecimiento (order-received)
	if ( is_wc_endpoint_url( 'order-received' ) ) {
		return;
	}

	$cart_token = zxc_get_cart_token();
	if ( empty( $cart_token ) ) {
		return;
	}

	zxc_do_sync( $cart_token );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Lógica central: fetch Store API → poblar WC PHP cart
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param  string $cart_token  Valor del cookie wc_cart_token.
 * @return bool   true si se añadió al menos un producto.
 */
function zxc_do_sync( $cart_token ) {
	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		return false;
	}

	$items = zxc_fetch_store_cart( $cart_token );

	if ( empty( $items ) || ! is_array( $items ) ) {
		return false;
	}

	WC()->cart->empty_cart( true );

	$added = 0;

	foreach ( $items as $item ) {
		$product_id = absint( $item['id'] ?? 0 );
		$quantity   = absint( $item['quantity'] ?? 1 );

		if ( $product_id < 1 || $quantity < 1 ) {
			continue;
		}

		// Si el producto es una variación, WooCommerce necesita el ID del padre
		$product = wc_get_product( $product_id );
		if ( ! $product ) {
			continue;
		}

		if ( $product->is_type( 'variation' ) ) {
			$result = WC()->cart->add_to_cart(
				$product->get_parent_id(),
				$quantity,
				$product_id,
				$product->get_variation_attributes()
			);
		} else {
			$result = WC()->cart->add_to_cart( $product_id, $quantity );
		}

		if ( $result ) {
			$added++;
		}
	}

	if ( $added > 0 ) {
		WC()->cart->calculate_totals();
		return true;
	}

	return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Llamada interna a WooCommerce Store API con el Cart-Token
// ─────────────────────────────────────────────────────────────────────────────

function zxc_fetch_store_cart( $cart_token ) {
	$api_url = home_url( '/wp-json/wc/store/v1/cart' );

	$response = wp_remote_get(
		$api_url,
		array(
			'timeout'   => 10,
			'sslverify' => false, // Desactivado para evitar problemas en cPanel con loopback SSL
			'headers'   => array(
				'Cart-Token'   => $cart_token,
				'Content-Type' => 'application/json',
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		error_log( '[zx-cart] Error Store API: ' . $response->get_error_message() );
		return array();
	}

	$code = (int) wp_remote_retrieve_response_code( $response );

	if ( 200 !== $code ) {
		error_log( '[zx-cart] Store API devolvió HTTP ' . $code );
		return array();
	}

	$body = json_decode( wp_remote_retrieve_body( $response ), true );

	return ( is_array( $body ) && isset( $body['items'] ) && is_array( $body['items'] ) )
		? $body['items']
		: array();
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Helper: leer el cookie wc_cart_token
// ─────────────────────────────────────────────────────────────────────────────

function zxc_get_cart_token() {
	if ( empty( $_COOKIE[ ZXC_CART_COOKIE ] ) ) {
		return '';
	}
	return sanitize_text_field( wp_unslash( $_COOKIE[ ZXC_CART_COOKIE ] ) );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Limpiar el cookie wc_cart_token tras completar el pedido
//    Esto indica al frontend de Next.js que el carrito fue procesado
// ─────────────────────────────────────────────────────────────────────────────

add_action( 'woocommerce_thankyou', 'zxc_clear_cart_token_after_order' );

function zxc_clear_cart_token_after_order( $order_id ) {
	if ( empty( $order_id ) ) {
		return;
	}
	setcookie( ZXC_CART_COOKIE, '', time() - HOUR_IN_SECONDS, '/', '', is_ssl(), true );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. REST endpoint: POST /wp-json/zx/v1/sync-cart
//    Para que Next.js llame antes de redirigir al checkout de WordPress.
//    Body JSON:  { "cart_token": "<token>" }
//    Respuesta:  { success, checkout_url, items_count, message }
// ─────────────────────────────────────────────────────────────────────────────

add_action( 'rest_api_init', 'zxc_register_rest_routes' );

function zxc_register_rest_routes() {
	register_rest_route(
		'zx/v1',
		'/sync-cart',
		array(
			'methods'             => 'POST',
			'callback'            => 'zxc_rest_sync_cart',
			'permission_callback' => '__return_true',
			'args'                => array(
				'cart_token' => array(
					'required'          => true,
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
			),
		)
	);
}

function zxc_rest_sync_cart( WP_REST_Request $request ) {
	$cart_token = $request->get_param( 'cart_token' );

	if ( empty( $cart_token ) ) {
		return new WP_REST_Response(
			array( 'success' => false, 'message' => 'cart_token es requerido.' ),
			400
		);
	}

	$synced = zxc_do_sync( $cart_token );

	return new WP_REST_Response(
		array(
			'success'      => $synced,
			'checkout_url' => wc_get_checkout_url(),
			'cart_url'     => wc_get_cart_url(),
			'items_count'  => WC()->cart ? WC()->cart->get_cart_contents_count() : 0,
			'message'      => $synced
				? 'Carrito sincronizado correctamente.'
				: 'No se sincronizaron ítems (carrito vacío o token inválido).',
		),
		200
	);
}
