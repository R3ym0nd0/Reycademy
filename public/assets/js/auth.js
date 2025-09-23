// Sign Up
const signup = document.querySelector("#signup");

if (signup) {
    signup.addEventListener("submit", async(e) => {
        e.preventDefault();

        const data = {
            firstName : signup.firstname.value,
            lastName : signup.lastname.value,
            username : signup.username.value,
            password : signup.password.value,
            confirmPassword : signup.confirmpassword.value
        }
        
        try {
            const result = await fetch("https://reycademy.onrender.com/register", {
                method : "POST",
                headers : {"Content-Type":"application/json"},
                body : JSON.stringify(data),
                credentials: "include"
            });
            
            const a = await result.json();

            if (a.registered) {
                window.location.href = "/login";
            } else {
                const err = document.querySelector("#error");
                const text = err.textContent = a.message;


                signup.password.value = "";
                signup.confirmpassword.value = "";
                err.innerHTML = "";
                err.append(text);
            };

        } catch (err) {
            console.log("Something went wrong");
            console.log(err);
        };
    });
}

// Login 
const form = document.querySelector("#login");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            username: form.username.value,
            password: form.password.value
        };

        try {
            const res = await fetch("https://reycademy.onrender.com/submit", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(data),
                credentials: "include"
            });

            const result = await res.json();
            console.log(result);
            const auth = document.querySelector("#auth");

            auth.innerHTML = "";

            const message = document.createElement("p");
            message.textContent = result.message;
            message.style.color = "rgb(168, 165, 165)";

            if (result.success) {
                window.location.href = "/";
            } else {
                form.username.value = "";
                form.password.value = "";
                auth.append(message);
            };
        } catch (err) {
            console.error(err);
        };
    });
}