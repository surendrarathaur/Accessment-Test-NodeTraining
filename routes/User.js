const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer  = require('multer');
const config = require('../config/config');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const upload = multer({ dest:'uploads/'});


// GET ALL USERS DATA
router.get('/getUsers', function (req, res, next) {
    User.find()
    .then(results => {
        res.status(200).json({status: "success", data: results});
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// GET ONE USERS DATA
router.post('/getUser', function (req, res, next) {

      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({status: "error", message: "Request body is missing!"});
      }

      jwt.verify(req.headers['x-access-token'], config.secret, function(err, decoded) {
        if (err) {
          res.json({status:"error", message: err.message, data:null});
        }else{
          // add user id to request
         // console.log(decoded.id);

          if(req.body.id == decoded.id){
              User.findOne({
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

// CREATE USER
router.post('/createUser', function (req, res, next) {
  
  if (Object.keys(req.body).length === 0) {
      return res.status(400).send({status: "error", message: "Request body is missing!"});
  }

  if (Object.keys(req.body).length != 0) {
      
      let model = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        city: req.body.city,
        is_active: req.body.is_active
      });

      model.save()
      .then(results => {
          if (!results || results.length === 0) {
              return res.status(500).json(results);
          }
          res.status(201).json({status: "success", message: "User added successfully!!!"});
          })
          .catch(err => {
            res.status(500).json(err);
      });
  }
  
});

// Update USER DATA
router.put('/updateUser', function (req, res, next) {
  
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({status: "error", message: "Request body is missing!"});
    }

    jwt.verify(req.headers['x-access-token'], config.secret, function(err, decoded) {
      if (err) {
        res.json({status:"error", message: err.message, data:null});
      }else{
        if(req.body.id == decoded.id){
          
            let updateData = {
              username: req.body.username,
              password: req.body.password,
              email: req.body.email,
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              city: req.body.city,
              is_active: req.body.is_active
            };

            User.findOneAndUpdate({
                  _id: decoded.id
                }, updateData, {new:true})
                .then(results => {        
                    res.status(201).json({status: "success", message: "Record updated successfully."});
                })
                .catch(err => {
                    res.status(500).json(err);
            });
          }
        }
    });
    
});

// DELETE USER DATA
router.delete('/deleteUser', function (req, res, next) {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({status: "error", message: "Request body is missing!"});
    }

    User.findOneAndDelete({
      _id:req.body.id
    })
    .then(results => {        
        res.status(201).json({status: "success", message: "Record deleted successfully."});
    })
    .catch(err => {
        res.status(500).json(err);
    });

});

// LOGIN USER
router.post('/login', function (req, res, next) {
  
  if (Object.keys(req.body).length === 0) {
      return res.status(400).json({status: "error", message: "Request body is missing!"});
  }

  if (Object.keys(req.body).length != 0) {
      
    User.findOne({
      email:req.body.email
    }, function(err, userInfo){
          
          if (err) {
          next(err);

    } else {

            if(bcrypt.compareSync(req.body.password, userInfo.password)) {

              const token = jwt.sign({id: userInfo._id}, config.secret, { expiresIn: config.tokenLife });
              const refreshToken = jwt.sign({id: userInfo._id}, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
              const response = {
                  "status": "Logged in",
                  "token": token,
                  "refreshToken": refreshToken,
              }
              res.json({status:"success", message: "user found!!!", data:{user: userInfo, token:response}});

            }else{

             res.json({status:"error", message: "Invalid email/password!!!", data:null});

            }
        }
    });
  }
  
});

//GET REFRESH TOKEN
router.post('/token', (req,res) => {  
  // refresh the damn token
  const postData = req.body;
  // if refresh token exists
  if(postData.refreshToken) {
      const token = jwt.sign({id: postData.id}, config.secret, { expiresIn: config.tokenLife})
      const response = {
          "token": token
      }
      res.status(200).json(response);        
  } else {
      res.status(404).send('Invalid request')
  }
});

//GET ALL USER COMMENTS
router.post('/getUserComments', function (req, res, next) {

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
          
        Comment.find({
            userId: decoded.id
          })
          .then(results => {
              res.status(201).json({status: "success", data: results});
          })
          .catch(err => {
              res.status(500).json(err);
        });

       /*Comment.find({})
        .populate({ path: 'userId', model: User, select: 'userId' })
        .populate({ path: 'postId', model: Post, select: 'postId' })
        .limit(5)
        .exec(function(error, posts) {
          res.status(201).json({status: "success", data: posts});
        })*/
        
      }
    }

  });
});

//GET ALL USER POSTS
router.post('/getUserPosts', function (req, res, next) {

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
          Post.find({
            userId: decoded.id
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



module.exports = router;