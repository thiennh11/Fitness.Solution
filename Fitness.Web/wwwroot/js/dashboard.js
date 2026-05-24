renderSidebar("dashboard");

// PARSE JWT

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}

// GET TOKEN & CHECK LOGIN

const token = localStorage.getItem("token");
if (!token) { window.location.href = "../index.html"; }

const decodedToken = parseJwt(token);
const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
const userName =
    decodedToken["unique_name"] ||
    decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    decodedToken["name"] ||
    decodedToken["email"] ||
    "User";

document.getElementById("userName").innerText = userName;

// ADMIN UI

if (role === "Admin") {
    const adminSection = document.getElementById("adminSection");
    if (adminSection) adminSection.style.display = "block";

    const dashboardTitle = document.getElementById("dashboardTitle");
    if (dashboardTitle) dashboardTitle.innerText = "Admin Dashboard";

    const userCards = document.getElementById("userCards");
    if (userCards) userCards.style.display = "none";

    const userCharts = document.getElementById("userCharts");
    if (userCharts) userCharts.style.display = "none";
}

// LOAD DASHBOARD

async function loadDashboard() {
    try {
        const bmiResponse = await fetch(
            `https://localhost:7180/api/users/${userId}/bmi`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (bmiResponse.status === 401) { logout(); return; }
        const bmiData = await bmiResponse.json();
        document.getElementById("bmiValue").innerText = bmiData.bmi;

        const mealResponse = await fetch(
            "https://localhost:7180/api/mealplans",
            { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (mealResponse.status === 401) { logout(); return; }
        const mealData = await mealResponse.json();

        let totalCalories = 0;
        mealData.forEach(meal => { totalCalories += meal.totalCalories; });
        document.getElementById("totalCalories").innerText = totalCalories + " kcal";
        document.getElementById("mealCount").innerText = mealData.length + " Meals";

        const workoutResponse = await fetch(
            "https://localhost:7180/api/workoutplans",
            { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (workoutResponse.status === 401) { logout(); return; }
        const workoutData = await workoutResponse.json();

        let totalWorkoutCalories = 0;
        workoutData.forEach(w => { totalWorkoutCalories += w.totalCaloriesBurned; });
        document.getElementById("totalWorkout").innerText = totalWorkoutCalories + " kcal";

        if (role !== "Admin") {
            initUserCharts(mealData, workoutData);
        }

        if (role === "Admin") {
            loadAdminStats();
        }
    }
    catch (error) {
        console.error("loadDashboard error:", error);
    }
}

// INIT USER CHARTS

function initUserCharts(mealData, workoutData) {
    const labels = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
    }

    const caloriesByDay = new Array(7).fill(0);
    mealData.forEach(meal => {
        const mealDate = new Date(meal.date);
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            if (mealDate.toDateString() === d.toDateString()) {
                caloriesByDay[6 - i] += meal.totalCalories;
            }
        }
    });

    const workoutByDay = new Array(7).fill(0);
    workoutData.forEach(workout => {
        const wDate = new Date(workout.date);
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            if (wDate.toDateString() === d.toDateString()) {
                workoutByDay[6 - i] += workout.totalCaloriesBurned;
            }
        }
    });

    const calorieCanvas = document.getElementById("calorieChart");
    if (calorieCanvas) {
        new Chart(calorieCanvas, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Calories (kcal)",
                    data: caloriesByDay,
                    backgroundColor: "rgba(76, 175, 80, 0.7)",
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    const workoutCanvas = document.getElementById("userWorkoutChart");
    if (workoutCanvas) {
        new Chart(workoutCanvas, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Calories Burned (kcal)",
                    data: workoutByDay,
                    borderColor: "#2196F3",
                    backgroundColor: "rgba(33, 150, 243, 0.1)",
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: "#2196F3"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

// LOAD ADMIN STATS

async function loadAdminStats() {
    try {
        const response = await fetch(
            "https://localhost:7180/api/admin/stats",
            { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error("Failed to load admin stats");
        const data = await response.json();

        document.getElementById("totalUsers").innerText = data.totalUsers;
        document.getElementById("totalMealPlans").innerText = data.totalMealPlans;
        document.getElementById("totalWorkoutPlans").innerText = data.totalWorkoutPlans;
        document.getElementById("averageBMI").innerText = data.averageBMI;

        initAdminCharts(data);
    }
    catch (error) {
        console.error("loadAdminStats error:", error);
    }
}

// INIT ADMIN CHARTS

function initAdminCharts(data) {
    const workoutCanvas = document.getElementById("workoutChart");
    if (workoutCanvas) {
        new Chart(workoutCanvas, {
            type: "bar",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{
                    label: "Workouts",
                    data: [2, 5, 3, 6, 4, 7, 5],
                    backgroundColor: "rgba(76, 175, 80, 0.7)",
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    const bmiCanvas = document.getElementById("bmiChart");
    if (bmiCanvas) {
        new Chart(bmiCanvas, {
            type: "doughnut",
            data: {
                labels: ["Underweight", "Normal", "Overweight", "Obese"],
                datasets: [{
                    data: [2, 10, 4, 1],
                    backgroundColor: ["#2196F3", "#4CAF50", "#FF9800", "#F44336"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } }
            }
        });
    }
}

// RUN

loadDashboard();