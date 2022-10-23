const username = document.getElementById('username');
const password = document.getElementById('password');
const submit = document.getElementById('submit');

console.log('client ok');

submit.addEventListener('click',function(e){
    e.preventDefault();
    console.log(username.value);
    console.log(password.value);    
    fetch('http://localhost:3000/authentication', { 
        method: 'post', 
        headers: new Headers({
            'Authorization': 'Basic '+Buffer.from(`${username.value}:${password.value}` , 'base64'), 
            'Content-Type': 'application/x-www-form-urlencoded'
        }), 
        body: 'A=1&B=2'
    });
})




//about btoa
// This function is only provided for compatibility with legacy web platform APIs and should never be used in new code, because they use strings to represent binary data and predate the introduction of typed arrays in JavaScript. For code running using Node.js APIs, converting between base64-encoded strings and binary data should be performed using Buffer.from(str, 'base64') andbuf.toString('base64').