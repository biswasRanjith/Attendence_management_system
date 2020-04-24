const mongoose= require('mongoose');
const mapSchema = mongoose.Schema({
   empid:Number,
   subjects:[     
     {
       name:String,
       marks:Number 
    }
    ]
   
});
module.exports= mongoose.model('Student',mapSchema);