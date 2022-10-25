const welcomeMessage = document.getElementById("welcome-message")

const request = fetch('http://localhost:3000/userInfo', { 
                    method: 'post', 
                    body: JSON.stringify({}),
                // Adding headers to the request
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }})
                .then(response=>response.json())
                .then(data=>{
                    welcomeMessage.textContent = data.message; 
                });

// welcomeMessage.textContent="Hello Jonatas, this is the App Welcome Page";