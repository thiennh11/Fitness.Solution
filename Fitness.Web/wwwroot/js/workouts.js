renderSidebar("workouts");

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

// LOAD WORKOUTS

async function loadWorkouts() {
    try {
        const response = await fetch(
            "https://localhost:7180/api/workoutplans",
            { headers: { "Authorization": `Bearer ${getToken()}` } }
        );

        if (handleUnauthorized(response)) return;

        const workouts = await response.json();
        const tableBody = document.getElementById("workoutTableBody");

        let html = "";
        workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
                html += `
                    <tr>
                        <td>${new Date(workout.date).toLocaleDateString()}</td>
                        <td>${exercise.exerciseName}</td>
                        <td>${exercise.durationMinutes} mins</td>
                        <td>${exercise.totalCaloriesBurned} kcal</td>
                        <td>
                            <button class="action-btn delete-btn" onclick="openDeleteModal('${workout.id}')">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
            });
        });

        tableBody.innerHTML = html;
    }
    catch (error) {
        console.error("loadWorkouts error:", error);
    }
}

// LOAD EXERCISES

async function loadExercises() {
    try {
        const response = await fetch(
            "https://localhost:7180/api/exercises",
            { headers: { "Authorization": `Bearer ${getToken()}` } }
        );

        if (handleUnauthorized(response)) return;

        const exercises = await response.json();
        const selects = document.querySelectorAll(".exerciseSelect");

        let html = `<option value="" disabled selected>Select an exercise</option>`;
        exercises.forEach(exercise => {
            html += `<option value="${exercise.id}">${exercise.name}</option>`;
        });

        selects.forEach(select => { select.innerHTML = html; });
    }
    catch (error) {
        console.error("loadExercises error:", error);
    }
}

// OPEN / CLOSE MODAL

function openModal() {
    document.getElementById("workoutModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("workoutModal").style.display = "none";
    document.getElementById("workoutDate").value = "";
    document.getElementById("workoutItemsContainer").innerHTML = `
        <div class="workout-item">
            <div class="workout-item-header"><span>Exercise Item</span></div>
            <select class="exerciseSelect"></select>
            <input type="number" class="durationInput" placeholder="Duration (minutes)" min="1">
        </div>
    `;
    loadExercises();
}

// ADD ITEM FIELD

function addWorkoutItemField() {
    const container = document.getElementById("workoutItemsContainer");
    const firstSelect = document.querySelector(".exerciseSelect");

    const div = document.createElement("div");
    div.className = "workout-item";
    div.innerHTML = `
        <div class="workout-item-header">
            <span>Exercise Item</span>
            <button type="button" class="remove-item-btn" onclick="removeWorkoutItem(this)">Remove</button>
        </div>
        <select class="exerciseSelect">${firstSelect.innerHTML}</select>
        <input type="number" class="durationInput" placeholder="Duration (minutes)" min="1">
    `;
    container.appendChild(div);
}

function removeWorkoutItem(button) {
    const items = document.querySelectorAll(".workout-item");
    if (items.length === 1) { alert("At least one exercise is required."); return; }
    button.closest(".workout-item").remove();
}

// ADD WORKOUT

async function addWorkout() {
    const date = document.getElementById("workoutDate").value;
    if (!date) { alert("Please select a date."); return; }

    const items = [];
    const exerciseSelects = document.querySelectorAll(".exerciseSelect");
    const durationInputs = document.querySelectorAll(".durationInput");

    for (let i = 0; i < exerciseSelects.length; i++) {
        const exerciseId = exerciseSelects[i].value;
        const duration = durationInputs[i].value;

        if (!exerciseId) { alert("Please select an exercise."); return; }
        if (!duration || Number(duration) < 1) { alert("Please enter valid duration."); return; }

        items.push({ exerciseId, durationMinutes: Number(duration) });
    }

    try {
        const response = await fetch(
            "https://localhost:7180/api/workoutplans",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify({ date, items })
            }
        );

        if (handleUnauthorized(response)) return;
        if (response.ok) { closeModal(); loadWorkouts(); }
        else { alert("Failed to add workout."); }
    }
    catch (error) {
        console.error("addWorkout error:", error);
    }
}

// DELETE

function openDeleteModal(id) {
    document.getElementById("deleteWorkoutId").value = id;
    document.getElementById("deleteModal").style.display = "flex";
}

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
}

async function confirmDeleteWorkout() {
    const id = document.getElementById("deleteWorkoutId").value;

    try {
        const response = await fetch(
            `https://localhost:7180/api/workoutplans/${id}`,
            {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${getToken()}` }
            }
        );

        if (handleUnauthorized(response)) return;
        if (response.ok) { closeDeleteModal(); loadWorkouts(); }
        else { alert("Failed to delete workout."); }
    }
    catch (error) {
        console.error("confirmDeleteWorkout error:", error);
    }
}

// CLOSE MODAL OUTSIDE

window.onclick = function (event) {
    const workoutModal = document.getElementById("workoutModal");
    const deleteModal = document.getElementById("deleteModal");
    if (event.target === workoutModal) closeModal();
    if (event.target === deleteModal) closeDeleteModal();
};

// RUN

loadWorkouts();
loadExercises();