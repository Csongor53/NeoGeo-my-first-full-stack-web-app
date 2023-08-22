
const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController');
const authenticationsService = require('../services/authentication')

module.exports = () => {
    router.use(authenticationsService.authenticateAdminJWT);

    router.get ('/', userController.adminPanel)

    router.post('/delete', userController.adminDelete)


    return router
}