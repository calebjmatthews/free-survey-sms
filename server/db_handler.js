const mysql = require('promise-mysql');

class DataBaseHandler {
  pool;

  constructor() {
    mysql.createPool({
      host: 'localhost',
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      waitForConnections: true,
      connectionLimit: 50,
      queueLimit: 0
    }).then((res) => {
      this.pool = res;
    });
  }
}

let dbh = new DataBaseHandler();

module.exports = {dbh};
