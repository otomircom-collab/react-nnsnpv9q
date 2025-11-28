// OtoMarketGo Theme JavaScript

(function($) {
    'use strict';

    // Document Ready
    $(document).ready(function() {
        initStickyHeader();
        initMobileMenu();
        initSearchToggle();
        initProductActions();
    });

    // Sticky Header
    function initStickyHeader() {
        var header = $('#header');
        var headerOffset = header.offset().top;

        $(window).scroll(function() {
            if ($(window).scrollTop() > headerOffset) {
                header.addClass('header-sticky');
            } else {
                header.removeClass('header-sticky');
            }
        });
    }

    // Mobile Menu
    function initMobileMenu() {
        $('.mobile-menu-toggle').on('click', function() {
            $(this).toggleClass('active');
            $('.mobile-menu').toggleClass('open');
            $('body').toggleClass('menu-open');
        });

        $('.mobile-menu-close').on('click', function() {
            $('.mobile-menu').removeClass('open');
            $('.mobile-menu-toggle').removeClass('active');
            $('body').removeClass('menu-open');
        });
    }

    // Search Toggle
    function initSearchToggle() {
        $('.search-toggle').on('click', function() {
            $('.header-search').toggleClass('active');
            $('.search-input').focus();
        });
    }

    // Product Actions
    function initProductActions() {
        // Add to Cart
        $('.add-to-cart-btn').on('click', function(e) {
            e.preventDefault();
            var productId = $(this).data('product-id');
            // Add your cart logic here
            showNotification('Ürün sepete eklendi!', 'success');
        });

        // Add to Favorites
        $('.favorite-btn').on('click', function(e) {
            e.preventDefault();
            $(this).toggleClass('active');
            var isFavorite = $(this).hasClass('active');
            var message = isFavorite ? 'Favorilere eklendi!' : 'Favorilerden çıkarıldı!';
            showNotification(message, 'info');
        });
    }

    // Notification System
    function showNotification(message, type) {
        var notification = $('<div class="notification notification-' + type + '">' + message + '</div>');
        $('body').append(notification);
        
        setTimeout(function() {
            notification.addClass('show');
        }, 100);

        setTimeout(function() {
            notification.removeClass('show');
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Vehicle Search
    window.vehicleSearch = function() {
        var brand = $('#vehicle-brand').val();
        var model = $('#vehicle-model').val();
        var year = $('#vehicle-year').val();

        if (!brand || !model || !year) {
            showNotification('Lütfen tüm alanları doldurun!', 'error');
            return false;
        }

        // Redirect to search results
        window.location.href = '/arama?marka=' + brand + '&model=' + model + '&yil=' + year;
        return false;
    };

    // VIN Search
    window.vinSearch = function() {
        var vin = $('#vin-input').val();
        
        if (vin.length < 10) {
            showNotification('Şase numarası en az 10 karakter olmalıdır!', 'error');
            return false;
        }

        // Redirect to VIN search results
        window.location.href = '/arama?sase=' + vin;
        return false;
    };

})(jQuery);
