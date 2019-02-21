const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const Post = require('../models/Post');

// GET ALL POSTS
router.get('/getPosts', function (req, res, next) {
    Post.find()
    .then(results => {
        res.status(200).json({status: "success", data: results});
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// GET SINGLE POST
router.post('/getPost', function (req, res, next) {

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
              Post.findOne({
                _id: decoded.id
              })
              .then(results => {
                  res.status(201).json({status: "success", data: results});
              })
              .catch(err => {
                  res.status(500).json(err);
              });
          }
        }

      });
});

// CREATE POST
router.post('/createPost', function (req, res, next) {
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
                 
                    let model = new Post({
                        post_title: req.body.post_title,
                        post_content: req.body.post_content,
                        userId: results._id,
                        is_active: req.body.is_active
                    });
    
                    model.save()
                    .then(results => {
                        if (!results || results.length === 0) {
                            return res.status(500).json(results);
                        }
                        res.status(201).json({status: "success", message: "Post added successfully!!!"});
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

// UPDATE POST
router.put('/updatePost', function (req, res, next) {
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
                 
                    let updateData = {
                        post_title: req.body.post_title,
                        post_content: req.body.post_content,
                        userId: results._id,
                        is_active: req.body.is_active
                    };
    
                    Post.findOneAndUpdate({
                        _id: req.body.postid
                      }, updateData, {new:true})
                      .then(results => {        
                          res.status(201).json({status: "success", message: "Post updated successfully."});
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

// DELETE POST
router.delete('/deletePost', function (req, res, next) {
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
                 
                    Post.findOneAndDelete({
                        _id: req.body.postid
                      })
                    .then(results => {        
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

module.exports = router;