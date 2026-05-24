(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function normalize(value) {
        return (value || "").toString().toLowerCase().trim();
    }

    ready(function () {
        var header = document.querySelector("[data-header]");
        var toggle = document.querySelector("[data-nav-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        function updateHeader() {
            if (!header) {
                return;
            }
            header.classList.toggle("is-scrolled", window.scrollY > 20);
        }

        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });

        if (toggle && mobileNav && header) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
                header.classList.toggle("menu-open");
            });
        }

        document.querySelectorAll("[data-search-form]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                if (!input || !input.value.trim()) {
                    return;
                }
                event.preventDefault();
                window.location.href = "./search.html?q=" + encodeURIComponent(input.value.trim());
            });
        });

        document.querySelectorAll("[data-hero]").forEach(function (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var prev = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var current = 0;
            var timer;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === current);
                });
            }

            function start() {
                window.clearInterval(timer);
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    show(current - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    start();
                });
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    show(parseInt(dot.getAttribute("data-hero-dot"), 10));
                    start();
                });
            });

            show(0);
            start();
        });

        var localInput = document.querySelector("[data-local-search]");
        var yearSelect = document.querySelector("[data-year-filter]");
        var filterList = document.querySelector("[data-filter-list]");

        function applyLocalFilters() {
            if (!filterList) {
                return;
            }
            var term = normalize(localInput && localInput.value);
            var year = yearSelect ? yearSelect.value : "";
            filterList.querySelectorAll(".filter-card").forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-tags"),
                    card.getAttribute("data-year")
                ].join(" "));
                var yearOk = !year || card.getAttribute("data-year") === year;
                var termOk = !term || haystack.indexOf(term) !== -1;
                card.classList.toggle("is-filtered-out", !(yearOk && termOk));
            });
        }

        if (localInput) {
            localInput.addEventListener("input", applyLocalFilters);
        }
        if (yearSelect) {
            yearSelect.addEventListener("change", applyLocalFilters);
        }

        var searchInput = document.getElementById("search-input");
        var searchForm = document.querySelector("[data-page-search-form]");
        var searchResults = document.querySelector("[data-search-results]");

        function applySearch() {
            if (!searchInput || !searchResults) {
                return;
            }
            var term = normalize(searchInput.value);
            searchResults.querySelectorAll(".search-card").forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-tags"),
                    card.getAttribute("data-year")
                ].join(" "));
                card.classList.toggle("is-filtered-out", term && haystack.indexOf(term) === -1);
            });
        }

        if (searchInput) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");
            if (query) {
                searchInput.value = query;
            }
            searchInput.addEventListener("input", applySearch);
            applySearch();
        }

        if (searchForm) {
            searchForm.addEventListener("submit", function (event) {
                event.preventDefault();
                applySearch();
            });
        }

        document.querySelectorAll("[data-player]").forEach(function (player) {
            var video = player.querySelector("video");
            var button = player.querySelector("[data-play-button]");
            var stream = player.getAttribute("data-stream");
            var started = false;
            var hls;

            function play() {
                if (!video || !stream) {
                    return;
                }
                if (!started) {
                    if (video.canPlayType("application/vnd.apple.mpegurl")) {
                        video.src = stream;
                    } else if (window.Hls && window.Hls.isSupported()) {
                        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                        hls.loadSource(stream);
                        hls.attachMedia(video);
                    } else {
                        video.src = stream;
                    }
                    video.controls = true;
                    started = true;
                }
                if (button) {
                    button.classList.add("is-hidden");
                }
                var promise = video.play();
                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {
                        if (button) {
                            button.classList.remove("is-hidden");
                        }
                    });
                }
            }

            if (button) {
                button.addEventListener("click", play);
            }

            if (video) {
                video.addEventListener("click", function () {
                    if (!started || video.paused) {
                        play();
                    }
                });
            }
        });
    });
})();
