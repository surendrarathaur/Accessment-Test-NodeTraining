const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//Create User Schema 
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    image: {
         data: Buffer, 
         contentType: String 
    },
    is_active: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// hash user password before saving into database
UserSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

//Create User Schema Model  
var User = mongoose.model('User', UserSchema);
//export module User model
module.exports = User;