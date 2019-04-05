const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const passport=require("passport");

const users=require("./routes/api/users");
const posts=require("./routes/api/posts");


const app=express();
//body parser midddleware

app.use(
    bodyParser.urlencoded({
        extended:false
    })
);
app.use(bodyParser.json());

//DB config
const db=require("./config/keys").mongoURI;

// coonecting to MongoDB
mongoose
.connect(
    db,{
        useNewUrlParser:true
    })

    .then(()=>console.log("MongoDB successfulle connected"))
    .catch(err=>console.log(err));
    
    //passport miidlware
    app.use(passport.initialize());

    //passport config
    require("./config/passport")(passport);

    //Routes 
    app.use("/api/users",users);
    app.use("/api/posts",posts);

//passport middlware
    app.use(passport.initialize());
    app.use(passport.session());
  //Global varuables
  app.use(function(req,res,next)
  {
      res.locals.user=req.user||null;
        next();
  }); 

const port = process.env.PORT||5000;
app.listen(port,()=>console.log(`Server is  up and running on${port}!!`));
