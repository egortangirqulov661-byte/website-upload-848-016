var MoviePlayer = (function () {
    function attach(video, src, cover) {
        var started = false;

        function load() {
            if (started) {
                return;
            }

            started = true;

            if (cover) {
                cover.classList.add('hidden');
            }

            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 60
                });

                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        hls.destroy();
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                video.addEventListener('loadedmetadata', function () {
                    video.play().catch(function () {});
                }, { once: true });
            } else {
                video.src = src;
                video.play().catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener('click', load);
        }

        video.addEventListener('click', function () {
            if (!started) {
                load();
            }
        });

        video.addEventListener('play', function () {
            if (cover) {
                cover.classList.add('hidden');
            }
        });
    }

    return {
        start: function (videoId, src, coverId) {
            var video = document.getElementById(videoId);
            var cover = document.getElementById(coverId);

            if (!video) {
                return;
            }

            attach(video, src, cover);
        }
    };
})();
