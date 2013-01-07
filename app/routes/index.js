module.exports = function(app, _, models, passport) {
    app.get('/', function(req,res) {
        res.render('index', {});
    });

    require('./create-post')(app, _, models, passport);
    require('./view-post')(app, _, models);
};
