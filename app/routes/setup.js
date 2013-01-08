module.exports = function(app, _, models, passport) {
    app.get('/blogger/set', passport.ensureAuthenticated, function(req, res, next) {
        models.User.findOne({isBlogger: true}, function(error, user) {
            if (error) return next(error);
    
            // if blog does not have a blogger yet
            // make the current user our new user
            if (! user) {
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
