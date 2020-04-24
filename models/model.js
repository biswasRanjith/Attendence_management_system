const mongoose= require('mongoose');
const mapSchema = mongoose.Schema({
   empid:
   {
     type:Number,
     unique:true
   },
   subjects:[     
     {
       name:String,
       marks:Number
    }
    ]
   
});
module.exports= mongoose.model('Students',mapSchema);