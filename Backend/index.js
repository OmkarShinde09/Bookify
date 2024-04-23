const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

var session = require('express-session');
var flush = require('connect-flash');

const Book = require('./models/book');

const userRoute = require('./routes/user');
const bookRoute = require('./routes/book');
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

mongoose
    .connect('mongodb://localhost:27017/bookify')
    .then((e) => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use(session({
    secret: 'secret',
    cookie: {maxAge: 6000},
    resave: false,
    saveUninitialized: false,
}));
app.use(flush());


app.get("/", async (req, res) =>{
    const allBooks = await Book.find({});
    res.render("home", {
        message: req.flash('message'),
        user: req.user,
        books: allBooks,
    });
});

app.use('/user', userRoute);
app.use('/book', bookRoute);

app.use(express.static(path.join(__dirname, 'publics')));
app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));