// ===== Mobile Nav Bar Show | Hide =====
const hamburgerBar = document.querySelector("#hamburger-icon");
const navBar = document.querySelector("nav ul");

hamburgerBar.addEventListener("click", () => {
    if (navBar.classList.contains("show")) {
        hamburgerBar.style.color = "white";
        navBar.classList.remove("show");
    } else {
        hamburgerBar.style.color = "rgb(84, 207, 255)"
        navBar.classList.add("show");
    }
});

