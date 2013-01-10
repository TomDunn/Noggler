#!/usr/bin/env node

var _           = require('underscore');
var express     = require('express');
var passport    = require('passport');
var googleStrat = require('passport-google').Strategy;
var app         = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/app/views');
console.log(process.env);

var mongoose    = require('mongoose');
var schemas     = require('./app/schemas/')(_, mongoose);
var mongoUri    = process.env.MONGOHQ_URL || 'mongodb://localhost/blog';
var db          = mongoose.createConnection(mongoUri);
var models      = require('./app/models')(db, schemas);

// set up passport
require('./app/passport_config')(passport, googleStrat, models);

app.use('/public', express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'hung dung bung shut the hell up now donny'}));
app.use(express.methodOverride());
app.use(require('express-validator'));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.currentUser  = req.user ? req.user : null;
    res.locals.errors       = {};
    next();
});
app.use(app.router);

// error handling
app.use(function(error, req, res, next) {
    console.log("Error:");
    console.log(error);

    if (error.type == '404') return res.status(404).render('errors/404');
    return res.status(500).render('errors/500');
});

require('./app/routes')(app, _, models, passport);
require('./app/routes/auth-routes')(app, _, models, passport);
require('./app/routes/setup')(app, _, models, passport);

app.listen(process.env.PORT || 1080);
