require('dotenv').config();   // <-- used if the encryption word was stored in .env, so it would be fetched by: process.env.SECRET
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    version: Number
});

module.exports = {
    'key_to_create' : function () {
        userSchema.plugin(encrypt, {
            secret: process.env.SECRET,
            encryptedFields: ['password']
        });
        return (mongoose.model("User", userSchema))
    },

    'key_to_query' : function(){
        return (mongoose.model("User", userSchema)) 
    }
}