const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Create Post Schema 
var PostSchema = new mongoose.Schema({
    post_title: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    post_content: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

//Create Post Schema Model  
var Post = mongoose.model('Post', PostSchema);
//export module Post model
module.exports = Post;