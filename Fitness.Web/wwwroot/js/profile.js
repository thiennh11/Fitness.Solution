renderSidebar("profile");

// PARSE JWT

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}

const token = localStorage.getItem("token");
if (!token) { window.location.href = "../index.html"; }

const role = localStorage.getItem("role");
const decodedToken = parseJwt(token);
const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

// LOAD PROFILE

async function loadProfile() {
    try {
        const userResponse = await fetch(
            `https://localhost:7180/api/users/${userId}`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (userResponse.status === 401) { logout(); return; }
        const user = await userResponse.json();

        const bmiResponse = await fetch(
            `https://localhost:7180/api/users/${userId}/bmi`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (bmiResponse.status === 401) { logout(); return; }
        const bmiData = await bmiResponse.json();

        document.getElementById("fullName").innerText = user.fullName;
        document.getElementById("email").innerText = user.email;
        document.getElementById("weight").innerText = user.weight + " kg";
        document.getElementById("height").innerText = user.height + " cm";
        document.getElementById("age").innerText = user.age;
        document.getElementById("bmi").innerText = bmiData.bmi;
        document.getElementById("bmiStatus").innerText = bmiData.status;

        if (role === "Admin") {
            const profileInfo = document.querySelector(".profile-info");
            if (profileInfo) profileInfo.style.display = "none";
        }
    }
    catch (error) {
        console.error("loadProfile error:", error);
    }
}

// OPEN EDIT MODAL

function openEditModal() {
    document.getElementById("editFullName").value =
        document.getElementById("fullName").innerText;

    if (role === "Admin") {
        document.getElementById("weightField").style.display = "none";
        document.getElementById("heightField").style.display = "none";
        document.getElementById("ageField").style.display = "none";
    } else {
        document.getElementById("weightField").style.display = "block";
        document.getElementById("heightField").style.display = "block";
        document.getElementById("ageField").style.display = "block";
        document.getElementById("editWeight").value =
            document.getElementById("weight").innerText.replace(" kg", "");
        document.getElementById("editHeight").value =
            document.getElementById("height").innerText.replace(" cm", "");
        document.getElementById("editAge").value =
            document.getElementById("age").innerText;
    }

    document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

// UPDATE PROFILE

async function updateProfile() {
    const fullName = document.getElementById("editFullName").value;
    const weight = document.getElementById("editWeight").value;
    const height = document.getElementById("editHeight").value;
    const age = document.getElementById("editAge").value;

    let bodyData = { fullName };
    if (role !== "Admin") {
        bodyData.weight = Number(weight);
        bodyData.height = Number(height);
        bodyData.age = Number(age);
    }

    try {
        const response = await fetch(
            `https://localhost:7180/api/users/${userId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(bodyData)
            }
        );

        if (response.status === 401) { logout(); return; }
        if (response.ok) { closeEditModal(); loadProfile(); }
    }
    catch (error) {
        console.error("updateProfile error:", error);
    }
}

// CLOSE MODAL OUTSIDE

window.onclick = function (event) {
    const editModal = document.getElementById("editModal");
    if (event.target === editModal) closeEditModal();
};

// RUN

loadProfile();