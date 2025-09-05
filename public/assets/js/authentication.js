async function UpdateUI () {

    const nameDisplay = document.querySelector("#username-display");
    const logIn = document.querySelector("#authentication");
    const logOut = document.querySelector("#logout");

    // Check if login, update UI
    try {
        const res = await fetch("/session", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            credentials: "include"
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
async function logOut () {

    try {
        const res = await fetch("/logout", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            credentials: "include"
        });

        const result = await res.json();
        
        console.log(result);
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