// To establish a connection with mysql database
const mysql = require('mysql')
// For getting et the password from secrets file
const secrets = require('../secrets')

const config = mysql.createConnection({
    host: "atp.fhstp.ac.at",
    port: 8007,
    user: "cc211049",
    password: secrets.dbPassword,
    database: "cc211049"
});

config.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!")
})

module.exports = {config};