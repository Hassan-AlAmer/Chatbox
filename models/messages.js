const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const MessageSchema=new Schema({
    text:{type:String, required:true},
    user:{type:String, required:true},
    createdAt: {type:Date, default:Date.now()},
})

module.exports=mongoose.model('messages', MessageSchema)