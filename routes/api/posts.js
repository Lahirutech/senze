const express=require("express");
const router = express.Router();

const passport=require('passport');
//Load User model
const User=require("../../models/User");

//Post User model
const Post=require("../../models/Post");

//validation
const validatePostInput=require('../../validation/post');

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const { errors, isValid } = validatePostInput(req.body);
  
      // Check Validation
      if (!isValid) {
        // If any errors, send 400 with errors object
        return res.status(400).json(errors);
      }
  
      const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        avatar: req.body.avatar,
        UserID: req.user.id
      });
  
      newPost.save().then(post => res.json(post));
    }
  );

module.exports=router;