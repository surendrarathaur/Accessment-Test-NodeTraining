const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// GET ALL COMMENTS
router.get('/getComments', function (req, res, next) {
    Comment.find()
    .then(results => {
        res.status(200).json({status: "success", data: results});
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// GET SINGLE COMMENT
router.post('/getComment', function (req, res, next) {

      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({status: "error", message: "Request body is missing!"});
      }

      jwt.verify(req.headers['x-access-token'], config.secret, function(err, decoded) {
        if (err) {
          res.json({status:"error", message: err.message, data:null});
        }else{
          // add user id to request
          //console.log(decoded.id);

          if(req.body.id == decoded.id){
              
            Comment.findOne({
                _id: req.body.commentid
            })
            .then(doc => {
                res.status(200).json({status: "success", data: doc});
            })
            .catch(err => {
                res.status(500).json(err);
            });
              
          }
        }

      });
});

// CREATE COMMENT
router.post('/createComment', function (req, res, next) {
  jwt.verify(req.headers['x-access-token'], config.secret, function(err, decoded) {
    if (err) {
        res.json({status:"error", message: err.message, data:null});
    }else{
            if (Object.keys(req.body).length === 0) {
                return res.status(400).send({status: "error", message: "Request body is missing!"});
            }

            if (Object.keys(req.body).length != 0) {
                
                User.findOne({
                    _id: req.body.id
                })
                .then(results => {
                 
                    Post.findOne({
                        _id: req.body.postid
                    })
                    .then(data => {

                        let model = new Comment({
                            comment_content: req.body.comment_content,
                            userId: req.body.id,
                            postId: data._id,
                            is_active: req.body.is_active
                        });

                        model.save()
                        .then(doc => {
                            if (!doc || doc.length === 0) {
                                return res.status(500).json(doc);
                            }
                            res.status(201).json({status: "success", message: "Comment added successfully!!!"});
                            })
                            .catch(err => {
                                res.status(500).json(err);
                        });

                    })
                    .catch(err => {
                        res.status(500).json(err);
                    });

                })
                .catch(err => {
                    res.status(500).json(err);
                });
 
            }
        }
    });
  
});

//UPDATE COMMENT
router.put('/updateComment', function (req, res, next) {
    jwt.verify(req.headers['x-access-token'], config.secret, function(err, decoded) {
      if (err) {
        res.json({status:"error", message: err.message, data:null});
      }else{
            if (Object.keys(req.body).length === 0) {
                return res.status(400).json({status: "error", message: "Request body is missing!"});
            }

            if (Object.keys(req.body).length != 0) {
                
                User.findOne({
                    _id: req.body.userId
                })
                .then(results => {

                    Post.findOne({
                        _id: req.body.postid
                    })
                    .then(data => {

                        let updateData = {
                            comment_content: req.body.comment_content,
                            userId: req.body.userId,
                            postId: req.body.postid,
                            is_active: req.body.is_active
                        };

                        Comment.findOneAndUpdate({
                            _id: req.body.id
                        }, updateData, {new:true})
                        .then(doc => {        
                            res.status(201).json({status: "success", message: "Comment updated successfully."});
                        })
                        .catch(err => {
                            res.status(500).json(err);
                        });

                    })
                    .catch(err => {
                        res.status(500).json(err);
                    });
                   
                })
                .catch(err => {
                    res.status(500).json(err);
                });
 
            }
        
        }
    });
    
});

// DELETE COMMENT
router.delete('/deleteComment', function (req, res, next) {
    jwt.verify(req.headers['x-access-token'], config.secret, function(err, decoded) {
        if (err) {
          res.json({status:"error", message: err.message, data:null});
        }else{

            if (Object.keys(req.body).length === 0) {
                return res.status(400).json({status: "error", message: "Request body is missing!"});
            }

            if (Object.keys(req.body).length != 0) {
                
                User.findOne({
                    _id: req.body.id
                })
                .then(results => {
                 
                    Comment.findOneAndDelete({
                        _id: req.body.commentid,
                        userId: req.body.id
                      })
                    .then(doc => {        
                          res.status(201).json({status: "success", message: "Post deleted successfully."});
                    })
                    .catch(err => {
                          res.status(500).json(err);
                    });
                })
                .catch(err => {
                    res.status(500).json(err);
                });
 
            }
            
        }
    });
});

//UPDATE USER COMMENT LIKE/DISLIKE
router.put('/likeComment', function (req, res, next) {
    jwt.verify(req.headers['x-access-token'], config.secret, function(err, decoded) {
      if (err) {
        res.json({status:"error", message: err.message, data:null});
      }else{
            if (Object.keys(req.body).length === 0) {
                return res.status(400).json({status: "error", message: "Request body is missing!"});
            }

            if (Object.keys(req.body).length != 0) {
                
                User.findOne({
                    _id: req.body.userId
                })
                .then(results => {

                    Post.findOne({
                        _id: req.body.postid
                    })
                    .then(data => {

                        let updateData = {
                            userId: req.body.userId,
                            postId: req.body.postid,
                            likes: {
                                userId: req.body.userId,
                                postId: req.body.postid,
                                status: req.body.like
                            },
                            is_active: req.body.is_active
                        };

                        Comment.findOneAndUpdate({
                            _id: req.body.id
                        }, updateData, {new:true})
                        .then(doc => {        
                            res.status(201).json({status: "success", message: "Comment likes successfully."});
                        })
                        .catch(err => {
                            res.status(500).json(err);
                        });

                    })
                    .catch(err => {
                        res.status(500).json(err);
                    });
                   
                })
                .catch(err => {
                    res.status(500).json(err);
                });
 
            }
        
        }
    });
    
});

module.exports = router;