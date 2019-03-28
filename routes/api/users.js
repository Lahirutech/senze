const express=require("express");
const router = express.Router();
const bcrypt=require("bcryptjs");
const jwt =require("jsonwebtoken");
const keys=require("../../config/keys");
const{ensureAuthenticated}=require('../../helpers/auth');
const passport=require('passport');


//load input validation
const validateRegisterInput=require("../../validation/register");
const validateLoginInput=require("../../validation/login");

//Load User model
const User=require("../../models/User");
// @route POST api/users/register
// @desc Register user
// @access Public

router.post("/register",(req,res)=>{
    //Form Validation
    const {errors,isValid}=validateRegisterInput(req.body);

    //check validation
    if(!isValid){
        return res. status(400).json(errors);
    }
    User.findOne({email:req.body.email}).then(user=>{
        if(user){
            return res.status(400).json({email:"Email already exits"
        });
        }
        const newUser=new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
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
    });
});


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
//view Posts
router.get('/view',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json(req.user);
});
/////////////

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