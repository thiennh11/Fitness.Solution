async function login() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");

    message.innerText = "";

    if (email === "" || password === "") {

        message.style.color = "#e53935";

        message.innerText =
            "Please enter email and password";

        return;
    }

    try {

        const response = await fetch(
            "https://localhost:7180/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

        if (response.ok) {

            const data =
                await response.json();

            localStorage.setItem(
                "token",
                data.token);

            localStorage.setItem(
                "role",
                data.role);

            message.style.color = "#43a047";

            message.innerText =
                "Login successful";

            setTimeout(() => {

                window.location.href =
                    "pages/dashboard.html";

            }, 1000);
        }
        else {

            message.style.color = "#e53935";

            message.innerText =
                "Invalid email or password";
        }
    }
    catch (error) {

        console.log(error);

        message.style.color = "#e53935";

        message.innerText =
            "Cannot connect to server";
    }
}

// ENTER KEY

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            login();
        }
    }
);

// TOGGLE PASSWORD

function togglePassword() {

    const passwordInput =
        document.getElementById(
            "password"
        );

    const icon =
        document.querySelector(
            ".toggle-password"
        );

    if (
        passwordInput.type ===
        "password"
    ) {

        passwordInput.type = "text";

        icon.innerText =
            "visibility_off";
    }
    else {

        passwordInput.type =
            "password";

        icon.innerText =
            "visibility";
    }
}