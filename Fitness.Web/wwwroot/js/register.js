const API_URL =
    "https://localhost:7180/api/auth/register";

// SHOW MESSAGE

function showMessage(
    message,
    type
) {

    const box =
        document.getElementById(
            "messageBox"
        );

    box.innerText =
        message;

    box.className =
        type;

    box.style.display =
        "block";
}

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

        passwordInput.type =
            "text";

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

// REGISTER

// REGISTER

async function register() {

    const fullName =
        document.getElementById(
            "fullName"
        ).value;

    const email =
        document.getElementById(
            "email"
        ).value;

    const password =
        document.getElementById(
            "password"
        ).value;

    const gender =
        document.getElementById(
            "gender"
        ).value;

    const weight =
        document.getElementById(
            "weight"
        ).value;

    const height =
        document.getElementById(
            "height"
        ).value;

    const age =
        document.getElementById(
            "age"
        ).value;

    if (
        !fullName
        || !email
        || !password
        || !gender
        || !weight
        || !height
        || !age
    ) {

        showMessage(
            "Please fill all fields",
            "error"
        );

        return;
    }

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        fullName:
                            fullName,

                        email:
                            email,

                        password:
                            password,

                        gender:
                            gender,

                        weight:
                            Number(weight),

                        height:
                            Number(height),

                        age:
                            Number(age)
                    })
                });

        if (response.ok) {

            showMessage(
                "Register successful",
                "success"
            );

            setTimeout(() => {

                window.location.href =
                    "../index.html";

            }, 1500);
        }
        else {

            const error =
                await response.text();

            showMessage(
                error,
                "error"
            );
        }
    }
    catch (error) {

        console.log(error);

        showMessage(
            "Cannot connect to server",
            "error"
        );
    }
}