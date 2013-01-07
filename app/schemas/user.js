module.exports = function(_, mongoose) {
    var user =  mongoose.Schema({
        openId:         String,
        displayName:    String,
        firstName:      String,
        lastName:       String,
        emails:         Object
    });

    return user;
};
