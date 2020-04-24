const mongoose=require('mongoose');

const FdbSchema=mongoose.Schema({
    //properties of the student collections
    Batch:String,
    Id:String,
    Subject_name:String,
    Experience:String,
    Feedback:String
});
//creating own module
//syntax is module.exports
module.exports = mongoose.model('Feedback',FdbSchema);