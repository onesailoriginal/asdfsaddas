document.getElementById("registerForm")?.addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (username === "" || password === "") {
        alert("Töltsd ki az összes mezőt!");
        return;
    }

    try {
        console.log("Kérés elküldése a backendnek..."); // 1. lépés: Kérés küldése
        const response = await fetch('/api/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        console.log("Válasz érkezett a backendtől."); // 2. lépés: Válasz érkezett
        console.log("Státusz kód:", response.status); // Státusz kód kiírása

        const result = await response.json();
        console.log("Válasz adatok:", result); // Válasz adatok kiírása

        if (response.status === 200) {
            alert(result.message);
            window.location.href = "index.html";
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Hiba történt a kérés során:", error); // Hiba kiírása
        alert("Hiba történt a regisztráció során.");
    }
});