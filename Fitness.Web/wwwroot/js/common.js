
// RENDER SIDEBAR

function renderSidebar(activePage) {

    const role = localStorage.getItem("role");

    const menuItems = [
        {
            id: "menuDashboard",
            icon: "dashboard",
            label: "Dashboard",
            page: "dashboard",
            onclick: "goDashboard()",
            showFor: ["Admin", "User"]
        },
        {
            id: "menuFoods",
            icon: "restaurant",
            label: "Foods",
            page: "foods",
            onclick: "goFoods()",
            showFor: ["Admin", "User"]
        },
        {
            id: "menuExercises",
            icon: "fitness_center",
            label: "Exercises",
            page: "exercises",
            onclick: "goExercises()",
            showFor: ["Admin", "User"]
        },
        {
            id: "menuMealPlans",
            icon: "fastfood",
            label: "Meal Plans",
            page: "mealplans",
            onclick: "goMealPlans()",
            showFor: ["User"]
        },
        {
            id: "menuWorkouts",
            icon: "directions_run",
            label: "Workouts",
            page: "workouts",
            onclick: "goWorkouts()",
            showFor: ["User"]
        },
        {
            id: "menuRecommendations",
            icon: "restaurant_menu",
            label: "Recommendations",
            page: "recommendations",
            onclick: "goRecommendations()",
            showFor: ["User"]
        },
        {
            id: "menuProfile",
            icon: "account_circle",
            label: "Profile",
            page: "profile",
            onclick: "goProfile()",
            showFor: ["Admin", "User"]
        },
        {
            id: "menuUsers",
            icon: "group",
            label: "User Management",
            page: "users",
            onclick: "goUsers()",
            showFor: ["Admin"]
        },
        {
            id: "menuLogout",
            icon: "logout",
            label: "Logout",
            page: "",
            onclick: "logout()",
            showFor: ["Admin", "User"]
        }
    ];

    const sidebarEl = document.getElementById("sidebar");

    if (!sidebarEl) return;

    const menuHTML = menuItems
        .filter(item => item.showFor.includes(role))
        .map(item => `
            <li id="${item.id}"
                class="${activePage === item.page ? 'active' : ''}"
                onclick="${item.onclick}">
                <span class="material-icons">${item.icon}</span>
                ${item.label}
            </li>
        `)
        .join('');

    sidebarEl.innerHTML = `
        <div class="logo">
            <span class="material-icons">fitness_center</span>
            <h2>Fitness</h2>
        </div>
        <ul>${menuHTML}</ul>
    `;
}

// NAVIGATION (dùng chung cho tất cả trang)

function goDashboard() {
    window.location.href = "dashboard.html";
}

function goFoods() {
    window.location.href = "foods.html";
}

function goExercises() {
    window.location.href = "exercises.html";
}

function goMealPlans() {
    window.location.href = "mealplans.html";
}

function goWorkouts() {
    window.location.href = "workouts.html";
}

function goRecommendations() {
    window.location.href = "recommendations.html";
}

function goProfile() {
    window.location.href = "profile.html";
}

function goUsers() {
    window.location.href = "users.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "../index.html";
}
const favicon =
    document.createElement("link");

favicon.rel = "icon";

favicon.type =
    "image/svg+xml";

favicon.href =
    `data:image/svg+xml,
    %3Csvg xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'%3E
    %3Ctext y='20'
    font-size='20'%3E🏋️%3C/text%3E
    %3C/svg%3E`;

document.head.appendChild(
    favicon
);