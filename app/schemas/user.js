module.exports = function(_, mongoose) {
    var user =  mongoose.Schema({
        openId:         String,
        displayName:    String,
        firstName:      String,
        lastName:       String,
        isBlogger:      {type: Boolean, default: false},
        emails:         Object
    });

    return user;
};
