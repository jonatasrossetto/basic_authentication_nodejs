const newName = document.getElementById('name');
const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const submit = document.getElementById('submit');
const message = document.getElementById('message');

newName.addEventListener('click',()=>{
    message.textContent='';
    newName.value='';
    username.value='';
    password.value='';
    confirmPassword.value='';
})

submit.addEventListener('click',function(e){
    e.preventDefault();
    try {
        if (newName.value.length>=3&&password.value.length>=3&&username.value.length>=3){
            if (password.value.indexOf(":")<0&&username.value.indexOf(":")<0){
                if (password.value==confirmPassword.value){
                    message.textContent='password confirmed';
                    const request = fetch('http://localhost:3000/register', { 
                        method: 'post', 
                        body: JSON.stringify({
                            name: newName.value,
                            username: username.value,
                            password: password.value
                    }),
                    // Adding headers to the request
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }})
                    .then(response=>response.json())
                    .then(data=>{
                        console.log('data.message: ',data.message);
                        message.textContent = data.message;
                        if (data.message=='new user created') {
                            window.location.href = 'http://localhost:3000/';    
                        }
                    });
                } else {
                    message.textContent='failed to confirm password';
                }
            } else {
                message.textContent='username and password should not contain ":"';
            }
        }else {
            message.textContent='name, username and password must be at least 8 characters long';
    }
        
    } catch (error) {
        message.textContent='Sorry, something went wrong! Please try later!';
    }
    
    
    
})