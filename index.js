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
        }
        else
        {
            console.log('first else:test authorization info');
            step1=new Buffer.from(authStuff.split(" ")[1], 'base64');
            console.log(step1);
            //Extracting username:password from the encoding Authorization: Basic username:password
            step2=step1.toString().split(":");
            console.log(step2);
            //Extracting the username and password in an array
            if(step2[0]=='adm' && step2[1]=='123') 
            {
                //Correct username and password given
                console.log("WELCOME ADMIN");
                //Store a cookie with name=user and value=username
                res.cookie('user', 'admin', {signed: true});
                res.send({ message: 'Signed in the first time' });
            }
            else
            {
                //Wrong authentication info, retry
                console.log('last else: Wrong authentication info, retry');
                res.send({ message: 'all wrong' });
            }
        }
    }
    else
    {//Signed cookie already stored
        if(req.signedCookies.user=='admin')
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


