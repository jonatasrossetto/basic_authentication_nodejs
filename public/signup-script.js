const name = document.getElementById('name');
const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const submit = document.getElementById('submit');
const message = document.getElementById('message');

submit.addEventListener('click',function(e){
    e.preventDefault();
    console.log('name: '+name.value);
    console.log('username: '+username.value);
    console.log('password: '+password.value);
    console.log('confirm password: '+confirmPassword.value);
    if (password.value.indexOf(":")<0&&username.value.indexOf(":")<0){
        if (password.value==confirmPassword.value){
            console.log('password confirmed');
            message.textContent='password confirmed';
            const request = fetch('http://localhost:3000/register', { 
                method: 'post', 
                body: JSON.stringify({
                    name: name.value,
                    username: username.value,
                    password: password.value
            }),
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }}).then(function(response){
                console.log(response.json());
            });
        } else {
            console.log('failed to confirm password');
            message.textContent='failed to confirm password';
        }
    } else {
        console.log('username and password should not contain ":"');
        message.textContent='username and password should not contain ":"';
    }
    
})