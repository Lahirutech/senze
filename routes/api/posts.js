const express=require("express");
const router = express.Router();
const jwt =require("jsonwebtoken");
const config = require("../../config/keys.js");



const passport=require('passport');
//Load User model
const User=require("../../models/User");

//Post User model
const Post=require("../../models/Post");

//validation
const validatePostInput=require('../../validation/post');

//adding a post with userid,postid
//private

router.post('/new/:userID/:postID',verifyToken,(req,res)=>{
  jwt.verify(req.token,config.secretOrKey,(err,authData)=>{
    const { errors, isValid } = validatePostInput(req.body);
  
    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      UserID:req.params.userID,
      PostID:req.params.postID
    });

    newPost.save().then(post => res.json(post));
  });
});

//verifying the token
function verifyToken(req,res,next){
  //get auth header value
  const bearerHeader=req.headers['autorization'];
  if(typeof bearerHeader!== 'undefined'){
    //split from the space
    const bearer=bearerHeader.split(' ');
    //Get the token from the array
    const bearerToken=bearer[1];
    //set the token
    req.token=bearerToken;
    //callinf the next
    console.log(bearerToken);
    next();

  }else{
    //forbidden
    res.sendStatus(403)
    .json({
      message:'Post access denied..'
    });
  } 

}
module.exports=router;