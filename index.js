const express = require('express');
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser')

const app = express();
// inform the public directory for node.js
app.use(express.static(__dirname + '/public'));
// apply bodyParser to all incomming calls
app.use(bodyParser.urlencoded({extended:true}));
// apply cookie-parser to incomming calls and decode using the secret key
// this secret key must be stored in a configuration file such as config.json
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
    if (cookieStuff){
            console.log('begin validCookieData');
            const db = require("./db");
            const cookieIsValid = db.validCookieData(cookieStuff).then((validCookieDataResponse)=>{
                console.log('validCookieDataResponse:',validCookieDataResponse);
                if(validCookieDataResponse.isValid) {
                    console.log('The cookie info is OK');
                    res.sendFile(__dirname +'/appWelcome.html');
                } else {
                    //Wrong info, user asked to authenticate again
                    console.log('Wrong cookie authentication data');
                    res.sendFile(__dirname +'/login.html');
                }
            });
        } else {
            console.log('There is no cookie authentication data');
            res.sendFile(__dirname +'/login.html');
        }
})
// set the landing page
app.post('/logout',function(req,res){
    console.log('logout service');
    let expireDate = new Date(Date.now()-1);
    res.cookie('user','', {signed: true,expires:expireDate, path:"/", domain: 'localhost',httpOnly:true});
    res.send('user cookie cleared');
})

// endpoint to implement basic authentication
app.post('/authentication',function(req,res){
    console.log('authentication in progress');
    // stores the data from the cookie user, if it exists, deconding it
    let cookieStuff=req.signedCookies.user;
    let authIsValid;
    console.log('cookieStuff:',cookieStuff);
    //But the user is logging in for the first time so there won't be any appropriate signed cookie for usage.
    if(!cookieStuff)//True for our case
    {
        console.log('req.headers.authorization:',req.headers.authorization);
        let authStuff=req.headers.authorization;
        if(!authStuff)
        {
            //No authentication info given
            console.log('no authentication info given');
            res.send({ message: 'No authentication info was sent to server' });
        }
        else
        {
            console.log('recover authentication data');
            const authData = recoverAuthenticationData(authStuff);
            console.log('authData:',authData);
            (async ()=>{
                console.log('begin async');
                const db = require("./db");
                const authIsValid = await db.checkUserData(authData.username, authData.password);
                console.log('authIsValid:',authIsValid);
                //Extracting the username and password in an array
                if(!authIsValid.error) 
                {
                    console.log("WELCOME "+authIsValid.name);
                    let expireDate = new Date(Date.now()+5*60*1000);
                    console.log('expire date:' + expireDate);
                    res.cookie('user', {id:authIsValid.id,name:authIsValid.name},{signed: true,expires:expireDate, path:"/", domain: 'localhost',httpOnly:true});
                    res.send({ message: 'Signed in the first time' });
                }
                else
                {
                    //Wrong authentication info, retry
                    console.log('last else: Wrong authentication info, retry');
                    console.log(authIsValid);
                    res.send({ message: 'Wrong authentication info, retry' });
                }
            })();
        }
    }
    else
    {//Signed cookie already stored
        (async () => {
            const db = require("./db");
            console.log('begin validCookieData');
            if(validCookieData(cookieStuff).isValid) {
                console.log('The cookie info is OK');
                res.send({message:'The cookie info is OK'});
            } else {
                //Wrong info, user asked to authenticate again
                console.log('Wrong cookie authentication data');
                res.send({message:'Wrong cookie authentication data'});
            }
        })
    }
})

app.get('/appWelcome',function(req,res){
    console.log('trying to go to appWelcome page');
    let cookieStuff=req.signedCookies.user;
    console.log('cookieStuff:');
    console.log(cookieStuff);
    if (cookieStuff){
            console.log('begin validCookieData');
            const db = require("./db");
            const cookieIsValid = db.validCookieData(cookieStuff).then((validCookieDataResponse)=>{
                console.log('validCookieDataResponse:',validCookieDataResponse);
                if(validCookieDataResponse.isValid) {
                    console.log('The cookie info is OK');
                    res.sendFile(__dirname +'/appWelcome.html');
                } else {
                    //Wrong info, user asked to authenticate again
                    console.log('Wrong cookie authentication data');
                    res.sendFile(__dirname +'/login.html');
                }
            });
        } else {
            console.log('There is no cookie authentication data');
            res.sendFile(__dirname +'/login.html');
        }
    });

app.get('/signup',function(req,res){
    console.log('signup page');
    let cookieStuff=req.signedCookies.user;
    console.log('cookieStuff:');
    console.log(cookieStuff);
    if (cookieStuff){
            console.log('begin validCookieData');
            const db = require("./db");
            const cookieIsValid = db.validCookieData(cookieStuff).then((validCookieDataResponse)=>{
                console.log('validCookieDataResponse:',validCookieDataResponse);
                if(validCookieDataResponse.isValid) {
                    console.log('The cookie info is OK');
                    res.sendFile(__dirname +'/appWelcome.html');
                } else {
                    res.sendFile(__dirname +'/signup.html');
                }
            });
        } else {
            console.log('There is no cookie authentication data');
            res.sendFile(__dirname +'/signup.html');
        }
});

app.post('/register',function(req,res){
    console.log('register service');
    const db = require("./db");
    let cookieStuff=req.signedCookies.user;
    console.log('cookieStuff:');
    console.log(cookieStuff);
    if (cookieStuff){
            console.log('begin validCookieData');
            const cookieIsValid = db.validCookieData(cookieStuff).then((validCookieDataResponse)=>{
                console.log('validCookieDataResponse:',validCookieDataResponse);
                if(validCookieDataResponse.isValid) {
                    console.log('The cookie info is OK');
                    res.sendFile(__dirname +'/appWelcome.html');
                }
            });
        } else {
            console.log('trying to create a new user');
            const resp = db.addUser(req.body).then((response)=>{
                console.log('add User response: ',response);
                //res.send({message:response.message}); 
                res.send(response); 
            });
        }
});

app.post('/userInfo',function(req,res){
    console.log('userInfo');
    let cookieStuff=req.signedCookies.user;
    console.log('cookieStuff:');
    console.log(cookieStuff.id);
    if (cookieStuff){
            console.log('begin validCookieData');
            const db = require("./db");
            const cookieIsValid = db.validCookieData(cookieStuff).then((validCookieDataResponse)=>{
                console.log('validCookieDataResponse:',validCookieDataResponse);
                if(validCookieDataResponse.isValid) {
                    console.log('The cookie info is OK');
                    console.log('sending the message');
                    res.send({message:validCookieDataResponse.name});
                } else {
                    //Wrong info, user asked to authenticate again
                    console.log('Wrong cookie authentication data');
                    res.sendFile(__dirname +'/login.html');
                }
            });
        } else {
            console.log('There is no cookie authentication data');
            res.sendFile(__dirname +'/login.html');
        }
    });



const recoverAuthenticationData = function(receivedAuthenticationData){
    // recover authenticationData from base64
    const authenticationData=new Buffer.from(receivedAuthenticationData.split(" ")[1], 'base64');
    return {    username: authenticationData.toString().split(":")[0],
                password: authenticationData.toString().split(":")[1] }
}

const checkUserDataOld = function (username, password){
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



