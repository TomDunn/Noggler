module.exports = function(_, mongoose) {

    var blogPostComment = mongoose.Schema({
        comment_date:   Date,
        commenter:      mongoose.Schema.Types.ObjectId,
        comment:        String
    });

    var blogPost    = mongoose.Schema({
        title:      String,
        blogger:    mongoose.Schema.Types.ObjectId,
        post_date:  Date,
        edit_date:  Date,
        post:       String,
        url:        String,
        postBody:   String,
        tags:       [String],
        comments:   [blogPostComment],
        is_live:    {type:  Boolean, default:false}
    });

    blogPost.statics.toUrl = function(s) {
        return s.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    };

    blogPost.statics.toObjectId = function(s) {
        return mongoose.Types.ObjectId(s);
    };

    return blogPost;
};
