// ==========================================
// EASY UPDATE: FUNDRAISER
// ==========================================
const currentRaised = 60;
const goal = 2000;

// ==========================================
// EASY UPDATE: HIKE VIDEO LINKS
// Leave blank "" to grey the button out.
// ==========================================
const hikeVideos = {
    snowdon: "https://youtube.com/shorts/6Gty9ftO-uo",
    scafell: "",
    bennevis: ""
};

// ==========================================
// EASY UPDATE: VIDEO GALLERY
// Newest first. Leave blank urls out.
// ==========================================
const galleryVideos = [
    {
        title: "Snowdon",
        url: "https://youtube.com/shorts/6Gty9ftO-uo"
    },
    {
        title: "Challenge Intro",
        url: "https://www.youtube.com/shorts/nyoPz9B5pNw"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const progressBar = document.getElementById("progress-bar");
    const raisedAmount = document.getElementById("raised-amount");
    const progressPercent = document.getElementById("progress-percent");
    const tracker = document.getElementById("tracker-progress");
    const progressMarker = document.getElementById("progress-marker");
    const progressBadge = document.getElementById("progress-badge");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const percentage = Math.min((currentRaised / goal) * 100, 100);
    const gbp = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0
    });

    if (tracker) {
        tracker.setAttribute("aria-valuenow", currentRaised);
    }

    const updateMarkerPosition = (percent) => {
        if (!progressMarker) return;

        progressMarker.style.bottom = `${percent}%`;

        if (percent > 72) {
            progressMarker.style.transform = "translateY(110%)";
        } else {
            progressMarker.style.transform = "translateY(50%)";
        }
    };

    if (reducedMotion) {
        if (progressBar) progressBar.style.height = `${percentage}%`;
        if (raisedAmount) raisedAmount.textContent = gbp.format(currentRaised);
        if (progressBadge) progressBadge.textContent = gbp.format(currentRaised);
        if (progressPercent) progressPercent.textContent = `${Math.round(percentage)}% of goal`;
        updateMarkerPosition(percentage);
        document.querySelectorAll(".fade-in").forEach((el) => el.classList.add("visible"));
    } else {
        setTimeout(() => {
            if (progressBar) progressBar.style.height = `${percentage}%`;
            updateMarkerPosition(percentage);
        }, 250);

        animateValue(raisedAmount, 0, currentRaised, 1200, (value) => gbp.format(value));
        animateValue(progressBadge, 0, currentRaised, 1200, (value) => gbp.format(value));
        animateValue(progressPercent, 0, Math.round(percentage), 1200, (value) => `${value}% of goal`);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        });

        document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    }

    const videoModal = document.getElementById("video-modal");
    const closeVideoModal = document.getElementById("close-video-modal");
    const videoModalBackdrop = document.getElementById("video-modal-backdrop");
    const videoFrame = document.getElementById("video-frame");
    const videoModalTitle = document.getElementById("video-modal-title");

    const openModal = (url, title = "Hike video") => {
        if (!videoModal || !videoFrame) return;
        videoModal.classList.add("is-open");
        videoModal.setAttribute("aria-hidden", "false");
        videoFrame.src = toEmbedUrl(url, true);
        if (videoModalTitle) videoModalTitle.textContent = title;
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        if (!videoModal || !videoFrame) return;
        videoModal.classList.remove("is-open");
        videoModal.setAttribute("aria-hidden", "true");
        videoFrame.src = "";
        document.body.style.overflow = "";
    };

    if (closeVideoModal) closeVideoModal.addEventListener("click", closeModal);
    if (videoModalBackdrop) videoModalBackdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && videoModal && videoModal.classList.contains("is-open")) {
            closeModal();
        }
    });

    document.querySelectorAll(".peak-watch-btn").forEach((button) => {
        const hikeKey = button.dataset.hike;
        const url = hikeVideos[hikeKey];

        if (!url) {
            button.disabled = true;
            button.classList.add("is-disabled");
            return;
        }

        button.addEventListener("click", () => {
            const titleMap = {
                snowdon: "Snowdon",
                scafell: "Scafell Pike",
                bennevis: "Ben Nevis"
            };

            openModal(url, `${titleMap[hikeKey] || "Hike"} video`);
        });
    });

    const validGalleryVideos = galleryVideos.filter((video) => video.url && video.url.trim() !== "");
    const gallerySection = document.getElementById("videos");
    const galleryFrame = document.getElementById("gallery-video-frame");
    const galleryTitle = document.getElementById("gallery-video-title");
    const galleryMeta = document.getElementById("gallery-video-meta");
    const galleryPrev = document.getElementById("video-prev");
    const galleryNext = document.getElementById("video-next");

    let currentGalleryIndex = 0;

    const renderGallery = () => {
        if (!validGalleryVideos.length) {
            if (gallerySection) gallerySection.style.display = "none";
            return;
        }

        const currentVideo = validGalleryVideos[currentGalleryIndex];

        if (galleryFrame) galleryFrame.src = toEmbedUrl(currentVideo.url, false);
        if (galleryTitle) galleryTitle.textContent = currentVideo.title;
        if (galleryMeta) galleryMeta.textContent = `${currentGalleryIndex + 1} of ${validGalleryVideos.length}`;

        if (galleryPrev) galleryPrev.disabled = currentGalleryIndex === 0;
        if (galleryNext) galleryNext.disabled = currentGalleryIndex === validGalleryVideos.length - 1;
    };

    if (galleryPrev) {
        galleryPrev.addEventListener("click", () => {
            if (currentGalleryIndex > 0) {
                currentGalleryIndex -= 1;
                renderGallery();
            }
        });
    }

    if (galleryNext) {
        galleryNext.addEventListener("click", () => {
            if (currentGalleryIndex < validGalleryVideos.length - 1) {
                currentGalleryIndex += 1;
                renderGallery();
            }
        });
    }

    renderGallery();
});

function animateValue(element, start, end, duration, formatValue) {
    if (!element) return;

    const startTime = performance.now();

    function update(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(start + (end - start) * eased);

        element.textContent = formatValue(value);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function toEmbedUrl(url, autoplay = false) {
    const cleanUrl = (url || "").trim();
    if (!cleanUrl) return "";

    const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([^?&/]+)/i);
    const watchMatch = cleanUrl.match(/[?&]v=([^?&/]+)/i);
    const embedMatch = cleanUrl.match(/youtube(?:-nocookie)?\.com\/embed\/([^?&/]+)/i);
    const shortLinkMatch = cleanUrl.match(/youtu\.be\/([^?&/]+)/i);

    const videoId =
        (shortsMatch && shortsMatch[1]) ||
        (watchMatch && watchMatch[1]) ||
        (embedMatch && embedMatch[1]) ||
        (shortLinkMatch && shortLinkMatch[1]) ||
        cleanUrl;

    const params = autoplay ? "?autoplay=1&rel=0" : "?rel=0";
    return `https://www.youtube.com/embed/${videoId}${params}`;
}