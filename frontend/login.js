document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
        alert("Töltsd ki az összes mezőt!");
        return;
    }

    const loginRequest = new XMLHttpRequest();
    loginRequest.open("POST", "http://localhost:3000/login", true);
    loginRequest.setRequestHeader("Content-Type", "application/json");

    loginRequest.onreadystatechange = () => {
        if (loginRequest.readyState === 4) {
            if (loginRequest.status === 200) {
                const result = JSON.parse(loginRequest.responseText);
                localStorage.setItem("token", result.token);
                alert(result.message);
                window.location.href = "game.html";
            } else {
                alert("Hibás felhasználónév vagy jelszó!");
            }
        }
    };

    loginRequest.send(JSON.stringify({ username, password }));
});