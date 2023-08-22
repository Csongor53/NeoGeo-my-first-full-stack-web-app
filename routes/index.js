const express = require('express');
const router = express.Router();

//
// The first router in the code path. Can re-route to users or games router
//

// User controller: Used for services such as login, register, logout
// Authentication: used not only in the users router so the user profile can be displayed on the nav bar at all times
const userController = require('../controllers/userController');
const authenticationsService = require("../services/authentication");

const usersRoute = require('./users');
const gamesRoute = require('./games');
const adminRoute = require('./admin');

module.exports = () => {

    router.use(authenticationsService.authenticateJWT);

    // render the home view when accessing the website first
    router.get('/', (req, res, next) => {
        try {
            res.render('layout', {
                template: 'home',
                user: req.user,
                sliderItems: [
                    {
                        img: '/public/images/games/game1.png',
                        title: 'Swifty Snake',
                        text: "This is a newly created browser game based on the '90s snake game, but now you can play it on your phone too.",
                        link: '1',
                    },
                    {
                        img: '/public/images/games/game2.png',
                        title: 'BamPack',
                        text: 'BamPack is a side scroller game with a twist! You can go through the altering levels competing for the highest score in the game all while massacring zombies with a huge gun and a jetpack!',
                        link: '2',
                    },

                    {
                        img: '/public/images/games/game3.png',
                        title: 'Trapped Among The Hordes',
                        text: 'Shoot all the zombies and take the challenge.Survive at all coast.',
                        link: '3',
                    },

                    {
                        img: '/public/images/games/game4.png',
                        title: 'Whack a Clown',
                        text: 'Try to hit the clown as many times as possible and score as many points as possible within 1 minute.',
                        link: '4',
                    },
                ],
            });
        } catch (err) {
            return next(err);
        }
    });

    // takes the user to the login/register view
    router.get('/login-register', (req, res, next) => {
        try {
            res.render('layout', {
                template: 'login-register',
                user: req.user
            });
        } catch (err) {
            return next(err);
        }
    });

    // Services: Register, login, logout
    router.post('/register', (req, res, next) => {
        userController.register(req, res);
    });

    router.post('/login', (req, res, next) => {
        userController.login(req, res);
    });

    router.get('/logout', (req, res, next) => {
        userController.logOut(req, res);
    });

    //chat page rendering
    router.get('/chat', (req, res, next) => {
        try {
            res.render('layout', {
                template: 'chat',
                user:req.user
            });
        } catch (err) {
            return next(err);
        }
    });

    //blog post rendering
    router.get("/create-blog", (req, res, next) => {
        try {
            res.render('layout', {
                template: 'create-blog',
                user:req.user
            });
        } catch (err) {
            return next(err);
        }
    })

    router.get("/blogs", (req, res, next) => {
        try {
            res.render('layout', {
                template: 'blogs',
                user:req.user
            });
        } catch (err) {
            return next(err);
        }
    })


    // Goes to the next routes depending on the path
    router.use('/users', usersRoute());
    router.use('/games', gamesRoute());
    router.use('/admin', adminRoute());

    return router;
};
