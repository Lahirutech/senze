const express=require("express");
const router = express.Router();
const bcrypt=require("bcryptjs");
const jwt =require("jsonwebtoken");
const keys=require("../../config/keys");
const{ensureAuthenticated}=require('../../helpers/auth');
const passport=require('passport');
const gravatar=require('gravatar');
const shortid = require('shortid');



//load input validation
const validateRegisterInput=require("../../validation/register");
const validateLoginInput=require("../../validation/login");

//Load User model
const User=require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public

router.post("/register", async (req, res) => {
    //Form Validation
    const {errors,isValid} = validateRegisterInput(req.body);
  
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    //Checking the user Email existance
    let user = await User.findOne({
      email: req.body.email
    });
    if (user) {
      return res.status(404).json({
        email: "Email already exits"
      });
    }
    //Checking the Username existance
    user = await User.findOne({
      name: req.body.name
    });
    if (user) {
      return res.status(404).json({
        name: "Username Already Exist"
      });
    }
    var avatar = gravatar.url('req.body.email', {s: '200', r: 'pg', d: 'mm'});

 
  const newUser = new User({
    _id:shortid.generate(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avatar
    });

        //Hashpassword before saving database
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>
                {
                    if(err) throw err;
                    newUser.password=hash;
                    newUser
                    .save()
                    .then(user=>res.json(user))
                    .catch(err=>console.log(err));
                });
            });

}) 


// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login",(req,res)=>{
    //form calidtion
    const{errors,isValid}=validateLoginInput(req.body);
    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    const email=req.body.email;
        const password=req.body.password;

        //find User by email
        User.findOne({email}).then(user=>{
            //check if user exist
            if(!user){
                return res.status(404).json({emailnotfound:"Email not Found"});
            }
            //password check
            bcrypt.compare(password,user.password).then(isMatch=>{
                if(isMatch){
                    //user matched
                    //create JWT Payload
                    const payload={
                        id:user.id,
                        name:user.name
                    };
              //sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn:31556926 //1year
                    },
                    (err,token)=>{
                        res.json({
                            success:true,
                            token:"Bearer " + token
                        });
                    }
                );      
                }else{
                    return res.status(400)
                    .json({passwordincorrect:"password incorrect"});
                }
            });
        });

});

//Logout User
router.get('/logout',(req,res)=>{
    req.logout();
    res.json({logged:false});
});

router.get('/view/:id',(req,res)=>{
  User.findById((req.params.id), function (err, doc) {
    if (err)
    {return res.status(404).end();}
    return res.status(200).json(doc);
  });
  
});


  router.get('/view/',(req,res)=>{
      User.find({})
      .then(data=>{
  
        if(!data){return res.status(404).end();}
        return res.status(200).json(data);
      })
    });


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
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      });
  
      newPost.save().then(post => res.json(post));
    }
  );

module.exports=router;