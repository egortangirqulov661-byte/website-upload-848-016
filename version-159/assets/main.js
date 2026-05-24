document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
      navLinks.classList.toggle("is-open");
    });
  }

  const hero = document.querySelector("[data-hero]");

  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    let activeIndex = 0;

    const showSlide = function (index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        const index = Number(dot.getAttribute("data-hero-dot"));
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }
  }

  const filterInputs = Array.from(document.querySelectorAll("[data-filter-input]"));
  const typeFilters = Array.from(document.querySelectorAll("[data-type-filter]"));
  const yearFilters = Array.from(document.querySelectorAll("[data-year-filter]"));

  const filterCards = function () {
    const query = filterInputs.map(function (input) {
      return input.value.trim().toLowerCase();
    }).join(" ").trim();
    const type = typeFilters.map(function (select) {
      return select.value;
    }).find(Boolean) || "";
    const year = yearFilters.map(function (select) {
      return select.value;
    }).find(Boolean) || "";
    const cards = Array.from(document.querySelectorAll("[data-movie-card]"));

    cards.forEach(function (card) {
      const text = (card.getAttribute("data-text") || "").toLowerCase();
      const cardType = card.getAttribute("data-type") || "";
      const cardYear = Number(card.getAttribute("data-year") || "0");
      const matchQuery = !query || text.includes(query);
      const matchType = !type || cardType === type;
      const matchYear = !year || (year === "older" ? cardYear < 2020 : String(cardYear) === year);
      card.classList.toggle("is-hidden", !(matchQuery && matchType && matchYear));
    });
  };

  filterInputs.concat(typeFilters).concat(yearFilters).forEach(function (control) {
    control.addEventListener("input", filterCards);
    control.addEventListener("change", filterCards);
  });

  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");

  if (q && filterInputs.length > 0) {
    filterInputs[0].value = q;
    filterCards();
  }

  const playButton = document.querySelector("[data-player-button]");
  const video = document.querySelector("[data-player-video]");

  if (playButton && video) {
    const startPlayer = function () {
      const url = playButton.getAttribute("data-url");

      if (!url) {
        return;
      }

      playButton.classList.add("is-hidden");
      video.controls = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        if (!video.getAttribute("src")) {
          video.setAttribute("src", url);
        }
      } else if (window.Hls && window.Hls.isSupported()) {
        if (!video.dataset.ready) {
          const hls = new window.Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
          video.dataset.ready = "1";
        }
      } else if (!video.getAttribute("src")) {
        video.setAttribute("src", url);
      }

      const playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    };

    playButton.addEventListener("click", startPlayer);
    video.addEventListener("click", function () {
      if (!video.controls) {
        startPlayer();
      }
    });
  }
});
