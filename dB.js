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

module.exports = {getUsers}
