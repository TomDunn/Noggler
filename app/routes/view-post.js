module.exports = function(app, _, models) {
    app.get('/posts', function(req, res) {
        models.blogPost.find({is_live: true}).sort({post_date: 'desc'}).exec(function(error, documents) {
            if (error)      return res.status(500).render('500');
            if (!documents) return res.status(404).render('404');

            res.locals.blog_posts = documents;
            res.render('posts/view-many');
        });
    });

    app.get('/posts/:post_url', function(req, res) {
        models.blogPost.findOne({is_live: true, url: req.params.post_url}, function(error, document) {
            if (error)      return res.status(500).render('500');
            if (!document)  return res.status(404).render('404');

            res.locals.blog_post = document;
            res.render('posts/view-one');
        });
    });
};
