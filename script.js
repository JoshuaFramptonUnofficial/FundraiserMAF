const currentRaised = 60;
const goal = 2000;

document.addEventListener("DOMContentLoaded", () => {
    const progressBar = document.getElementById("progress-bar");
    const raisedAmount = document.getElementById("raised-amount");
    const progressPercent = document.getElementById("progress-percent");
    const tracker = document.getElementById("tracker-progress");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const percentage = Math.min((currentRaised / goal) * 100, 100);
    const gbp = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0
    });

    tracker.setAttribute("aria-valuenow", currentRaised);

    if (reducedMotion) {
        progressBar.style.width = `${percentage}%`;
        raisedAmount.textContent = gbp.format(currentRaised);
        progressPercent.textContent = `${Math.round(percentage)}% funded`;
        document.querySelectorAll(".fade-in").forEach((el) => el.classList.add("visible"));
        return;
    }

    setTimeout(() => {
        progressBar.style.width = `${percentage}%`;
    }, 250);

    animateValue(raisedAmount, 0, currentRaised, 1200, (value) => gbp.format(value));
    animateValue(progressPercent, 0, Math.round(percentage), 1200, (value) => `${value}% funded`);

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
