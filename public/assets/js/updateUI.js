async function UpdateUI () {

    const nameDisplay = document.querySelector("#username-display");
    const logIn = document.querySelector("#authentication");
    const logOut = document.querySelector("#logout");

    // Check if login, update UI
    try {
        const res = await fetch("https://reycademy.onrender.com/session", {
            method: "POST",
            headers: {"Content-Type":"application/json",
                      "Authorization": `Bearer ${localStorage.getItem("token")}`}
        })

        const result = await res.json();
        
        // If loggedIn value is true then update UI
        if (result.loggedIn) {
            nameDisplay.textContent = result.username;
            if (logOut.classList.contains("show") && logIn.classList.contains("hide")) {
                logIn.classList.remove("hide");
                logOut.classList.remove("show");      
            } else {
                logIn.classList.add("hide");
                logOut.classList.add("show");
            }
        }
    } catch (err) {
        console.log("Something went wrong :(");
        console.log(err);
    }
}

// Function for logout
async function logOut() {
    // Simply remove the token
    localStorage.removeItem("token");
    UpdateUI();
};
document.getElementById("logout").addEventListener("click", logOut);
