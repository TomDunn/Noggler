module.exports = function(app, _, models, passport) {

    app.get('/blogger/set', passport.ensureAuthenticated, function(req, res, next) {
        models.User.findOne({isBlogger: true}, function(error, user) {
            if (error)  return next(error);
            if (user)   return next({type:'404'});

            res.render('setup/set-blogger-form');
        });
    });

    app.post('/blogger/set', passport.ensureAuthenticated, function(req, res, next) {
        models.User.findOne({isBlogger: true}, function(error, user) {
            if (error) return next(error);
    
            // if blog does not have a blogger yet
            // make the current user our new user
            var secret = process.env.SETUP_SECRET || req.body.blogger_secret;
            if ( (!user) && req.body.blogger_secret && req.body.blogger_secret == secret) {
                models.User.findById(req.user._id, function(error, currentUser) {
                    currentUser.isBlogger = true;
                    currentUser.save(function(error) {
                        if (error) return next(error);
                        req.user.isBlogger = true;
                        res.redirect('/');
                    });
                });
            // if someone is snooping perhaps
            } else {
                return next({type: '404'});
            }
        });
    });
};
