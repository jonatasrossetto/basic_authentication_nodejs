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
    const conn = await connect();
    if (cookieData) {
        const id = cookieData.id;
        console.log('id: '+id);
        const [rows] = await conn.query(`SELECT * FROM users WHERE id='${id}'`);
        if (rows.length>0){
            const userData = rows.pop();
            console.log(userData.userId);
            console.log(userData.active);
            if (userData.userId===Number(id)&&userData.active===true){
                console.log('cookie true');
                return true;
            }
        }
    }
    console.log('cookie false');
    return false;
}


module.exports = {getUsers, checkUserData, validCookieData}
