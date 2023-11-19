//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded( { extended: true } ));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userSecretsDB');
const User_required_function = require('./users_module');
const User_schema = User_required_function.schema();

User_schema.plugin(passportLocalMongoose);

const User_model = new mongoose.model("User", User_schema);

passport.use(User_model.createStrategy());
passport.serializeUser(User_model.serializeUser());
passport.deserializeUser(User_model.deserializeUser());

app.get('/', function(req,res){
    console.log(User_model);
    res.render('home')
});

app.get('/login', function(req,res){
    res.render('login')
});

app.get('/secrets', function(req,res){
    if (req.isAuthenticated()){
        res.render('secrets')
    } else{
        res.redirect('/login')
    }
});

app.get('/register', function(req,res){
    res.render('register')
});

app.get('/submit', function(req,res){
    res.render('submit')
});

app.post('/register', async function(req,res){
    User_model.register({ username: req.body.username }, req.body.password,
    function(err, user){
        if (err){
            console.log('>>> error in app.post(/register:', err.message)
            res.redirect('/register')
        } else{
            passport.authenticate('local')(req, res, function(){        // <-- this method sends a cookie!
                res.redirect('/secrets')
            })
        }
    })
});

app.post('/login', function(req,res){
    const wannabe_user = new User_model({
        username: req.body.username,
        password: req.body.password
    });
    req.login(wannabe_user, function(err){
        if (err){
            console.log('error in app.post(/login: ', err.message);
            res.render('login')
        } else{
            passport.authenticate('local')(req, res, function(){        // <-- this method sends a cookie!
                res.redirect('/secrets')
            })
        }
    })
});

app.post('/submit', function(req,res){
    const new_secret = req.body.secret;
});

app.listen(3000, function(){
    console.log('Server started on port 3000')
})