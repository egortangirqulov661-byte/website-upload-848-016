(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var isOpen = mobileNav.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', String(isOpen));
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === current);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var index = Number(dot.getAttribute('data-hero-dot')) || 0;
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5600);
    }

    var filterInput = document.querySelector('.filter-input');
    var filterSelect = document.querySelector('.filter-select');
    var filterScope = document.querySelector('.filter-scope');
    var urlParams = new URLSearchParams(window.location.search);
    var queryValue = urlParams.get('q');

    if (filterInput && queryValue) {
        filterInput.value = queryValue;
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function filterCards() {
        if (!filterScope) {
            return;
        }

        var keyword = normalize(filterInput ? filterInput.value : '');
        var year = filterSelect ? filterSelect.value : 'all';
        var cards = Array.prototype.slice.call(filterScope.children);

        cards.forEach(function (card) {
            var text = normalize(card.textContent + ' ' + card.getAttribute('data-title') + ' ' + card.getAttribute('data-genre') + ' ' + card.getAttribute('data-region'));
            var cardYear = String(card.getAttribute('data-year') || '');
            var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchYear = year === 'all' || cardYear === year;
            card.classList.toggle('hidden-by-filter', !(matchKeyword && matchYear));
        });
    }

    if (filterInput) {
        filterInput.addEventListener('input', filterCards);
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', filterCards);
    }

    filterCards();
})();
