const currentRaised = 50;
const goal = 2000;

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

    tracker.setAttribute("aria-valuenow", currentRaised);

    const updateMarkerPosition = (percent) => {
        progressMarker.style.bottom = `${percent}%`;

        if (percent > 72) {
            progressMarker.style.transform = "translateY(110%)";
        } else {
            progressMarker.style.transform = "translateY(50%)";
        }
    };

    if (reducedMotion) {
        progressBar.style.height = `${percentage}%`;
        raisedAmount.textContent = gbp.format(currentRaised);
        progressBadge.textContent = gbp.format(currentRaised);
        progressPercent.textContent = `${Math.round(percentage)}% of goal`;
        updateMarkerPosition(percentage);
        document.querySelectorAll(".fade-in").forEach((el) => el.classList.add("visible"));
        return;
    }

    setTimeout(() => {
        progressBar.style.height = `${percentage}%`;
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
});

function animateValue(element, start, end, duration, formatValue) {
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
