//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const bcrypt = require('bcrypt');
const saltRounds = 3;
const User_required_function = require('./users_module');
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
    try{
        const User_model_creation = User_required_function.key_to_create();
        bcrypt.genSalt(saltRounds, async function(err, salt) {
            bcrypt.hash( (req.body.password), salt, async function(err, hash) {
                // Store hash in your password DB.
                await User_model_creation.create({
                    email: (req.body.username),
                    password: hash,
                    version: 13
                });
            });
        });
        res.render('secrets')
    }catch(err){
        console.log('error in app.post(/register:', err.message);
        return res.render('login')
    }
});

app.post('/login', async function(req,res){
    try{
        // Load hash from your password DB.
        //... fetch user from a db etc.
        let User_model_query;
        try{
            User_model_query = User_required_function.key_to_create();
        } catch (err){
            console.log('>>> catched error:', err.message);
            User_model_query = User_required_function.key_to_query();
        } finally{
            const found_user = await User_model_query.findOne( { email: req.body.username } );
            console.log('found_user:'); console.log(found_user);
            const match = await bcrypt.compare( (req.body.password), found_user.password);
            if(match) {
                console.log('>>> MATCHED');
                res.render('secrets')
            } else{
                console.log('>>> DID NOT MATCH');
                res.render('home')
            }
        }
    } catch (err){
        console.log('error in app.post(/login:', err.message)
    }
});

app.post('/submit', function(req,res){
    const new_secret = req.body.secret;
});

app.listen(3000, function(){
    console.log('Server started on port 3000')
})