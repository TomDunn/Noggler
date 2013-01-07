module.exports = function(_, mongoose) {
    return {
        blog_post:      require('./blog_post')(_, mongoose),
        user_profile:   require('./user_profile')(_, mongoose),
        user:           require('./user')(_, mongoose)
    };
};
