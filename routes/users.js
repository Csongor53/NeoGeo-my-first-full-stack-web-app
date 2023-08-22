const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController');
const authenticationsService = require('../services/authentication')

module.exports = () => {
    router.use(authenticationsService.authenticateSecureJWT);

    router.get('/:id', (req, res, next) => {
        res.redirect('/')
    });

    // takes the user to their profile page
    router.get('/:id/user-profile', userController.toProfile);


    // Edit user info
    router.get('/:id/user-profile/edit', userController.editUser)
    router.post('/:id/user-profile', userController.updateUser)

    // Edit banner
    router.get('/:id/user-profile/banner', userController.editBanner)
    router.post('/:id/user-profile/banner', userController.updateBanner)

    // Delete user
    router.get('/:id/user-profile/delete',userController.deleteUser)

    return router
}