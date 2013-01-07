#!/usr/bin/env node

var _           = require('underscore');
var express     = require('express');
var passport    = require('passport');
var googleStrat = require('passport-google').Strategy;
var app         = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/app/views');

var mongoose    = require('mongoose');
var schemas     = require('./app/schemas/')(_, mongoose);
var db          = mongoose.createConnection('localhost', 'blog');
var models      = require('./app/models')(db, schemas);

// set up passport
require('./app/passport_config')(passport, googleStrat, models);

app.use('/public', express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'hung dung bung'}));
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

require('./app/routes')(app, _, models, passport);
require('./app/routes/auth-routes')(app, _, models, passport);
app.listen(1080);
