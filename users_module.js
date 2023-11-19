require('dotenv').config();   // <-- used if the encryption word was stored in .env, so it would be fetched by: process.env.SECRET
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

module.exports = {
    'model_encryption_plugin' : function () {
        userSchema.plugin(encrypt, {
            secret: process.env.SECRET,
            encryptedFields: ['password']
        });
        return(mongoose.model("User", userSchema))
    },

    'model_no_plugin' : function(){
        return(mongoose.model("User", userSchema)) 
    },

    'schema' : function(){
        return(userSchema)
    }
}