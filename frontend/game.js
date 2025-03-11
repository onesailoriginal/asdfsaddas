async function checkAuth() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html'; 
    } else {
        try {
            const response = await fetch('/api/checkToken', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                }
            });
            const data = await response.json();
            if (!data.success) {
                sessionStorage.removeItem('token'); 
                sessionStorage.removeItem('id')
                window.location.href = 'index.html'; 
            }

        } catch (error) {
            console.error('Error during token check:', error);
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('id')
            window.location.href = 'index.html';
        }
    }
}

document.addEventListener('DOMContentLoaded', checkAuth);
window.addEventListener('beforeunload', function (event) {
    sessionStorage.removeItem('token'); });

const choices = ["rock", "paper", "scissors"];
const buttons = document.querySelectorAll(".choice");
const resultText = document.getElementById("result");
const winsText = document.getElementById("wins");
const lossesText = document.getElementById("losses");
const drawsText = document.getElementById("draws");
const resetButton = document.getElementById("reset");
const username = sessionStorage.getItem('username');
const rockChoice = document.getElementById('rockChoice')
const paperChoice = document.getElementById('paperChoice')
const scissorsChoice = document.getElementById('scissorsChoice')





let stats = { wins: 0, loses: 0, draws: 0 };

// Statisztikák betöltése a backendről
async function fetchStats() {
    try {
        const token = sessionStorage.getItem('token');
        const username = sessionStorage.getItem('username');

        if (!token) {
            console.error("Nincs token elmentve!");
            return;
        }

        const res = await fetch(`/api/history/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token             }
        });

        if (!res.ok) {
            throw new Error(`Hiba történt: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
       


        if (!data.success) {
            return;

        } else {
          //  console.log("Siker:", data);
            // Itt frissítheted a UI-t, pl. updateStatsUI(data);
            stats = data.user
            updateStatsUI()
        }

    } catch (err) {
        console.error("Hiba:", err);
    }
}

    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //         stats = JSON.parse(xhr.responseText);
    //         updateStatsUI();
    //     }
    // };
    // xhr.send();


// Játék indítása
buttons.forEach(button => {
    button.addEventListener("click", async () => {
        resultText.textContent = "A bot gondolkodik...";
        rockChoice.disabled = true
        paperChoice.disabled =  true
        scissorsChoice.disabled = true
        setTimeout(async () => {   
            try{
                const token = sessionStorage.getItem('token');
                const playerChoice = button.dataset.choice;
                const res = await fetch('/api/play', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token 
                    },
                    body: JSON.stringify({"selectedItem": playerChoice}),
                });
                
                const data = await res.json();

                rockChoice.disabled = false
                paperChoice.disabled =  false
                scissorsChoice.disabled = false
                
                if(!data.success){
                    resultText.textContent = "Kicsit Elbasztad!";
                    // console.error(data.message)
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
             }, 1000)
       
    });
});

async function saveCuccs() {
    try {
        const username = sessionStorage.getItem('username');
        const wins = parseInt(winsText.textContent, 10);
        const draws = parseInt(drawsText.textContent, 10);
        const losses = parseInt(lossesText.textContent, 10);

        
        // console.log(username, wins, draws, losses);
        const token = sessionStorage.getItem('token');
        const res = await fetch('/api/save', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token 
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
            return;
        }
        fetchStats()

    } catch (err) {
        throw err;
    }
}

function updateStatsUI() {
    winsText.textContent = stats.wins;
    lossesText.textContent = stats.loses;
    drawsText.textContent = stats.draws;
}



resetButton.addEventListener("click", async () => {

    try {
        const username = sessionStorage.getItem('username');

        // console.log(username, wins, draws, losses);
        const token = sessionStorage.getItem('token');
        const res = await fetch('/api/resetStats', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token 
            },
            body: JSON.stringify({
                username: username,
            })
        });
        const data = await res.json();

        if (!data.success) {
            return;
        }
        fetchStats()

    } catch (err) {
        throw err;
    }
});

fetchStats();
