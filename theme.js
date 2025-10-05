function toggleTheme() {
    const body = document.body;
    const toggleBtn = document.getElementById('theme-toggle');
    let newTheme;

    if (body.classList.contains('dark')) {
        newTheme = 'light';
        toggleBtn.textContent = 'Switch to Dark Mode';
    } else {
        newTheme = 'dark';
        toggleBtn.textContent = 'Switch to Light Mode';
    }

    body.classList.remove('light', 'dark', 'auto');
    body.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
}

// Update button text on load
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    const toggleBtn = document.getElementById('theme-toggle');
    toggleBtn.textContent = savedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
});