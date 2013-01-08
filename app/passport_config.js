module.exports = function(passport, googleStrat, models) {

    passport.use(new googleStrat({
            returnURL:  'http://localhost:1080/auth/google/return',
            realm:      'http://localhost:1080/'
        },
        function(identifier, profile, done) {
            var query = {openId: identifier};
            var updated_profile = {
                displayName:    profile.displayName,
                firstName:      profile.name.givenName,
                lastName:       profile.name.familyName,
                emails:         profile.emails
            };

            models.User.findOneAndUpdate(query, updated_profile, {upsert: true}, function(err, user) {
                done(err, user);
            });
        }
    ));

    passport.serializeUser = function(user, done) {
        done(null, user);
    };

    passport.deserializeUser = function(user, done) {
        done(null, user);
    };

    passport.ensureAuthenticated = function(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    };

    passport.isBlogger = function(req, res, next) {
        if (req.isAuthenticated() && req.user.isBlogger)
            return next();
        res.redirect('/login');
    };

};
