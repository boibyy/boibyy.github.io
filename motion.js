let motionEnabled = true;

function toggleMotion() {
    motionEnabled = !motionEnabled;
    const img = document.querySelector('.bouncy-image');

    if (!motionEnabled) {
        img.style.animation = 'none';
        document.getElementById('motion-toggle').innerText = 'Enable Motion';
    } else {
        img.style.animation = '';
        document.getElementById('motion-toggle').innerText = 'Reduce Motion';
    }
}

// Respect system prefers-reduced-motion by default
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    motionEnabled = false;
    const img = document.querySelector('.bouncy-image');
    if (img) img.style.animation = 'none';
    const btn = document.getElementById('motion-toggle');
    if (btn) btn.innerText = 'Enable Motion';
}