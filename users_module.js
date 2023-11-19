require('dotenv').config();   // <-- used if the encryption word was stored in .env, so it would be fetched by: process.env.SECRET
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    version: Number
});

module.exports = {
    'an_exports_key' : function (in_string) {
        userSchema.plugin(encrypt, {
            secret: in_string,
            encryptedFields: ['password']
        });
        return (mongoose.model("User", userSchema))
    },

    'to_query' : function(){
        return(mongoose.model("User", userSchema))
    }
}