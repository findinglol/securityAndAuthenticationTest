require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB', { useUnifiedTopology: true, useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/login", (req, res) => {
    res.render('login');
});

app.get("/register", (req, res) => {
    res.render('register');
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save((err) => {
        if (err) {
            res.send(err);
        } else {
            res.render('secrets');
        }
    });
});

app.post("/login", (req, res) => {
    const getEmail = req.body.username;
    const getPassword = req.body.password;

    User.findOne({ email: getEmail }, (err, foundUser) => {
        if (err) {
            res.send(err);
        } else {
            if (foundUser) {
                if (foundUser.password === getPassword) {
                    res.render("secrets");
                }
            }
        }
    });

});

app.listen(3000, () => {
    console.log('Server running on Port Number 3000');
});