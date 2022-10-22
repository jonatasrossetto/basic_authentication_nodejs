const express = require('express');
const bodyParser = require("body-parser");

const app = express();

// apply bodyParser to all incomming calls
app.use(bodyParser.urlencoded({extended:true}));

// start the server to listen on port 3000
app.listen(3000, function(){
    console.log('server running on port 3000');
})

// set the landing page
app.get('/',function(req,res){
    console.log('landing page');
    // res.status(200).send('hey from the server side');
    res.sendFile(__dirname +'/login.html');
})

// endpoint to implement basic authentication
app.post('/authentication',function(req,res){
    console.log('authentication in progress');
    console.log(req.body.login);
    console.log(req.body.password);
    res.send('hey from login');
})
