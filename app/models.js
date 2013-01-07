module.exports = function(db, schemas) {
    return {
        blogPost:   db.model('blog_posts',  schemas.blog_post),
        User:       db.model('users',       schemas.user)
    };
};
