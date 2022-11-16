async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'usersauthentication'
      });
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function getUsers(){
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM users');
    return rows;
}

async function checkUserData(username, password) {
    console.log('checkUserData with mysql database');
    let msg = {error: true, msg: '', id: '', username: '', name: ''};
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM users WHERE login='${username}'`);
    
    if (rows.length>0){
        // console.log('checkUserData rows:');
        // console.log(rows.length);
        const userData = rows.pop();
        // console.log(userData.senha);
        // console.log(password);
        // console.log(userData.senha==password);
        // console.log(rows.length>0);
        if (userData.senha==password) {
            console.log('password is ok');
            // await conn.query(`UPDATE users SET active=true WHERE id='${userData.id}'`);
            msg = {error: false, msg: '', id: userData.id, username: userData.login, name: userData.name};

        }
    } else {
             console.log('login not found within DB');
             msg = {error: true, msg: 'error: login or password incorrect', id: '', username: '', name: ''};
    }
    // console.log('msg');
    // console.log(msg);
    return msg;
}


async function validCookieData(cookieData) {
    console.log('validCookieData with mysql database');
    let msg = {isValid: false, username: '', name: ''};
    const conn = await connect();
        const id = cookieData.id;
        console.log('cookie id: '+id);
        const [rows] = await conn.query(`SELECT * FROM users WHERE id='${id}'`);
        if (rows.length>0){
            const userData = rows.pop();
            console.log('id: ',userData.id);
            if (userData.id===Number(id)){
                console.log('cookie true');
                msg = {isValid: true, username: userData.login, name: userData.name};
                return msg;
            }
        }
    console.log('cookie false');
    return msg;
}

async function getUserinfo(username, password) {
    console.log('checkUserData with mysql database');
    let msg = {error: true, msg: '', id: '', username: '', name: ''};
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM users WHERE login='${username}'`);
    
    if (rows.length>0){
        // console.log('checkUserData rows:');
        // console.log(rows.length);
        const userData = rows.pop();
        // console.log(userData.senha);
        // console.log(password);
        // console.log(userData.senha==password);
        // console.log(rows.length>0);
        if (userData.senha==password) {
            console.log('password is ok');
            msg = {error: false, msg: '', id: userData.id, username: userData.login, name: userData.name};
        }
    } else {
             console.log('login not found within DB');
             msg = {error: true, msg: 'error: login or password incorrect', id: '', username: '', name: ''};
    }
    // console.log('msg');
    // console.log(msg);
    return msg;
}


module.exports = {getUsers, checkUserData, validCookieData}
