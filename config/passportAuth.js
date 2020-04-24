//Logic for authentication...how to authenticate
//And to encrypt password beforing storing


const LocalStrategy = require('passport-local').Strategy;//local strategy means ill define my own way for authenticating and i wont be using google,fb.etc authentication
const bcrypt = require('bcryptjs');//to encrypt password

// Load User model
const User = require('../models/usermodel.js');

//Logic for Authentication
//If the user with given empid exists then next decrypt(previously encrypted while storing to db) the password from db for that and check for the entered password. if everyhting matches success.
module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'empid' }, (empid, password, done) => {
      // Match user with entered empid
      User.findOne({
        empid: empid
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Invalid Credentials' });
        }

        // Match password of the found user in db with the entered password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );


//Used to identify to which user session belongs to by storing user's id in session object.
//https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

  