renderSidebar("foods");

const role = localStorage.getItem("role");

// HIDE ADD BUTTON FOR USER

document.addEventListener("DOMContentLoaded", () => {
    if (role !== "Admin") {
        const addBtn = document.getElementById("addFoodBtn");
        if (addBtn) addBtn.style.display = "none";
    }
});

// HELPERS

function getToken() {
    return localStorage.getItem("token");
}

function handleUnauthorized(response) {
    if (response.status === 401) {
        localStorage.clear();
        window.location.href = "../index.html";
        return true;
    }
    return false;
}

// LOAD FOODS

async function loadFoods() {
    try {
        const response = await fetch(
            "https://localhost:7180/api/foods",
            { headers: { "Authorization": `Bearer ${getToken()}` } }
        );

        if (handleUnauthorized(response)) return;

        const foods = await response.json();
        const tableBody = document.getElementById("foodTableBody");

        let html = "";
        foods.forEach(food => {
            html += `
                <tr>
                    <td>${food.name}</td>
                    <td>${food.calories}</td>
                    <td>${food.protein}</td>
                    <td>${food.carbs}</td>
                    <td>${food.fat}</td>
                    <td>
                        ${role === "Admin" ? `
                            <button class="action-btn edit-btn" onclick="openEditModal('${food.id}')">Edit</button>
                            <button class="action-btn delete-btn" onclick="openDeleteModal('${food.id}')">Delete</button>
                        ` : ""}
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;
    }
    catch (error) {
        console.error("loadFoods error:", error);
    }
}

// OPEN ADD MODAL

function openAddModal() {
    document.getElementById("foodModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("foodModal").style.display = "none";
}

// ADD FOOD

async function addFood() {
    const name = document.getElementById("foodName").value.trim();
    const calories = document.getElementById("foodCalories").value;
    const protein = document.getElementById("foodProtein").value;
    const carbs = document.getElementById("foodCarbs").value;
    const fat = document.getElementById("foodFat").value;

    if (!name) { alert("Please enter food name"); return; }

    try {
        const response = await fetch(
            "https://localhost:7180/api/foods",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    name,
                    calories: Number(calories),
                    protein: Number(protein),
                    carbs: Number(carbs),
                    fat: Number(fat)
                })
            }
        );

        if (handleUnauthorized(response)) return;
        if (response.ok) { closeModal(); loadFoods(); }
    }
    catch (error) {
        console.error("addFood error:", error);
    }
}

// OPEN EDIT MODAL

async function openEditModal(id) {
    try {
        const response = await fetch(
            `https://localhost:7180/api/foods/${id}`,
            { headers: { "Authorization": `Bearer ${getToken()}` } }
        );

        if (handleUnauthorized(response)) return;

        const food = await response.json();

        document.getElementById("editFoodId").value = food.id;
        document.getElementById("editFoodName").value = food.name;
        document.getElementById("editCalories").value = food.calories;
        document.getElementById("editProtein").value = food.protein;
        document.getElementById("editCarbs").value = food.carbs;
        document.getElementById("editFat").value = food.fat;
        document.getElementById("editModal").style.display = "flex";
    }
    catch (error) {
        console.error("openEditModal error:", error);
    }
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

// UPDATE FOOD

async function updateFood() {
    const id = document.getElementById("editFoodId").value;
    const name = document.getElementById("editFoodName").value;
    const calories = Number(document.getElementById("editCalories").value);
    const protein = Number(document.getElementById("editProtein").value);
    const carbs = Number(document.getElementById("editCarbs").value);
    const fat = Number(document.getElementById("editFat").value);

    try {
        const response = await fetch(
            `https://localhost:7180/api/foods/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify({ id, name, calories, protein, carbs, fat })
            }
        );

        if (handleUnauthorized(response)) return;
        if (response.ok) { closeEditModal(); loadFoods(); }
    }
    catch (error) {
        console.error("updateFood error:", error);
    }
}

// DELETE MODAL

function openDeleteModal(id) {
    document.getElementById("deleteFoodId").value = id;
    document.getElementById("deleteModal").style.display = "flex";
}

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
}

async function confirmDeleteFood() {
    const id = document.getElementById("deleteFoodId").value;

    try {
        const response = await fetch(
            `https://localhost:7180/api/foods/${id}`,
            {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${getToken()}` }
            }
        );

        if (handleUnauthorized(response)) return;
        if (response.ok) { closeDeleteModal(); loadFoods(); }
    }
    catch (error) {
        console.error("deleteFood error:", error);
    }
}
function searchFoods() {

    const keyword =
        document.getElementById(
            "foodSearch")
            .value
            .toLowerCase();

    const rows =
        document.querySelectorAll(
            "#foodTableBody tr");

    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();

        row.style.display =
            text.includes(keyword)
                ? ""
                : "none";
    });
}

// CLOSE MODAL WHEN CLICK OUTSIDE

window.onclick = function (event) {
    const foodModal = document.getElementById("foodModal");
    const editModal = document.getElementById("editModal");
    const deleteModal = document.getElementById("deleteModal");

    if (event.target === foodModal) closeModal();
    if (event.target === editModal) closeEditModal();
    if (event.target === deleteModal) closeDeleteModal();
};

// RUN

loadFoods();