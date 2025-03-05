const choices = ["rock", "paper", "scissors"];
const buttons = document.querySelectorAll(".choice");
const resultText = document.getElementById("result");
const winsText = document.getElementById("wins");
const lossesText = document.getElementById("losses");
const drawsText = document.getElementById("draws");
const resetButton = document.getElementById("reset");
const username = localStorage.getItem('username');


let stats = { wins: 0, loses: 0, draws: 0 };

// Statisztikák betöltése a backendről
function fetchStats() {
    const username = localStorage.getItem('username');
    console.log('username'+username)
    //const username = localStorage.getItem('username')
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/history/${username}`, true); // Módosított URL
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            stats = JSON.parse(xhr.responseText);
            updateStatsUI();
        }
    };
    xhr.send();
}

// Játék indítása
buttons.forEach(button => {
    button.addEventListener("click", async () => {
        resultText.textContent = "A bot gondolkodik...";
        try{
            const playerChoice = button.dataset.choice;
            const res = await fetch('/api/play', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"selectedItem": playerChoice}),
            });
            
            const data = await res.json();
            
            if(!data.success){
                resultText.textContent = "Kicsit Elbasztad!";
                console.error(data.message)
                return;
            }
            if(data.playerWin){
                resultText.textContent = "Nyertél!, a bot választott: "+data.botItem;
                winsText.textContent++;
                saveCuccs()
                return;
            }
            if(data.botWin){
                resultText.textContent = "Elbasztad!, a bot választott: "+data.botItem;
                lossesText.textContent++;
                saveCuccs()
                return;
            }
            else{
                resultText.textContent = "Döntetlen!, a bot választott: "+data.botItem;
                drawsText.textContent++;
                saveCuccs()
                return;
            }
        }catch(error){
            resultText.textContent = "Nagyon Elbasztad!";
            
            throw error;
        }
       
    });
});

async function saveCuccs() {
    try {
        const username = localStorage.getItem('username');

        const wins = parseInt(winsText.textContent, 10);
        const draws = parseInt(drawsText.textContent, 10);
        const losses = parseInt(lossesText.textContent, 10);

        console.log(username, wins, draws, losses);

        const res = await fetch('/api/save', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                wins: wins,
                draws: draws,
                loses: losses
            })
        });
        const data = await res.json();

        if (!data.success) {
            console.error('Hiba történt a mentés során:', data.message);
        }

    } catch (err) {
        console.error('Hiba történt:', err);
        throw err;
    }
}

function updateStatsUI() {
    winsText.textContent = stats.wins;
    lossesText.textContent = stats.loses;
    drawsText.textContent = stats.draws;
}



resetButton.addEventListener("click", () => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/resetStats", true);
    xhr.setRequestHeader("Content-Type", "application/json"); // Beállítjuk a Content-Type fejlécet

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            stats = { wins: 0, loses: 0, draws: 0 };
            fetchStats();
        }
    };

    const username = localStorage.getItem('username');
    const data = JSON.stringify({ username: username }); // JSON formátumba alakítjuk az adatot

    xhr.send(data); // Elküldjük az adatot a kérés body-jában
});

// Induláskor betöltjük az adatokat a szerverről
fetchStats();
