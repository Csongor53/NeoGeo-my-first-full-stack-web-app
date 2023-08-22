// Get access to the database
const db = require('../services/database').config;

// get one of the games from the database by its id
let getGameById = (id) =>
    new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM ssc_games WHERE id = ' + parseInt(id);
        db.query(sql, function (err, users) {
            if (err) reject(err);
            else resolve(users[0]);
        });
    });

module.exports = {
    getGameById,
};
