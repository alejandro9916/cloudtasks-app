const API_URL = 'http://localhost:3000/api/auth';



// REGISTER

async function register() {

    const username = document.getElementById('username').value;

    const email = document.getElementById('email').value;

    const password = document.getElementById('password').value;



    const response = await fetch(`${API_URL}/register`, {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json'

        },

        body: JSON.stringify({

            username,

            email,

            password

        })

    });



    const data = await response.json();



    if (response.ok) {

        alert('Usuario registrado correctamente');



        window.location.href = 'login.html';

    }

    else {

        alert(data.message);

    }

}



// GO LOGIN

function goLogin() {

    window.location.href = 'login.html';

}