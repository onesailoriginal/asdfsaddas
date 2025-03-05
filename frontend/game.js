const choices = ["rock", "paper", "scissors"];
const buttons = document.querySelectorAll(".choice");
const resultText = document.getElementById("result");
const winsText = document.getElementById("wins");
const lossesText = document.getElementById("losses");
const drawsText = document.getElementById("draws");
const resetButton = document.getElementById("reset");

let stats = { wins: 0, losses: 0, draws: 0 }; // Alapértelmezett értékek

// 📌 1️⃣ Statisztikák betöltése a backendről (XMLHttpRequest)
function fetchStats() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/stats", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            stats = JSON.parse(xhr.responseText);
            updateStatsUI();
        }
    };
    xhr.send();
}

// 📌 2️⃣ Játék indítása
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const playerChoice = button.dataset.choice;
        resultText.textContent = "A bot gondolkodik...";
        
        setTimeout(() => {
            const botChoice = choices[Math.floor(Math.random() * choices.length)];
            const result = determineWinner(playerChoice, botChoice);
            const result2 = determineWinner2(playerChoice, botChoice);

            updateStats(result); // 📌 3️⃣ Küldjük az adatokat a backendnek

            resultText.textContent = `Te: ${emoji(playerChoice)} ${result2} Bot: ${emoji(botChoice)} → ${result}`;
        }, 1000);
    });
});

// 📌 3️⃣ Adatok küldése a backendnek (XMLHttpRequest)
function updateStats(result) {
    if (result === "Győztél!") stats.wins++;
    if (result === "Vesztettél!") stats.losses++;
    if (result === "Döntetlen") stats.draws++;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/stats/update", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            fetchStats(); // Frissítjük a statisztikákat a szerverről
        }
    };
    xhr.send(JSON.stringify(stats));
}

// 📌 4️⃣ Győztes meghatározása
function determineWinner(player, bot) {
    if (player === bot) return "Döntetlen";
    if (
        (player === "rock" && bot === "scissors") ||
        (player === "paper" && bot === "rock") ||
        (player === "scissors" && bot === "paper")
    ) {
        return "Győztél!";
    } else {
        return "Vesztettél!";
    }
}

function determineWinner2(player, bot) {
    if (player === bot) return "=";
    if (
        (player === "rock" && bot === "scissors") ||
        (player === "paper" && bot === "rock") ||
        (player === "scissors" && bot === "paper")
    ) {
        return ">";
    } else {
        return "<";
    }
}

// 📌 5️⃣ UI frissítés
function updateStatsUI() {
    winsText.textContent = stats.wins;
    lossesText.textContent = stats.losses;
    drawsText.textContent = stats.draws;
}

// 📌 6️⃣ Statisztikák törlése (XMLHttpRequest)
resetButton.addEventListener("click", () => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/stats/reset", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            stats = { wins: 0, losses: 0, draws: 0 };
            fetchStats(); // Frissítjük a szerverről
        }
    };
    xhr.send();
});

// 📌 7️⃣ Induláskor betöltjük az adatokat a szerverről
fetchStats();
