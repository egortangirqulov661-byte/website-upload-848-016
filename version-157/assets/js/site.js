(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-nav]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    function initHero() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
        var active = 0;

        function show(index) {
            active = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === active);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                show((active + 1) % slides.length);
            }, 5200);
        }
    }

    function normalize(text) {
        return (text || "").toString().toLowerCase().replace(/\s+/g, " ").trim();
    }

    function initFilters() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
        if (!inputs.length) {
            return;
        }

        inputs.forEach(function (input) {
            var queryName = input.getAttribute("data-url-query");
            if (queryName) {
                var params = new URLSearchParams(window.location.search);
                var value = params.get(queryName);
                if (value) {
                    input.value = value;
                }
            }

            function applyFilter() {
                var keyword = normalize(input.value);
                var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute("data-search") + " " + card.textContent);
                    card.classList.toggle("hidden", keyword && haystack.indexOf(keyword) === -1);
                });
            }

            input.addEventListener("input", applyFilter);
            applyFilter();
        });
    }

    window.bindMoviePlayer = function (videoId, streamUrl, overlayId) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        if (!video || !streamUrl) {
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
        } else {
            video.src = streamUrl;
        }

        function start() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var playResult = video.play();
            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener("click", start);
        }
        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });
        video.addEventListener("pause", function () {
            if (overlay && video.currentTime === 0) {
                overlay.classList.remove("is-hidden");
            }
        });
    };

    ready(function () {
        initMenu();
        initHero();
        initFilters();
    });
})();
