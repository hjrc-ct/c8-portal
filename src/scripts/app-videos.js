async function registerVideos() {

    document.querySelectorAll(".video-placeholder").forEach(function (placeholder) {

        placeholder.addEventListener("click", function () {

            const src = this.dataset.video;
            console.log("video url", src);

            this.innerHTML = `
                <video controls autoplay playsinline>
                    <source src="${src}" type="video/mp4">
                </video>
            `;

            const video = this.querySelector("video");

            video.addEventListener("loadedmetadata", () => {
                video.playbackRate = 1.5;
            });

        });

    });
}