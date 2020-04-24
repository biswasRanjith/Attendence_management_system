const express = require('express');
const router = express.Router();
const User = require('../models/usermodel.js');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { ensureAuthenticated,forwardNotAuthenticated } = require('../config/authfuncs.js');

// Welcome Page only for not authenticated people, if he is authenticated(logged in) sends him directly to his home page.
router.get('/',forwardNotAuthenticated, (req, res) => res.render('index'));
//Signin page -"-
router.get('/SignIn',forwardNotAuthenticated, (req, res) => res.render('SignIn'));
//Admin Login page -"-
router.get('/AdminLogin',forwardNotAuthenticated, (req, res) => res.render('AdminLogin'));


router.get('/forgotPwd', function(req, res) {
    res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
    async.waterfall([
        function(done) {
        crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
        });
        },
        function(token, done) {
        User.findOne({ empid: req.body.empid }, function(err, user) {
            if (!user) {
            req.flash('error', 'No account with that Employee Id exists.');
            return res.redirect('/forgotPwd');
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 300000; // 5 Mins
    
            user.save(function(err) {
            done(err, token, user);
            });
        });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                host: 'smtp.sendgrid.net',
                port: 465,
                secure: true,
                auth: {
                  user: 'apikey',
                  pass: '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'
                }
              });
              var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'TMS Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('info_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
               done(err, 'done');
            });
            }
        ], function(err) {
            if (err) req.flash('error_msg',err.message);
            res.redirect('/forgotPwd');
        });
        });
        
        router.get('/reset/:token', function(req, res) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
              if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgotPwd');
              }
              res.render('reset', {
                user: req.user
              });
            });
          });
        
          router.post('/reset/:token', function(req, res) {
            async.waterfall([
              function(done) {
                User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                  if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                  }
          
                  bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                      if (err) throw err;
                      user.password = hash;
                      user.resetPasswordToken = undefined;
                      user.resetPasswordExpires = undefined;
                      user.save(function(err) {
                        req.logIn(user, function(err) {
                          done(err, user);
                        });
                      });

                    });
                  });
                });
              },
              function(user, done) {
                var smtpTransport = nodemailer.createTransport({
                  host: 'smtp.sendgrid.net',
                  port: 465,
                  secure: true,
                  auth: {
                    user: 'apikey',
                    pass: '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'
                  }
                });
                var mailOptions = {
                  to: user.email,
                  from: 'passwordreset@demo.com',
                  subject: 'Your password has been changed',
                  text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                  req.flash('success_msg', 'Success! Your password has been changed.');
                  done(err);
                });
              }
            ], function(err) {
              res.redirect('/SignIn');
            });
          });
        

module.exports = router;
