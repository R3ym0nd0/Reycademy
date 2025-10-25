document.addEventListener("DOMContentLoaded", () => {
  const nameDisplay = document.querySelector("#username-display");
  const logInButton = document.querySelector("#login-button");
  const profile = document.querySelector("#profile-container");
  const logoutBtn = document.getElementById("logout");

  logInButton.classList.add("show");
  profile.classList.remove("show");

  function popUp() {
    const popUp = document.getElementById("cookie-consent");
    const popUpButton = document.getElementById("pop-up-button");

    popUp.style.display = "flex";

    popUpButton.addEventListener("click", async () => {
      try {
        const res = await fetch('https://reycademy.onrender.com/accept-terms', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include'
        });
        const result = await res.json();
        if (result.success) {
          popUp.style.display = "none";
        } 
      } catch (err) {
        console.log("Fetch error:", err);
      }
    });
  }

  async function UpdateUI() {
    try {
      const res = await fetch("https://reycademy.onrender.com/session", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include"
      });

      const result = await res.json();

      if (result.loggedIn) {
        nameDisplay.textContent = result.username;
        logInButton.classList.remove("show");
        profile.classList.add("show");

        if (!result.termsAccepted) {
          popUp()
        };
      }
    } catch (err) {
      console.log("Something went wrong :(", err);
    }
  }

  async function logOut() {
    try {
      const res = await fetch("https://reycademy.onrender.com/logout", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include"
      });
      const result = await res.json();
      console.log(result.message);
      UpdateUI();
    } catch (err) {
      console.log("Something went wrong :(", err);
    }
  }

  logoutBtn.addEventListener("click", logOut);
  UpdateUI();
});
