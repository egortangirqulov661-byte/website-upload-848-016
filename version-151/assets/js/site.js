(function () {
  var menuButton = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-nav-menu]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  var backTop = document.querySelector('[data-back-top]');

  if (backTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 360) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    });

    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
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
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  document.querySelectorAll('[data-search]').forEach(function (input) {
    var scope = input.getAttribute('data-search');
    var area = document.querySelector('[data-search-area="' + scope + '"]');

    if (!area) {
      return;
    }

    var cards = Array.prototype.slice.call(area.querySelectorAll('[data-card]'));

    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-title') || '').toLowerCase();
        card.classList.toggle('hide', keyword.length > 0 && haystack.indexOf(keyword) === -1);
      });
    });
  });

  document.querySelectorAll('[data-player]').forEach(function (player) {
    var video = player.querySelector('video[data-video]');
    var button = player.querySelector('[data-play]');
    var hls;
    var loaded = false;

    if (!video) {
      return;
    }

    function start() {
      var url = video.getAttribute('data-video');

      if (!loaded) {
        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ maxBufferLength: 45 });
          hls.loadSource(url);
          hls.attachMedia(video);
        } else {
          video.src = url;
        }
      }

      if (button) {
        button.classList.add('is-hidden');
      }

      video.controls = true;

      var playPromise = video.play();

      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
