async function UpdateUI () {

    const nameDisplay = document.querySelector("#username-display");
    const logInButton = document.querySelector("#login-button");
    const profile = document.querySelector("#profile-container");

    // Check if login, update UI
    try {
        const res = await fetch("https://reycademy.onrender.com/session", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            credentials: "include"
        })

        const result = await res.json();
        
        // If loggedIn value is true then update UI
        if (result.loggedIn) {
            nameDisplay.textContent = result.username;
            logInButton.classList.remove("show");
            profile.classList.add("show");
        } else {
            logInButton.classList.add("show");
            profile.classList.remove("show");
        }
    } catch (err) {
        console.log("Something went wrong :(");
        console.log(err);
    }
}

// Function for logout
async function logOut () {

    try {
        const res = await fetch("https://reycademy.onrender.com/logout", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            credentials: "include"
        });

        const result = await res.json();
        
        if (result.success) {
            console.log(result.message);
        } else {
            console.log(result.message)
        };  

    } catch (err) {
        console.log("Something went wrong :(");
        console.log(err);
    }
};

UpdateUI();
document.getElementById("logout").addEventListener("click", logOut);