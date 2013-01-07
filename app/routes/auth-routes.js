module.exports = function(app, _, models, passport) {
    app.get('/login', 
        function(req, res, next) {
            if (req.isAuthenticated())
                res.redirect('/');
            else
                next();
        }, function(req, res) {
            res.render('login');
        }
    );

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/google', passport.authenticate('google'));

    app.get('/auth/google/return', passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
};
