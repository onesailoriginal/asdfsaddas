document.getElementById("registerForm")?.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (username === "" || password === "") {
        alert("Töltsd ki az összes mezőt!");
        return;
    }

    const registerRequest = new XMLHttpRequest();
    registerRequest.open("POST", "http://localhost:3000/register", true);
    registerRequest.setRequestHeader("Content-Type", "application/json");

    registerRequest.onreadystatechange = () => {
        if (registerRequest.readyState === 4) {
            const result = JSON.parse(registerRequest.responseText);
            alert(result.message);
            if (registerRequest.status === 200) {
                window.location.href = "index.html";
            }
        }
    };

    registerRequest.send(JSON.stringify({ username, password }));
});