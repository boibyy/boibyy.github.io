document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('header nav');

    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        nav.classList.toggle('show');
    });
});
