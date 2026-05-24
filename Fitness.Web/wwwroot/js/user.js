renderSidebar("users");

const role = localStorage.getItem("role");

if (role !== "Admin") {
    window.location.href = "../index.html";
}

let allUsers = [];

// MESSAGE

function showMessage(message, type) {
    const box = document.getElementById("messageBox");
    box.innerText = message;
    box.className = type;
    box.style.display = "block";
    setTimeout(() => { box.style.display = "none"; }, 3000);
}

// LOAD USERS

async function loadUsers() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            "https://localhost:7180/api/users",
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) { showMessage("Failed to load users", "error"); return; }

        allUsers = await response.json();
        renderUsers(allUsers);
    }
    catch (error) {
        console.log(error);
        showMessage("Cannot connect to server", "error");
    }
}

// RENDER USERS

function renderUsers(users) {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";

    users.forEach(user => {
        let bmi = "N/A";
        if (user.height > 0) {
            bmi = (user.weight / ((user.height / 100) * (user.height / 100))).toFixed(2);
        }

        tableBody.innerHTML += `
            <tr>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.weight}</td>
                <td>${user.height}</td>
                <td>${bmi}</td>
                <td>${user.role}</td>
                <td>
                    <button class="action-btn delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

// SEARCH

function searchUsers() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const filteredUsers = allUsers.filter(user =>
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
    );
    renderUsers(filteredUsers);
}

// DELETE USER

async function deleteUser(id) {
    const token = localStorage.getItem("token");
    if (!confirm("Delete this user?")) return;

    try {
        const response = await fetch(
            `https://localhost:7180/api/users/${id}`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        if (response.ok) { showMessage("Deleted successfully", "success"); loadUsers(); }
        else { showMessage("Delete failed", "error"); }
    }
    catch (error) {
        console.log(error);
        showMessage("Cannot connect to server", "error");
    }
}

// RUN

loadUsers();