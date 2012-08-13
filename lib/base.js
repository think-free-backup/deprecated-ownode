

// ## Uid generator
exports.getUid = function() {
    var result = '';
    for(var i = 0; i < 32; i++)
        result += Math.floor(Math.random() * 16).toString(16).toUpperCase();
    return result
};

// ## Unix timestamp

exports.getCurrentTimeStamp = function(){
    var ts = Math.round((new Date()).getTime() / 1000);
    return ts;
}
