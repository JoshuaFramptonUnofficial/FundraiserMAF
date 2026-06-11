// ==========================================
// EASY UPDATE: CHANGE THIS VARIABLE HERE
// ==========================================
const currentRaised = 60; 
const goal = 2000;
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // Thermometer Animation
    const progressBar = document.getElementById("progress-bar");
    
    setTimeout(() => {
        // Calculate percentage (caps at 100% so it doesn't break the UI if you exceed the goal)
        const percentage = Math.min((currentRaised / goal) * 100, 100);
        progressBar.style.width = percentage + "%";
    }, 500);

    // Clean Scroll Fade-In Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // Apply observer to all elements with the 'fade-in' class
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});