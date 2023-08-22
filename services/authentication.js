// JWT encodes (not encrypts) the data we want to transmit for authentication or info exchange
const jwt = require('jsonwebtoken');
// JWT token from secrets
const ACCESS_TOKEN_SECRET = require('../secrets').access_token_secret;
// Request bcrypt for checking encrypted passwords at login
const bcrypt = require('bcrypt');

const userModel = require('../models/userModel');

// Check if the encrypted input password and the database pw match
async function checkPassword(password, hash) {
    //return the password
    return await bcrypt.compare(password, hash);
}

async function getRole(email) {
    return await userModel.getUserRole(email);
}

// Log the user in by finding the user in the db and checking the pw
async function authenticateUser(
    { email, password, nickname, account_name },
    users,
    res
) {
    // Check whether the user exists and return their email (const user is the whole user)
    const user = users.find((u) => {
        return u.email === email;
    });

    let role = await getRole(user.email);
    console.log('role: ' + role)

    // if the email is in the db and the encrypted pw matches
    if (user && checkPassword(password, user.password)) {
        // Create new JWT with the uid and email as payload and secret
        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
                account_name: user.account_name,
                role: role,
            },
            ACCESS_TOKEN_SECRET
        );

        // Creates the actual cookie with the token
        res.cookie('accessToken', accessToken);
        res.redirect('/users/' + user.id);
    } else {
        res.send('Username or password incorrect');
    }
}

// A middleware func that authenticates an already logged-in user
function authenticateJWT(req, res, next) {
    // Save the value of the current token(cookie)
    const token = req.cookies['accessToken'];

    // Check if the token exists
    if (token) {
        // Verify the token's secret with the server's
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            //
            if (err) return res.sendStatus(403);

            // Set the user object if everything went fine
            console.log('User logged in: ' + user.account_name);

            req.user = user;
            next();
        });
    } else {
        next();
    }
}

function authenticateSecureJWT(req, res, next) {
    // Save the value of the current token(cookie)
    const token = req.cookies['accessToken'];

    // Check if the token exists
    if (token) {
        // Verify the token's secret with the server's
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            //
            if (err) return res.sendStatus(403);

            // Set the user object if everything went fine
            console.log('User logged in: ' + user.account_name);

            req.user = user;
            next();
        });
    } else {
        res.send(
            'You are not logged in. Please log in or register to see this page!'
        );
    }
}

function authenticateAdminJWT(req, res, next) {
    // Save the value of the current token(cookie)
    const token = req.cookies['accessToken'];

    // Check if the token exists
    if (token) {
        // Verify the token's secret with the server's
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            //
            if (err) return res.sendStatus(403);

            // Set the user object if everything went fine
            console.log(user.role);
            req.user = user;
            if (req.user.role === 'admin') next();
            else res.send('You are not logged in. Please log in or register to see this page!')
        });
    } else {
        res.send(
            'You are not logged in. Please log in or register to see this page!'
        );
    }
}

module.exports = {
    authenticateUser,
    authenticateSecureJWT,
    authenticateJWT,
    authenticateAdminJWT,
};
