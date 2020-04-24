// Authentication functions
// ensureAuthenticated func says if authenticated let him move forward to the page else redirect back to index page
// forwardNotAuthenticated func says if not authenticated let him move forward to the page else redirect him to his home page
module.exports = {

    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');//error message using flash
      res.render('index')
    },


    forwardNotAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.render('Users/home',{user: req.user});      
    }

  };
