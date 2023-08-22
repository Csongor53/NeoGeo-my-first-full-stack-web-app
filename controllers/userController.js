// enable access to the user models
const userModel = require('../models/userModel');
const authenticationsService = require('../services/authentication');

// called when user logs in
function login(req, res) {
    userModel
        .getUsers()
        .then((users) =>
            authenticationsService.authenticateUser(req.body, users, res)
        )
        .catch((err) => res.sendStatus(500));
}

// called when user registers
function register(req, res) {
    userModel
        .addUser(req.body)
        .then((user) =>
            authenticationsService.authenticateUser(req.body, [req.body], res)
        )
        .catch((err) => res.sendStatus(500));
}

// render the user profile
function toProfile(req, res) {
    userModel
        .getUser(parseInt(req.params.id))
        .then((user) =>
            res.render('layout', {
                template: 'user-profile',
                user: user,
            })
        )
        .catch((error) => res.sendStatus(500));
}

// enter edit user view
function editUser(req, res, next) {
    userModel
        .getUser(req.params.id)
        .then((user) =>
            res.render('layout', {
                template: 'edit-user',
                user: user,
            })
        )
        .catch((error) => res.sendStatus(500));
}

// update the user when finished editing
function updateUser(req, res, next) {
    userModel
        .updateUser(req.body)
        .then((user) =>
            res.render('layout', {
                template: 'user-profile',
                user: user,
            })
        )
        .catch((error) => res.sendStatus(500));
}

// enter edit banner view
function editBanner(req, res, next) {
    userModel
        .getUser(req.params.id)
        .then((user) =>
            res.render('layout', {
                template: 'edit-user-banner',
                loggedin: true,
                user: user,
            })
        )
        .catch((error) => res.sendStatus(500));
}

// change the user's banner when finished editing
function updateBanner(req, res, next) {
    console.log(req.files);
    try {
        let picture = req.files.banner;
        let filename = './public/uploads/' + req.params.id + '_banner.jpg';
        userModel
            .getUser(req.params.id)
            .then((user) =>
                picture
                    .mv(filename)
                    .then((banner) =>
                        res.render('layout', {
                            template: 'user-profile',
                            user: user,
                        })
                    )
                    .catch((error) => res.sendStatus(500))
            )
            .catch((error) => res.sendStatus(500));
    } catch (err) {
        res.status(500).send(err);
    }
}

// delete the currently logged-in user
function deleteUser(req, res) {
    console.log('u delete controller');
    userModel
        .deleteUser(req.params.id)
        .then((u) => res.redirect('/'))
        .catch((error) => res.sendStatus(500));
}

// delete the JWT access token after logout
function logOut(req, res) {
    res.cookie('accessToken', '', { maxAge: 0 });
    res.redirect('/');
}

function adminPanel(req, res) {
    userModel
        .getUsers()
        .then((users) =>
            res.render('layout', {
                template: 'admin',
                user: req.user,
                data: users,
            })
        )
        .catch((error) => res.sendStatus(500));
}

function adminDelete(req, res) {
    userModel
        .adminDelete(req.params.id)
        .then(res.redirect('/'))
        .catch((error) => res.sendStatus(500));
}

module.exports = {
    login,
    register,
    toProfile,
    editUser,
    updateUser,
    editBanner,
    updateBanner,
    deleteUser,
    logOut,
    adminPanel,
    adminDelete,
};
