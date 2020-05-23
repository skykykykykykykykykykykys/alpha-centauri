var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "eduka-test"
});

con.connect(function (err) {
    if(err) throw err;
    console.log('database connected!');
});

module.exports = con;