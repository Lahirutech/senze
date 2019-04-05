const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {
    type: String,
    required: true
  },
  UserID:{
      type:String
  },
  PostID:{
    type:String
},
  content: {
    type: String
  },
  categoryID: {
    type: String
  },
  remarks:{
      type:String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('post', PostSchema);
