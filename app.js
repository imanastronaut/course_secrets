//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User_required_function = require('./users_module');
const md5 = require('md5');         // <-- do we really need it yet?
const clean = require('get-clean-string')();

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded( { extended: true } ));

mongoose.connect('mongodb://localhost:27017/userSecretsDB');


app.get('/', function(req,res){
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
    let new_user;
    try{
        const User_model = User_required_function.an_exports_key( (clean(req.body.username, '-')) );
        console.log('>>> User_2:');
        console.log(User_model);
        bcrypt.genSalt(saltRounds, async function(err, salt) {
            bcrypt.hash((req.body.password), salt, async function(err, hash) {
                // Store hash in your password DB.
                const new_user = await User_model.create({
                    email: req.body.username,
                    password: hash,
                    version: 6
                });
                console.log(new_user)
            });
        });
        res.render('secrets')
    }catch(err){
        console.log(err.message);
        return res.render('login')
    }
});

app.post('/login', async function(req,res){
    const login_email = req.body.username;
    const login_password = req.body.password;
    try{
        const login_arr = await User.find({ email: login_email });
        if (login_arr.length > 0){
            console.log('login_arr:');
            console.log(login_arr);
            if (login_arr[0].password == login_password){
                res.render('secrets')
            } else{
                console.log('! WRONG PASSWORD !')
                res.render('home')
            }
        } else{
            console.log('! USER DOES NOT EXIST !')
            res.render('home')
        }
    } catch (err){
        console.log(err.message)
    }
});

app.post('/submit', function(req,res){
    const new_secret = req.body.secret;
});

app.listen(3000, function(){
    console.log('Server started on port 3000')
})