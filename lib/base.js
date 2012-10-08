
// ## Uid generator
exports.getUid = function(count) {

    var m_count = 32;
    if (count != undefined && count != null)
        m_count = count;

    var result = '';
    for(var i = 0; i < m_count; i++)
        result += Math.floor(Math.random() * 16).toString(16).toUpperCase();
    return result
};

// ## Unix timestamp
exports.getCurrentTimeStamp = function(){
    var ts = Math.round((new Date()).getTime() / 1000);
    return ts;
}

