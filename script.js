// ==========================================
// EASY UPDATE: FUNDRAISER
// ==========================================
const currentRaised = 95;
const goal = 2000;

// ==========================================
// EASY UPDATE: NEXT NOTIFICATION
//
// enabled: false = grey bell, no shaking, cannot open.
// enabled: true = blue bell, unread dot, gentle shake.
//
// target: Use local UK time in YYYY-MM-DDTHH:MM format.
// Update title, message, and target for each next hike.
// ==========================================
const fundraiserNotification = {
    enabled: true,
    title: "Bonus Yorkshire 3 Peaks",
    message: "On 18 July, I’m taking on an extra challenge, the Yorkshire 3 Peaks: Pen-y-Ghent, Whernside, and Ingleborough.",
    target: "2026-07-18T10:00",
    dateLabel: "Saturday 18 July 2026"
};


// ==========================================
// EASY UPDATE: ALL VIDEOS, OLDEST TO NEWEST
// Leave url blank "" to disable that hike button.
// ==========================================
const videos = [
    {
        key: "intro",
        title: "Challenge Intro",
        url: "https://www.youtube.com/shorts/nyoPz9B5pNw"
    },
	{
        key: "issac",
        title: "Issac & MAF UK",
        url: "https://www.youtube.com/watch?v=MApBRFexRIA"
    },
    {
        key: "snowdon",
        title: "Snowdon",
        url: "https://youtube.com/shorts/6Gty9ftO-uo"
    },
    {
        key: "scafell",
        title: "Scafell Pike",
        url: ""
    },
    {
        key: "bennevis",
        title: "Ben Nevis",
        url: ""
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

    const validVideos = videos.filter((video) => video.url && video.url.trim() !== "");
    const openVideoGallery = document.getElementById("open-video-gallery");
    const videoModal = document.getElementById("video-modal");
    const closeVideoModal = document.getElementById("close-video-modal");
    const videoModalBackdrop = document.getElementById("video-modal-backdrop");
    const videoFrame = document.getElementById("video-frame");
    const videoModalTitle = document.getElementById("video-modal-title");
    const videoModalPrev = document.getElementById("video-modal-prev");
    const videoModalNext = document.getElementById("video-modal-next");

    let currentVideoIndex = 0;

    const renderModalVideo = () => {
        if (!validVideos.length || !videoFrame) return;

        const currentVideo = validVideos[currentVideoIndex];
        videoFrame.src = toEmbedUrl(currentVideo.url, true);

        if (videoModalTitle) {
            videoModalTitle.textContent = currentVideo.title;
        }

        if (videoModalPrev) {
            videoModalPrev.disabled = currentVideoIndex === 0;
        }

        if (videoModalNext) {
            videoModalNext.disabled = currentVideoIndex === validVideos.length - 1;
        }
    };

    const openModalAtIndex = (index) => {
        if (!validVideos.length || !videoModal) return;

        currentVideoIndex = Math.max(0, Math.min(index, validVideos.length - 1));
        videoModal.classList.add("is-open");
        videoModal.setAttribute("aria-hidden", "false");
        renderModalVideo();
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        if (!videoModal || !videoFrame) return;

        videoModal.classList.remove("is-open");
        videoModal.setAttribute("aria-hidden", "true");
        videoFrame.src = "";
        document.body.style.overflow = "";
    };

    if (openVideoGallery) {
        if (validVideos.length) {
            openVideoGallery.addEventListener("click", () => openModalAtIndex(0));
        } else {
            openVideoGallery.disabled = true;
        }
    }

    if (videoModalPrev) {
        videoModalPrev.addEventListener("click", () => {
            if (currentVideoIndex > 0) {
                currentVideoIndex -= 1;
                renderModalVideo();
            }
        });
    }

    if (videoModalNext) {
        videoModalNext.addEventListener("click", () => {
            if (currentVideoIndex < validVideos.length - 1) {
                currentVideoIndex += 1;
                renderModalVideo();
            }
        });
    }

    if (closeVideoModal) {
        closeVideoModal.addEventListener("click", closeModal);
    }

    if (videoModalBackdrop) {
        videoModalBackdrop.addEventListener("click", closeModal);
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && videoModal && videoModal.classList.contains("is-open")) {
            closeModal();
        }
    });

    document.querySelectorAll(".peak-watch-btn, .issac-video-btn").forEach((button) => {
        const hikeKey = button.dataset.hike;
        const matchingIndex = validVideos.findIndex((video) => video.key === hikeKey);

        if (matchingIndex === -1) {
            button.disabled = true;
            button.classList.add("is-disabled");
            return;
        }

        button.addEventListener("click", () => {
            openModalAtIndex(matchingIndex);
        });
    });
	    const notificationTrigger = document.getElementById("notification-trigger");
    const notificationModal = document.getElementById("notification-modal");
    const notificationModalBackdrop = document.getElementById("notification-modal-backdrop");
    const closeNotificationButton = document.getElementById("close-notification-modal");
    const notificationTitle = document.getElementById("notification-title");
    const notificationMessage = document.getElementById("notification-message");
    const notificationDate = document.getElementById("notification-date");
    const countdownDays = document.getElementById("countdown-days");
    const countdownHours = document.getElementById("countdown-hours");
    const countdownMinutes = document.getElementById("countdown-minutes");
    let notificationTimer;
	const notificationScrollButton = document.getElementById("notification-scroll-btn");

    const formatCountdownNumber = (number) => String(number).padStart(2, "0");

    const updateCountdown = () => {
        if (!fundraiserNotification.enabled) return;

        const now = new Date();
        const target = new Date(fundraiserNotification.target);
        const difference = target.getTime() - now.getTime();

        if (difference <= 0) {
            if (countdownDays) countdownDays.textContent = "00";
            if (countdownHours) countdownHours.textContent = "00";
            if (countdownMinutes) countdownMinutes.textContent = "00";
            return;
        }

        const totalMinutes = Math.floor(difference / 60000);
        const days = Math.floor(totalMinutes / 1440);
        const hours = Math.floor((totalMinutes % 1440) / 60);
        const minutes = totalMinutes % 60;

        if (countdownDays) countdownDays.textContent = formatCountdownNumber(days);
        if (countdownHours) countdownHours.textContent = formatCountdownNumber(hours);
        if (countdownMinutes) countdownMinutes.textContent = formatCountdownNumber(minutes);
    };

    const openNotificationModal = () => {
        if (!fundraiserNotification.enabled || !notificationModal) return;

        notificationModal.classList.add("is-open");
        notificationModal.setAttribute("aria-hidden", "false");
        notificationTrigger.setAttribute("aria-expanded", "true");
        notificationTrigger.classList.remove("is-unread");
        document.body.style.overflow = "hidden";

        updateCountdown();
    };

    const closeNotificationModal = () => {
        if (!notificationModal) return;

        notificationModal.classList.remove("is-open");
        notificationModal.setAttribute("aria-hidden", "true");
        notificationTrigger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    };

    if (notificationTrigger) {
        if (fundraiserNotification.enabled) {
            notificationTrigger.classList.add("has-notification", "is-unread");
            notificationTrigger.disabled = false;

            if (notificationTitle) {
                notificationTitle.textContent = fundraiserNotification.title;
            }

            if (notificationMessage) {
                notificationMessage.textContent = fundraiserNotification.message;
            }

            if (notificationDate) {
                notificationDate.textContent = fundraiserNotification.dateLabel;
            }

            updateCountdown();
            notificationTimer = window.setInterval(updateCountdown, 30000);

            notificationTrigger.addEventListener("click", openNotificationModal);
        } else {
            notificationTrigger.classList.remove("has-notification", "is-unread");
            notificationTrigger.disabled = true;
            notificationTrigger.setAttribute("aria-label", "No fundraiser notifications");
        }
    }

    if (closeNotificationButton) {
    closeNotificationButton.addEventListener("click", closeNotificationModal);
}

    if (notificationModalBackdrop) {
        notificationModalBackdrop.addEventListener("click", closeNotificationModal);
    }
	
	if (notificationScrollButton) {
    notificationScrollButton.addEventListener("click", () => {
        closeNotificationModal();
    });
}

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            notificationModal &&
            notificationModal.classList.contains("is-open")
        ) {
            closeNotificationModal();
        }
    });
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
