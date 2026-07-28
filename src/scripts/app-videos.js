async function registerVideos() {
    document.querySelectorAll(".video-placeholder").forEach(function (video) {

        video.addEventListener("click", function () {

            const src = this.dataset.video;
            console.log('video url ', src);

            this.innerHTML =
            `
            <iframe
                src="${src}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
            `;

        });

    });
}