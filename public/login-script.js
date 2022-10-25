const username = document.getElementById('username');
        const password = document.getElementById('password');
        const submit = document.getElementById('submit');
        const serverMessage = document.querySelector('.server-message');

        console.log('client ok');


        submit.addEventListener('click',function(e){
            e.preventDefault();
            console.log(username.value);
            console.log(password.value); 
            let coded = btoa(`${username.value}:${password.value}`);
            console.log(coded);
            console.log(atob(coded));

            const request = fetch('http://localhost:3000/authentication', { 
                method: 'post', 
                headers: new Headers({
                    'Authorization': 'Basic '+btoa(`${username.value}:${password.value}`), 
                    'Content-Type': 'application/x-www-form-urlencoded'
                }), 
                body: 'A=1&B=2'
            })
            .then(response=>response.json())
            .then(data=>{ 
                console.log(data.message);
                serverMessage.textContent=data.message;
                if (data.message==='Signed in the first time'){
                    console.log('ok');
                    window.location.href = "http://localhost:3000/appWelcome";
                }
             });

        })