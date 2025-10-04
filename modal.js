function openModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
    document.body.style.overflow = "";
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeModal();
    }
});

document.addEventListener("DOMContentLoaded", function() {
        const modal = document.getElementById("modal");
        modal.style.display = "none"; 
        document.body.style.overflow = ""; 
});

