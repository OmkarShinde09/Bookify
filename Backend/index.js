const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const userRoute = require('./routes/user')

const app = express();
const PORT = 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) =>{
    res.render("home");
});

app.use('/user', userRoute);


app.use(express.static(path.join(__dirname, 'publics')));
app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));