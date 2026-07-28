async function registerVideos() {

    document.querySelectorAll(".video-placeholder").forEach(function (placeholder) {

        placeholder.addEventListener("click", function () {

            // Already initialized?
            if (this.querySelector("video")) {
                return;
            }

            const src = this.dataset.video;

            this.innerHTML = `
                <video controls autoplay playsinline>
                    <source src="${src}" type="video/mp4">
                </video>
            `;

            const video = this.querySelector("video");
            video.playbackRate = 1.5;
            video.play();

        });

    });

}