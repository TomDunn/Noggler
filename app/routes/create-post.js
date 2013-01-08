module.exports = function(app, _, models, passport) {
    var sanitize = require('validator').sanitize;

    app.get('/create-edit/:editId?', passport.isBlogger, function(req, res, next) {
        var finish = function() {
            res.render('create-post');
        };

        if (req.params.editId) {
            models.blogPost.findById(req.params.editId, function(error, document) {
                if (! document) return next({type: '404'});

                res.locals.post_data = document;
                finish();
            });
        } else {
            res.locals.post_data = {
                title:  '',
                post:   '',
                url:    '',
                is_live:    false
            };

            finish();
        }
    });

    app.post('/create-edit/:editId?', passport.isBlogger, function(req, res, next) {
        var is_live = (req.body.is_live)    ? true              : false;
        var post    = (req.body.post)       ? req.body.post     : '';
        var title   = (req.body.title)      ? req.body.title    : '';
        var url     = (req.body.url)        ? req.body.url      : '';
        
        if (is_live) {
            req.assert('url', 'Must specify a url for this post').notEmpty();
            req.assert('title', 'Must specify a title for this post').notEmpty();
            req.assert('post', 'You cannot publish a blank post').notEmpty();
        }

        var errors  = req.validationErrors(true);
        var data    = {
            post:   sanitize(post).xss(),
            title:  sanitize(title).xss(),
            url:    models.blogPost.toUrl(sanitize(url).xss()),
            is_live: is_live
        };

        if (errors) {
            res.locals.errors    = errors;
            res.locals.post_data = data;
            res.render('create-post');
        } else {

            var finish = function(error, document) {
                if (error) return next(error);
                if (! document) return next({type: '404'});

                res.redirect('/create-edit/' + document._id.toString());
            };

            if (req.params.editId) {
                data.edit_date = new Date();
                models.blogPost.findByIdAndUpdate(req.params.editId, data, finish);
            } else {
                var new_post =  new models.blogPost(_.extend(data, {
                    blogger:    models.blogPost.toObjectId(req.user._id),
                    post_date:  new Date()
                }));

                new_post.save(finish);
            }
        }

    });

    app.delete('/create-edit/:postId', passport.isBlogger, function(req, res, next) {
        models.blogPost.findById(req.params.postId).remove(function(error, modified) {
            if (error) return next(error);
            if (modified == 0) return next({type: '404'});

            res.redirect('create-edit');
        });
    });

};
