//
// Require node modules
//
// BodyParser: simplify getting a response as res.body used for json, raw body, text, URL-encoded
// Cors: Cross-Origin Resource Sharing. (secure resource sharing) Allows or restricts requested resources on a web server depending on where the HTTP request was initiated.
// Express-fileupload: Uploaded files will be accessible from req.files.(...)
// Cookie-parser: Parses cookies attached to the client request object(req) such as the authentication JWT
// http-errors: Used to create http errors
// ejs: Express js is a templating language combining html and js. (<% (...) %>)
//
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpLoad = require('express-fileupload')
const cookieParser = require('cookie-parser')
const createError = require('http-errors')
const ejs = require('ejs')
const ws = require("./services/websockets.js")
const mysql = require("mysql")
const db = require("./services/database.js")

const expressValidator = require('express-validator');

const flash = require('express-flash');
const session = require('express-session');
//
// App type, port(Azure or local host), and routes

const app = express()
const port = process.env.PORT || 3000

let routes = require('./routes')

// global variable (used in templates)
app.locals.siteName = 'NeoGeo'

//
// Setting up the application
//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret:"imcrazyyo",
        cookie: { secure: false, maxAge: 14400000 },
    })
);
app.use(flash());

app.use(fileUpLoad({ createParentPath: true }));
app.use(cookieParser());
app.use(expressValidator())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', routes())

// Renders the error message in the error view amongst others
app.use((err, req, res, next) => {
    console.log(err)
    res.locals.message = err.message
    const status = err.status || 500
    res.locals.status = status
    res.status(status)
    res.render('error')
})




//get create-blog here
app.get("/create-blog", async function(req, res, next) {

    new Promise((reject, resolve) => {
        db.query("", async function(err, result, fields) {
            if (err) {
                reject(err)
            }
            else {
                resolve(res.render("create-blog"))
            }
        })
    }).then(result => res.render("create-blog", {
        title:"",
        subtitle:"",
        post:"",
        author:""
    })).catch(err => res.status(400))
})



//create blog here

app.post("/create-blog", function(req, res, next) {
    req.assert("title", "title is required").notEmpty()
    req.assert("subtitle", "sub title is required").notEmpty()
    req.assert("post", "post is required").notEmpty()
    req.assert("author", "author is required").notEmpty()

    //initializing validation from express
    //did it with npm validate as well
    //best in the npm market
    const errors = req.validationErrors()

    if(!errors) {
        let blog = {
            title: req.sanitize("title").escape().trim(),
            subtitle: req.sanitize("subtitle").escape().trim(),
            post: req.sanitize("post").escape().trim(),
            author:req.sanitize("author").escape().trim()
        }

        new Promise((resolve, reject) => {
            db.query("INSERT INTO ssc_blogs SET ?",blog, async function (err, result, fields) {
                if (err) {
                    req.flash("error", err)
                    console.log(err)
                }

                else {
                    resolve(res.render("create-blog", {
                        title: blog.title,
                        subtitle:blog.subtitle,
                        post:blog.post,
                        author:blog.author
                    }))
                }
            })
        }).then(result => res.render("create-blog")).catch(err => res.status(400))
    } else {
        if( err ){
            req.flash("error",err)
            //throw err;
            //console.log(err)
            //reject(err)
        } else {
            res.render("create-blog")
        }
    }
})






app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});