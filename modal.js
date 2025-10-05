(function () {
    function openModal(id = "modal") {
        const modal = document.getElementById(id);
        if (!modal) {
            console.warn(`openModal(): Modal with id "${id}" not found.`);
            return;
        }
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal(id = "modal") {
        const modal = document.getElementById(id);
        if (!modal) {
            console.warn(`closeModal(): Modal with id "${id}" not found.`);
            return;
        }
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            document.querySelectorAll(".modal").forEach(modal => {
                modal.style.display = "none";
                modal.setAttribute("aria-hidden", "true");
            });
            document.body.style.overflow = "";
        }
    });

    document.addEventListener("click", function (e) {
        const modals = document.querySelectorAll(".modal");
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = "none";
                modal.setAttribute("aria-hidden", "true");
                document.body.style.overflow = "";
            }
        });
    });

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".modal").forEach(modal => {
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true");
        });
    });

    window.openModal = openModal;
    window.closeModal = closeModal;
})();
