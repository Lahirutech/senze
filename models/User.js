const shortid = require('shortid');
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

//  create Schema
const UserSchema=new Schema({
    _id:{
        'type':String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    school:{
        type:String,
        required:false
    },
    avatar:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});
module.exports=User=mongoose.model("users",UserSchema);
