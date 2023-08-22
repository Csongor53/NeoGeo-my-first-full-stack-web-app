// enable access to the user models
const blogModel = require('../models/blogModel');
const authenticationsService = require('../services/authentication');

// enter edit user view
function getBlogs(req, res, next) {
    blogModel
        .getBlogs()
        .then((res) =>
            res.render('blogs')
        )
        .catch((error) => res.sendStatus(500));
}



module.exports = {
    getBlogs
}