window.addEventListener("DOMContentLoaded", () => {
    const ageModal = document.getElementById("age-modal");
    const skipModal = document.getElementById("age-skip-confirm");

    const continueBtn = document.getElementById("age-continue-btn");
    const skipBtn = document.getElementById("age-skip-btn");

    const backBtn = document.getElementById("age-skip-back-btn");
    const okBtn = document.getElementById("age-skip-ok-btn");

    // Auto-open modal after page loads
    setTimeout(() => {
        ageModal.style.display = "flex";
    }, 500);

    // Navigate to ageverify page
    continueBtn.addEventListener("click", () => {
        window.location.href = "https://boiby.dev/ageverify";
    });

    // Skip button → confirmation modal
    skipBtn.addEventListener("click", () => {
        ageModal.style.display = "none";
        skipModal.style.display = "flex";
    });

    // Back → return to original modal
    backBtn.addEventListener("click", () => {
        skipModal.style.display = "none";
        ageModal.style.display = "flex";
    });

    // OK → allow access but mark as restricted
    okBtn.addEventListener("click", () => {
        skipModal.style.display = "none";
        // Optional: set a cookie so the modal doesn’t reappear
        document.cookie = "ageRestricted=true; path=/;";
    });

    // Clicking outside closes nothing (prevents bypass)
});
