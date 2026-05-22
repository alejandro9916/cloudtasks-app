const API_URL = 'http://localhost:3000/api/auth';



// LOGIN

async function login() {

    const email = document.getElementById('email').value;

    const password = document.getElementById('password').value;



    const response = await fetch(`${API_URL}/login`, {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json'

        },

        body: JSON.stringify({

            email,

            password

        })

    });



    const data = await response.json();



    if (response.ok) {

        localStorage.setItem('token', data.token);

        localStorage.setItem('user', JSON.stringify(data.user));



        window.location.href = 'index.html';

    }

    else {

        alert(data.message);

    }

}



// GO REGISTER

function goRegister() {

    window.location.href = 'register.html';

}