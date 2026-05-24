renderSidebar("exercises");

const API_URL = "https://localhost:7180/api/exercises";
const exerciseToken = localStorage.getItem("token");
const exerciseRole = localStorage.getItem("role");

let editingExerciseId = null;

// HIDE ADD BUTTON FOR USER

if (exerciseRole !== "Admin") {
    document.getElementById("addExerciseBtn").style.display = "none";
}

// MESSAGE

function showMessage(message, type) {
    const box = document.getElementById("messageBox");
    box.innerText = message;
    box.className = type;
    box.style.display = "block";
    setTimeout(() => { box.style.display = "none"; }, 3000);
}

// LOAD EXERCISES

async function loadExercises() {
    try {
        const response = await fetch(API_URL, {
            headers: { Authorization: `Bearer ${exerciseToken}` }
        });

        const exercises = await response.json();
        const tableBody = document.getElementById("exerciseTableBody");

        tableBody.innerHTML = "";
        exercises.forEach(exercise => {
            tableBody.innerHTML += `
                <tr>
                    <td>${exercise.name}</td>
                    <td>${exercise.caloriesBurnPerMinute}</td>
                    <td>
                        ${exerciseRole === "Admin" ? `
                            <button class="action-btn edit-btn"
                                onclick="openEditModal('${exercise.id}','${exercise.name}','${exercise.caloriesBurnPerMinute}')">
                                Edit
                            </button>
                            <button class="action-btn delete-btn"
                                onclick="deleteExercise('${exercise.id}')">
                                Delete
                            </button>
                        ` : ""}
                    </td>
                </tr>
            `;
        });
    }
    catch (error) {
        console.log(error);
    }
}

// OPEN ADD MODAL

function openAddModal() {
    editingExerciseId = null;
    document.getElementById("exerciseName").value = "";
    document.getElementById("exerciseCalories").value = "";
    document.getElementById("exerciseModal").style.display = "flex";
}

// OPEN EDIT MODAL

function openEditModal(id, name, calories) {
    editingExerciseId = id;
    document.getElementById("exerciseName").value = name;
    document.getElementById("exerciseCalories").value = calories;
    document.getElementById("exerciseModal").style.display = "flex";
}

// CLOSE MODAL

function closeModal() {
    document.getElementById("exerciseModal").style.display = "none";
}

// ADD / UPDATE EXERCISE

async function addExercise() {
    const name = document.getElementById("exerciseName").value;
    const caloriesBurnPerMinute = parseInt(document.getElementById("exerciseCalories").value);

    if (name.trim() === "") { showMessage("Exercise name is required", "error"); return; }
    if (isNaN(caloriesBurnPerMinute) || caloriesBurnPerMinute <= 0) {
        showMessage("Calories must be greater than 0", "error"); return;
    }

    let url = API_URL;
    let method = "POST";

    if (editingExerciseId) {
        url = `${API_URL}/${editingExerciseId}`;
        method = "PUT";
    }

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${exerciseToken}`
        },
        body: JSON.stringify({ name, caloriesBurnPerMinute })
    });

    if (response.ok) {
        showMessage(editingExerciseId ? "Exercise updated successfully" : "Exercise added successfully", "success");
        editingExerciseId = null;
        closeModal();
        loadExercises();
    }
}

// DELETE EXERCISE

async function deleteExercise(id) {
    if (!confirm("Delete this exercise?")) return;

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${exerciseToken}` }
    });

    if (response.ok) {
        showMessage("Exercise deleted successfully", "success");
        loadExercises();
    }
}
function searchExercises() {

    const keyword =
        document.getElementById(
            "exerciseSearch")
            .value
            .toLowerCase();

    const rows =
        document.querySelectorAll(
            "#exerciseTableBody tr");

    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();

        row.style.display =
            text.includes(keyword)
                ? ""
                : "none";
    });
}

// RUN

loadExercises();