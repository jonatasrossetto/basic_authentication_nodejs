const welcomeMessage = document.getElementById("welcome-message")
const btnLogout = document.querySelector(".btn-logout");

const request = fetch('http://localhost:3000/userInfo', { 
                    method: 'post', 
                    body: JSON.stringify({}),
                // Adding headers to the request
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }})
                .then(response=>response.json())
                .then(data=>{
                    welcomeMessage.textContent = `${data.message}, welcome to the App`; 
                });

btnLogout.addEventListener('click',()=>{
    console.log('removing coookie');
    fetch('http://localhost:3000/logout', {method: 'post'}).then((response)=>{
        console.log(response);
        window.location.href = 'http://localhost:3000/';
    });
})

// welcomeMessage.textContent="Hello Jonatas, this is the App Welcome Page";