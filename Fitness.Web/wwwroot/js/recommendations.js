renderSidebar("recommendations");

// PARSE JWT

function parseJwt(token) {

    const base64Url =
        token.split('.')[1];

    const base64 =
        base64Url
            .replace(/-/g, '+')
            .replace(/_/g, '/');

    return JSON.parse(
        window.atob(base64));
}

// TOKEN

const token =
    localStorage.getItem("token");

if (!token) {

    window.location.href =
        "../index.html";
}

// USER

const decodedToken =
    parseJwt(token);

const userId =
    decodedToken[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];

// GOAL

let currentGoal =
    "LoseWeight";

// SELECT GOAL

function selectGoal(goal, btnEl) {

    currentGoal = goal;

    document
        .querySelectorAll('.goal-btn')
        .forEach(btn =>
            btn.classList.remove(
                'active'));

    btnEl.classList.add(
        'active');

    loadRecommendations();
}

// LOAD BMI

async function loadBmi() {

    try {

        const response =
            await fetch(
                `https://localhost:7180/api/users/${userId}/bmi`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        if (response.status === 401) {

            logout();

            return;
        }

        const bmiData =
            await response.json();

        document.getElementById(
            "bmiValue").innerText =
            bmiData.bmi;

        const statusEl =
            document.getElementById(
                "bmiStatus");

        statusEl.innerText =
            bmiData.status;

        const colorMap = {

            "Underweight": "#3b82f6",

            "Normal": "#22c55e",

            "Overweight": "#f59e0b",

            "Obese": "#ef4444"
        };

        statusEl.style.color =
            colorMap[bmiData.status]
            || "#333";
    }
    catch (error) {

        console.error(
            "loadBmi error:",
            error);
    }
}

// LOAD RECOMMENDATIONS

async function loadRecommendations() {

    const foodListEl =
        document.getElementById(
            'recommendationList');

    const exerciseListEl =
        document.getElementById(
            'exerciseList');

    const reasonEl =
        document.getElementById(
            'recommendReason');

    foodListEl.innerHTML =
        `<p class="loading-text">
            ⏳ Đang tải thực phẩm...
        </p>`;

    exerciseListEl.innerHTML =
        `<p class="loading-text">
            ⏳ Đang tải bài tập...
        </p>`;

    reasonEl.style.display =
        'none';

    try {

        const response =
            await fetch(
                `https://localhost:7180/api/recommendations/meals?goal=${currentGoal}`,
                {
                    headers: {
                        'Authorization':
                            `Bearer ${token}`
                    }
                });

        if (response.status === 401) {

            logout();

            return;
        }

        if (!response.ok) {

            foodListEl.innerHTML =
                `<p class="error-text">
                    ⚠️ Không thể tải gợi ý.
                </p>`;

            exerciseListEl.innerHTML =
                "";

            return;
        }

        const data =
            await response.json();

        const foods =
            data.recommendedFoods;

        const exercises =
            data.recommendedExercises;

        // REASON

        reasonEl.innerText =
            '💡 ' + data.reason;

        reasonEl.style.display =
            'block';

        // NO FOOD

        if (!foods || foods.length === 0) {

            foodListEl.innerHTML =
                `<p class="error-text">
                    ⚠️ Không có thực phẩm phù hợp.
                </p>`;
        }

        else {

            renderFoods(foods);
        }

        // NO EXERCISE

        if (!exercises ||
            exercises.length === 0) {

            exerciseListEl.innerHTML =
                `<p class="error-text">
                    ⚠️ Không có bài tập phù hợp.
                </p>`;
        }

        else {

            renderExercises(
                exercises);
        }
    }
    catch (error) {

        foodListEl.innerHTML =
            `<p class="error-text">
                ❌ Lỗi kết nối server.
            </p>`;

        exerciseListEl.innerHTML =
            "";

        console.error(
            'loadRecommendations error:',
            error);
    }
}

// RENDER FOODS

function renderFoods(foods) {

    const listEl =
        document.getElementById(
            'recommendationList');

    listEl.innerHTML =
        foods.map(food => `

            <div class="food-card">

                <div class="food-icon">
                    🥗
                </div>

                <div class="food-name">
                    ${food.name}
                </div>

                <div class="food-stats">

                    <div class="stat-item">

                        <span class="stat-icon">
                            🔥
                        </span>

                        <span class="stat-value">
                            ${food.calories}
                        </span>

                        <span class="stat-label">
                            kcal
                        </span>

                    </div>

                    <div class="stat-item">

                        <span class="stat-icon">
                            🥩
                        </span>

                        <span class="stat-value">
                            ${food.protein}g
                        </span>

                        <span class="stat-label">
                            protein
                        </span>

                    </div>

                    <div class="stat-item">

                        <span class="stat-icon">
                            🍞
                        </span>

                        <span class="stat-value">
                            ${food.carbs}g
                        </span>

                        <span class="stat-label">
                            carbs
                        </span>

                    </div>

                    <div class="stat-item">

                        <span class="stat-icon">
                            🧈
                        </span>

                        <span class="stat-value">
                            ${food.fat}g
                        </span>

                        <span class="stat-label">
                            fat
                        </span>

                    </div>

                </div>

            </div>

        `).join('');
}

// RENDER EXERCISES

function renderExercises(exercises) {

    const exerciseList =
        document.getElementById(
            "exerciseList");

    exerciseList.innerHTML =
        exercises.map(exercise => `

            <div class="food-card">

                <div class="food-icon">
                    🏋️
                </div>

                <div class="food-name">
                    ${exercise.name}
                </div>

                <div class="food-stats">

                    <div class="stat-item">

                        <span class="stat-icon">
                            🔥
                        </span>

                        <span class="stat-value">
                            ${exercise.caloriesBurnPerMinute}
                        </span>

                        <span class="stat-label">
                            cal/min
                        </span>

                    </div>

                </div>

            </div>

        `).join('');
}

// RUN

loadBmi();

loadRecommendations();