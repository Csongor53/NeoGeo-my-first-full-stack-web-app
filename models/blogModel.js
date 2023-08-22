// Get access to the database
const db = require('../services/database').config;
// Request bcrypt to encrypt passwords at register
const bcrypt = require('bcrypt');
const { promise } = require('bcrypt/promises');
const { logOut } = require('../controllers/userController');

//
// MODELS BELOW from ("ssc_users" table in mysql)
//

// gets all the users from the database
let getBlogs = () => {
    new Promise((resolve, reject) => {
        db.query('SELECT * FROM ssc_blogs', function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        })
    })
}

let createBlog = () => {
    new Promise((resolve, reject) => {
        db.query("INSERT INTO ssc_blogs SET ?", function(err, result, fields) {
            if (err) reject(err);
            resolve(result);
        })
    })
}

//editblog
let editBlog = () => {
    new Promise((resolve, reject) => {
        db.query("SELECT * FROM ssc_blogs WHERE id = " + req.params.id, function(err, result, fields) {
            if(err) reject(err);
            resolve(result)
        })
    })
}






//update blog






module.exports = {
    getBlogs,
    createBlog
}