const express = require('express');
const router = express.Router();
const Trainee = require('../models/tmodels.js');
const Fdb = require('../models/fd_schema.js');

const { ensureAuthenticated,forwardNotAuthenticated } = require('../config/authfuncs.js');

router.get('/test',ensureAuthenticated, (req, res) => res.render('Users/Trainee/test11'));
router.get('/feedback',ensureAuthenticated, (req, res) => res.render('Users/Trainee/feedback'));
    router.get('/api/getstudents',(req,res)=>
{
    
    Trainee.find().then(data=>{
         res.send(data);
     }

     ).catch(err =>
        {
            console.log("Error occured");
        });  
    

});

router.post('/api/getScoreById',(req,res)=>
{
     empidx = req.user.empid ;
     console.log(req.body+"yes");
     Trainee.find({"empid" : empidx}).then(data=>{
        console.log(data); 
        res.send(data);
     }

     ).catch(err =>
        {
            console.log(err.message);
            console.log("Error occured");
        });  
    

});

router.post('/api/students',(req,res)=>
{
  const trainee = new Trainee();
  trainee.empid=req.body.empid,
  trainee.subjects=req.body.subjects;
  trainee.save().then(data=>
    {
        res.send(data);
       console.log("Success");
    }).catch(err=>
        {
            res.send(err);
            console.log("error");
        });
});

//FEEDBACK
router.post('/api/fdbs', (req, res)=> {
    // Validate request
    console.log("sd");
    if(!req.body.Subject_name) {
    return res.status(400).send({
        message: "Fdb Subject name can not be empty"
    })
}
    // Create a atd
    const atd = new Fdb({
        Batch:req.body.Batch,
        Id:req.body.Id,
        Subject_name: req.body.Subject_name,
        Experience:req.body.Experience,
        Feedback: req.body.Feedback
    });
      // Save atd in the database
    atd.save().then(data => {
        res.send("Successful");
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Fdb."
        });
    });
    
});


module.exports = router;