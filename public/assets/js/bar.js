// ===== Mobile Nav Bar Show | Hide =====
const hamburgerBar = document.querySelector("#hamburger-icon");
const navBar = document.querySelector("nav ul");
const header = document.querySelector("header");

hamburgerBar.addEventListener("click", () => {
    if (navBar.classList.contains("show")) {
        hamburgerBar.style.color = "white";
        navBar.classList.remove("show");
        header.style.backgroundColor = "rgba(5, 25, 40, 0.9)";
    } else {
        hamburgerBar.style.color = "rgb(84, 207, 255)"
        navBar.classList.add("show");
        header.style.backgroundColor = "rgba(5, 25, 40, 0.9)";

    }
});

// ===== Side Bar Show | Hide =====
const hideSideBar = document.querySelector("#hide-sideBar");
const sideBar = document.querySelector("#sidebar");
const profile = document.querySelector("#profile")

profile.addEventListener("click", () => {
    sideBar.classList.add("show");
    navBar.classList.remove("show");
    header.style.backgroundColor = "rgb(13, 27, 53)";
    hamburgerBar.style.color = "white";

    hideSideBar.addEventListener("click", () => {
        sideBar.classList.remove("show"); 
    }); 
    
});