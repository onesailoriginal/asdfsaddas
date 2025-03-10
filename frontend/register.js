document.getElementById("loginForm").addEventListener("submit",async function(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
        alert("Töltsd ki az összes mezőt!");
        return;
    }

    try{
        const res = await fetch('/api/register/', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "username": username, "password": password })
        })
        if(!res.ok){
            const errorData = await res.json();
            alert( "Hibás felhasználónév vagy jelszó!");   
            throw new Error(errorData.message || 'Hiba történt a kérelem során')
        }
        const data = await res.json()
       if(data.success){
        localStorage.setItem('username', username);
        window.location.href = "index.html";
       }
    }catch(error){
        console.error('Hiba történt: ', error)
        throw error;
    }
});


