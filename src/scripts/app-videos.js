function parseTimestampToSeconds(timestampText) {
    const match = timestampText.match(/(\d+):(\d{1,2})(?::(\d{1,2}))?/);
    if (!match) {
        return 0;
    }

    const hours = parseInt(match[1], 10) || 0;
    const minutes = parseInt(match[2], 10) || 0;
    const seconds = parseInt(match[3] || "0", 10) || 0;

    return (hours * 3600) + (minutes * 60) + seconds;
}

function openVideoAtTime(placeholder, seekTime = null) {
    if (placeholder.querySelector("video")) {
        const video = placeholder.querySelector("video");
        if (seekTime !== null) {
            video.currentTime = seekTime;
        }
        video.play();
        return;
    }

    const src = placeholder.dataset.video;

    placeholder.innerHTML = `
        <video controls autoplay playsinline preload="metadata">
            <source src="${src}" type="video/mp4">
        </video>
    `;

    const video = placeholder.querySelector("video");
    video.playbackRate = 1.5;

    if (seekTime !== null) {
        video.addEventListener("loadedmetadata", function onLoadedMetadata() {
            video.currentTime = seekTime;
            video.play();
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
        }, { once: true });
    } else {
        video.play();
    }
}

async function registerVideos() {
    document.querySelectorAll(".video-placeholder").forEach(function (placeholder) {
        placeholder.addEventListener("click", function (event) {
            if (event.target.closest(".video-time")) {
                return;
            }

            if (this.querySelector("video")) {
                return;
            }

            openVideoAtTime(this);
        });
    });

    document.querySelectorAll(".video-time").forEach(function (timestamp) {
        timestamp.style.cursor = "pointer";
        timestamp.setAttribute("role", "button");
        timestamp.setAttribute("tabindex", "0");

        timestamp.addEventListener("click", function (event) {
            event.stopPropagation();

            const card = this.closest(".video-card");
            if (!card) {
                return;
            }

            const placeholder = card.querySelector(".video-placeholder");
            if (!placeholder) {
                return;
            }

            const seekTime = parseTimestampToSeconds(this.textContent);
            openVideoAtTime(placeholder, seekTime);
        });

        timestamp.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                this.click();
            }
        });
    });
}