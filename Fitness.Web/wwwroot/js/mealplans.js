renderSidebar("mealplans");

// HELPERS

function getToken() {
    return localStorage.getItem("token");
}

function handleUnauthorized(response) {
    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "../index.html";
        return true;
    }
    return false;
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}

// LOAD MEAL PLANS

async function loadMealPlans() {
    try {
        const response = await fetch(
            "https://localhost:7180/api/mealplans",
            { headers: { "Authorization": `Bearer ${getToken()}` } }
        );

        if (handleUnauthorized(response)) return;

        const meals = await response.json();
        const tableBody = document.getElementById("mealTableBody");

        let html = "";
        meals.forEach(meal => {
            let foodList = "";
            meal.foods.forEach(food => {
                foodList += `${food.foodName} (${food.quantity})<br>`;
            });

            html += `
                <tr>
                    <td>${new Date(meal.date).toLocaleDateString()}</td>
                    <td>${foodList}</td>
                    <td>${meal.totalCalories} kcal</td>
                    <td>
                        <button class="action-btn delete-btn" onclick="openDeleteModal('${meal.id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;
    }
    catch (error) {
        console.error("loadMealPlans error:", error);
    }
}

// LOAD FOODS DROPDOWN

async function loadFoods() {
    try {
        const response = await fetch(
            "https://localhost:7180/api/foods",
            { headers: { "Authorization": `Bearer ${getToken()}` } }
        );

        if (handleUnauthorized(response)) return;

        const foods = await response.json();
        const select = document.getElementById("foodSelect");

        let html = `<option value="" disabled selected>Select a food</option>`;
        foods.forEach(food => {
            html += `<option value="${food.id}" data-calories="${food.calories}" data-name="${food.name}">${food.name}</option>`;
        });

        select.innerHTML = html;
    }
    catch (error) {
        console.error("loadFoods error:", error);
    }
}

// MEAL ITEMS

let mealItems = [];

function addMealItem() {
    const select = document.getElementById("foodSelect");
    const foodId = select.value;
    const foodName = select.options[select.selectedIndex]?.text;
    const calories = Number(select.options[select.selectedIndex]?.dataset.calories);
    const quantity = Number(document.getElementById("foodQuantity").value);

    if (!foodId) { alert("Please select a food."); return; }
    if (!quantity || quantity < 1) { alert("Please enter a valid quantity."); return; }

    const existing = mealItems.find(x => x.foodId === foodId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        mealItems.push({ foodId, foodName, calories, quantity });
    }

    renderMealItems();
}

function removeMealItem(foodId) {
    mealItems = mealItems.filter(x => x.foodId !== foodId);
    renderMealItems();
}

function renderMealItems() {
    const tbody = document.getElementById("mealItemsBody");
    let html = "";

    mealItems.forEach(item => {
        html += `
            <tr>
                <td>${item.foodName}</td>
                <td>${item.quantity}</td>
                <td>${item.calories * item.quantity} kcal</td>
                <td>
                    <button class="action-btn delete-btn" onclick="removeMealItem('${item.foodId}')">Remove</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// OPEN / CLOSE MODAL

function openModal() {
    mealItems = [];
    renderMealItems();
    document.getElementById("mealDate").value = "";
    document.getElementById("mealModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("mealModal").style.display = "none";
}

// SAVE MEAL PLAN

async function saveMealPlan() {
    const date = document.getElementById("mealDate").value;

    if (!date) { alert("Please select a date."); return; }
    if (mealItems.length === 0) { alert("Please add at least one food."); return; }

    try {
        const response = await fetch(
            "https://localhost:7180/api/mealplans",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    date,
                    items: mealItems.map(x => ({ foodId: x.foodId, quantity: x.quantity }))
                })
            }
        );

        if (handleUnauthorized(response)) return;

        if (response.ok) {
            closeModal();
            loadMealPlans();
        } else {
            const err = await response.text();
            alert(err || "Failed to add meal plan.");
        }
    }
    catch (error) {
        console.error("saveMealPlan error:", error);
    }
}

// DELETE MODAL

function openDeleteModal(id) {
    document.getElementById("deleteMealId").value = id;
    document.getElementById("deleteModal").style.display = "flex";
}

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
}

async function confirmDeleteMeal() {
    const id = document.getElementById("deleteMealId").value;

    try {
        const response = await fetch(
            `https://localhost:7180/api/mealplans/${id}`,
            {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${getToken()}` }
            }
        );

        if (handleUnauthorized(response)) return;
        if (response.ok) { closeDeleteModal(); loadMealPlans(); }
        else { alert("Failed to delete meal plan."); }
    }
    catch (error) {
        console.error("confirmDeleteMeal error:", error);
    }
}

// CLOSE MODAL WHEN CLICK OUTSIDE

window.onclick = function (event) {
    const mealModal = document.getElementById("mealModal");
    const deleteModal = document.getElementById("deleteModal");
    if (event.target === mealModal) closeModal();
    if (event.target === deleteModal) closeDeleteModal();
};

// RUN

loadMealPlans();
loadFoods();