const express = require('express');
const router = express.Router();
const Book = require('../models/model.js');
const Fdb = require('../models/fd_schema.js');

const { ensureAuthenticated,forwardNotAuthenticated } = require('../config/authfuncs.js');

router.get('/index',ensureAuthenticated, (req, res) => res.render('Users/Co-ordinator/index'));
router.get('/getfeedback',ensureAuthenticated, (req, res) => res.render('Users/Co-ordinator/feedback_get.ejs'));


//get by empid
router.get('/getstudent/:empid',(req,res)=>
{
 
    console.log(req.params.empid);
     Book.findOne({empid:req.params.empid}).then(data=>{
       
          res.send(data);

       
     }

     ).catch(err =>
        {
            console.log("Error occured");
        });  
   

});

//get feedback
router.get('/api/fdbs', (req,res)=> {
    Fdb.find().then(fdbs => {
        res.send(fdbs);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving fdbs."
        });
    });
});

//get all details of students
router.get('/getstudents',(req,res)=>
{
 
    console.log(req.params.empid);
     Book.find().then(data=>{
       
          res.send(data);

       
     }

     ).catch(err =>
        {
            console.log("Error occured");
        });  
   

});

//add scores in the form of array
router.post('/students',(req,res)=>
{
  const book = new Book();
  book.empid=req.body.empid,
  console.log(req.body);
  subjects = JSON.parse(req.body.subjects);
  book.subjects=subjects;
   book.save().then(data=>
    {
        res.send("Success");
       console.log("Success");
    }).catch(err=>
        {
            console.log("error");
        });
});

//update score
router.put('/put/:empid',(req,res)=>
    {

     console.log(req.body.name);
     console.log(req.body.marks);
       subject = [
              { name:req.body.name,
                marks:req.body.marks
              }
            ]
       console.log(subject);
        Book.findOneAndUpdate({empid:req.params.empid},
            { "$push": { "subjects": subject } },
         
            function (err, data) {
                if (err) throw err;
                res.send("Success");
                console.log(data);
            }
        );
    });
    module.exports = router;