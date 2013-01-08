module.exports = function(app, _, models) {
    app.get('/posts', function(req, res, next) {
        models.blogPost.find({is_live: true}).sort({post_date: 'desc'}).exec(function(error, documents) {
            if (error)      return next(error);
            if (!documents) return next({type: '404'});

            res.locals.blog_posts = documents;
            res.render('posts/view-many');
        });
    });

    app.get('/posts/:post_url', function(req, res, next) {
        models.blogPost.findOne({is_live: true, url: req.params.post_url}, function(error, document) {
            if (error)      return next(error);
            if (!document)  return next({type: '404'});

            res.locals.blog_post = document;
            res.render('posts/view-one');
        });
    });
};
