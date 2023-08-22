const express = require('express')
const router = express.Router()

const gameController = require('../controllers/gameController')

module.exports = () => {

    // gets and renders a game's page
    router.post('/toGame', gameController.getGame)

    return router
}