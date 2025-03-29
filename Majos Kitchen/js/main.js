let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

// Open cart
cartIcon.onclick = () => {
    cart.classList.add("active");
};

// Close cart
closeCart.onclick = () => {
    cart.classList.remove("active");
};

// Ensure the DOM is fully loaded before running scripts
document.addEventListener("DOMContentLoaded", ready);

function ready() {
    let addCartButtons = document.querySelectorAll(".add-cart");
    addCartButtons.forEach(button => {
        button.addEventListener("click", addCartClicked);
    });

    document.querySelector(".cart-content").addEventListener("click", function (event) {
        if (event.target.classList.contains("cart-remove")) {
            event.target.parentElement.remove();
            updateTotal();
            saveCartItems();
            updateCartIcon();
        }
    });

    document.querySelector(".cart-content").addEventListener("input", function (event) {
        if (event.target.classList.contains("cart-quantity")) {
            if (isNaN(event.target.value) || event.target.value <= 0) {
                event.target.value = 1;
            }
            updateTotal();
            saveCartItems();
            updateCartIcon();
        }
    });
    
    loadCartItems();
}

function addCartClicked(event) {
    let button = event.target;
    let product = button.closest(".col-lg-4");

    if (!product) return;

    let title = product.querySelector(".product-name").innerText;
    let priceText = product.querySelector(".product-price").innerText;
    let productImage = product.querySelector(".img-fluid").src;
    let price = parseFloat(priceText.replace(/[^0-9.]/g, ""));

    addProductToCart(title, price, productImage);
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

function addProductToCart(title, price, productImage) {
    let cartContent = document.querySelector(".cart-content");
    let cartItems = cartContent.getElementsByClassName("cart-item");

    for (let i = 0; i < cartItems.length; i++) {
        let cartItem = cartItems[i];
        let cartItemTitle = cartItem.querySelector(".cart-product-title").innerText;
        if (cartItemTitle === title) {
            let quantityInput = cartItem.querySelector(".cart-quantity");
            quantityInput.value = parseInt(quantityInput.value) + 1;
            updateTotal();
            saveCartItems();
            updateCartIcon();
            return;
        }
    }

    let cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
        <img src="${productImage}" width="50">
        <span class="cart-product-title">${title}</span>
        <span class="cart-product-price">£${price.toFixed(2)}</span>
        <input type="number" class="cart-quantity" value="1" min="1">
        <button class="cart-remove">Remove</button>
    `;

    cartContent.appendChild(cartItem);
    saveCartItems();
    updateTotal();
    updateCartIcon();
}

function updateTotal() {
    let cartItems = document.querySelectorAll(".cart-item");
    let total = 0;

    cartItems.forEach((item) => {
        let priceText = item.querySelector(".cart-product-price").innerText;
        let price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
        let quantity = parseInt(item.querySelector(".cart-quantity").value);
        total += price * quantity;
    });

    document.querySelector(".total-price").innerText = `£${total.toFixed(2)}`;
    localStorage.setItem("cartTotal", total);
}

function saveCartItems() {
    let cartContent = document.querySelector(".cart-content");
    let cartItems = cartContent.getElementsByClassName("cart-item");
    let items = [];

    for (let cartItem of cartItems) {
        let title = cartItem.querySelector(".cart-product-title").innerText;
        let price = cartItem.querySelector(".cart-product-price").innerText;
        let quantity = cartItem.querySelector(".cart-quantity").value;
        let productImg = cartItem.querySelector("img").src;

        items.push({ title, price, quantity, productImg });
    }
    localStorage.setItem("cartItems", JSON.stringify(items));
}

function loadCartItems() {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let cartContent = document.querySelector(".cart-content");
    cartContent.innerHTML = "";

    cartItems.forEach(item => {
        addProductToCart(item.title, parseFloat(item.price.replace(/[^0-9.]/g, "")), item.productImg);
        let cartItems = document.getElementsByClassName("cart-item");
        let cartItem = cartItems[cartItems.length - 1];
        cartItem.querySelector(".cart-quantity").value = item.quantity;
    });

    let cartTotal = localStorage.getItem("cartTotal");
    if (cartTotal) {
        document.querySelector(".total-price").innerText = `£${cartTotal}`;
    }
    updateCartIcon();
}

function updateCartIcon() {
    let cartItems = document.getElementsByClassName("cart-item");
    let quantity = 0;

    for (let cartItem of cartItems) {
        let quantityElement = cartItem.querySelector(".cart-quantity");
        quantity += parseInt(quantityElement.value);
    }
    cartIcon.setAttribute("data-quantity", quantity);
}

// jQuery dependent code
(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);

    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        }
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 2
            },
            1200: {
                items: 2
            }
        }
    });

    // Vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });

    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });

    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });

})(jQuery);
