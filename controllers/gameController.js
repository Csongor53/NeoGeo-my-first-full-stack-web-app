const gameModel = require('../models/gameModel');

// renders the game clicked on
function getGame(req, res) {
    gameModel
        .getGameById(req.body.id)
        .then((game) => {
            res.render('layout', {template: 'game', game: game, user: req.user})
        })
        .catch((err) => res.sendStatus(500));
}

module.exports = {
    getGame,
};
