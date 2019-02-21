const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Create Comment Schema 
var CommentSchema = new mongoose.Schema({
    comment_content: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    likes: {
        type: Array,
        default: []
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

//Create Comment Schema Model  
var Comment = mongoose.model('Comment', CommentSchema);
//export module Comment model
module.exports = Comment;