// Get access to the database
const db = require('../services/database').config;
// Request bcrypt to encrypt passwords at register
const bcrypt = require('bcrypt');

//
// MODELS BELOW from ("ssc_users" table in mysql)
//

// gets all the users from the database
let getUsers = () =>
    new Promise((resolve, reject) => {
        db.query('SELECT * FROM ssc_users', function (err, users, fields) {
            if (err) reject(err);
            resolve(users);
        });
    });

// get a single user by their id
let getUser = (id) =>
    new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM ssc_users WHERE id = ' + parseInt(id);
        db.query(sql, function (err, users, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(users[0]);
            }
        });
    });

// replace the user's data when edited
let updateUser = (userData) =>
    new Promise(async (resolve, reject) => {
        let pw = await bcrypt.hash(userData.password, 10);

        let sql =
            'UPDATE ssc_users SET ' +
            ' nickname= ' +
            db.escape(userData.nickname) +
            ', account_name= ' +
            db.escape(userData.account_name) +
            ', email=' +
            db.escape(userData.email) +
            ', password=' +
            db.escape(pw) +
            'WHERE id= ' +
            parseInt(userData.id);

        db.query(sql, function (err, user, fields) {
            if (err) throw err;
            console.log('I just changed: ' + user.affectedRows + ' row(s)');
            resolve(userData);
        });
    });

// Create a new user in the database when registering
let addUser = (userData) =>
    new Promise(async (resolve, reject) => {
        // Encrypt the password given by the user
        let pw = await bcrypt.hash(userData.password, 10);

        let sql =
            'INSERT INTO ssc_users (account_name, email, nickname, password) VALUES (' +
            db.escape(userData.account_name) +
            ',' +
            db.escape(userData.email) +
            ',' +
            db.escape(userData.nickname) +
            ',' +
            db.escape(pw) +
            ')';

        db.query(sql, function (err, user) {
            if (err) throw err;

            userData.id = user.insertId;
            console.log('User Registered: ');
            console.log(userData);
            resolve(userData);
        });
    });

let deleteUser = (id) =>
    new Promise((resolve, reject) => {
        // SQL statement that deletes all data from a row in the specified table
        let sql = 'DELETE FROM ssc_users WHERE id = ' + parseInt(id);

        db.query(sql, function (err, res) {
            if (err) reject(err);
            console.log('in u model');
            resolve(res);
        });
    });

let getUserRole = (email) =>
    new Promise((resolve, reject) => {
        let sql = 'SELECT role FROM ssc_users WHERE email = ' + `'${email}'`;

        db.query(sql, function (err, role) {
            if (err) reject(err);
            resolve(role[0].role);
        });
    });

let adminDelete = (id) => new Promise((resolve, reject) => {
    let sql = 'DELETE * FROM ssc_users WHERE id = ' + parseInt(id);

    db.query(sql, function(err, res){
        if (err) reject(err);
        resolve(res);
    })
})

module.exports = {
    getUsers,
    getUser,
    updateUser,
    addUser,
    deleteUser,
    getUserRole,
    adminDelete
};
