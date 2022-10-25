const express = require('express');
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser')

const app = express();

// inform the public directory for node.js
app.use(express.static(__dirname + '/public'));
// apply bodyParser to all incomming calls
app.use(bodyParser.urlencoded({extended:true}));
// apply cookie-parser to incomming calls and decode using the secre key
app.use(cookieParser('secret_key'));
app.use(express.json());

let users = [
    {
      userId: 1,
      name:"João Neves",
      login:"joao",
      password:"123",
      active:false
    },
    {
      userId: 2,
      name:"Maria Silva",
      login:"maria",
      password:"123",
      active:false
    },
    {
        userId: 3,
      name:"José Costa",
      login:"jose",
      password:"123",
      active:false
    },
    {
        userId: 4,
      name:"Jorge Bonfim",
      login:"jorge",
      password:"123",
      active:false
    }
  ];

// start the server to listen on port 3000
app.listen(3000, function(){
    console.log('server running on port 3000');
})

// set the landing page
app.get('/',function(req,res){
    console.log('landing page');
    
    let cookieStuff=req.signedCookies.user;
    console.log('cookieStuff:');
    console.log(cookieStuff);
    
    if (validCookieData(cookieStuff))//True for our case
    {
        // res.status(200).send('hey from the server side');
        res.sendFile(__dirname +'/appWelcome.html');
    } else {
        // res.status(200).send('hey from the server side');
        res.sendFile(__dirname +'/login.html');
    }
})

// endpoint to implement basic authentication
app.post('/authentication',function(req,res){
    console.log('authentication in progress');
    // stores the data from the cookie user, if it exists, deconding it
    let cookieStuff=req.signedCookies.user;
    console.log('cookieStuff:');
    console.log(cookieStuff);
    //But the user is logging in for the first time so there won't be any appropriate signed cookie for usage.
    if(!cookieStuff)//True for our case
    {
        console.log('req.headers.authorization:')
        console.log(req.headers.authorization);
        let authStuff=req.headers.authorization;
        if(!authStuff)
        {
            //No authentication info given
            console.log('no authentication info given');
            res.send({ message: 'No authentication info was sent to server' });
        }
        else
        {
            console.log('first else:test authorization info');
            const authData = recoverAuthenticationData(authStuff);
            console.log(authData);
            const authIsValid = checkUserData(authData.username, authData.password);
            console.log(authIsValid.error + ' : ' + authIsValid.msg + ' : ' + authIsValid.username);
            //Extracting the username and password in an array
            if(!authIsValid.error) 
            {
                console.log("WELCOME "+authIsValid.name);
                let expireDate = new Date(Date.now()+60*1000);
                console.log('expire date:' + expireDate);
                res.cookie('user', {id:authIsValid.id,name:authIsValid.name}, 
                {signed: true,
                expires:expireDate});
                res.send({ message: 'Signed in the first time' });
            }
            else
            {
                //Wrong authentication info, retry
                console.log('last else: Wrong authentication info, retry');
                res.send({ message: authIsValid.msg });
            }
        }
    }
    else
    {//Signed cookie already stored
        if(validCookieData(cookieStuff))
        {
            console.log('The cookie info is OK');
            res.send({message:'The cookie info is OK'});
        }
        else
        {
            //Wrong info, user asked to authenticate again
            console.log('Wrong cookie authentication data');
            res.send({message:'Wrong cookie authentication data'});
        }
    }
})

app.get('/appWelcome',function(req,res){
    console.log('trying to go to appWelcome page');
    let cookieStuff=req.signedCookies.user;
    console.log('cookieStuff:');
    console.log(cookieStuff);
    if (validCookieData(cookieStuff))//True for our case
    {
        // res.status(200).send('hey from the server side');
        console.log('hey hey appWelcome');
        res.sendFile(__dirname +'/appWelcome.html');
    } else {
        // res.status(200).send('hey from the server side');
        res.sendFile(__dirname +'/login.html');
    }
});

app.get('/signup',function(req,res){
    console.log('signup page');
    let cookieStuff=req.signedCookies.user;
    console.log('cookieStuff:');
    console.log(cookieStuff);
    if (validCookieData(cookieStuff))//True for our case
    {
        // res.status(200).send('hey from the server side');
        console.log('hey hey appWelcome');
        res.sendFile(__dirname +'/appWelcome.html');
    } else {
        // res.status(200).send('hey from the server side');
        res.sendFile(__dirname +'/signup.html');
    }
});

app.post('/register',function(req,res){
    console.log('register service');
    let cookieStuff=req.signedCookies.user;
    console.log('cookieStuff:');
    console.log(cookieStuff);
    if (validCookieData(cookieStuff))//True for our case
    {
        console.log('hey hey appWelcome');
        res.sendFile(__dirname +'/appWelcome.html');
    } else {
        if (newUsernameIsValid(req.body.username)){
            users.push({
                userId: users[users.length-1].userId+1,
                name:req.body.name,
                login:req.body.username,
                password:req.body.password,
                active:false
            });
            res.send({ message: 'register ok' });
        } else {
            res.send({ message: 'username already exist' });    
        }
    }
});



const recoverAuthenticationData = function(receivedAuthenticationData){
    // recover authenticationData from base64
    const authenticationData=new Buffer.from(receivedAuthenticationData.split(" ")[1], 'base64');
    return {    username: authenticationData.toString().split(":")[0],
                password: authenticationData.toString().split(":")[1] }
}

const checkUserData = function (username, password){
    console.log('checkUserData');
    for (const user of users){
        console.log(user);
        if ((user.login===username)&&(user.password===password)) {
            console.log(user.login);
            if (user.active===false) {
                user.active=true;
                return {error: false, msg: '', id: user.userId, username: user.login, name: user.name};
            } else {
                return {error: true, msg: 'user already active', id: '', username: '', name: ''};
            }
        } 
    }
    return {error: true, msg: 'error: login or password incorrect', id: '', username: '', name: ''};
}

const validCookieData = function (cookieData){
    if (cookieData) {
        const id = cookieData.id;
        console.log('id: '+id);
        for (const user of users) {
            console.log(user.userId);
            console.log(user.active);
            if (user.userId===Number(id)&&user.active===true){
                console.log('cookie true');
                return true;
            }
        }
    }
    console.log('cookie false');
    return false;
}

const newUsernameIsValid = function(newUsername){
    console.log('newUsernameIsValid');
    for (const user of users){
        console.log(user);
        if (user.login===newUsername) {
            return false;
        } else {
            return true;
        }
    } 
}
