const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, trim:true},
    password:{type:String, required:true},
    pic:{type:String, required:true, default:"https://icon-library.com/images/admin-user-icon/admin-user-icon-4.jpg"}
},
{
    timestamps:true
});

const User= mongoose.model('User', userSchema);
module.exports= User;