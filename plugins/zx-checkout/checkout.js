(function ($) {
  'use strict';

  $(function () {

    /* ── Mobile summary toggle ───────────────────────────── */
    var $toggle = $('#zxMobileToggle');
    var $body   = $('#zxMobileBody');
    var $caret  = $toggle.find('.zx-caret');

    $toggle.on('click', function () {
      var open = $body.is(':visible');
      $body.slideToggle(220);
      $caret.toggleClass('open', !open);
      $toggle.attr('aria-expanded', String(!open));
    });

    /* ── Payment method: highlight selected card ─────────── */
    function highlightPayment() {
      $('#payment .wc_payment_method').removeClass('zx-selected');
      $('#payment input[name="payment_method"]:checked').closest('.wc_payment_method').addClass('zx-selected');
    }

    $(document.body).on('change', '#payment input[name="payment_method"]', function () {
      highlightPayment();
    });

    /* ── Shipping: show only the selected method ─────────── */
    function syncShipping() {
      var $items = $('#order_review ul#shipping_method li');
      $items.removeClass('zx-shipping-selected');
      var $checked = $items.filter(function () {
        return $(this).find('input[type="radio"]:checked').length > 0;
      });
      if ($checked.length) {
        $checked.addClass('zx-shipping-selected');
      } else {
        /* No method checked yet — show first available as default */
        $items.first().addClass('zx-shipping-selected');
      }
    }

    /* ── Mobile bar: clone from #order_review (no form inputs) ── */
    /* Cloning instead of a separate woocommerce_order_review()    */
    /* call avoids duplicate shipping_method inputs in the form,   */
    /* which caused the "not a valid JSON response" checkout error. */
    function syncMobileBar() {
      var $source = $('#order_review .woocommerce-checkout-review-order-table');
      if (!$source.length) return;
      var $clone = $source.clone();
      /* Mark selected shipping BEFORE removing inputs */
      $clone.find('ul#shipping_method li').has('input[type="radio"]:checked')
        .addClass('zx-shipping-selected');
      /* Strip all form controls — mobile bar is display-only.          */
      /* Shipping radios stay (sin name/id, para no duplicar campos en   */
      /* el form) y reenvían el clic al radio real de #order_review.     */
      $clone.find('ul#shipping_method input[type="radio"]').each(function () {
        var $r = $(this);
        $r.attr('data-real', $r.attr('id')).removeAttr('name').removeAttr('id');
      });
      $clone.find('input, select, textarea').not('[data-real]').remove();
      $('#zxMobileSummaryClone').html($clone);
    }

    $('#zxMobileSummaryClone').on('click', 'input[data-real]', function () {
      var $real = $('#' + $(this).attr('data-real'));
      if ($real.length && !$real.is(':checked')) { $real.trigger('click'); }
    });

    $(document.body).on('change', '#order_review input.shipping_method', syncShipping);

    /* ── Force-unblock helper ────────────────────────────── */
    /* Payment is now in the left column, outside #order_review.  */
    /* WC blocks form.checkout (not just #order_review) on AJAX   */
    /* totals refresh triggered by payment method change, coupon,  */
    /* etc. We force-unblock both after every refresh cycle.       */
    function forceUnblock() {
      if (typeof $.fn.unblock !== 'undefined') {
        $('form.checkout').unblock();
        $('#order_review').unblock();
      }
      $('.woocommerce-checkout .blockUI.blockOverlay, #order_review .blockUI').css({
        'pointer-events': 'none',
        opacity: 0
      });
    }

    /* Re-highlight and unblock after WooCommerce AJAX refresh */
    $(document.body).on('updated_checkout', function () {
      highlightPayment();
      syncShipping();
      syncMobileBar();
      forceUnblock();

      /* Sync mobile total */
      var $t = $('#order_review .order-total .woocommerce-Price-amount').first();
      if ($t.length) { $('#zxMobileTotal').html($t.html()); }
    });

    /* ── Safety net poll: catches lingering overlays ─────── */
    /* Covers race conditions where updated_checkout fires    */
    /* before blockUI finishes its animation, or AJAX errors. */
    /* Skips during actual form submission (_submitting=true). */
    var _attempts  = 0;
    var _submitting = false;

    var _poll = setInterval(function () {
      if (!_submitting) { forceUnblock(); }
      if (++_attempts >= 20) { clearInterval(_poll); } /* stop after 10 s */
    }, 500);

    /* ── Notice enhancement: icon + close button ────────────── */
    function enhanceNotices() {
      $('.woocommerce-error, .woocommerce-message, .woocommerce-info').each(function () {
        var $n = $(this);
        if ($n.find('.zx-notice-close').length) return;
        var $btn = $('<button type="button" class="zx-notice-close" aria-label="Dismiss">&#x2715;</button>');
        $btn.on('click', function () {
          $n.addClass('zx-notice-dismissing');
          setTimeout(function () { $n.remove(); }, 240);
        });
        $n.append($btn);
      });
    }

    $(document.body).on('updated_checkout wc_fragments_refreshed', function () {
      enhanceNotices();
    });

    /* ── Scroll to first error ────────────────────────────── */
    $(document.body).on('checkout_error', function () {
      _submitting = false;
      enhanceNotices();
      var $err = $('.woocommerce-error').first();
      if ($err.length) {
        $('html,body').animate({ scrollTop: $err.offset().top - 100 }, 280);
      }
    });

    /* ── Place order: show processing overlay ───────────── */
    var $overlay = $('#zxProcessingOverlay');

    function showProcessing() {
      $overlay.addClass('zx-processing--active').attr('aria-hidden', 'false');
    }

    function hideProcessing() {
      $overlay.removeClass('zx-processing--active').attr('aria-hidden', 'true');
    }

    $('body').on('submit', 'form.checkout', function () {
      _submitting = true;
      showProcessing();
      var $btn  = $('#place_order');
      var label = $btn.text();
      $btn.prop('disabled', true).data('label', label).text('Processing…');
      $(document.body).one('checkout_error', function () {
        hideProcessing();
        $btn.prop('disabled', false).text(label);
      });
    });

    /* ── PayPal guard ────────────────────────────────────────── */
    /* The PayPal smart button opens its popup without validating  */
    /* the WooCommerce form. While required fields are missing we  */
    /* lay a transparent shield over the button; clicking it shows */
    /* what is missing. FAIL-OPEN: any error, an already-submitting */
    /* form, or a fully valid form → no shield, PayPal works as    */
    /* if this code did not exist.                                 */
    var $form = $('form.checkout');

    function fieldLabel($f) {
      var id = $f.attr('id') || '';
      var $l = $('label[for="' + id + '"]').first().clone();
      $l.find('.required, .optional').remove();
      var text = $.trim($l.text()) || id;
      var pre  = id.indexOf('shipping_') === 0 ? 'Shipping ' : (id.indexOf('billing_') === 0 ? 'Billing ' : '');
      return pre + text;
    }

    function collectErrors() {
      var errs = [];
      $form.find('.validate-required').each(function () {
        var $row = $(this);
        if (!$row.is(':visible')) return;
        var $f = $row.find('input, select, textarea').not('[type="hidden"]').first();
        if (!$f.length || $f.is(':disabled')) return;
        var val = $f.is(':checkbox') ? $f.is(':checked') : $.trim($f.val() || '');
        if (!val) {
          errs.push({ $row: $row, $f: $f, msg: $f.is(':checkbox')
            ? 'Please accept the terms and conditions.'
            : fieldLabel($f) + ' is a required field.' });
        } else if ($row.hasClass('validate-email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          errs.push({ $row: $row, $f: $f, msg: fieldLabel($f) + ' is not a valid email address.' });
        }
      });
      return errs;
    }

    function guardNeeded() {
      try {
        if (_submitting || $form.hasClass('processing')) return false;
        return collectErrors().length > 0;
      } catch (e) {
        return false; /* fail open */
      }
    }

    function showGuardErrors() {
      try {
        var errs = collectErrors();
        $('.zx-guard-notice').remove();
        if (!errs.length) return;

        var $ul = $('<ul class="woocommerce-error" role="alert"></ul>');
        $.each(errs, function (_, e) {
          e.$row.addClass('woocommerce-invalid woocommerce-invalid-required-field');
          $('<li></li>').text(e.msg).appendTo($ul);
        });
        $('<div class="woocommerce-NoticeGroup zx-guard-notice"></div>').append($ul)
          .prependTo('.zx-container');
        enhanceNotices();

        var $first = errs[0].$f;
        $('html,body').animate({ scrollTop: Math.max($first.offset().top - 140, 0) }, 280);
        setTimeout(function () { try { $first.trigger('focus'); } catch (e) {} }, 300);
      } catch (e) { /* fail open: nothing to do */ }
    }

    function syncGuard() {
      try {
        var $btns = $('.paypal-buttons').first();
        var $host = $btns.length ? $btns.parent() : $();
        var $shield = $('#zxPayGuard');

        if (!$host.length || !guardNeeded()) {
          $shield.remove();
          $('.zx-guard-notice').remove();
          return;
        }
        if (!$shield.length || !$.contains($host[0], $shield[0])) {
          $shield.remove();
          $host.css('position', 'relative');
          $('<div id="zxPayGuard" class="zx-pay-guard" title="Complete the required fields first"></div>')
            .on('click touchstart', function (ev) { ev.preventDefault(); showGuardErrors(); })
            .appendTo($host);
        }
      } catch (e) {
        $('#zxPayGuard').remove(); /* fail open */
      }
    }

    $form.on('input change keyup blur', 'input, select, textarea', syncGuard);
    $(document.body).on('updated_checkout country_to_state_changing', function () {
      setTimeout(syncGuard, 50);
    });
    /* Safety net: autofill, PayPal SDK re-renders, select2 without events */
    setInterval(syncGuard, 600);
    syncGuard();

    /* Initial state on page load */
    highlightPayment();
    syncShipping();
    syncMobileBar();

  });

}(jQuery));
