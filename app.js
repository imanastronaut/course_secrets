//jshint esversion:6

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
    secret: 'abcdefghi',
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

app.get('/register', function(req,res){
    res.render('register')
});

app.get('/submit', function(req,res){
    res.render('submit')
});

app.post('/register', async function(req,res){
    
});

app.post('/login', async function(req,res){
    
});

app.post('/submit', function(req,res){
    const new_secret = req.body.secret;
});

app.listen(3000, function(){
    console.log('Server started on port 3000')
})